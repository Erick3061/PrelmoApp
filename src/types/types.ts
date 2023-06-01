import { MD3Theme } from "react-native-paper";
import { Theme } from '@react-navigation/native';
import { Account, Events, Key, User } from '../interface/interface';

/**Enums */

export enum Service {
    'Keychain-Saved' = 'LogIn-Prelmo-Saved',
    'Keychain-Saved-Biometry' = 'LogIn-Prelmo-Saved-Biometry',
    'Encrypted-Domain' = 'Prelmo-Domain',
    'Encrypted-Saved' = 'Prelmo-Saved',
    'Encrypted-Token' = 'Prelmo-Token',
    'Encrypted-RefreshToken' = 'Prelmo-Refresh-Token',
}

export enum MIMETypes {
    'pdf' = 'application/pdf',
    'xlsx' = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'desc' = ''
}

export enum Saved {
    'save' = 'save',
    'saveBiometry' = 'saveBiometry'
}

export enum Orientation {
    portrait = 'portrait',
    landscape = 'landscape'
}

export enum BatteryStatus {
    ERROR = "ERROR",
    RESTORE = "RESTORE",
    WITHOUT_EVENTS = "WITHOUT-EVENTS"
}



/**navigation */

export type StatusApp = 'checking' | 'unlogued' | 'logued';
export type TypeReport = 'ap-ci' | 'event-alarm' | 'batery' | 'state' | 'apci-week';
export type typeAccount = number;
export type TypeReportDownload = 'ap-ci' | 'alarm' | 'batery' | 'state' | 'ap-ci-week';
export type filterEvents = "ALL" | "AP" | "CI" | "APCI" | "Alarm" | "Prue" | "Bat" | "otros";

export const AP = ["O", "OS", "US11"];
export const CI = ["C", "CS", "UR11"];
export const APCI = ["C", "CS", "O", "OS", "UR11", "US11"];
export const Alarm = ["A", "ACZ", "ASA", "ATR", "CPA", "FIRE", "GA", "P", "SAS", "SMOKE", "VE"];
export const Prue = ["AGT", "AT", "ATP", "AUT", "TST", "TST0", "TST1", "TST3", "TSTR", "TX0"];
export const Bat = ["BB"];
export const otros = ['1381', "24H", "ACR", "BPS", "CAS", "CN", "CTB", "ET*", "FC*", "FCA", "FT", "FT*", "IA*", "MED", "PA", "PAF", "PR", "PRB", "RAS", "REB", "RES", "RFC", "RON", "S99", "STL", "SUP", "TAM", "TB", "TEL", "TESE", "TESS", "TPL", "TRB"];


export type RootStackParamList = {
    SplashScreen: undefined;
    DomainScreen: undefined;
    LogInScreen: undefined;
    DetailsInfoScreen: undefined;
    Drawer: undefined;
    DownloadScreen: undefined;
    ChangePasswordScreen: undefined;
    PdfScreen: {
        name: string;
        url: string;
    };
    TCAP: { user: User } | undefined;
    Search: { type: 'Account' | 'Accounts' | 'Groups' };
    ResultAccountScreen: {
        account: Account,
        start: string,
        end: string,
        report: Exclude<TypeReport, "batery" | "state" | "apci-week">,
        keys: Array<Key<Events>>,
        typeAccount: typeAccount,
        filter: boolean,
    };
    ResultAccountsScreen: {
        accounts: Array<{ name: string, code: number }>,
        nameGroup: string,
        start?: string,
        end?: string,
        report: TypeReport,
        keys: Array<Key<Events>> | Array<Key<Account>>,
        typeAccount: typeAccount
    };
    TableScreen: {
        events: Array<Events>;
        keys: Array<Key<Events>> | Array<Key<Account>>;
        name: string;
        report: string;
        address: string;
    }
}

export type RootDrawerParamList = {
    HomeScreen: undefined;
    ProfileScreen: undefined;
    DownloadScreen: undefined;
    DetailsInfoScreen: undefined;
    SelectAccountScreen: undefined;
    SelectGroupsScreen: undefined;
    SelectAccountsScreen: undefined;
}

/**Context */
export type StateAppContext = {
    domain: string;
    directory: string;

    status: StatusApp;
    theme: AppTheme;
    saved: Saved;
    User?: User;

}

export type StateRequestContext = {
    isDownloadDoc: boolean;
}

export type ActionAppContext =
    | { type: 'updateTheme', payload: AppTheme }
    | {
        type: 'updateState', payload: {
            state: StatusApp,
            User?: User
        }
    }
    ;

export type ActionRequestContext =
    | { type: 'isDownloadDoc', payload: boolean }


export type IndicatorColors = {
    colors: {
        info: string,
        danger: string,
        warning: string,
        success: string,
        question: string
        test: string;
        other: string;
    };
}

export declare type AppTheme = Theme & MD3Theme & IndicatorColors;