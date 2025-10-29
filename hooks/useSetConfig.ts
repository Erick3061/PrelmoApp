import { User } from "@/interface/auth.store.interface";
import { ThemeMode } from "@/interface/theme.store.interface";
import useAppStore from "@/utils/app.store";
import useAuthStore from "@/utils/auth.store";
import useThemeStore from "@/utils/theme.store";
import axios, { AxiosError } from "axios";
import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect } from "react";
import { useColorScheme } from 'react-native';

export const useSetConfig = () => {
    const colorScheme = useColorScheme();
    const updateMode = useThemeStore(state => state.updateMode);
    const instance = useAppStore(store => store.instance);
    // const setOrientation = useAppStore(store => store.setOrientation);
    const updateIsCompatible = useAppStore(store => store.updateIsCompatible);
    // const setScreen = useAppStore(store => store.setScreen);
    const domain = useAppStore(store => store.domain);

    const biometric = useCallback(
        async () => {
            const data = await LocalAuthentication.hasHardwareAsync();
            updateIsCompatible(data);
        },
        [updateIsCompatible],
    )


    const updateInstance = useCallback(
        () => {
            instance.defaults.baseURL = domain;
            instance.interceptors.request.use(
                (config) => {
                    const { User } = useAuthStore.getState();
                    config.headers['Authorization'] = `Bearer ${User?.refreshToken ?? 'without token'}`;
                    console.info(config.baseURL, config.url);
                    return config;
                },
                (error) => { Promise.reject(error) }
            );

            instance.interceptors.response.use(function (response) {
                return response;
            }, async function (error) {
                const originalRequest = error.config;
                const Err = error as AxiosError;
                if (Err.response?.status === 401 && JSON.stringify(Err.response.data).includes("La sesión expiro, inicie sesión nuevamente") && !originalRequest._retry) {
                    originalRequest._retry = true; // Mark request as retried
                    try {
                        const { User } = useAuthStore.getState();
                        const { data } = await axios.create({ baseURL: domain }).get<User>('auth/check-auth', { headers: { Authorization: `Bearer ${User?.token}` } });
                        useAuthStore.getState().logIn(data);
                        return instance(originalRequest);
                    } catch (refreshError) {
                        useAuthStore.getState().logIn(undefined);
                        if (error.response && error.response.data) return Promise.reject(error.response.data);
                        return Promise.reject(refreshError);
                    }
                }
                if (error.response && error.response.data) return Promise.reject(error.response.data);
                return Promise.reject(error);
            });
        },
        [domain, instance],
    )


    // const { width, height } = Dimensions.get('screen');
    // if (height >= width) {
    //     setOrientation(Orientation.portrait);
    //     setScreen({ height, width });
    // } else {
    //     setOrientation(Orientation.landscape);
    //     setScreen({ height: width, width: height });
    // }
    // 

    return (
        useEffect(() => {
            biometric();
            updateInstance();
        }, [biometric, updateInstance]),

        useEffect(() => {
            return () => {
                if (colorScheme === 'dark') updateMode(ThemeMode.dark)
                else updateMode(ThemeMode.light);
            }
        }, [colorScheme, updateMode])
    )
}
