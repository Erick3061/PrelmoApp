import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosInstance } from 'axios';
import { Saved, StatusApp, Service, Orientation } from '../types/types';
import { RootState } from "../app/store";
import EncryptedStorage from "react-native-encrypted-storage";
import keychain from 'react-native-keychain';
import { Account, Group, User } from "../interface/interface";


interface ConfigState {
    domain: string;
    directory: string;
    instance: AxiosInstance;
    saved: Saved | null;
    User?: User;
    orientation: Orientation;
    screenHeight: number;
    screenWidth: number;
    status: StatusApp;
    firstEntry: boolean;
    isCompatible: keychain.BIOMETRY_TYPE | null;
    accountsSelected: Array<Account>;
    groupsSelected: Array<Group>;
}

const initialState: ConfigState = {
    domain: '',
    directory: '',
    instance: axios.create({ url: '' }),
    saved: null,
    orientation: Orientation.portrait,
    screenHeight: 0,
    screenWidth: 0,
    status: 'checking',
    firstEntry: true,
    isCompatible: null,
    accountsSelected: [],
    groupsSelected: [],
}

export const updateDomain = createAsyncThunk('updateDomain', async (domain: string) => {
    const instance: AxiosInstance = axios.create({
        baseURL: domain,
    });

    instance.interceptors.request.use(async (config) => {
        console.log('entra intercept req');
        const token = await EncryptedStorage.getItem(Service["Encrypted-Token"]);
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
        (error) => {
            console.log("-->" + error);
            return Promise.reject(error)
        },
    );

    return { domain, instance };
});

export const setUser = createAsyncThunk('LogIn', async (User: User) => {
    try {
        await EncryptedStorage.setItem(Service["Encrypted-Token"], User.token);
        await EncryptedStorage.setItem(Service["Encrypted-RefreshToken"], User.refreshToken);
        console.log(User.refreshToken);

        return User;
    } catch (error) {
        await EncryptedStorage.removeItem(Service["Encrypted-Token"]);
        await EncryptedStorage.removeItem(Service["Encrypted-RefreshToken"]);
        return undefined;
    }
});

export const logOut = createAsyncThunk('logOut', async () => {
    try {
        await EncryptedStorage.removeItem(Service["Encrypted-Token"]);
        await EncryptedStorage.removeItem(Service["Encrypted-RefreshToken"]);
    } catch (error) {
        return undefined;
    }
});


const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        updateDirectory: (state, action: PayloadAction<string>) => {
            state.directory = action.payload;
        },
        updateSaved: (state, action: PayloadAction<Saved | null>) => {
            state.saved = action.payload;
        },
        setOrientation: (state, action: PayloadAction<Orientation>) => {
            state.orientation = action.payload;
        },
        setScreen: (state, action: PayloadAction<{ width: number, height: number }>) => {
            state.screenHeight = action.payload.height;
            state.screenWidth = action.payload.width;
        },
        updateStatus: (state, action: PayloadAction<StatusApp>) => {
            state.status = action.payload
        },
        updateisCompatible: (state, action: PayloadAction<keychain.BIOMETRY_TYPE | null>) => {
            state.isCompatible = action.payload;
        },
        updateFE: (state, action: PayloadAction<boolean>) => {
            state.firstEntry = action.payload;
        },
        updateAccounts: (state, action: PayloadAction<Array<Account>>) => {
            state.accountsSelected = action.payload;
        },
        updateGroups: (state, action: PayloadAction<Array<Group>>) => {
            state.groupsSelected = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateDomain.fulfilled, (state, { payload, meta, type }) => {
                state.domain = payload.domain;
                state.instance = payload.instance
            })
            .addCase(setUser.fulfilled, (state, { payload }) => {
                if (!payload) {
                    state.User = undefined;
                    state.status = 'unlogued'
                } else {
                    state.User = payload;
                    state.status = 'logued';
                }
            })
            .addCase(logOut.fulfilled, (state) => {
                state.User = undefined;
                state.status = 'unlogued';
            });
    }
});


export const {
    updateDirectory,
    updateSaved,
    setOrientation,
    setScreen,
    updateStatus,
    updateisCompatible,
    updateFE,
    updateAccounts,
    updateGroups
} = configSlice.actions;


export const Config = (state: RootState) => state.config;
export default configSlice.reducer;