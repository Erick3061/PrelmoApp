import React from 'react';
import { Control, Controller, RegisterOptions } from 'react-hook-form';
import { TextInput as NativeTextInput, } from 'react-native';
import { HelperText, TextInput, TextInputProps } from 'react-native-paper';

interface Props<T> extends TextInputProps {
    formInputs: T;
    name: keyof T;
    control: Control<any, any>;
    errorColor?: string;
    rules?: RegisterOptions;
    onR?: (ref: React.ForwardedRef<NativeTextInput>) => void;
}

export const Input = <T extends object>(props: Props<T>) => {
    const { control, name, rules, errorColor } = props;
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
                        {error && (
                            <HelperText
                                type='error'
                                visible={true}
                                style={{ color: errorColor || 'red' }}
                            >
                                {error.message}
                            </HelperText>
                        )}
                    </>
                )
            }
            }
        />
    )
}