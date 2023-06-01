import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, ScrollView, ListRenderItemInfo, StyleSheet, Modal, Platform, Keyboard, ActivityIndicator, RefreshControl } from 'react-native';
import { useAppSelector, useDebouncedValue, useReport } from '../app/hooks';
import { Loading } from '../components/Loading';
import { AP, CI, MIMETypes, RootStackParamList, TypeReport, TypeReportDownload } from '../types/types';
import { TargetPercentaje } from '../components/TargetPercentaje';
import Color from 'color';
import { Account, percentaje, formatDate } from '../interface/interface';
import { style } from '../../App';
import { getDay, modDate } from '../functions/functions';
import { useQueryClient } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Row } from '../components/table/Row';
import { ReciclerData } from '../components/ReciclerData';
import { RequestContext } from '../context/RequestContext';
import { Appbar, IconButton, Searchbar, Text } from 'react-native-paper';
import { IconMenu } from '../components/IconMenu';
import { Orientation } from '../types/types';
import { BatteryStatus } from '../types/types';
import Animated, { LightSpeedInLeft, LightSpeedInRight, LightSpeedOutRight, SlideInRight, SlideOutRight } from 'react-native-reanimated';
import { NotificationContext } from '../components/Notification/NotificationtContext';

interface Props extends NativeStackScreenProps<RootStackParamList, 'ResultAccountsScreen'> { };

const Tab = createBottomTabNavigator();

