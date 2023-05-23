import React, { useCallback, useEffect, useState } from 'react';
import { LayoutRectangle, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import { useAppSelector } from '../app/hooks';
import Color from 'color';
import Animated, { FadeInDown, SlideInLeft } from 'react-native-reanimated';
import { Orientation } from '../types/types';
import { Text } from 'react-native-paper';

interface Props<T> {
    data: Array<T>;
    selected: Array<T>;
    valueField: keyof T;
    labelField: keyof T;
    loading: boolean;
    height?: number;
    separator?: boolean;
    marginHorizontal?: number;
    onChange: (item: T) => void;
    onRefresh?: (() => void);
}

export const ReciclerData = <T extends Object>(props: Props<T>) => {
    const { data, labelField, valueField, height, separator,
        marginHorizontal, selected, onChange, loading = false, onRefresh } = props;

    const {
        theme: { theme: { colors, roundness } },
        config: { orientation, screenWidth }
    } = useAppSelector(state => state);

    const [layout, setLayout] = useState<LayoutRectangle>();
    const [dataProvider, setDataProvider] = useState<DataProvider>(new DataProvider((r1, r2) => r1 !== r2));

    const _onSelect = useCallback((item: T) => {
        onChange(item);
    }, [dataProvider, onChange]);

    const _layoutProvider = useCallback(() => {
        if (layout) {
            const { width } = layout;
            return new LayoutProvider(
                index => index,
                (_, dim) => {
                    dim.width = orientation === Orientation.landscape ? (width - (marginHorizontal ?? 0)) / 2 : width;
                    dim.height = height ?? 50;
                }
            );
        }
        return new LayoutProvider(
            index => index,
            (_, dim) => {
                dim.width = screenWidth;
                dim.height = height ?? 50;
            }
        );
    }, [dataProvider, screenWidth, orientation, layout, height, marginHorizontal]);

    const _renderRow = useCallback((type: string | number, data: any, index: number, extendedState?: object | undefined) => {
        const isSelected = selected.find(f => f[valueField] === data[valueField]);
        return (
            <Pressable
                onPress={() => _onSelect(data)}
                style={({ pressed }) => [
                    styles.item,
                    {
                        borderRadius: roundness * 2,
                        marginVertical: 2,
                        paddingHorizontal: 10,
                        borderBottomWidth: .3, borderColor: Color(colors.outline).fade(.5).toString()
                    },
                    isSelected && { backgroundColor: colors.primaryContainer },
                    pressed && { backgroundColor: Color(colors.primary).fade(.8).toString() }
                ]}
            >
                <Animated.View entering={FadeInDown}>
                    <Text variant='labelMedium'>{data[labelField]}</Text>
                </Animated.View>
            </Pressable>
        )
    }, [dataProvider, colors, selected, _onSelect, roundness, labelField]);

    useEffect(() => {
        setDataProvider(dataProvider.cloneWithRows(data));
    }, [data])


    return (
        <View style={{ flex: 1 }} onLayout={({ nativeEvent: { layout } }) => setLayout(layout)}>
            {
                data.length === 0
                    ? <Text>Sin coincidencias</Text>
                    : <RecyclerListView
                        rowRenderer={_renderRow}
                        dataProvider={dataProvider}
                        canChangeSize={true}
                        layoutProvider={_layoutProvider()}
                        scrollViewProps={{
                            refreshControl: (
                                <RefreshControl
                                    refreshing={loading}
                                    onRefresh={onRefresh}
                                />
                            )
                        }}
                    />
            }
        </View>
    )
};

const styles = StyleSheet.create({
    item: {
        flex: 1,
        justifyContent: 'center',
    },
});
