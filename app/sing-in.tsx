import { Input } from '@/components/Input'
import Loading from '@/components/Loading'
import { SocialNetworks } from '@/components/SocialNetworks'
import { Saved } from '@/interface/app.store.interface'
import { InputsSingIn } from '@/interface/auth.store.interface'
import { ThemeMode } from '@/interface/theme.store.interface'
import useAppStore from '@/utils/app.store'
import useAuthStore from '@/utils/auth.store'
import useNotificationStore from '@/utils/notification.store'
import useThemeStore from '@/utils/theme.store'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native'
import { Button, IconButton, Switch, Text, TextInput, TouchableRipple } from 'react-native-paper'
import Animated, { BounceIn, FadeIn } from 'react-native-reanimated'
import AuthService from '../services/auth.service'

const SingIn = () => {
    const { control, handleSubmit, reset, setValue, getValues } = useForm<InputsSingIn>({ defaultValues: { email: '', password: '' } });
    const handleError = useNotificationStore(state => state.handleError);
    const [isShow, setIsShow] = useState<boolean>(true);
    const [getted, setGetted] = useState<InputsSingIn>();
    const [isChanged, setIsChanged] = useState<boolean>(false);
    const router = useRouter();
    const logIn = useAuthStore(store => store.logIn);
    const setData = useAuthStore(store => store.setData);
    const authData = useAuthStore(store => store.authData);
    const removeData = useAuthStore(store => store.removeData);
    const { saved } = useAppStore();
    const updateFE = useAppStore(store => store.updateFE);
    const firstEntry = useAppStore(store => store.firstEntry);
    const setSaved = useAppStore(store => store.setSaved);
    const isCompatible = useAppStore(store => store.isCompatible);
    const mode = useThemeStore(store => store.mode);

    const { mutate, isPending } = useMutation({
        mutationKey: ['LogIn'],
        mutationFn: AuthService.signIn,
        retry: 0,
        onError: async err => {
            const Err = err as AxiosError;
            handleError(Err.message);
        },
        onSuccess: data => {
            if (isCompatible) {
                if (saved === Saved.saveBiometry) Save(getValues('email'), getValues('password'), true);
                if (saved === Saved.save) Save(getValues('email'), getValues('password'), false);
            } else
                if (saved === Saved.save) Save(getValues('email'), getValues('password'), false);

            reset();
            updateFE(false);
            if (data.termsAndConditions) { }
            else router.navigate('/tcap', {});
            logIn(data);
            router.replace('/(drawer)');
        },
    });

    const onSubmit: SubmitHandler<InputsSingIn> = useCallback(
        (data) => mutate(data),
        [mutate],
    );

    // const Biometricos = async () => {
    //     const resp = await LocalAuthentication.authenticateAsync();
    //     if (resp.success) onSubmit({ email: authData?.email ?? '', password: authData?.password ?? '' });
    //     else {
    //         notification({
    //             type: 'warning',
    //             title: 'Alerta',
    //             text: `${resp.error}`,
    //         });
    //     }
    // }

    const setValuesStart = useCallback(
        () => {
            switch (saved) {
                case Saved.save:
                    if (authData) {
                        setGetted({ email: authData.email, password: authData.password });
                        setValue('email', authData.email);
                        if (firstEntry) onSubmit({ email: authData.email, password: authData.password });
                    }
                    break;
                // case Saved.saveBiometry:
                //     if (authData) {
                //         setGetted({ email: authData.email, password: authData.password });
                //         setValue('email', authData.email);
                //         if (firstEntry) Biometricos();
                //     }
                //     break;
                default:
                    setGetted(undefined);
            }
        },
        [authData, firstEntry, onSubmit, saved, setValue],
    );

    const askSave = () => {
        Alert.alert('Alerta', '¿Realmente quieres Recordar la contraseña?', [
            { text: 'cancelar' },
            { text: 'ok', onPress: () => setSaved(Saved.save) }
        ], { cancelable: true });
    }

    const check = () => {
        // if (isCompatible) {
        //     Alert.alert('Activar lector de biometría', '¿Desea activar el inicio de sesión con lectores biométricos? \n\nSiempre se puede cambiar esto en los ajustes de la aplicación', [
        //         { text: 'no', onPress: () => askSave() },
        //         { text: 'si', onPress: async () => { setSaved(Saved.saveBiometry); } }
        //     ], { cancelable: true })
        // }
        // else { askSave() }
        askSave()
    }

    const deleteCheck = async () => {
        try {
            setSaved(null);
            setGetted(undefined);
            removeData();
            reset();
        } catch (error) { handleError(`${error}`); console.log(error) }
    }

    const Save = (user: string, password: string, isBiometry: boolean) => {
        try {
            if (isBiometry) {
                if (!getted) {
                    setData({ email: user, password });
                } else {//TODO : Verificar este paso  para la actualizacón de los datos

                }
            } else {
                if (!getted) {
                    setData({ email: user, password });
                } else {//TODO : Verificar este paso  para la actualizacón de los datos

                }
            }
        } catch (error) {
            handleError(`${error}`);
        }
    }

    useEffect(() => {
        saved !== null && setValuesStart();
    }, [saved, setValuesStart]);

    return (
        <>
            <Animated.View entering={FadeIn.delay(350).duration(400)} style={[{ paddingHorizontal: '7%', justifyContent: 'center', flex: 1 }]} >
                <Loading refresh={true} />
                <View style={{ flex: 1 }} />
                <ScrollView>
                    <Text style={{ marginVertical: 15, textAlign: 'center' }} variant='headlineLarge'>Bienvenido</Text>
                    <Text style={{ textAlign: 'center', marginBottom: 15 }}>Ingrese sus datos, para iniciar sesión.</Text>
                    <KeyboardAvoidingView style={{ flex: 1, gap: 5 }} enabled behavior={Platform.OS === "ios" ? "padding" : undefined}>
                        <Input
                            errorColor={mode === ThemeMode.dark ? 'lightcoral' : 'darkred'}
                            editable={(!isPending)}
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
                            left={<TextInput.Icon icon={'email'} />}
                            mode='outlined'
                        />
                        <Input
                            errorColor={mode === ThemeMode.dark ? 'lightcoral' : 'darkred'}
                            onR={(nextInput) => { nextInput = nextInput }}
                            editable={(!isPending)}
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
                            mode='outlined'
                            onChange={async ({ nativeEvent: { text } }) => {
                                if ((isCompatible && saved === Saved.saveBiometry && getted) && text !== '') {
                                    setIsChanged(true);
                                }
                                if ((isCompatible && saved === Saved.saveBiometry && getted) && text === '') {
                                    setIsChanged(false);
                                }
                            }}
                            style={{ backgroundColor: 'transparent' }}
                            left={<TextInput.Icon icon={'lock'} />}
                            right={
                                <TextInput.Icon
                                    icon={isShow ? 'eye-off' : 'eye'}
                                    // color={(focused) => focused ? undefined : colors.primary}
                                    onPress={() => setIsShow(!isShow)}
                                    forceTextInputFocus={false}
                                />
                            }
                        />

                        <TouchableRipple style={{ marginVertical: 10 }} onPress={() => (saved === null) ? check() : deleteCheck()} >
                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                <Switch
                                    value={(saved !== null) ? true : false}
                                    onChange={() => (saved === null) ? check() : deleteCheck()}
                                />
                                <Text>Recordar contraseña</Text>
                            </View>
                        </TouchableRipple>
                        {
                            (isCompatible && saved === 'saveBiometry' && getted && !isChanged)
                                ?
                                <View style={{ alignItems: 'center' }}>
                                    <Animated.View entering={BounceIn} >
                                        <IconButton icon='fingerprint' size={40} onPress={() => { }} />
                                    </Animated.View>
                                    <Text variant='labelSmall' style={{ marginTop: 10 }}>Iniciar sesión con biométricos</Text>
                                </View>
                                :
                                <Animated.View entering={BounceIn} >
                                    <Button
                                        mode='contained'
                                        onPress={handleSubmit(onSubmit)}
                                        loading={(isPending)}
                                        disabled={(isPending)}
                                        style={{ alignSelf: 'center' }}
                                        labelStyle={{ textTransform: 'uppercase' }}
                                    >Iniciar Sesión</Button>
                                </Animated.View>
                        }
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', marginVertical: 5 }}>
                            <TouchableOpacity onPress={() =>
                                Alert.alert('Reinicio de contraseña', 'Comunicate con tu titular para realizar el proceso de reinicio de contraseña.', [], { cancelable: true })
                            }
                                disabled={isPending} >
                                <Text variant='titleSmall' style={[{ textAlign: 'center', marginVertical: 10 }]} >Olvidé mi contraseña</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
                <SocialNetworks />
            </Animated.View>
        </>
    )
}

export default SingIn;