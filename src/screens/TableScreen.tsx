import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useLayoutEffect } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import { useAppSelector } from '../app/hooks';
import { ListRenderItemInfo } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Orientation, RootStackParamList } from '../types/types';
import { Events, Key } from '../interface/interface';
import { DataTable, Text } from 'react-native-paper';

interface Props extends NativeStackScreenProps<RootStackParamList, 'TableScreen'> { };
export const TableScreen = ({ navigation, route: { params: { events, keys, name, address, report } } }: Props) => {
    const { config: { orientation, screenHeight, screenWidth }, theme: { theme: { colors, fonts } } } = useAppSelector(state => state);
    useLayoutEffect(() => {
        navigation.setOptions({
            title: report,
            headerTitleStyle: { ...fonts.titleLarge }
        });
    }, [navigation])

    const renderItem = useCallback(({ index, item, separators }: ListRenderItemInfo<Events>) => {
        const Keys = keys as Array<Key<Events>>;
        return (
            <DataTable.Row>
                {
                    Keys.map((key) =>
                        <DataTable.Cell
                            key={index + key.label}
                            style={{ width: key.size, justifyContent: 'center' }}
                            textStyle={[fonts.labelSmall]}
                        >
                            {`${Array.isArray(key.key) ? key.key.map((tc,) => item[tc]).join(' ') : item[key.key]}`}
                        </DataTable.Cell>)
                }
            </DataTable.Row>
        )
    }, [keys])

    return (
        <View style={[
            {
                flex: 1,
                backgroundColor: colors.background,
                alignSelf: 'center',
                margin: 10,
            },
            orientation === Orientation.landscape && { width: '95%', alignSelf: 'center' }
        ]}>
            <Text variant='titleMedium'>{name}</Text>
            <Text variant='titleSmall'>{address}</Text>
            <ScrollView horizontal={true}>
                <DataTable>
                    <DataTable.Header>
                        {
                            keys.map((key) => <DataTable.Title key={key.label} style={{ width: key.size, justifyContent: 'center' }} textStyle={[fonts.labelMedium]}>{key.label}</DataTable.Title>)
                        }
                    </DataTable.Header>
                    <FlatList
                        data={events}
                        renderItem={renderItem}
                        keyExtractor={(_, idx) => `${idx}`}
                        removeClippedSubviews={true}
                        getItemLayout={(data, index) => (
                            { length: orientation === Orientation.landscape ? screenWidth + 100 : ((screenWidth / 100) * 95), offset: 50 * index, index }
                        )}
                        ListEmptyComponent={<Text>Sin eventos</Text>}
                    />
                </DataTable>
            </ScrollView>
        </View>
    )
}
