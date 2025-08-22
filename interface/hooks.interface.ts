/**Constants */
export const AP = ["O", "OS", "US11"];
export const CI = ["C", "CS", "UR11"];
export const APCI = ["C", "CS", "O", "OS", "UR11", "US11"];
export const Alarm = ["A", "ACZ", "ASA", "ATR", "CPA", "FIRE", "GA", "P", "SAS", "SMOKE", "VE"];
export const Prue = ["AGT", "AT", "ATP", "AUT", "TST", "TST0", "TST1", "TST3", "TSTR", "TX0"];
export const Bat = ["BB"];
export const otros = ['1381', "24H", "ACR", "BPS", "CAS", "CN", "CTB", "ET*", "FC*", "FCA", "FT", "FT*", "IA*", "MED", "PA", "PAF", "PR", "PRB", "RAS", "REB", "RES", "RFC", "RON", "S99", "STL", "SUP", "TAM", "TB", "TEL", "TESE", "TESS", "TPL", "TRB"];

/**Enums */
export enum BatteryStatus {
    ERROR = "ERROR",
    RESTORE = "RESTORE",
    WITHOUT_EVENTS = "WITHOUT-EVENTS"
}

/**Types */
export type TypeReport = 'ap-ci' | 'event-alarm' | 'batery' | 'state' | 'apci-week';
export type typeAccount = number;
export type filterEvents = "ALL" | "AP" | "CI" | "APCI" | "Alarm" | "Prue" | "Bat" | "otros";


/**Interfaces */
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

export interface Account {
    CodigoCte: string;
    CodigoAbonado: string;
    Nombre: string;
    Direccion: string;
    Status?: string;
    nombre?: string;
    numeroEventos?: number;
    estado?: BatteryStatus;
    eventos?: Events[];
    evento?: Events;
}

export interface useReportProps {
    type: TypeReport,
    accounts: number[],
    dateStart?: string,
    dateEnd?: string,
    typeAccount: typeAccount,
    key: string;
}

export interface GetReport {
    accounts: number[];
    typeAccount: typeAccount;
    dateStart?: string;
    dateEnd?: string;
}

export interface Key<T> {
    label: string,
    key: keyof T | (keyof T)[],
    size?: number,
    center?: boolean
}

export interface ResponseReport {
    nombre: string;
    cuentas?: Account[] | undefined;
    fechas?: string[] | undefined;
    total?: number | undefined;
    percentajes?: Percentajes | undefined;
}