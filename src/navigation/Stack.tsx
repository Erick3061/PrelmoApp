import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect } from 'react';
import { Orientation, RootStackParamList, Saved, Service } from '../types/types';
import { DomainScreen } from '../screens/DomainScreen';
import { LogInScreen } from '../screens/LogInScreen';
import { Drawer } from './Drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { TCAPScreen } from '../screens/TCAPScreen';
import { PdfScreen } from '../screens/PdfScreen';
import { DownloadScreen } from '../screens/DownloadScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Alert, ColorSchemeName, Dimensions, Platform, StatusBar, useColorScheme } from 'react-native';
import { updateTheme } from '../features/themeSlice';
import { CombinedDarkTheme, CombinedDefaultTheme } from '../config/Theming';
import { logOut, setOrientation, setScreen, setUser, updateDirectory, updateDomain, updateFE, updateSaved, updateStatus, updateisCompatible } from '../features/configSlice';
import RNFS from 'react-native-fs';
import EncryptedStorage from 'react-native-encrypted-storage';
import keychain from 'react-native-keychain';
import { NotificationProvider } from '../components/Notification/NotificationtContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { RequestContext } from '../context/RequestContext';
import { DetailsInfoScreen } from '../screens/drawer/DetailsInfoScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { ResultAccountScreen } from '../screens/ResultAccountScreen';
import { ResultAccountsScreen } from '../screens/ResultAccountsScreen';
import { TableScreen } from '../screens/TableScreen';
import { OrientationLocker, OrientationType } from 'react-native-orientation-locker';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


const RootStack = createNativeStackNavigator<RootStackParamList>();

export const Stack = () => {
    const {
        theme: { theme },
        config: { status }
    } = useAppSelector(state => state);
    const { CheckAuth } = useContext(RequestContext);
    const color: ColorSchemeName = useColorScheme();
    const AppDispatch = useAppDispatch();
    const queryclient = useQueryClient();

    const { mutate } = useMutation(['CheckAuth'], CheckAuth, {
        onSuccess: data => {
            AppDispatch(updateFE(false));
            AppDispatch(setUser(data));
        },
        onError: err => {
            const Error: AxiosError = err as AxiosError;
            const Response: AxiosResponse = Error.response as AxiosResponse;
            if (Error.response?.status === 401 && JSON.stringify(Error.response?.data).includes("La sesión expiro, inicie sesión nuevamente")) {
                queryclient.clear();
                AppDispatch(logOut());
            }
            AppDispatch(updateStatus('unlogued'));
            Alert.alert('Error', `${Response.data.message}`)
        }
    })

    const autoLogIn = async () => {
        await EncryptedStorage.getItem(Service["Encrypted-Token"])
            .then(async token => {
                if (!token) {
                    AppDispatch(updateStatus('unlogued'));
                } else {
                    mutate();
                }
            })
            .catch(error => Alert.alert('Error', `${error}`));
    }

    async function setConfig() {
        try {
            const directory: string = (Platform.OS === 'ios') ? RNFS.DocumentDirectoryPath : RNFS.ExternalCachesDirectoryPath;
            AppDispatch(updateDirectory(directory));

            const { width, height } = Dimensions.get('screen');
            if (height >= width) {
                AppDispatch(setOrientation(Orientation.portrait));
                AppDispatch(setScreen({ height, width }));
            } else {
                AppDispatch(setOrientation(Orientation.landscape));
                AppDispatch(setScreen({ height: width, width: height }));
            }

            const isCompatible = await keychain.getSupportedBiometryType();
            AppDispatch(updateisCompatible(isCompatible));

            const saved = await EncryptedStorage.getItem(Service["Encrypted-Saved"]);
            (saved === Saved.save) && AppDispatch(updateSaved(Saved.save));
            (saved === Saved.saveBiometry) && AppDispatch(updateSaved(Saved.saveBiometry));
            (saved === null) && AppDispatch(updateSaved(null));


            // const domain: string = await EncryptedStorage.getItem(Service["Encrypted-Domain"]) ?? '';

            // if (domain !== '') {
            AppDispatch(updateDomain('https://api-consultas.prelmo.com/v1'));
            autoLogIn();
            // }
            // else {
            //     AppDispatch(updateStatus('unlogued'));
            // }

        } catch (error) {
            Alert.alert('Error', `${error}`);
        }
    }

    useEffect(() => {
        // if (whithSystem)
        (color === 'light') ? AppDispatch(updateTheme(CombinedDefaultTheme)) : AppDispatch(updateTheme(CombinedDarkTheme));
        //Todo cambiar el tema manual
        // }
    }, [color]);

    useEffect(() => {
        setConfig();
    }, []);


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PaperProvider theme={theme}>
                <NavigationContainer theme={theme}>
                    <NotificationProvider>
                        <StatusBar backgroundColor={theme.colors.background} barStyle={theme.dark ? 'light-content' : 'dark-content'} />
                        <OrientationLocker
                            orientation='ALL_ORIENTATIONS_BUT_UPSIDE_DOWN'
                            onChange={(props) => (props === OrientationType.PORTRAIT) ? AppDispatch(setOrientation(Orientation.portrait)) : AppDispatch(setOrientation(Orientation.landscape))}
                        />
                        <RootStack.Navigator>
                            {
                                (status === 'logued')
                                    ?
                                    <>
                                        <RootStack.Group key={"Private"}>
                                            <RootStack.Screen name="Drawer" component={Drawer} options={{ headerShown: false }} />
                                            <RootStack.Screen name='DetailsInfoScreen' component={DetailsInfoScreen} />
                                            <RootStack.Screen name='ResultAccountScreen' component={ResultAccountScreen} />
                                            <RootStack.Screen name='ResultAccountsScreen' component={ResultAccountsScreen} />
                                            <RootStack.Screen name='TableScreen' component={TableScreen} />
                                            <RootStack.Screen name='Search' component={SearchScreen} options={{ animation: 'fade_from_bottom' }} />
                                        </RootStack.Group>
                                        <RootStack.Group screenOptions={{ presentation: 'formSheet' }}>
                                            <RootStack.Screen name="ChangePasswordScreen" options={{ title: 'Cambiar contraseña' }} component={ChangePasswordScreen} />
                                        </RootStack.Group>
                                    </>
                                    :
                                    <RootStack.Group>
                                        <RootStack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
                                        <RootStack.Screen name="LogInScreen" component={LogInScreen} />
                                    </RootStack.Group>
                            }
                            <RootStack.Group key={"AllState"}>
                                <RootStack.Screen name='DownloadScreen' component={DownloadScreen} />
                                <RootStack.Screen name="DomainScreen" component={DomainScreen} />
                                <RootStack.Screen name='PdfScreen' component={PdfScreen} />
                            </RootStack.Group>
                            <RootStack.Group screenOptions={{ presentation: 'transparentModal' }}>
                                <RootStack.Screen name="TCAP" options={{ headerShown: false, }} component={TCAPScreen} />
                            </RootStack.Group>
                        </RootStack.Navigator>
                    </NotificationProvider>
                </NavigationContainer>
            </PaperProvider>
        </GestureHandlerRootView>
    )
}
