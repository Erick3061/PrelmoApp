import { BatteryStatus, MIMETypes, StateAppContext, TypeReport, TypeReportDownload, typeAccount } from "../types/types";



/**Context only functions */
export interface ContextAppProps extends StateAppContext {
    updateTheme: () => void;
}

/**App  */


export interface date {
    date: string;
    day: number;
    month: number;
    year: number;
};

export interface time {
    time: string;
    hour: number;
    minute: number;
    second: number;
};
export interface formatDate {
    DATE: Date;
    date: date;
    time: time;
    weekday: number;
}

export interface Key<T> {
    label: string,
    key: keyof T | Array<keyof T>,
    size?: number,
    center?: boolean
}

export interface useReportProps {
    type: TypeReport,
    accounts: Array<number>,
    dateStart?: string,
    dateEnd?: string,
    typeAccount: typeAccount,
    key: string;
}


export interface DataDownload {
    accounts: Array<number>;
    typeAccount: number;
    dateStart?: string;
    dateEnd?: string;
    showGraphs: boolean;
}

export interface FuncDownload {
    report: TypeReportDownload;
    fileName: string;
    mime: MIMETypes;
    data: DataDownload
}

export interface Account {
    CodigoCte: string;
    CodigoAbonado: string;
    Nombre: string;
    Direccion: string;
    Status?: string;
    nombre?: string;
    numeroEventos?: number;
    estado?: BatteryStatus;
    eventos?: Array<Events>;
    evento?: Events;
}

export interface Group {
    Codigo: number;
    Nombre: string;
    Tipo: number;
}

export interface Events {
    FechaOriginal: string;
    Hora: string;
    CodigoEvento: string;
    CodigoAlarma: string;
    DescripcionAlarm: string;
    CodigoZona: string;
    DescripcionZona: string;
    CodigoUsuario: string;
    NombreUsuario: string;
    DescripcionEvent: string;
    Particion: number;
    ClaveMonitorista: string;
    NomCalifEvento: string;
    FechaPrimeraToma: string;
    HoraPrimeraToma: string;
    FechaFinalizo: string;
    HoraFinalizo: string;
}


export interface Company {
    id: string;
    name: string;
    shortName?: string;
    primaryColor?: string;
    logoPath?: string;
    serviceIsActive: boolean;
}

export interface User {
    id: string;
    fullName: string;
    email: string;
    termsAndConditions: boolean;
    roles: Array<string>;
    company?: Company;
    token: string;
    refreshToken: string;
}

export interface UpdateUserProps {
    id: string;
    fullName: string;
    password: string;
    lastPassword: string;
}

export interface GetReport {
    accounts: Array<number>;
    typeAccount: typeAccount;
    dateStart?: string;
    dateEnd?: string;
}

export interface percentaje {
    total: number;
    events: number;
    percentaje: number;
    label?: string;
    text?: string;
}

export interface Percentajes {
    Aperturas?: percentaje;
    Cierres?: percentaje;
    APCI?: percentaje;
    Alarma?: percentaje;
    Pruebas?: percentaje;
    Battery?: percentaje;
    Otros?: percentaje;
    conRestaure?: percentaje;
    sinRestaure?: percentaje;
    sinEventos?: percentaje;
    abiertas?: percentaje;
    cerradas?: percentaje;
    sinEstado?: percentaje;
}

export interface TonalPalette {
    'T-0': string;
    'T-10': string;
    'T-20': string;
    'T-30': string;
    'T-40': string;
    'T-50': string;
    'T-60': string;
    'T-70': string;
    'T-80': string;
    'T-90': string;
    'T-95': string;
    'T-99': string;
    'T-100': string;
}