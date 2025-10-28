import useThemeStore from '@/utils/theme.store';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import React, { useCallback } from 'react';
import { RefreshControl } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface Props<T> {
    data: T[];
    selected: T[];
    valueField: keyof T;
    labelField: keyof T;
    loading: boolean;
    height?: number;
    separator?: boolean;
    marginHorizontal?: number;
    onChange: (item: T) => void;
    onRefresh?: (() => void);
}

export const ReciclerData = <T extends object>(props: Props<T>) => {
    const theme = useThemeStore(store => store.theme);
    const { data, labelField, valueField, selected, onChange, loading = false, onRefresh } = props;

    const _onSelect = useCallback((item: T) => {
        onChange(item);
    }, [onChange]);

    const _renderRow = useCallback(({ index, item }: ListRenderItemInfo<T>) => {
        const isSelected = selected.find(f => f[valueField] === item[valueField]);
        return (
            <>
                <Animated.Text
                    entering={FadeInRight.delay(index)}
                    style={{
                        padding: 15,
                        backgroundColor: isSelected ? theme.colors.primaryContainer : theme.colors.surface,
                        color: isSelected ? theme.colors.onPrimaryContainer : theme.colors.onSurface,
                        borderRadius: 10,
                        height: props.height || 50,
                        marginVertical: 2,
                    }}
                    onPress={() => _onSelect(item)}
                >
                    {`${item[labelField]}`}
                </Animated.Text>
                {index < data.length - 1 && <Divider />}
            </>
        )
    }, [_onSelect, data.length, labelField, props.height, selected, theme.colors.onPrimaryContainer, theme.colors.onSurface, theme.colors.primaryContainer, theme.colors.surface, valueField]);

    return (
        data.length === 0
            ? <Text>Sin coincidencias</Text>
            :
            <FlashList
                data={data}
                renderItem={_renderRow}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={onRefresh}
                    />
                }
            />
    )
};