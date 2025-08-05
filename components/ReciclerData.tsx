import React, { useCallback } from 'react';
import { Pressable, RefreshControl, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInRight } from 'react-native-reanimated';
// import { DataProvider, LayoutProvider } from 'recyclerlistview';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';


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
    const { data, labelField, valueField, selected, onChange, loading = false, onRefresh } = props;

    const _onSelect = useCallback((item: T) => {
        onChange(item);
    }, [onChange]);

    const _renderRow = useCallback(({ index, item }: ListRenderItemInfo<T>) => {
        const isSelected = selected.find(f => f[valueField] === item[valueField]);
        return (
            <Pressable
                onPress={() => _onSelect(item)}
                style={({ pressed }) => [
                    styles.item,
                    {
                        marginVertical: 2,
                        marginHorizontal: 10,
                        borderBottomWidth: .3,
                    },
                    // isSelected && { backgroundColor: colors.primaryContainer },
                    // pressed && { backgroundColor: Color(colors.primary).fade(.8).toString() }
                ]}
            >
                <Animated.View entering={FadeInRight.delay(index * 20)}>
                    <Text variant='labelMedium' style={{ padding: 15 }}>{`${item[labelField]}`}</Text>
                </Animated.View>
            </Pressable>
        )
    }, [_onSelect, labelField, selected, valueField]);

    return (
        data.length === 0
            ? <Text>Sin coincidencias</Text>
            :
            <FlashList
                data={data}
                renderItem={_renderRow}
                estimatedItemSize={data.length}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={onRefresh}
                    />
                }
            />
    )
};

const styles = StyleSheet.create({
    item: {
        flex: 1,
        justifyContent: 'center',
    },
});