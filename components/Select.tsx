import { ThemeMode } from '@/interface/theme.store.interface';
import useAppStore from '@/utils/app.store';
import useThemeStore from '@/utils/theme.store';
import React, { useCallback, useRef, useState } from 'react';
import { Keyboard, LayoutRectangle, TextInput as NativeTextInput, Pressable, StyleSheet, View } from 'react-native';
import { Portal, Surface, TextInput } from 'react-native-paper';
import { ReciclerData } from './ReciclerData';

interface Props<T> {
    valueField: keyof T;
    labelField: keyof T;
    itemsSelected: T[];
    data: T[];
    onChange: (item: T[]) => void;
    value: string;
    label?: string;
    maxHeight?: number;
}

export const Select = <T extends object>(props: Props<T>) => {
    const {
        valueField,
        labelField,
        data,
        onChange,
        value,
        label,
        itemsSelected,
        maxHeight,
    } = props;

    const ref = useRef<View>(null);
    const search = useRef<NativeTextInput>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [layout, setLayout] = useState<LayoutRectangle>();
    const mode = useThemeStore(store => store.mode);
    const screenHeight = useAppStore(store => store.screenHeight);

    const _close = useCallback(() => {
        if (visible) setVisible(false);
        if (search.current) {
            if (search.current.isFocused()) {
                search.current.blur();
            }
        }

    }, [visible, search]);

    const onSelect = useCallback(
        (items: T[]) => {
            onChange(items);
            Keyboard.dismiss();
            _close();
        },
        [onChange, _close]
    );

    const _renderDropDown = useCallback(() => {
        return (
            <TextInput
                style={{ marginVertical: 10 }}
                mode='outlined'
                ref={search}
                value={value}
                label={value !== '' ? label ?? 'Cuenta seleccionada' : label ?? ''}
                placeholder={visible ? 'Buscando ...' : label ?? 'Seleccione una cuenta'}
                showSoftInputOnFocus={false}
                right={
                    <TextInput.Icon
                        icon={value !== '' ? 'close' : visible ? 'menu-up' : 'menu-down'}
                        forceTextInputFocus={false}
                        onPress={() => {
                            if (value !== '') {
                                onSelect([]);
                            } else {
                                setVisible(true)
                            }
                        }}
                    />
                }
                onChange={() => {
                    setVisible(false);
                }}
                onPressIn={() => {
                    setVisible(true);
                }}
            />
        )
    }, [value, label, visible, onSelect]);

    const _renderModal = useCallback(() => {
        let top: number | undefined = (maxHeight ?? 0) + (layout?.y ?? 0) * 2 + 15;
        if (top === 0 || (screenHeight - (top + (maxHeight ?? 0)) < 100)) { top = undefined }

        return (
            <Portal>
                {
                    visible &&
                    <View style={[modal.Modal]}>
                        <Pressable style={{ width: '100%', height: '100%', backgroundColor: mode === ThemeMode.dark ? '#000000cd' : '#00000099' }} onPress={_close} />
                        <Surface style={{
                            borderRadius: 10,
                            height: maxHeight ?? '100%',
                            width: layout?.width ?? '90%',
                            position: 'absolute',
                            elevation: 4,
                            top
                        }}>
                            <ReciclerData
                                data={data}
                                labelField={labelField}
                                valueField={valueField}
                                loading={false}
                                onChange={(item) => onSelect([item])}
                                selected={itemsSelected}
                            />
                        </Surface>
                    </View>
                }
            </Portal >
        )
    }, [maxHeight, layout?.y, layout?.width, screenHeight, visible, mode, _close, data, labelField, valueField, itemsSelected, onSelect]);

    return (
        <View style={{ justifyContent: 'center', flex: 1 }} ref={ref} onLayout={({ nativeEvent: { layout } }) => setLayout(layout)}>
            {_renderDropDown()}
            {_renderModal()}
        </View>
    )
};

const modal = StyleSheet.create({
    Modal: {
        flex: 1,
        alignItems: 'center'
    }
});