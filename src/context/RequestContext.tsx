import { createContext, useReducer } from "react";
import { Account, DataDownload, FuncDownload, GetReport, Group, Percentajes, UpdateUserProps, User } from "../interface/interface";
import { useAppDispatch, useAppSelector } from '../app/hooks';
import axios, { AxiosError } from "axios";
import { AP, APCI, Alarm, Bat, BatteryStatus, CI, MIMETypes, Prue, Service, StateRequestContext, TypeReport, otros } from "../types/types";
import { Buffer } from 'buffer';
import RNFS from 'react-native-fs';
import { Reducer } from "../features/RequestReducer";
import EncryptedStorage from "react-native-encrypted-storage";
import { setUser } from "../features/configSlice";

interface ContextProps extends StateRequestContext {
    LogIn: (props: { email: string; password: string; }) => Promise<User>;
    CheckAuth: () => Promise<User>;
    AccepTerms: (token: string) => Promise<User>;
    GetMyAccount: () => Promise<{ accounts: Array<Account> }>;
    GetGroups: () => Promise<{ groups: Array<Group> }>;
    UpdateUser: ({ id, ...props }: UpdateUserProps) => Promise<User>;
    ReportEvents: ({ body, type }: {
        body: GetReport;
        type?: TypeReport | undefined;
    }) => Promise<{
        nombre: string;
        cuentas?: Account[] | undefined;
        fechas?: string[] | undefined;
        total?: number | undefined;
        percentajes?: Percentajes | undefined;
    }>;
    downloadReport: (props: FuncDownload) => Promise<{
        status: boolean;
        msg: string;
        data?: undefined;
    } | {
        status: boolean;
        data: {
            title: string;
            text: string;
        };
        msg?: undefined;
    }>;
}

export const RequestContext = createContext({} as ContextProps);

const initialState: StateRequestContext = {
    isDownloadDoc: false,
}

