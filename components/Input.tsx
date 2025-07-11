import React from 'react';
import { Control, Controller, RegisterOptions } from 'react-hook-form';
import { TextInput as NativeTextInput, Text, } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';

interface Props<T> extends TextInputProps {
    formInputs: T;
    name: keyof T;
    control: Control<any, any>;
    rules?: RegisterOptions;
    onR?: (ref: React.ForwardedRef<NativeTextInput>) => void;
}

export const Input = <T extends object>(props: Props<T>) => {
    const { control, name, rules } = props;
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
                        {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
                    </>
                )
            }
            }
        />
    )
}