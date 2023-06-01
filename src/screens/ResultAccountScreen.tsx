import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FlatList, ListRenderItemInfo, Modal, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Loading } from '../components/Loading';
import { useAppSelector, useReport } from '../app/hooks';
import Color from 'color';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alarm, AP, APCI, Bat, CI, filterEvents, MIMETypes, Orientation, otros, Prue, RootStackParamList } from '../types/types';
import { RefreshControl } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NotificationContext } from '../components/Notification/NotificationtContext';
import { RequestContext } from '../context/RequestContext';
import { DataTable, IconButton, Text } from 'react-native-paper';
import { IconMenu } from '../components/IconMenu';
import { Account, Events, Percentajes, percentaje } from '../interface/interface';
import { TargetPercentaje } from '../components/TargetPercentaje';
import { style } from '../../App';


interface Props extends NativeStackScreenProps<RootStackParamList, 'ResultAccountScreen'> { };

const Tab = createBottomTabNavigator();

export const ResultAccountScreen = ({ navigation, route: { params: { account, end, report, start, keys, typeAccount, filter } } }: Props) => {

    const {
        theme: { theme: { colors, fonts, roundness, dark } },
        config: { orientation, screenWidth, screenHeight }
    } = useAppSelector(state => state);

    const { data, isLoading, isFetching, refetch, error } = useReport({ accounts: [parseInt(account.CodigoCte)], dateStart: start, dateEnd: end, type: report, typeAccount, key: String(account.CodigoCte) });
    const { handleError, notification } = useContext(NotificationContext);
    const { isDownloadDoc, downloadReport } = useContext(RequestContext);
    const [view, setView] = useState<'table' | 'default'>('default');

    const refModal = useRef<Modal>(null);


    const pages: Array<{ title: string, key: filterEvents, nameIcon: string, color: string }> = report === 'ap-ci'
        ?
        [
            { title: 'Aperturas', key: 'AP', nameIcon: 'lock-open', color: colors.success },
            {
                title: 'Cierres', key: 'CI', nameIcon: 'lock', color: colors.danger
            }
        ]
        :
        [
            { title: 'Ap/Ci', key: 'APCI', nameIcon: 'shield', color: colors.success },
            { title: 'Alarmas', key: 'Alarm', nameIcon: 'bell', color: colors.danger },
            { title: 'Pruebas', key: 'Prue', nameIcon: 'cog', color: colors.test },
            { title: 'Baterias', key: 'Bat', nameIcon: 'battery', color: colors.warning },
            { title: 'Otros', key: 'otros', nameIcon: 'help-circle', color: colors.other },
        ];

    useLayoutEffect(() => {
        navigation.setOptions({
            title: isDownloadDoc ? 'Descargando documento...' : `${orientation === Orientation.landscape ? `${account.Nombre}  ` : ''} ${(report === 'ap-ci') ? 'Apertura y cierre' : 'Evento de alrma'}`,
            headerLeft: (() =>
                isDownloadDoc
                    ?
                    <ActivityIndicator
                        style={{ paddingRight: 10 }}
                        color={colors.primary}
                    />
                    :
                    <IconButton
                        style={{ paddingRight: 10 }}
                        icon={Platform.OS === 'ios' ? 'chevron-left' : 'arrow-left'}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    />
            ),
            headerRight: (() =>
                <IconMenu
                    ref={refModal}
                    disabled={isLoading || isFetching || isDownloadDoc}
                    menu={[
                        {
                            children: 'Descargar pdf con gráfica',
                            icon: 'download',
                            onPress: () => {
                                Download({ mime: MIMETypes.pdf, withGrap: true });
                            },
                            contentStyle: { ...styles.btnMenu }
                        },
                        {
                            children: 'Descargar pdf',
                            icon: 'download',
                            onPress: () => {
                                Download({ mime: MIMETypes.pdf });
                            },
                            contentStyle: { ...styles.btnMenu }
                        },
                        {
                            children: 'Descargar excel',
                            icon: 'download',
                            onPress: () => {
                                Download({ mime: MIMETypes.xlsx });
                            },
                            contentStyle: { ...styles.btnMenu }
                        },
                        view === 'default' ? {
                            children: 'ver como tabla',
                            icon: 'table',
                            onPress: () => setView('table'),
                            contentStyle: { ...styles.btnMenu }
                        } : {
                            children: 'ver como lista',
                            icon: 'view-list',
                            onPress: () => setView('default'),
                            contentStyle: { ...styles.btnMenu }
                        },
                        {
                            children: 'Descargas',
                            icon: 'file-download',
                            onPress: () => { navigation.navigate('DownloadScreen') },
                            contentStyle: { ...styles.btnMenu }
                        },
                        {
                            children: 'Recargar',
                            icon: 'reload',
                            onPress: () => refetch(),
                            contentStyle: { ...styles.btnMenu }
                        },
                    ]}
                />
            )
        });
    }, [navigation, isLoading, isFetching, setView, view, isDownloadDoc, orientation]);

    const renderItem = useCallback(({ index, item, separators }: ListRenderItemInfo<Events>) => (
        view === 'default'
            ?
            <Animated.View entering={FadeIn} style={[styles.item, { borderRadius: roundness, backgroundColor: colors.background, shadowColor: colors.primary, alignSelf: 'center', width: orientation === Orientation.landscape ? screenWidth + 100 : ((screenWidth / 100) * 95), height: 90, }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text variant='titleMedium'>{item.DescripcionEvent}</Text>
                        <Text>Particón: {item.Particion}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View >
                            <Text variant='labelMedium'>{item.FechaOriginal} {item.Hora}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={{ flex: 1 }} variant='labelMedium'>{`${item.DescripcionZona} ${item.NombreUsuario}`.split('').length <= 1 ? 'Sistema / Llavero' : `${item.DescripcionZona} ${item.NombreUsuario}`}</Text>
                    <Text variant='labelMedium'># {item.CodigoUsuario} {item.CodigoZona}</Text>
                </View>
            </Animated.View>
            :
            <DataTable.Row style={[
                (index % 2 === 0) && { backgroundColor: Color(dark ? colors.onSurface : colors.primary).fade(.98).toString() }
            ]}>
                {
                    keys.map((key) =>
                        <DataTable.Cell
                            key={index + key.label}
                            style={{ width: key.size, justifyContent: 'center' }}
                            textStyle={[fonts.labelSmall]}
                        >
                            {`${Array.isArray(key.key) ? key.key.map((tc,) => item[tc]).join(' ') : item[key.key]}`}
                        </DataTable.Cell>)
                }
            </DataTable.Row>
    ), [colors, roundness, orientation, view]);

    const _renderPercentajes = useCallback(() => {
        const Percentajes = (percentajes: Percentajes) => {
            {
                return (
                    Object.entries(percentajes).map((el, idx) => {
                        const { label, total, percentaje, text, events }: percentaje = el[1];
                        const title: string = label ?? el[0];
                        return (
                            <TargetPercentaje
                                key={JSON.stringify(el)}
                                max={100}
                                text={title}
                                amount={`${events}/${total}`}
                                percentage={percentaje}
                                textLarge={text}
                                icon={
                                    (el[0] === 'Aperturas')
                                        ? { name: 'lock-open', backgroundColor: colors.success }
                                        : (el[0] === 'Cierres')
                                            ? { name: 'lock', backgroundColor: colors.danger }
                                            : (el[0] === 'APCI')
                                                ? { name: 'shield', backgroundColor: colors.success }
                                                : (el[0] === 'Alarma')
                                                    ? { name: 'bell', backgroundColor: colors.danger }
                                                    : (el[0] === 'Pruebas')
                                                        ? { name: 'cog', backgroundColor: colors.test }
                                                        : (el[0] === 'Battery')
                                                            ? { name: 'battery', backgroundColor: colors.warning }
                                                            : { name: 'help-circle', backgroundColor: colors.other }
                                } />
                        )
                    })
                )
            }
        }

        if (data && data.cuentas) {
            if (data.cuentas.length === 1) {
                const { percentajes } = data;
                if (percentajes)
                    return (
                        <View style={{ paddingVertical: 5 }}>
                            {
                                (report === 'ap-ci')
                                    ?
                                    <View style={{ flexDirection: orientation === Orientation.portrait ? 'row' : 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        {Percentajes(percentajes)}
                                    </View>
                                    :
                                    <ScrollView horizontal={orientation === Orientation.portrait} alwaysBounceHorizontal={orientation === Orientation.portrait} showsHorizontalScrollIndicator={false} >
                                        {Percentajes(percentajes)}
                                    </ScrollView>
                            }
                        </View>
                    )
                else return undefined;
            } else { return undefined }
        } else { return undefined }
    }, [data, colors, orientation, report]);

    const _renderData = useCallback((filter?: filterEvents) => {
        if (data && data.cuentas) {
            if (data.cuentas.length === 1) {
                const { eventos }: Account = data.cuentas[0];
                let Events = eventos ?? [];

                if (filter) {
                    switch (filter) {
                        case 'AP': Events = Events.filter(f => AP.find(ff => ff === f.CodigoAlarma)); break;
                        case 'CI': Events = Events.filter(f => CI.find(ff => ff === f.CodigoAlarma)); break;
                        case 'APCI': Events = Events.filter(f => APCI.find(ff => ff === f.CodigoAlarma)); break;
                        case 'Alarm': Events = Events.filter(f => Alarm.find(ff => ff === f.CodigoAlarma)); break;
                        case 'Prue': Events = Events.filter(f => Prue.find(ff => ff === f.CodigoAlarma)); break;
                        case 'Bat': Events = Events.filter(f => Bat.find(ff => ff === f.CodigoAlarma)); break;
                        case 'otros': Events = Events.filter(f => otros.find(ff => ff === f.CodigoAlarma)); break;
                    }
                }

                return (
                    <>
                        {
                            (view === 'default')
                                ?
                                <FlatList
                                    data={Events}
                                    renderItem={renderItem}
                                    keyExtractor={(_, idx) => `${idx}`}
                                    removeClippedSubviews={true}
                                    getItemLayout={(data, index) => (
                                        { length: orientation === Orientation.landscape ? screenWidth + 100 : ((screenWidth / 100) * 95), offset: 90 * index, index }
                                    )}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={false}
                                            onRefresh={() => refetch()}
                                        />
                                    }
                                />
                                :
                                <View style={[
                                    { flex: 1 },
                                    orientation === Orientation.landscape && { width: '95%', alignSelf: 'center' }
                                ]}>
                                    <ScrollView horizontal={true}>
                                        <DataTable>
                                            <DataTable.Header style={{ backgroundColor: Color(colors.primary).fade(.9).toString() }}>
                                                {
                                                    keys.map((key) => <DataTable.Title key={key.label} style={{ width: key.size, justifyContent: 'center' }}
                                                        textStyle={[fonts.labelMedium, { fontWeight: 'bold' }]}>{key.label}</DataTable.Title>)
                                                }
                                            </DataTable.Header>
                                            <FlatList
                                                data={Events}
                                                renderItem={renderItem}
                                                keyExtractor={(_, idx) => `${idx}`}
                                                removeClippedSubviews={true}
                                                getItemLayout={(data, index) => (
                                                    { length: orientation === Orientation.landscape ? screenWidth + 100 : ((screenWidth / 100) * 95), offset: 50 * index, index }
                                                )}
                                                refreshControl={
                                                    <RefreshControl
                                                        refreshing={false}
                                                        onRefresh={() => refetch()}
                                                    />
                                                }
                                            />
                                        </DataTable>
                                    </ScrollView>
                                </View>
                        }

                    </>
                )
            } else {
                return (<Text>more accounts</Text>)
            }

        }
        return undefined;
    }, [data, view, dark, Color, colors, screenWidth, screenHeight, orientation, fonts]);

    useEffect(() => {
        if (error) handleError(String(error));
    }, [error])

    const Download = async ({ mime, withGrap }: { withGrap?: boolean, mime: MIMETypes }) => {

        const Response = await downloadReport({
            data: {
                accounts: [parseInt(account.CodigoCte)],
                showGraphs: withGrap ? true : false,
                typeAccount,
                dateStart: start,
                dateEnd: end
            },
            mime,
            report: (report === 'ap-ci') ? report : 'alarm',
            fileName: `${(report === 'ap-ci') ? 'APCI' : 'EA'} ${start} ${end} ${account.Nombre}${new Date().getTime()}`
        });

        if (Response.status && Response.data) {
            notification({ type: 'success', title: Response.data.title, text: Response.data.text });
        } else {
            handleError(Response.msg ?? "Error al descargar");
        }
    }


    return (
        <>
            <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
                <Text variant='titleMedium' style={[
                    { marginBottom: 5 },
                    orientation === Orientation.landscape && { display: 'none' }
                ]}>{account.Nombre}</Text>
                <Text variant='titleSmall' style={[{ borderLeftWidth: 3, borderColor: colors.primary }]}>  Entre las fechas {start} a {end}</Text>
            </View>
            {
                (!filter)
                    ?
                    <View style={{ flex: 1, margin: 5 }}>
                        {(!isLoading || !isFetching) && orientation === Orientation.portrait && _renderPercentajes()}
                        {_renderData()}
                    </View>
                    :
                    <View style={[
                        { flex: 1 },
                        orientation === Orientation.landscape && { flexDirection: 'row' }
                    ]}
                    >
                        {(!isLoading || !isFetching) && _renderPercentajes()}
                        <Tab.Navigator screenOptions={{ headerShown: false }}>
                            <Tab.Screen name="Todos" options={{ tabBarIcon: (() => <IconButton icon='check-all' iconColor={colors.primary} />) }}>
                                {(props) =>
                                    <FilterScreen>
                                        {_renderData()}
                                    </FilterScreen>
                                }
                            </Tab.Screen>
                            {
                                <>
                                    {
                                        pages.map((p, idx) => (
                                            <Tab.Screen key={idx + p.key} name={p.title} options={{ tabBarIcon: (() => <IconButton icon={p.nameIcon} iconColor={p.color} />) }}>
                                                {() =>
                                                    <FilterScreen>
                                                        {_renderData(p.key)}
                                                    </FilterScreen>
                                                }
                                            </Tab.Screen>

                                        ))
                                    }
                                </>
                            }
                        </Tab.Navigator>
                    </View>
            }
            <Loading loading={isLoading} refresh={isFetching} />
        </>
    )
}

interface PropsFilter {
    children: React.ReactNode;
}
const FilterScreen = ({ children }: PropsFilter) => {

    return (
        <View style={{ flex: 1 }}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        padding: 10,
        margin: 4,
        ...style.shadow,
    },
    btnMenu: {
        justifyContent: 'flex-start'
    }
});