export const RequestProvider = ({ children }: any) => {
    const { domain, instance, directory } = useAppSelector(state => state.config);
    const AppDispatch = useAppDispatch();
    const [state, dispatch] = useReducer(Reducer, initialState);

    instance.interceptors.response.use(function (response) {
        return response;
    }, async function (error) {
        const Err = error as AxiosError;
        if (Err.response?.status === 401 && JSON.stringify(Err.response.data).includes("La sesión expiro, inicie sesión nuevamente")) {
            try {
                const refreshToken = await EncryptedStorage.getItem(Service["Encrypted-RefreshToken"]) ?? 'without token';
                const user = await CheckAuth(refreshToken);
                AppDispatch(setUser(user));
            } catch (error) {
                return Promise.reject(error);
            }
        }
        if (error.response && error.response.data) return Promise.reject(error.response.data);
        return Promise.reject(error);
    });

    const downloadReport = async ({ report, mime, data, fileName }: FuncDownload) => {
        try {
            dispatch({ type: 'isDownloadDoc', payload: true });
            const extFile: string = (mime === MIMETypes.pdf) ? 'pdf' : (mime === MIMETypes.xlsx) ? 'xlsx' : '';
            const endpoint: string = `${report}/${extFile}`;
            const Directory = `${directory}/${fileName}.${extFile}`;
            const response = await getFile({ data, endpoint });
            if (await RNFS.exists(Directory)) {
                return { status: false, msg: `Ruta existente:\n${Directory}` };
            } else {
                await RNFS.writeFile(Directory, response, 'base64');
                return { status: true, data: { title: 'Documento descargado', text: `${fileName}.${extFile}` } }
            }
        } catch (error) {
            return { status: false, msg: String(error) }
        }
        finally {
            dispatch({ type: 'isDownloadDoc', payload: false });
        }
    }

    const getFile = async ({ endpoint, data }: { endpoint: string; data: DataDownload }) => {
        const response = await instance.post(`download/${endpoint}`, data, { responseType: 'arraybuffer' });
        return Buffer.from(response.data, 'binary').toString('base64');
    }


    const LogIn = async (props: { email: string, password: string }) => {
        const response = await instance.post('auth', props);
        return response.data as User;
    }

    const CheckAuth = async (refreshToken?: string) => {
        if (refreshToken) {
            const response = await axios.get('auth/check-auth', { baseURL: domain, headers: { Authorization: `Bearer ${refreshToken}` } });
            return response.data as User;
        }
        const response = await instance.get('auth/check-auth');
        return response.data as User;
    }

    const AccepTerms = async (token: string) => {
        const response = await axios.get('user/accept-terms', { baseURL: domain, headers: { Authorization: `Bearer ${token}` } })
        return response.data as User;
    };

    const UpdateUser = async ({ id, ...props }: UpdateUserProps) => {
        const response = await instance.patch(`user/update/${id}`, props);
        return response.data as User;
    };

    const GetMyAccount = async () => {
        const response = await instance.get('accounts/my-individual-accounts');
        return response.data as { accounts: Array<Account> };
    };

    const GetGroups = async () => {
        const response = await instance.get('accounts/my-groups');
        return response.data as { groups: Array<Group> };
    };

    const ReportEvents = async ({ body, type }: { body: GetReport, type?: TypeReport }) => {
        const response = await instance.post(`reports/${type}`, body);

        const { data: dataResponse, ...rest } = response;
        const data = dataResponse as { nombre: string, cuentas?: Array<Account>, fechas?: Array<string>, total?: number, percentajes?: Percentajes };

        if (data.cuentas?.length === 1 && data.cuentas[0].eventos) {
            const total: number = data.cuentas[0].eventos.length;
            if (type === 'ap-ci') {
                let Aperturas = data.cuentas[0].eventos.filter(f => AP.find(ff => ff === f.CodigoAlarma)).length;
                let Cierres = data.cuentas[0].eventos.filter(f => CI.find(ff => ff === f.CodigoAlarma)).length;
                const percentajes: Percentajes = {
                    Aperturas: {
                        total,
                        percentaje: Aperturas * 100 / total,
                        events: Aperturas,
                        text: 'Aperturas recibidas'
                    },
                    Cierres: {
                        total,
                        percentaje: Cierres * 100 / total,
                        events: Cierres,
                        text: 'Cierres recibidos'
                    }
                }
                return { nombre: '', cuentas: [{ ...data.cuentas[0] }], percentajes }
            } else if (type === 'event-alarm') {
                let ApCi = data.cuentas[0].eventos.filter(f => APCI.find(ff => ff === f.CodigoAlarma)).length;
                let Alarma = data.cuentas[0].eventos.filter(f => Alarm.find(ff => ff === f.CodigoAlarma)).length;
                let Pruebas = data.cuentas[0].eventos.filter(f => Prue.find(ff => ff === f.CodigoAlarma)).length;
                let Bate = data.cuentas[0].eventos.filter(f => Bat.find(ff => ff === f.CodigoAlarma)).length;
                let Otros = data.cuentas[0].eventos.filter(f => otros.find(ff => ff === f.CodigoAlarma)).length;

                const percentajes: Percentajes = {
                    APCI: {
                        total,
                        events: ApCi,
                        percentaje: ApCi * 100 / total,
                        label: 'Ap/Ci',
                        text: 'Aperturas y Cierres \nrecibidos'
                    },
                    Alarma: {
                        total,
                        events: Alarma,
                        percentaje: Alarma * 100 / total,
                        label: 'Alarma',
                        text: 'Alarmas recibidas'
                    },
                    Pruebas: {
                        total,
                        events: Pruebas,
                        percentaje: Pruebas * 100 / total,
                        label: 'Pruebas',
                        text: 'Pruebas recibidas'
                    },
                    Battery: {
                        total,
                        events: Bate,
                        percentaje: Bate * 100 / total,
                        label: 'Bateria',
                        text: 'Eventos de batería \nrecibidos'
                    },
                    Otros: {
                        total,
                        events: Otros,
                        percentaje: Otros * 100 / total,
                        label: 'Otros',
                        text: 'Otros eventos \nrecibidos'
                    }
                }

                return {
                    nombre: '',
                    cuentas: [{ ...data.cuentas[0] }],
                    percentajes
                }
            }
        } else if (type === 'batery') {
            if (data && data.cuentas && data.total) {
                let conRestaure: number = 0, sinRestaure: number = 0, sinEventos: number = 0;
                sinRestaure = data.cuentas.filter(acc => acc.estado === BatteryStatus.ERROR).length;
                conRestaure = data.cuentas.filter(acc => acc.estado === BatteryStatus.RESTORE).length;
                sinEventos = data.cuentas.filter(acc => acc.estado === BatteryStatus.WITHOUT_EVENTS).length;

                const percentajes: Percentajes = {
                    sinRestaure: {
                        percentaje: sinRestaure / data.total * 100,
                        total: data.total,
                        events: sinRestaure,
                        label: 'Sin restaure',
                    },
                    conRestaure: {
                        percentaje: conRestaure / data.total * 100,
                        total: data.total,
                        events: conRestaure,
                        label: 'Con restaure',
                    },
                    sinEventos: {
                        percentaje: sinEventos / data.total * 100,
                        total: data.total,
                        events: sinEventos,
                        label: 'Sin eventos'
                    }
                }

                return {
                    nombre: data.nombre,
                    cuentas: [...data.cuentas],
                    total: data.total,
                    percentajes
                }
            }
        } else if (type === 'state') {
            if (data && data.cuentas) {
                let abiertas: number = 0, cerradas: number = 0, sinEstado: number = 0;
                abiertas = data.cuentas.filter(f => (AP.find(ff => ff === f.evento?.CodigoAlarma))).length;
                cerradas = data.cuentas.filter(f => (CI.find(ff => ff === f.evento?.CodigoAlarma))).length;
                sinEstado = data.cuentas.filter(f => !f.evento).length;
                const percentajes: Percentajes = {
                    abiertas: {
                        percentaje: (abiertas * 100) / data.cuentas.length,
                        total: data.cuentas.length,
                        events: abiertas,
                        label: 'Abiertas',
                        text: 'Sucursales abiertas'
                    },
                    cerradas: {
                        percentaje: (cerradas * 100) / data.cuentas.length,
                        total: data.cuentas.length,
                        events: cerradas,
                        label: 'Cerradas',
                        text: 'Sucursales cerradas'
                    },
                    sinEstado: {
                        percentaje: (sinEstado * 100) / data.cuentas.length,
                        total: data.cuentas.length,
                        events: sinEstado,
                        label: 'Sin estado',
                        text: 'Sucursales sin estado'
                    }
                }
                return {
                    nombre: data.nombre,
                    cuentas: [...data.cuentas],
                    total: data.total,
                    percentajes
                }
            }
        } else if (type === 'apci-week') {
            if (data && data.cuentas) {
                let reciberAp: number = 0, reciberCi: number = 0;
                const acc = data.cuentas.map(acc => {
                    if (acc.eventos && data.fechas) {
                        const { eventos, ...rest } = acc;
                        const df = data.fechas.map(day => {
                            const perDay = acc.eventos?.filter(ev => ev.FechaOriginal === day);
                            if (perDay && perDay.length > 0) {
                                let Aperturas = perDay.filter(f => AP.find(ff => ff === f.CodigoAlarma)).slice(0, 1);
                                let Cierres = perDay.filter(f => CI.find(ff => ff === f.CodigoAlarma)).reverse().slice(0, 1);
                                reciberAp += Aperturas.length;
                                reciberCi += Cierres.length;
                                return [Aperturas, Cierres].flat()
                            } else {
                                return [];
                            }
                        }).flat();
                        return { ...rest, eventos: df };
                    } else {
                        return acc;
                    }
                });
                const total: number = acc.length * 7;
                const percentajes: Percentajes = {
                    Aperturas: {
                        total,
                        percentaje: reciberAp * 100 / total,
                        events: reciberAp,
                        label: 'Aperturas',
                        text: 'Aperturas recibidas'
                    },
                    Cierres: {
                        total,
                        percentaje: reciberCi * 100 / total,
                        events: reciberCi,
                        label: 'Cierres',
                        text: 'Cierres recibidos'
                    },
                }
                return {
                    nombre: data.nombre,
                    fechas: data.fechas,
                    cuentas: acc,
                    percentajes,
                }
            }
        }
        return data;
    }

    return (
        <RequestContext.Provider
            value={{
                ...state,
                LogIn,
                AccepTerms,
                CheckAuth,
                UpdateUser,
                GetGroups,
                GetMyAccount,
                downloadReport,
                ReportEvents
            }}
        >
            {children}
        </RequestContext.Provider>
    )
}