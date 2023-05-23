import React from 'react';
import { Control, Controller, RegisterOptions } from 'react-hook-form';
import { Text, TextInput as NativeTextInput, } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';

import { useAppSelector } from '../app/hooks';

interface Props<T> extends TextInputProps {
    formInputs: T;
    name: keyof T;
    control: Control<any, any>;
    rules?: RegisterOptions;
    onR?: (ref: React.ForwardedRef<NativeTextInput>) => void;
}

export const Input = <T extends Object>(props: Props<T>) => {
    const { control, name, rules } = props;
    const { theme: { colors } } = useAppSelector(store => store.theme);

    return (
        <Controller
            control={control}
            rules={{ ...rules }}
            name={String(name)}
            render={({ field: { value, onBlur, onChange }, fieldState: { error } }) => {
                return (
                    <>
                        <TextInput
                            {...props}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                            error={error ? true : false}
                        />
                        {error && <Text style={{ color: colors.error }}>{error.message}</Text>}
                    </>
                )
            }
            }
        />
    )
}