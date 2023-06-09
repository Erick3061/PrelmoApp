import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useLayoutEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { View, KeyboardAvoidingView, Pressable, Switch } from 'react-native';
import { useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Color from 'color';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { getKeys, getKeysAccount, modDate } from '../../functions/functions';
import { Orientation, RootDrawerParamList, RootStackParamList, TypeReport } from '../../types/types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { formatDate } from '../../interface/interface';
import { NotificationContext } from '../../components/Notification/NotificationtContext';
import { Button, Dialog, IconButton, Portal, Text, TextInput } from 'react-native-paper';
import { updateAccounts } from '../../features/configSlice';
import { Select } from '../../components/select/Select';
import { style } from '../../../App';
import { Calendar } from '../../components/calendar/Calendar';

type Accout = {
    name: string;
    report: string;
    start: string;
    end: string;
}

const calendars = [
    { label: 'Fecha inicio', date: modDate({ days: -30 }).DATE },
    { label: 'Fecha final', date: modDate({}).DATE },
]

const reports: Array<{ name: string, value: TypeReport, msg: string, setDates: boolean }> = [
    { name: 'APERTURA Y CIERRE', value: 'ap-ci', msg: 'Con este reporte podra consultar los horarios en los que se recibieron los eventos de apertura y cierre', setDates: true },
    { name: 'EVENTO DE ALARMA', value: 'event-alarm', msg: 'Con este reporte podra ver los eventos de alarma, asi como los eventos generados por su sistema de alarma', setDates: true },
    { name: 'PROBLEMAS DE BATERIA', value: 'batery', msg: '', setDates: false },
    { name: 'ESTADO DE SUCURSALES', value: 'state', msg: '', setDates: false },
    { name: 'HORARIOS DE APERTURAS Y CIERRES', value: 'apci-week', msg: '', setDates: false },
]
type ResultAccountScreenProps = NativeStackNavigationProp<RootStackParamList, 'Drawer'>;

interface Props extends DrawerScreenProps<RootDrawerParamList, 'SelectAccountsScreen'> { };

export const SelectAccountsScreen = ({ navigation, route }: Props) => {
    const stack = useNavigation<ResultAccountScreenProps>();
    const {
        theme: { theme: { colors, fonts, roundness } },
        config: { orientation, accountsSelected }
    } = useAppSelector(state => state);

    const { control, handleSubmit, reset, setValue: setValueForm } = useForm<Accout>({ defaultValues: { name: '', start: '', end: '', report: '' } });
    const [report, setReport] = useState<typeof reports>();
    const [isShow, setIsShow] = useState<boolean>(false);
    const [dates, setDates] = useState<Array<{ name: string, date?: formatDate }>>();
    const [isSelected, setIsSelected] = useState(false);
    const [hideCalendars, setHideCalendars] = useState<boolean>(false);
    const AppDispatch = useAppDispatch();
    const isFocus = useIsFocused();
    const { notification } = useContext(NotificationContext);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Consulta Avanzada',
            headerRight: (() =>
                <IconButton
                    icon={'help-circle'}
                    onPress={() => setIsShow(true)}
                />
            ),
        })
    }, [navigation]);

    const onSubmit: SubmitHandler<Accout> = async (props) => {
        if (dates && accountsSelected.length > 0 && report) {
            const missingDates = dates.filter(s => s.date === undefined).map(name => name.name);
            if (missingDates?.length === 0) {
                const start = dates.find(f => f.name === 'Fecha inicio')?.date?.date.date ?? modDate({}).date.date;
                const end = dates.find(f => f.name === 'Fecha final')?.date?.date.date ?? modDate({}).date.date;
                if (accountsSelected.length === 1 && report && (report[0].value === 'ap-ci' || report[0].value === 'event-alarm')) {
                    stack.navigate('ResultAccountScreen', { account: accountsSelected[0], start, end, filter: isSelected, keys: getKeys(report[0].value), typeAccount: 1, report: report[0].value })
                } else if (accountsSelected.length > 0) {
                    stack.navigate('ResultAccountsScreen', {
                        accounts: accountsSelected.map(v => { return { name: v.Nombre, code: parseInt(v.CodigoCte) } }).sort(),
                        report: report[0].value,
                        keys: report[0].value === 'batery' ? getKeysAccount(report[0].value) : getKeys(report[0].value),
                        typeAccount: 1,
                        start: (report[0].value === 'ap-ci' || report[0].value === 'event-alarm') ? start : undefined,
                        end: (report[0].value === 'ap-ci' || report[0].value === 'event-alarm') ? end : undefined,
                        nameGroup: 'Custom Group'
                    })
                }
            } else {
                notification({
                    type: 'error',
                    title: 'Error al asignar Fechas',
                    text: `Fechas faltantes:\n${missingDates}`,
                    autoClose: true,
                });
            }
        }
    };

    const _renderSelectAccounts = useCallback(() => {
        return (
            <Controller
                control={control}
                rules={{ required: { message: 'Debe seleccionar al menos una cuenta', value: true } }}
                name='name'
                render={({ field: { value, onChange }, fieldState: { error } }) =>
                    <>
                        <TextInput
                            mode='outlined'
                            value={value}
                            label={'Seleccionar cuentas'}
                            placeholder={'Seleccionar cuentas'}
                            showSoftInputOnFocus={false}
                            right={
                                <TextInput.Icon
                                    icon={value !== '' ? 'close' : 'menu-down'}
                                    forceTextInputFocus={false}
                                    onPress={() => {
                                        if (value !== '') {
                                            AppDispatch(updateAccounts([]));
                                        } else {
                                            stack.navigate('Search', { type: 'Accounts' });
                                        }
                                    }}
                                />
                            }
                            onPressIn={() => { stack.navigate('Search', { type: 'Accounts' }); }}
                        />
                        {error && <Text style={[fonts.titleSmall, { marginLeft: 15, color: colors.error }]}>{error.message}</Text>}
                    </>
                }
            />
        )
    }, [control, colors]);

    const _renderSelectReport = useCallback(() => {
        if (reports) {
            return (
                <Controller
                    control={control}
                    rules={{ required: { message: 'Debe seleccionar un reporte', value: true } }}
                    name='report'
                    render={({ field: { value, onChange }, fieldState: { error } }) =>
                        <>
                            <Select
                                maxHeight={200}
                                valueField='value'
                                labelField='name'
                                value={value}
                                label='Seleccionar reporte'
                                itemsSelected={report ?? []}
                                data={accountsSelected?.length === 1 ? reports.slice(0, 2) : reports}
                                onChange={(value) => {
                                    setReport(value);
                                    if (value.length > 0) {
                                        onChange(value[0].name);
                                    } else {
                                        onChange('')
                                    }
                                }}
                            />
                            {error && <Text style={[fonts.titleSmall, { marginLeft: 15, color: colors.error }]}>{error.message}</Text>}
                        </>
                    }
                />
            )
        }
        return undefined;
    }, [control, report, setReport, reports, colors, accountsSelected])

    useEffect(() => {
        if (accountsSelected.length === 0) setValueForm('name', '');
        if (accountsSelected.length === 1) {
            setReport([reports[0]]);
            setValueForm('report', reports[0].name);
        }
        if (accountsSelected.length > 0) {
            setValueForm('name', accountsSelected[0].Nombre);
        }
    }, [accountsSelected, isFocus]);

    useEffect(() => {
        if (report && report.length > 0 && report[0].setDates) setHideCalendars(false);
        else setHideCalendars(true);
    }, [report]);

    return (
        <View style={{ flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
            <View style={[
                { width: '100%' },
                orientation === Orientation.landscape && {
                    width: '80%'
                }
            ]}>
                <ScrollView>
                    {
                        <KeyboardAvoidingView>
                            {_renderSelectAccounts()}
                            {
                                accountsSelected && accountsSelected.length > 0 &&
                                <View style={[{ padding: 10, maxHeight: 200, backgroundColor: Color(colors.primary).fade(.85).toString(), borderRadius: roundness * 2 }]}>
                                    <ScrollView >
                                        {
                                            accountsSelected.map(acc =>
                                                <View
                                                    key={acc.CodigoCte}
                                                    style={[
                                                        style.shadow,
                                                        {
                                                            backgroundColor: colors.background,
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            borderRadius: roundness * 2,
                                                            paddingHorizontal: 10,
                                                            paddingVertical: 5,
                                                            marginVertical: 4,
                                                            elevation: 5
                                                        }
                                                    ]}
                                                >
                                                    <Text style={[fonts.labelMedium, { color: colors.text, textAlign: 'left', flex: 1 }]}>{acc.Nombre}</Text>
                                                    <IconButton icon='close' onPress={() => { AppDispatch(updateAccounts(accountsSelected.filter(f => f.CodigoCte !== acc.CodigoCte))) }} />
                                                </View>
                                            )
                                        }
                                    </ScrollView>
                                </View>
                            }
                            {_renderSelectReport()}
                            <View style={[
                                orientation === Orientation.landscape && {
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end'
                                }
                            ]}>
                                {
                                    report && report.length > 0 && (report[0].value === 'ap-ci' || report[0].value === 'event-alarm') && accountsSelected.length === 1 &&
                                    <Pressable onPress={() => setIsSelected(!isSelected)}>
                                        {
                                            ({ pressed }) => {
                                                return (
                                                    <View style={[
                                                        {
                                                            borderRadius: roundness,
                                                            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                                                            paddingVertical: 10, paddingHorizontal: 5
                                                        },
                                                        pressed && { backgroundColor: Color(colors.primary).fade(.9).toString() },
                                                    ]}>
                                                        <Text variant='labelLarge'>Filtar eventos</Text>
                                                        <Switch onChange={() => setIsSelected(!isSelected)} value={isSelected} thumbColor={colors.primary} trackColor={{ false: undefined, true: Color(colors.primary).fade(.8).toString() }} />
                                                    </View>
                                                )
                                            }
                                        }
                                    </Pressable>
                                }
                                <Calendar
                                    calendars={calendars}
                                    backgroundColor={colors.background}
                                    textColor={colors.text}
                                    colorOutline={colors.primary}
                                    limitDays={30}
                                    onChange={setDates}
                                    Textstyle={fonts.titleMedium}
                                    hideInputs={hideCalendars}
                                />
                                <View style={{ padding: 10, alignItems: 'flex-end' }}>
                                    <Button
                                        children='CONSULTAR'
                                        style={{ marginVertical: 5 }}
                                        mode='contained'
                                        onPress={handleSubmit(onSubmit)}
                                        contentStyle={{ paddingVertical: 5 }}
                                    />
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    }
                </ScrollView>
            </View>
            <Portal>
                <Dialog visible={isShow} onDismiss={() => setIsShow(false)}>
                    <Dialog.Title>Consulta avanzada</Dialog.Title>
                    <Dialog.Content style={[
                        orientation === Orientation.landscape && {
                            maxHeight: 150
                        }
                    ]}>
                        <Text variant='labelMedium'>Seleccione el inicio y fin de la consulta{'\n'}</Text>
                        <Text variant='labelMedium'>Recuerde que solo se puede consultar hasta 30 dias naturales.{'\n'}</Text>
                        <Text variant='labelMedium'>Seleccione las sucursales de manera personalizada.{'\n'}</Text>
                        <Text variant='labelMedium'>Seleccione el reporte deseado.{'\n'}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setIsShow(false)}>Cerrar</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View >
    )
}