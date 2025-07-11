import { Orientation } from "@/interface/app.store.interface";
import { ThemeMode } from "@/interface/theme.store.interface";
import useAppStore from "@/utils/app.store";
import useAuthStore from "@/utils/auth.store";
import useThemeStore from "@/utils/theme.store";
import { AxiosError } from "axios";
import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect } from "react";
import { Dimensions, useColorScheme } from 'react-native';
import AuthService from "../services/auth.service";

export const useSetConfig = () => {
    const colorScheme = useColorScheme();
    const updateMode = useThemeStore(state => state.updateMode);
    const instance = useAppStore(store => store.instance);
    const setOrientation = useAppStore(store => store.setOrientation);
    const updateIsCompatible = useAppStore(store => store.updateIsCompatible);
    const setScreen = useAppStore(store => store.setScreen);
    const domain = useAppStore(store => store.domain);
    const logIn = useAuthStore(store => store.logIn);
    const User = useAuthStore(store => store.User);
    const refreshToken = useAuthStore(store => store.refreshToken);

    const biometric = async () => {
        const data = await LocalAuthentication.hasHardwareAsync();
        updateIsCompatible(data);
    }

    instance.defaults.baseURL = domain;

    instance.interceptors.request.use(
        (config) => {
            const token = User?.token ?? '';
            if (token) config.headers['Authorization'] = `Bearer ${token}`;
            return config;
        }
    );

    instance.interceptors.response.use(function (response) {
        return response;
    }, async function (error) {
        const Err = error as AxiosError;
        if (Err.response?.status === 401 && JSON.stringify(Err.response.data).includes("La sesión expiro, inicie sesión nuevamente")) {
            try {
                const user = await AuthService.checkAuth(refreshToken ?? 'without token');
                logIn(user);
            } catch (error) {
                return Promise.reject(error);
            }
        }
        if (error.response && error.response.data) return Promise.reject(error.response.data);
        return Promise.reject(error);
    });

    const { width, height } = Dimensions.get('screen');
    if (height >= width) {
        setOrientation(Orientation.portrait);
        setScreen({ height, width });
    } else {
        setOrientation(Orientation.landscape);
        setScreen({ height: width, width: height });
    }

    biometric();

    // const saved = await EncryptedStorage.getItem(Service["Encrypted-Saved"]);

    // switch (saved) {
    //     case 'save':
    //         AppDispatch(updateSaved(Saved.save));
    //         break;

    //     case 'saveBiometry':
    //         AppDispatch(updateSaved(Saved.saveBiometry))
    //         break;
    // }

    return (
        useEffect(() => {
            return (colorScheme === 'dark') ? updateMode(ThemeMode.dark) : updateMode(ThemeMode.light);
        }, [colorScheme, updateMode])
    )
}
