import { AxiosInstance } from "axios";
// import { BIOMETRY_TYPE } from 'react-native-keychain';

/**Enums */
export enum Saved {
    'save' = 'save',
    'saveBiometry' = 'saveBiometry'
}

export enum Orientation {
    portrait = 'portrait',
    landscape = 'landscape'
}

export enum Service {
    'Keychain-Saved' = 'LogIn-Prelmo-Saved',
    'Keychain-Saved-Biometry' = 'LogIn-Prelmo-Saved-Biometry',
    'Encrypted-Domain' = 'Prelmo-Domain',
    'Encrypted-Saved' = 'Prelmo-Saved',
    'Encrypted-Token' = 'Prelmo-Token',
    'Encrypted-RefreshToken' = 'Prelmo-Refresh-Token',
}


/** Interfaces*/
export interface AppActions {
    setInstance: (instance: AxiosInstance) => void;
    setOrientation: (orientation: Orientation) => void;
    setScreen: ({ height, width }: { height: number, width: number }) => void;
    updateIsCompatible: (isCompatible: boolean) => void;
    setSaved: (saved: Saved | null) => void;
    updateFE: (fe: boolean) => void;
}

export interface AppStore extends AppActions {
    domain: string;
    directory: string;
    instance: AxiosInstance;
    saved: Saved | null;
    orientation: Orientation;
    screenHeight: number;
    screenWidth: number;
    firstEntry: boolean;
    isCompatible: boolean;
}