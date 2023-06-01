import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, View, TouchableWithoutFeedback, Keyboard, ScrollView, Alert } from 'react-native';
import { RootStackParamList, Saved, Service } from '../types/types';

import { Appbar, Button, Checkbox, IconButton, Text, TextInput, TouchableRipple } from 'react-native-paper';
import Animated, { BounceIn, FadeInDown } from 'react-native-reanimated';
import { style } from '../../App';
import { SocialNetworks } from '../components/SocialNetworks';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Loading } from '../components/Loading';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '../components/Input';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import { setUser, updateFE, updateSaved } from '../features/configSlice';
import keychain from 'react-native-keychain';
import { RequestContext } from '../context/RequestContext';
import { NotificationContext } from '../components/Notification/NotificationtContext';


type Props = NativeStackScreenProps<RootStackParamList, 'LogInScreen'>;

type InputsLogIn = {
    email: string,
    password: string,
}

export const LogInScreen = ({ navigation, route }: Props) => {
    const { control, handleSubmit, reset, setValue, getValues } = useForm<InputsLogIn>({ defaultValues: { email: '', password: '' } });
    const [isShow, setIsShow] = useState<boolean>(true);
    const [getted, setGetted] = useState<InputsLogIn>();
    const [isChanged, setIsChanged] = useState<boolean>(false);
    const { LogIn } = useContext(RequestContext);
    const { handleError, notification } = useContext(NotificationContext);

    const {
        theme: { theme: { colors, dark } },
        config: { saved, domain, isCompatible, firstEntry }
    } = useAppSelector(state => state);

    const AppDispatch = useAppDispatch();

    const { isLoading, mutate } = useMutation(['LogIn'], LogIn, {
        retry: 0,
        onError: async err => {
            const Err = err as AxiosError;
            handleError(Err.message);
        },
        onSuccess: async data => {
            if (isCompatible) {
                if (saved === Saved.saveBiometry) {
                    await Save(getValues('email'), getValues('password'), true);
                }
                if (saved === Saved.save) {
                    await Save(getValues('email'), getValues('password'), false);
                }
            } else {
                if (saved === Saved.save) {
                    await Save(getValues('email'), getValues('password'), false);
                }
            }
            reset();
            AppDispatch(updateFE(false));
            if (data.termsAndConditions) AppDispatch(setUser(data));
            else navigation.navigate('TCAP', { user: data });
        },
    });

    const onSubmit: SubmitHandler<InputsLogIn> = async (data) => {
        mutate(data);
    };

    const askSave = () => {
        Alert.alert('Alerta', '¿Realmente quieres Recordar la contraseña?', [
            {
                text: 'cancelar'
            },
            { text: 'ok', onPress: () => AppDispatch(updateSaved(Saved.save)) }
        ], {
            cancelable: true
        });
    }

    const check = () => {
        if (isCompatible) {
            Alert.alert('Activar lector de biometría', '¿Desea activar el inicio de sesión con lectores biométricos? \n\nSiempre se puede cambiar esto en los ajustes de la aplicación', [
                { text: 'no', onPress: () => askSave() },
                {
                    text: 'si', onPress: async () => {
                        AppDispatch(updateSaved(Saved.saveBiometry));
                    }
                }
            ], { cancelable: true })
        }
        else {
            askSave()
        }
    }

    const deleteCheck = async () => {
        try {
            await keychain.resetGenericPassword({ service: Service['Keychain-Saved'] });
            await keychain.resetGenericPassword({ service: Service['Keychain-Saved-Biometry'] });
            await EncryptedStorage.removeItem(Service['Encrypted-Saved']);
            AppDispatch(updateSaved(null));
            setGetted(undefined);
            reset();
        } catch (error) { handleError(`${error}`) }
    }

    const Save = async (user: string, password: string, isBiometry: boolean) => {
        try {
            (saved !== null) && await EncryptedStorage.setItem(Service['Encrypted-Saved'], saved);

            if (isBiometry) {
                if (!getted) {
                    await keychain.setGenericPassword(user, password, {
                        service: Service['Keychain-Saved']
                    });
                    await keychain.setGenericPassword(user, password, {
                        accessControl: keychain.ACCESS_CONTROL.BIOMETRY_ANY,
                        service: Service['Keychain-Saved-Biometry']
                    });
                } else {//TODO : Verificar este paso  para la actualizacón de los datos

                }
            } else {
                if (!getted) {
                    await keychain.setGenericPassword(user, password, {
                        service: Service['Keychain-Saved']
                    });
                } else {//TODO : Verificar este paso  para la actualizacón de los datos

                }
            }
        } catch (error) {
            handleError(`${error}`);
        }
    }

    const useBiometricos = async () => {
        try {
            const data = await keychain.getGenericPassword({ service: Service['Keychain-Saved-Biometry'] });
            if (data) onSubmit({ email: data.username, password: data.password });
        } catch (error) {
            notification({
                type: 'warning',
                title: 'Alerta',
                text: `${error}`,
            });
        }
    }

    const setValues = async () => {
        try {
            const data = await keychain.getGenericPassword({ service: Service['Keychain-Saved'] });
            switch (saved) {
                case Saved.save:
                    if (data) {
                        setGetted({ email: data.username, password: data.password });
                        setValue('email', data.username);
                        if (firstEntry) onSubmit({ email: data.username, password: data.password });
                    }
                    break;
                case Saved.saveBiometry:
                    if (data) {
                        setGetted({ email: data.username, password: data.password });
                        setValue('email', data.username);
                        if (firstEntry) useBiometricos();
                    }
                    break;
                default:
                    setGetted(undefined);
            }
        } catch (error) {
            handleError(`${error}`);
        }
    }


    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: '',
            header: () => {
                return (
                    <Appbar>
                        <Image
                            source={require('../assets/prelmo2.png')}
                            style={[
                                dark && { tintColor: colors.onSurface },
                                {
                                    marginHorizontal: 10,
                                    height: '100%',
                                    width: 90,
                                    resizeMode: 'contain',
                                    alignSelf: 'flex-start',
                                }
                            ]}
                        />
                    </Appbar>
                )
            }
        })
    }, [navigation, dark]);



    useEffect(() => {
        const state = navigation.getState();
        const routes = state.routes;

        navigation.reset({
            ...state,
            routes: routes.slice(0),
            index: 0
        });
        setValues();
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <>
                <Loading refresh={isLoading} />
                <Animated.View entering={FadeInDown.delay(350).duration(400)}
                    style={[
                        style.container,
                        { paddingHorizontal: '7%', justifyContent: 'center' }
                    ]}
                >
                    <View>
                        <ScrollView>
                            <Text style={{ marginVertical: 5, textAlign: 'center', fontWeight: 'bold' }} variant='titleLarge'>¡Bienvenido!</Text>
                            <Text style={{ textAlign: 'center', color: colors.outline }}>Ingrese sus datos para iniciar sesión</Text>
                            <KeyboardAvoidingView style={{ flex: 1 }} enabled behavior={Platform.OS === "ios" ? "padding" : undefined}>
                                <TextInput
                                    disabled
                                    label="Dirección del Servidor"
                                    placeholder="Type something"
                                    style={{
                                        flex: 1,
                                        backgroundColor: 'transparent'
                                    }}
                                    left={<TextInput.Icon icon="server" />}
                                    right={
                                        <TextInput.Icon
                                            icon="cloud-sync"
                                            color={() => colors.primary}
                                            onPress={(() => navigation.navigate('DomainScreen'))}
                                        />
                                    }
                                    value={domain.replace('https://', '').replace('http://', '').replace('/', '')}
                                />
                                <Input
                                    editable={(!isLoading)}
                                    formInputs={control._defaultValues}
                                    control={control}
                                    name={'email'}
                                    placeholder='ejemplo@correo.com'
                                    keyboardType='email-address'
                                    rules={{ required: { value: true, message: 'Campo requerido' } }}
                                    label='Correo'
                                    returnKeyType='next'
                                    autoCapitalize='none'
                                    style={{ backgroundColor: 'transparent' }}
                                    left={<TextInput.Icon icon={'email'} color={(focused) => focused ? undefined : colors.primary} />}
                                />

                                <Input
                                    onR={(nextInput) => { nextInput = nextInput }}
                                    editable={(!isLoading)}
                                    formInputs={control._defaultValues}
                                    control={control}
                                    name={'password'}
                                    keyboardType='default'
                                    secureTextEntry={isShow ? true : false}
                                    placeholder='**********'
                                    rules={{ required: { value: true, message: 'Campo requerido' } }}
                                    label='Contraseña'
                                    onSubmitEditing={handleSubmit(onSubmit)}
                                    returnKeyType='next'
                                    autoCapitalize='none'
                                    onChange={async ({ nativeEvent: { text } }) => {
                                        if ((isCompatible && saved === Saved.saveBiometry && getted) && text !== '') {
                                            setIsChanged(true);
                                        }
                                        if ((isCompatible && saved === Saved.saveBiometry && getted) && text === '') {
                                            setIsChanged(false);
                                        }
                                    }}
                                    style={{ backgroundColor: 'transparent' }}
                                    left={<TextInput.Icon icon={'lock'} color={(focused) => focused ? undefined : colors.primary} />}
                                    right={
                                        <TextInput.Icon

                                            icon={isShow ? 'eye-off' : 'eye'}
                                            color={(focused) => focused ? undefined : colors.primary}
                                            onPress={() => setIsShow(!isShow)}
                                            forceTextInputFocus={false}
                                        />
                                    }
                                />

                                <TouchableRipple style={{ marginVertical: 10 }} rippleColor={colors.secondaryContainer} onPress={() => (saved === null) ? check() : deleteCheck()} >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Checkbox
                                            status={(saved !== null) ? 'checked' : 'unchecked'}
                                            onPress={() => (saved === null) ? check() : deleteCheck()}
                                        />
                                        <Text>Recordar contraseña</Text>
                                    </View>
                                </TouchableRipple>

                                {
                                    (isCompatible && saved === 'saveBiometry' && getted && !isChanged)
                                        ?
                                        <View style={{ alignItems: 'center' }}>
                                            <Animated.View entering={BounceIn} >
                                                <IconButton icon='fingerprint' size={40} onPress={async () => useBiometricos()} />
                                            </Animated.View>
                                            <Text variant='labelSmall' style={{ marginTop: 10 }}>Iniciar sesión con fuerte biométrica</Text>
                                        </View>
                                        :
                                        <Animated.View entering={BounceIn} >
                                            <Button
                                                children='Iniciar Sesión'
                                                mode='contained'
                                                onPress={handleSubmit(onSubmit)}
                                                loading={(isLoading)}
                                                disabled={(isLoading)}
                                                style={{ alignSelf: 'center' }}
                                                labelStyle={{ textTransform: 'uppercase' }}
                                            />
                                        </Animated.View>
                                }

                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginVertical: 5 }}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('PdfScreen', {
                                            name: 'Registro', url: `${domain}/docs/REGISTRO-PLATAFORMA.pdf`
                                        })}
                                        disabled={isLoading} >
                                        <Text variant='titleSmall' style={[{ textAlign: 'center', marginVertical: 10 }]}>Regístrate</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => Alert.alert('Alerta', 'Contacta a tu titular para recuperar tu contraseña', [], { cancelable: true })}
                                        disabled={isLoading} >
                                        <Text variant='titleSmall' style={[{ textAlign: 'center', marginVertical: 10 }]} >Olvidé mi contraseña</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity style={{ marginVertical: 15 }} onPress={() => navigation.navigate('TCAP')} disabled={isLoading} >
                                    <Text variant='titleSmall' style={{ textAlign: 'center' }}>Términos y condiciones y aviso de privacidad</Text>
                                </TouchableOpacity>
                            </KeyboardAvoidingView>
                            <SocialNetworks />
                        </ScrollView>
                    </View>
                </Animated.View>
            </>
        </TouchableWithoutFeedback>
    )
}
