import { ThemeMode } from "@/interface/theme.store.interface";
import useAppStore from "@/utils/app.store";
import useAuthStore from "@/utils/auth.store";
import useThemeStore from "@/utils/theme.store";
import { AxiosError } from "axios";
import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect } from "react";
import { useColorScheme } from 'react-native';
import AuthService from "../services/auth.service";

export const useSetConfig = () => {
    const colorScheme = useColorScheme();
    const updateMode = useThemeStore(state => state.updateMode);
    const instance = useAppStore(store => store.instance);
    // const setOrientation = useAppStore(store => store.setOrientation);
    const updateIsCompatible = useAppStore(store => store.updateIsCompatible);
    // const setScreen = useAppStore(store => store.setScreen);
    const domain = useAppStore(store => store.domain);
    const logIn = useAuthStore(store => store.logIn);
    const logOut = useAuthStore(store => store.logOut);
    const User = useAuthStore(store => store.User);

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
                    config.headers['Authorization'] = `Bearer ${User?.refreshToken ?? 'without token'}`;
                    console.info(config.baseURL, config.url);
                    return config;
                }
            );

            instance.interceptors.response.use(function (response) {
                return response;
            }, async function (error) {
                const Err = error as AxiosError;
                console.error(error);

                if (Err.response?.status === 401 && JSON.stringify(Err.response.data).includes("La sesión expiro, inicie sesión nuevamente")) {
                    try {
                        const user = await AuthService.CheckAuth(User?.token ?? 'without token');
                        logIn(user);
                    } catch (error) {
                        logOut();
                        return Promise.reject(error);
                    }
                }
                if (error.response && error.response.data) return Promise.reject(error.response.data);
                return Promise.reject(error);
            });
        },
        [User?.refreshToken, User?.token, domain, instance.defaults, instance.interceptors.request, instance.interceptors.response, logIn, logOut],
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
