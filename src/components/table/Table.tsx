import React, { useCallback } from 'react';
import { ListRenderItemInfo, ScrollView, StyleSheet, View } from 'react-native';
import { Row, TableRow } from './Row';
import { Key } from '../../interface/interface';
import { useAppSelector } from '../../app/hooks';
import Color from 'color';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Orientation } from '../../types/types';
import { Text } from 'react-native-paper';
import { style } from '../../../App';


type Props<T> = {
    Header?: {
        title?: string;
        subtitle?: string;
    }
    isShowHeader?: boolean;
    Data: Array<T>;
    titles: Array<Key<T>>;
    showIndices?: boolean;
}

const Table = <T extends Object>({ Header, Data, titles, isShowHeader = true, showIndices = true }: Props<T>) => {
    const { theme: { theme: { colors, roundness, dark } }, config: { orientation } } = useAppSelector(state => state);
    const backgroundColor: string = dark ? Color(colors.background).darken(.4).toString() : colors.background;
    const _renderHeader = React.useCallback(() => {
        if (Header)
            return (
                <View style={[{ paddingVertical: 5 }, orientation === Orientation.landscape && { flexDirection: 'row', justifyContent: 'space-between' }]}>
                    {Header.title && <Text style={{ marginRight: 10 }} variant='labelLarge'>{Header.title}</Text>}
                    {Header.subtitle && <Text style={{ marginRight: 10 }} variant='labelLarge'>{Header.subtitle}</Text>}
                </View>
            )
        return null;
    }, [Header, colors, orientation])

    const _renderTH = React.useCallback(() => {
        if (titles && isShowHeader) {
            const tamCol = titles.map(s => { return { size: s.size ?? 10, center: s.center } });
            const data = titles.map(r => r.label);
            return (
                <Row tamCol={showIndices ? [{ size: 30, center: true }, ...tamCol] : [...tamCol]} styleLabel={{ fontWeight: 'bold', textTransform: 'uppercase', color: colors.text }} data={showIndices ? ["#", ...data] : [...data]} />
            )
        }
        return null;
    }, [titles, isShowHeader, colors, showIndices]);

    const _renderBody = React.useCallback(() => {
        if (Data)
            if (Data.length === 0) return <Text style={{ textAlign: 'center', width: 100 }}>Sin Eventos</Text>;
            else
                return (
                    Data.map((ev, idx) =>
                        <TableRow
                            key={idx + 1}
                            data={ev}
                            titles={titles}
                            style={{ borderBottomColor: colors.backdrop, borderBottomWidth: 1 }}
                            indice={showIndices ? idx + 1 : undefined}
                        />
                    )
                )
        return <Text style={{ textAlign: 'center', width: 100, color: colors.text }}>Sin Eventos</Text>;
    }, [Data, colors, showIndices])

    const renderItem = useCallback(({ index, item, separators }: ListRenderItemInfo<any>) => {
        return (
            <Animated.View entering={FadeInDown}>
                <TableRow
                    data={item}
                    titles={titles}
                    style={{ borderBottomColor: colors.backdrop, borderBottomWidth: 1 }}
                    indice={showIndices ? index + 1 : undefined}
                />
            </Animated.View>
        )
    }, [Data, titles, showIndices])


    return (
        <View style={[styles.container, {
            backgroundColor,
            borderRadius: roundness * 2,
            padding: 5,
            alignSelf: 'center'
        }]}>
            {_renderHeader()}
            <ScrollView horizontal={true}>
                <View>
                    {_renderTH()}
                    <ScrollView >
                        {_renderBody()}
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    )
}

export default Table;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 5,
        ...style.shadow
    },
    textTitlesHeader: {
        paddingHorizontal: 5,
        fontWeight: 'bold'
    },
    containerPagination: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexWrap: 'wrap'
    }
});