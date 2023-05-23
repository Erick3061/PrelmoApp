import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Keyboard, TextInput as NativeTextInput, View, SafeAreaView, StyleSheet, LayoutRectangle, Pressable } from 'react-native';
import Color from 'color';
import { ReciclerData } from '../ReciclerData';
import Animated, { ZoomInEasyDown, ZoomOutEasyDown } from 'react-native-reanimated';
import { useAppSelector } from '../../app/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Portal, TextInput } from 'react-native-paper';
import { style } from '../../../App';
import { Orientation } from '../../types/types';

interface Props<T> {
    valueField: keyof T;
    labelField: keyof T;
    itemsSelected: Array<T>;
    data: Array<T>;
    onChange: (item: Array<T>) => void;
    value: string;
    label?: string;
    maxHeight?: number;
}

export const Select = <T extends Object>(props: Props<T>) => {
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

    const {
        theme: { theme: { colors, roundness, dark }, },
        config: { orientation, screenHeight }
    } = useAppSelector(state => state);

    const heightOption: number = 40;
    const ref = useRef<View>(null);
    const search = useRef<NativeTextInput>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [layout, setLayout] = useState<LayoutRectangle>();
    const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
    const backgroundColor: string = dark ? Color(colors.background).darken(.4).toString() : colors.background;
    const insets = useSafeAreaInsets();


    useEffect(() => {
        const keyboardOpen = Keyboard.addListener('keyboardDidShow', (event) => {
            setKeyboardHeight(event.endCoordinates.height);
        })
        const keyboardClose = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
        })
        return () => {
            keyboardOpen.remove();
            keyboardClose.remove();
        }
    }, []);

    const _close = useCallback(() => {
        if (visible) setVisible(false);
        if (search.current) {
            if (search.current.isFocused()) {
                search.current.blur();
            }
        }

    }, [visible, search]);

    const onSelect = useCallback(
        (items: Array<T>) => {
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
    }, [value, visible, label, search]);

    const _renderModal = useCallback(() => {
        let top: number | undefined = (maxHeight ?? 0) + (layout?.y ?? 0) * 2 + 10;
        if (top === 0 || (screenHeight - (top + (maxHeight ?? 0)) < 100)) { top = undefined }
        return (
            <Portal>
                {
                    visible &&
                    <SafeAreaView style={[modal.Modal, { backgroundColor: colors.backdrop }]}>
                        <Pressable style={{ width: '100%', height: '100%' }} onPress={_close} />
                        <Animated.View entering={ZoomInEasyDown.duration(200)} exiting={ZoomOutEasyDown.duration(200)} style={[
                            modal.Container,
                            {
                                height: maxHeight ?? '100%',
                                width: layout?.width ?? '90%',
                                borderRadius: roundness * 2,
                                backgroundColor: backgroundColor,
                            },
                            style.shadow, { elevation: 5, shadowColor: colors.primary },
                            orientation === Orientation.landscape
                                ?
                                {
                                    position: 'absolute',
                                    bottom: insets ? insets.bottom + 15 : 0
                                }
                                : maxHeight ? {
                                    position: 'absolute',
                                    top,
                                    bottom: top === undefined ? insets?.bottom + 15 ?? 0 : undefined
                                } : {}
                        ]}>
                            <ReciclerData
                                data={data}
                                labelField={labelField}
                                valueField={valueField}
                                loading={false}
                                onChange={(item) => onSelect([item])}
                                selected={itemsSelected}
                            />
                        </Animated.View>
                    </SafeAreaView>
                }
            </Portal>
        )
    }, [visible, keyboardHeight, colors, dark, heightOption, maxHeight, insets, layout, orientation, backgroundColor, screenHeight]);

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
        alignItems: 'center',
    },
    Container: {
        backgroundColor: 'white',
        padding: 10
    }
});