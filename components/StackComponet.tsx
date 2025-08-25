import { AuthStatus } from '@/interface/auth.store.interface';
import AuthService from '@/services/auth.service';
import useAuthStore from '@/utils/auth.store';
import useNotificationStore from '@/utils/notification.store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';


const StackComponent = () => {
    const status = useAuthStore(state => state.status);
    const logIn = useAuthStore(state => state.logIn);
    const logOut = useAuthStore(state => state.logOut);
    const handleError = useNotificationStore(state => state.handleError);
    const queryclient = useQueryClient();


    const { mutate } = useMutation({
        mutationKey: ['CheckAuth'],
        mutationFn: AuthService.CheckAuth,
        onSuccess: data => {
            logIn(data);
        },
        onError: err => {
            const Error: AxiosError = err as AxiosError;
            const Response: AxiosResponse = Error.response as AxiosResponse;
            if (Error.response?.status === 401 && JSON.stringify(Error.response?.data).includes("La sesión expiro, inicie sesión nuevamente")) {
                queryclient.clear();
                logOut();
            }
            handleError(Response.data.message);
        }
    })

    const Header = () => (
        <Appbar.Header>
            <Image style={[style.appbar_image]} source={require('../assets/images/prelmo2.png')} />
        </Appbar.Header>
    );

    useEffect(() => {
        mutate(undefined);
    }, [mutate])

    return (
        <Stack>
            <Stack.Protected guard={status === AuthStatus.authorized}>
                <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard>
                <Stack.Screen name="sing-in" options={{ header: Header }} />
                <Stack.Screen name="tcap" options={{ presentation: 'modal', animation: 'fade', title: 'Términos, condiciones y aviso de privacidad' }} />
                <Stack.Screen name="list-account" options={{ presentation: 'containedTransparentModal', title: 'Buscar', animation: 'fade' }} />
                <Stack.Screen name="result-account" />
                <Stack.Screen name="+not-found" />
            </Stack.Protected>
        </Stack>
    )
}

export default StackComponent

const style = StyleSheet.create({
    appbar_image: {
        resizeMode: 'contain',
        height: '45%',
        width: 120
    },
});