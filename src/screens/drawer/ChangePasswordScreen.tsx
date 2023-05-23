import React, { useContext, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, View, TextInput as NativeTextInput, Alert } from 'react-native';
import { NotificationContext } from '../../components/Notification/NotificationtContext';
import { RequestContext } from '../../context/RequestContext';
import { UpdateUserProps } from '../../interface/interface';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useMutation } from '@tanstack/react-query';
import { Orientation, Service } from '../../types/types';
import { Loading } from '../../components/Loading';
import { Input } from '../../components/Input';
import { Button, TextInput } from 'react-native-paper';
import { AxiosError, AxiosResponse } from 'axios';
import { logOut, updateSaved } from '../../features/configSlice';
import keychain from 'react-native-keychain';
import EncryptedStorage from 'react-native-encrypted-storage';


type ChagePassword = {
    password: string;
    newPassword: string;
    confirmPassword: string;
}

export const ChangePasswordScreen = () => {
    const { control, handleSubmit, reset, setValue, setError } = useForm<ChagePassword>({ defaultValues: { password: '', confirmPassword: '', newPassword: '' } });
    const newPass = useRef<NativeTextInput>(null);
    const confPass = useRef<NativeTextInput>(null);
    const [isShow, setIsShow] = useState<boolean>(false);
    const { handleError, notification } = useContext(NotificationContext);
    const { UpdateUser } = useContext(RequestContext);
    const AppDispatch = useAppDispatch();
    const {
        config: { orientation, User },
        theme: { theme: { colors } }
    } = useAppSelector(state => state);

    const deleteCheck = async () => {
        try {
            await keychain.resetGenericPassword({ service: Service['Keychain-Saved'] });
            await keychain.resetGenericPassword({ service: Service['Keychain-Saved-Biometry'] });
            await EncryptedStorage.removeItem(Service['Encrypted-Saved']);
            AppDispatch(updateSaved(null));
            reset();
        } catch (error) { handleError(`${error}`) }
    }

    const { isLoading, mutate } = useMutation(['updateUser'], (props: UpdateUserProps) => UpdateUser(props), {
        onError: error => {
            if (String(error).includes('no coincide')) {
                setError('password', { message: String(error) }, { shouldFocus: false });
            }
            const Error: AxiosError = error as AxiosError;
            handleError(String(Error.message))
        },
        onSuccess: (data) => {
            deleteCheck();
            Alert.alert("Contraseña actualizada", "Se cerrará la sesón por seguridad.", [
                {
                    text: 'Aceptar', onPress: () => {
                        AppDispatch(logOut());
                    }
                }
            ]);
        },
    })

    const onSubmit: SubmitHandler<ChagePassword> = async ({ confirmPassword, newPassword, password }) => {
        if (newPassword !== confirmPassword) {
            setValue('confirmPassword', '', { shouldValidate: false, shouldDirty: false, shouldTouch: false });
            setError('confirmPassword', { message: 'Contraseña no coincide' });
        } else {
            if (User) {
                const { id, fullName } = User;
                mutate({ id, fullName, lastPassword: password, password: confirmPassword });
            }
        }
    };

    return (
        <View style={[
            {
                flex: 1,
                justifyContent: 'center',
                padding: 10
            },
            orientation === Orientation.landscape && {
                width: '80%',
                alignSelf: 'center'
            }
        ]}>
            <Loading refresh={isLoading} />
            <KeyboardAvoidingView>
                <Input
                    style={{ backgroundColor: 'transparent' }}
                    formInputs={control._defaultValues}
                    control={control}
                    left={<TextInput.Icon icon={'lock'} color={(focused) => focused ? undefined : colors.primary} />}
                    name={'password'}
                    keyboardType='default'
                    placeholder='**********'
                    rules={{ required: { value: true, message: 'Campo requerido' } }}
                    right={
                        <TextInput.Icon
                            icon={isShow ? 'eye-off' : 'eye'}
                            color={(focused) => focused ? undefined : colors.primary}
                            onPress={() => setIsShow(!isShow)}
                            forceTextInputFocus={false}
                        />
                    }
                    secureTextEntry={isShow ? false : true}
                    label='Contraseña'
                    onSubmitEditing={() => newPass.current?.focus()}
                    returnKeyType='next'
                />

                <Input
                    style={{ backgroundColor: 'transparent' }}
                    formInputs={control._defaultValues}
                    control={control}
                    name={'newPassword'}
                    left={<TextInput.Icon icon={'lock'} color={(focused) => focused ? undefined : colors.primary} />}
                    keyboardType='default'
                    placeholder='**********'
                    rules={{
                        required: { value: true, message: 'Campo requerido' },
                        minLength: { value: 6, message: 'Minimo 6 caracteres' },

                    }}
                    label='Contraseña nueva'
                    onSubmitEditing={() => confPass.current?.focus()}
                    returnKeyType='next'
                />

                <Input
                    style={{ backgroundColor: 'transparent' }}
                    formInputs={control._defaultValues}
                    control={control}
                    name={'confirmPassword'}
                    left={<TextInput.Icon icon={'lock'} color={(focused) => focused ? undefined : colors.primary} />}
                    keyboardType='default'
                    placeholder='**********'
                    rules={{
                        required: { value: true, message: 'Campo requerido' },
                        minLength: { value: 6, message: 'Minimo 6 caracteres' },

                    }}
                    label='Confirma tu contraseña'
                    onSubmitEditing={handleSubmit(onSubmit)}
                    returnKeyType='done'
                />

                <View style={{ alignItems: 'flex-end', paddingVertical: 15 }}>
                    <Button
                        children='Cambiar contraseña'
                        icon={'swap-horizontal'}
                        mode='contained'
                        loading={false}
                        onPress={handleSubmit(onSubmit)}
                        disabled={false}
                        labelStyle={{ textTransform: 'uppercase' }}
                        contentStyle={{ paddingVertical: 5 }}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}
