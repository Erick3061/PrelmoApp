/**Enums */
export enum AuthStatus {
    authorized = 'authorized',
    unauthorized = 'unauthorized',
    pending = 'pending',
}

/**Types */
export type InputsSingIn = {
    email: string,
    password: string,
}

/**Interfaces */
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
    roles: string[];
    token: string;
    refreshToken: string;
    company?: Company;
}

export interface AuthActions {
    checkAuth: () => void;
    logIn: (user?: User) => void;
    logOut: () => void;
    setData: ({ email, password }: { email: string; password: string; }) => void;
    removeData: () => void;
}

export interface AuthState extends AuthActions {
    status: AuthStatus;
    User?: User;
    authData?: {
        email: string;
        password: string;
    }
}