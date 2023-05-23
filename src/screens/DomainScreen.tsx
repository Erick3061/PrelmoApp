import React, { useEffect, useLayoutEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, View, Image } from 'react-native';

import { RootStackParamList, Service } from '../types/types'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Appbar, Button, IconButton, Text, TextInput } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { style } from '../../App';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '../components/Input';
import axios from 'axios';
import { updateDomain } from '../features/configSlice';
import { Loading } from '../components/Loading';
import EncryptedStorage from 'react-native-encrypted-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'DomainScreen'>;

export const DomainScreen = ({ navigation, route }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        theme: { theme: { colors, dark } },
        config: { domain }
    } = useAppSelector(state => state);

    const AppDispatch = useAppDispatch();

    const { control, handleSubmit, reset, setValue, setError } = useForm<{ domain: string }>({ defaultValues: { domain: '', } });

    const goTo = async (domain: string) => {
        reset();
        await EncryptedStorage.setItem(Service['Encrypted-Domain'], domain);
        AppDispatch(updateDomain(domain));
        navigation.replace('LogInScreen');
    }

    const onSubmit: SubmitHandler<{ domain: string }> = async ({ domain }) => {
        setIsLoading(true);
        await axios.get(`https://${domain}`)
            .then(async response => await goTo(response.request['responseURL']))
            .catch(async err => {
                try {
                    const response = await axios.get(`http://${domain}`);
                    await goTo(response.request['responseURL']);
                } catch (error) {
                    setError('domain', { message: `${error}`, type: "validate" });
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: '',
            header: ({ navigation, options: { }, back }) => {
                return (
                    <Appbar>
                        {back && <Appbar.BackAction iconColor={colors.primary} onPress={() => navigation.goBack()} />}
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
        setValue('domain', domain.replace('https://', '').replace('http://', '').replace('/', ''));
    }, []);


    return (
        <Animated.View entering={FadeInDown.delay(350).duration(400)} style={{ flex: 1 }}>
            <Loading refresh={isLoading} />
            <KeyboardAvoidingView style={{ flex: 1 }} enabled behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <View
                    style={[
                        style.container,
                        {
                            padding: 15,
                            justifyContent: 'center'
                        }
                    ]}
                >
                    <IconButton icon='code-json' size={40} style={{ alignSelf: 'center' }} />
                    <Text style={{ marginVertical: 5, textAlign: 'center', fontWeight: 'bold' }} variant='titleLarge'>¡Bienvenido!</Text>
                    <Text style={{ marginVertical: 5, textAlign: 'center', marginHorizontal: 10, color: colors.outline }}>Para empezar a utilizar esta aplicación, proporcione la dirección del servidor de su central de alarmas</Text>
                    <Input
                        formInputs={control._defaultValues}
                        control={control}
                        name={'domain'}
                        label="Dirección del Servidor"
                        placeholder="Type something"
                        style={{
                            backgroundColor: 'transparent'
                        }}
                        left={<TextInput.Icon icon="server" color={(focused) => focused ? undefined : colors.primary} />}
                    />
                    <Button
                        children='Ok'
                        style={{ alignSelf: 'center', marginVertical: 10 }}
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                    />
                </View>
            </KeyboardAvoidingView>
        </Animated.View>
    )
}