export const ResultAccountsScreen = ({ navigation, route: { params: { accounts, end, report, start, keys, typeAccount, nameGroup } } }: Props) => {
    const { theme: { theme: { colors, fonts, roundness, dark } }, config: { orientation } } = useAppSelector(state => state);

    const { data, isLoading, isFetching, refetch } =
        useReport({ accounts: [...accounts.map(a => a.code)], dateStart: start, dateEnd: end, type: report, typeAccount, key: JSON.stringify(accounts.map(a => a.code).sort()) });

    const [filterData, setFilterData] = useState<typeof data>();

    const queryClient = useQueryClient();
    const keyQuery = ["Events", "[" + accounts.map(a => a.code).sort() + "]", report, start, end];
    const refModal = useRef<Modal>(null);
    const [isSearch, setIsSearch] = useState<boolean>(false);

    const dates: { start: formatDate, end: formatDate } = { start: modDate({ days: -30 }), end: modDate({}) }

    const { downloadReport, isDownloadDoc } = useContext(RequestContext);
    const { handleError, notification } = useContext(NotificationContext);

    const backgroundColor: string = dark ? Color(colors.background).darken(.4).toString() : colors.background;

    const [textQueryValue, setTextQueryValue] = useState<string>('');
    const debaucedValue = useDebouncedValue(textQueryValue, 300);

    const Download = async ({ mime, withGrap, name }: { withGrap?: boolean, mime: MIMETypes, name?: string }) => {
        let reportDownload: TypeReportDownload, fileName: string = '';

        switch (report) {
            case 'ap-ci':
                reportDownload = 'ap-ci'
                fileName = `APCI ${start} ${end} ${name} ${new Date().getTime()}`;
                break;
            case 'event-alarm':
                reportDownload = 'alarm'
                fileName = `EA ${start} ${end} ${name} ${new Date().getTime()}`;
                break;
            case 'batery':
                reportDownload = 'batery'
                fileName = `EB ${name} ${new Date().getTime()}`;
                break;
            case 'state':
                reportDownload = 'state'
                fileName = `ES ${name} ${new Date().getTime()}`;
                break;
            case 'apci-week':
                reportDownload = 'ap-ci-week'
                fileName = `HAPCI ${name} ${new Date().getTime()}`;
                break;
        }

        const Response = await downloadReport({
            data: {
                accounts: accounts.map(acc => acc.code),
                showGraphs: withGrap ? true : false,
                typeAccount,
                dateStart: start,
                dateEnd: end
            },
            mime,
            fileName,
            report: reportDownload
        });

        if (Response.status && Response.data) {
            notification({ type: 'success', title: Response.data.title, text: Response.data.text });
        } else {
            handleError(Response.msg ?? "Error al descargar");
        }
    }


    useLayoutEffect(() => {
        navigation.setOptions({
            title:
                (report === 'ap-ci')
                    ? 'Apertura y cierre'
                    : (report === 'event-alarm')
                        ? 'Evento de alarma'
                        : (report === 'batery')
                            ? `${orientation === Orientation.landscape ? `${(data?.nombre) ? data.nombre : 'Grupo personalizado, cuentas individuales'}  ` : ''} Problemas de batería`
                            : (report === 'state')
                                ? `${orientation === Orientation.landscape ? `${(data?.nombre) ? data.nombre : 'Grupo personalizado, cuentas individuales'}  ` : ''} Estado de sucursales`
                                : `${orientation === Orientation.landscape ? `${(data?.nombre) ? data.nombre : 'Grupo personalizado, cuentas individuales'}  ` : ''} Horario de aperturas y cierres`
            ,
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
                            queryClient.removeQueries({ queryKey: keyQuery })
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
                                Download({ mime: MIMETypes.pdf, withGrap: true, name: (data?.nombre) ? data.nombre : 'Grupo personalizado, cuentas individuales' })
                            },
                            contentStyle: { ...styles.btnMenu }
                        },
                        {
                            children: 'Descargar pdf',
                            icon: 'download',
                            onPress: () => {
                                Download({ mime: MIMETypes.pdf, name: (data?.nombre) ? data.nombre : 'Grupo personalizado, cuentas individuales' })
                            },
                            contentStyle: { ...styles.btnMenu }
                        },
                        {
                            children: 'Descargar excel',
                            icon: 'download',
                            onPress: () => {
                                Download({ mime: MIMETypes.xlsx, name: (data?.nombre) ? data.nombre : 'Grupo personalizado, cuentas individuales' })
                            },
                            contentStyle: { ...styles.btnMenu }
                        },
                        {
                            children: 'Descargas',
                            icon: 'cloud-download',
                            onPress: () => { navigation.navigate('DownloadScreen') },
                            contentStyle: { ...styles.btnMenu }
                        },
                        {
                            children: 'Recargar',
                            icon: 'refresh',
                            onPress: () => refetch(),
                            contentStyle: { ...styles.btnMenu }
                        },
                    ]}
                />
            ),
            headerLargeTitle: true,
        });
    }, [navigation, isLoading, isFetching, data, isDownloadDoc, orientation]);

    useEffect(() => {
        setFilterData(data);
    }, [data]);

    const _renderPercentajes = useCallback(() => {
        if (data && data.percentajes && orientation === Orientation.portrait && !Keyboard.isVisible()) {
            const { percentajes } = data;
            return (
                <View style={{ paddingVertical: 5 }}>
                    <ScrollView horizontal alwaysBounceHorizontal contentContainerStyle={[{ marginLeft: 5 }]} showsHorizontalScrollIndicator={false}>
                        {Object.entries(percentajes).map((el, idx) => {
                            const { label, total, percentaje, text, events }: percentaje = el[1];
                            const title: string = label ?? el[0];
                            return (
                                <TargetPercentaje
                                    key={JSON.stringify(el)}
                                    max={100}
                                    text={title}
                                    percentage={percentaje}
                                    amount={`${events}/${total}`}
                                    textLarge={text}
                                    icon={
                                        (el[0] === 'sinRestaure') ? { name: 'alert', backgroundColor: colors.danger }
                                            : (el[0] === 'conRestaure') ? { name: 'bell', backgroundColor: colors.warning }
                                                : (el[0] === 'abiertas') ? { name: 'lock-open', backgroundColor: colors.success }
                                                    : (el[0] === 'cerradas') ? { name: 'lock', backgroundColor: colors.danger }
                                                        : (el[0] === 'sinEstado') ? { name: 'alert', backgroundColor: colors.warning }
                                                            : (el[0] === 'Aperturas') ? { name: 'lock-open', backgroundColor: colors.success }
                                                                : (el[0] === 'Cierres') ? { name: 'lock', backgroundColor: colors.danger }
                                                                    : { name: 'check-circle', backgroundColor: colors.success }
                                    } />
                            )
                        })}
                    </ScrollView>
                </View>
            )
        } else { return undefined }
    }, [filterData, orientation]);

    const _renderHead = useCallback(() => {
        const sizeName: number = 200;
        if (filterData && filterData.fechas) {
            const tam = new Array(filterData.fechas.length).fill({ size: 100, center: true });
            const days = filterData.fechas.map(a => getDay(modDate({ dateI: new Date(a) }).weekday));
            const ApCi = new Array(tam.length).fill(['AP', 'CI']);

            return (
                <>
                    <Row key={'days'} tamCol={[{ size: 30 }, { size: sizeName }, ...tam]} styleLabel={{ fontWeight: 'bold', textTransform: 'uppercase', color: colors.text }} data={['', '', ...filterData.fechas]} />
                    <Row key={'nameDays'} tamCol={[{ size: 30 }, { size: sizeName }, ...tam]} styleLabel={{ fontWeight: 'bold', textTransform: 'uppercase', color: colors.text }} data={['', '', ...days]} />
                    <Row key={'header'} style={{ borderBottomWidth: 1, borderColor: Color(colors.text).fade(.9).toString() }} tamCol={[{ size: 30, center: true }, { size: sizeName }, ...tam]} styleLabel={{ fontWeight: 'bold', textTransform: 'uppercase', color: colors.text }} data={['#', 'Nombre', ...ApCi]} />
                </>
            )
        }
        return undefined;
    }, [filterData, colors]);

    const _renderDataDays = useCallback(() => {
        const sizeName: number = 200;
        if (filterData && filterData.fechas) {
            const tam = new Array(filterData.fechas.length).fill({ size: 100, center: true });
            const SN = new Array(filterData.fechas.length).fill(['--:--', '--:--']);
            return (
                <>
                    {
                        filterData.cuentas?.map((acc, idx) => {
                            if (acc.eventos) {
                                const test = filterData.fechas?.map(day => {
                                    const perDay = acc.eventos?.filter(ev => ev.FechaOriginal === day);
                                    if (perDay !== undefined) {
                                        if (perDay.length === 0) {
                                            return ['--:--', '--:--'];
                                        }
                                        if (perDay.length === 1) {
                                            return (perDay[0].DescripcionEvent.toLowerCase().includes('apert')) ? [perDay[0].Hora.slice(0, 5), '--:--'] : ['--:--', perDay[0].Hora.slice(0, 5)];
                                        }
                                        if (perDay.length > 1) {
                                            let ap: string = '--:--';
                                            let ci: string = '--:--';
                                            const test = perDay.map(s => {
                                                if (s.DescripcionEvent.toLowerCase().includes('apert')) {
                                                    if (ap === '--:--') {
                                                        ap = s.Hora.slice(0, 5);
                                                    }
                                                } else if (s.DescripcionEvent.toLowerCase().includes('cierr')) {
                                                    ci = s.Hora.slice(0, 5);
                                                }
                                                return [ap, ci]
                                            });
                                            return test[test.length - 1];
                                        }
                                    }
                                    return '';
                                });
                                return (
                                    <Row key={(idx + 1) + acc.CodigoCte} styleLabel={{ color: colors.text }} style={{ borderBottomWidth: 1, borderColor: Color(colors.text).fade(.9).toString() }} data={[`${idx + 1}`, acc.Nombre, ...test ?? []]} tamCol={[{ size: 30, center: true }, { size: sizeName }, ...tam]} />
                                )
                            } else {
                                return (
                                    <Row key={(idx + 1) + acc.CodigoCte} styleLabel={{ color: colors.text }} style={{ borderBottomWidth: 1, borderColor: Color(colors.text).fade(.9).toString() }} data={[`${idx + 1}`, acc.Nombre, ...SN]} tamCol={[{ size: 30, center: true }, { size: sizeName }, ...tam]} />
                                )
                            }
                        })
                    }
                    <Row key={'days'} tamCol={[]} styleLabel={{ fontWeight: 'bold', textTransform: 'uppercase' }} data={['']} />
                </>
            )
        }
        return undefined;
    }, [filterData, colors, dark, Color]);

    useEffect(() => {
        if (data && data.cuentas) {
            if (report === 'batery') {
                setFilterData({ ...data, cuentas: data.cuentas.filter(fil => fil.nombre && fil.nombre.toLowerCase().includes(debaucedValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) })
            } else if (report === 'state') {
                setFilterData({ ...data, cuentas: data.cuentas.filter(fil => fil.Nombre.toLowerCase().includes(debaucedValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) })
            }
        }
    }, [debaucedValue]);

    useEffect(() => {
        if (textQueryValue.length === 0 && data) {
            setFilterData(data);
        }
    }, [textQueryValue]);


    const _renderTables = useCallback((report: TypeReport) => {
        if (filterData)
            if (report === 'apci-week') {
                return (
                    <View style={[styles.container, { backgroundColor: dark ? Color(colors.background).darken(.4).toString() : colors.background }]}>
                        <ScrollView horizontal={true}>
                            <View>
                                {_renderHead()}
                                <ScrollView >
                                    {_renderDataDays()}
                                </ScrollView>
                            </View>
                        </ScrollView>
                    </View>
                )
            }
        if (report === 'ap-ci' || report === 'event-alarm') {
            if (filterData?.cuentas) {
                return (
                    <ReciclerData
                        data={filterData.cuentas}
                        labelField={'Nombre'}
                        valueField={'CodigoCte'}
                        loading={false}
                        selected={[]}
                        onChange={({ eventos, Nombre, Direccion }) =>
                            navigation.navigate('TableScreen',
                                {
                                    events: eventos ?? [],
                                    keys,
                                    name: Nombre,
                                    address: Direccion,
                                    report: report === 'ap-ci' ? 'Apertura y Cierre' : 'Evento de alarma'
                                }
                            )
                        }
                    />
                )
            }
            return undefined;
        }
        return undefined;
    }, [filterData, keys, colors, roundness, backgroundColor]);

    type dataFilter = "SR" | "CR" | "SE" | "A" | "C" | "S";

    const renderItem = useCallback(({ index, item, separators }: ListRenderItemInfo<Account>) => {
        let shadowColor: string = colors.primary;
        return (
            <View style={[styles.item, {
                borderRadius: roundness * 2,
                backgroundColor,
                shadowColor, elevation: 5
            }]}>
                {
                    report === 'batery'
                        ?
                        <>
                            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: .2, borderColor: Color(colors.primary).alpha(.2).toString() }}>
                                <Text style={[fonts.titleSmall, { flex: 1 }]}>#</Text>
                                <Text style={{ flex: 1, textAlign: 'right', paddingRight: 10, }}>{index + 1}</Text>
                            </View>
                            {
                                keys.map(({ key, label }, idx) => {
                                    const color = (item['estado'] === BatteryStatus.ERROR) ? colors.danger : (item['estado'] === BatteryStatus.RESTORE) ? colors.warning : (item['estado'] === BatteryStatus.WITHOUT_EVENTS) ? colors.success : undefined
                                    return (
                                        <View key={idx + label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: .2, borderColor: Color(colors.primary).alpha(.2).toString() }}>
                                            <Text style={[fonts.titleSmall, { flex: 1, }, label === 'Estado' && { color }]}>{label}</Text>
                                            <Text adjustsFontSizeToFit numberOfLines={2} style={[{
                                                flex: 1,
                                                textAlign: 'right'
                                            }, label === 'Estado' && { color }]} > {
                                                    /*@ts-ignore */
                                                    Array.isArray(key) ? 'arr' : item[key]
                                                }</Text>
                                        </View>
                                    )
                                })
                            }
                        </>
                        :
                        <>
                            <View key={index + 1} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: .2, borderColor: Color(colors.primary).alpha(.2).toString() }}>
                                <Text style={[fonts.titleSmall, { flex: 1 }]}>#</Text>
                                <Text style={{ flex: 1, textAlign: 'right', paddingRight: 10, }}>{index + 1}</Text>
                            </View>
                            <View key={index + item.CodigoAbonado} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: .2, borderColor: Color(colors.primary).alpha(.2).toString() }}>
                                <Text style={[fonts.titleSmall, { flex: 1, }]}>Abonado</Text>
                                <Text adjustsFontSizeToFit numberOfLines={2} style={{ flex: 1, textAlign: 'right', paddingRight: 10, }}>{item.CodigoAbonado}</Text>
                            </View>
                            <View key={index + item.Nombre} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: .2, borderColor: Color(colors.primary).alpha(.2).toString() }}>
                                <Text style={[fonts.titleSmall, { flex: 1, }]}>Nombre</Text>
                                <Text adjustsFontSizeToFit numberOfLines={2} style={{ flex: 1, textAlign: 'right', paddingRight: 10, }}>{item.Nombre}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: .2, borderColor: Color(colors.primary).alpha(.2).toString() }}>
                                {
                                    (item.evento)
                                        ?
                                        <>
                                            <Text style={[
                                                fonts.titleSmall,
                                                { flex: 1, color: item.evento.DescripcionAlarm.toLowerCase().includes('apert') ? colors.success : colors.danger }
                                            ]}>Estado</Text>
                                            <Text style={[
                                                fonts.titleSmall,
                                                { flex: 1, textAlign: 'right', color: item.evento.DescripcionAlarm.toLowerCase().includes('apert') ? colors.success : colors.danger }
                                            ]}>{item.evento.DescripcionAlarm}</Text>
                                        </>
                                        :
                                        <>
                                            <Text style={[fonts.titleSmall, { flex: 1, color: colors.warning }]}>Estado</Text>
                                            <Text style={[{ color: colors.warning }]}>----</Text>
                                        </>
                                }
                            </View>
                        </>
                }
            </View>
        )
    }, [colors, backgroundColor])

    const _renderCards = useCallback((datafilter?: dataFilter) => {
        let data = (filterData?.cuentas ?? []);
        if (datafilter) {
            switch (datafilter) {
                case 'SR':
                    data = data.filter(acc => acc.estado === BatteryStatus.ERROR)
                    break;
                case 'CR':
                    data = data.filter(acc => acc.estado === BatteryStatus.RESTORE)
                    break;
                case 'SE':
                    data = data.filter(acc => acc.estado === BatteryStatus.WITHOUT_EVENTS)
                    break;
                case 'A':
                    data = data.filter(acc => acc.evento && AP.find(ff => ff === acc.evento?.CodigoAlarma))
                    break;
                case 'C':
                    data = data.filter(acc => acc.evento && CI.find(ff => ff === acc.evento?.CodigoAlarma))
                    break;
                case 'S':
                    data = data.filter(acc => !acc.evento)
                    break;
            }
        }

        return (
            <View style={{ flex: 1, margin: 5 }}>
                <Animated.FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(_, idx) => `${idx}`}
                    ListEmptyComponent={<Text style={[fonts.titleMedium, { textAlign: 'center' }]}>Sin coincidencias</Text>}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => refetch()}
                        />
                    }
                />
            </View>
        )
    }, [filterData, colors, fonts, dark, navigation, dates]);

    return (
        <>
            <Text
                style={[
                    { borderLeftWidth: 3, borderColor: colors.primary, color: colors.text, marginVertical: 10 },
                    fonts.titleMedium,
                    orientation === Orientation.landscape && { display: 'none' }
                ]}
            >  {(data?.nombre) ? data.nombre : 'Grupo personalizado, cuentas individuales'}</Text>
            <Loading refresh={isLoading || isFetching} />
            {_renderPercentajes()}
            {
                (report === 'batery' || report === 'state')
                    ?
                    <Tab.Navigator
                        screenOptions={{
                            header: ((props) => {
                                return (
                                    <Appbar>
                                        <Appbar.Content title={props.route.name} titleStyle={[fonts.titleMedium]} />
                                        {
                                            isSearch
                                                ?
                                                <Animated.View entering={SlideInRight} exiting={SlideOutRight} style={{ width: '80%', flexDirection: 'row', alignItems: 'center' }}>
                                                    <Searchbar
                                                        style={{ flex: 1 }}
                                                        value={textQueryValue}
                                                        onChangeText={setTextQueryValue}
                                                    />
                                                    <IconButton
                                                        iconColor={colors.primary}
                                                        icon={'close'}
                                                        onPressIn={() => {
                                                            setIsSearch(false);
                                                            setTextQueryValue('');
                                                        }} />
                                                </Animated.View>
                                                :
                                                <Animated.View entering={LightSpeedInLeft} exiting={LightSpeedInRight}>
                                                    <Appbar.Action icon={'magnify'} iconColor={colors.primary} onPress={() => setIsSearch(true)} />
                                                </Animated.View>
                                        }
                                        {/* <Searchbar value='' /> */}
                                    </Appbar>
                                )
                            })
                        }}
                    >
                        <Tab.Screen name="Todos" options={{ tabBarIcon: (() => <IconButton icon='check-all' />) }}>
                            {
                                () => _renderCards()
                            }
                        </Tab.Screen>
                        <Tab.Screen
                            name={(report === 'state') ? "Abiertas" : "Sin restaure"}
                            options={{
                                tabBarIcon: (() =>
                                    <IconButton
                                        icon={(report === 'state') ? 'lock-open' : 'alert'}
                                        iconColor={(report === 'state') ? colors.success : colors.danger}
                                    />
                                )
                            }}>
                            {
                                () => (report === 'state') ? _renderCards('A') : _renderCards('SR')
                            }
                        </Tab.Screen>
                        <Tab.Screen
                            name={(report === 'state') ? "Cerradas" : "Con restaure"}
                            options={{
                                tabBarIcon: (() =>
                                    <IconButton
                                        icon={(report === 'state') ? 'lock' : 'bell'}
                                        iconColor={(report === 'state') ? colors.danger : colors.warning}
                                    />
                                )
                            }}>
                            {
                                () => (report === 'state') ? _renderCards('C') : _renderCards('CR')
                            }
                        </Tab.Screen>
                        <Tab.Screen
                            name={(report === 'state') ? "Sin estado" : "Sin Eventos"}
                            options={{
                                tabBarIcon: (() =>
                                    <IconButton
                                        icon={(report === 'state') ? 'alert' : 'check-circle'}
                                        iconColor={(report === 'state') ? colors.warning : colors.success}
                                    />
                                )
                            }}>
                            {
                                () => (report === 'state') ? _renderCards('S') : _renderCards('SE')
                            }
                        </Tab.Screen>
                    </Tab.Navigator>
                    : _renderTables(report)

            }
            <Loading loading={isLoading} refresh={isFetching} />
        </>
    )
}

const styles = StyleSheet.create({
    item: {
        padding: 5,
        margin: 5,
        ...style.shadow,
        elevation: 2,
    },
    container: {
        flex: 1,
        borderRadius: 10,
        marginHorizontal: 5,
        marginVertical: 5,
        ...style.shadow,
        elevation: 2,
    },
    textTitlesHeader: {
        paddingHorizontal: 5,
        fontWeight: 'bold'
    },
    btnMenu: {
        justifyContent: 'flex-start'
    }
});