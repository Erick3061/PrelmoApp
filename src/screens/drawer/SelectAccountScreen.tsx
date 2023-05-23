import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { View, KeyboardAvoidingView, Pressable, Alert } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Switch } from 'react-native';
import Color from 'color';
import { Orientation, RootDrawerParamList, RootStackParamList, TypeReport } from '../../types/types';
import { getKeys, modDate } from '../../functions/functions';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { formatDate } from '../../interface/interface';
import { NotificationContext } from '../../components/Notification/NotificationtContext';
import { updateAccounts } from '../../features/configSlice';
import { Button, Dialog, IconButton, Portal, Text, TextInput } from 'react-native-paper';
import { Select } from '../../components/select/Select';
import { ScrollView } from 'react-native-gesture-handler';
import { Calendar } from '../../components/calendar/Calendar';

interface Accout {
    name: string;
    report: string;
    start: string;
    end: string;
}

const calendars = [
    { label: 'Fecha inicio', date: modDate({ days: -30 }).DATE },
    { label: 'Fecha final', date: modDate({}).DATE },
];

const reports: Array<{ name: string, value: Exclude<TypeReport, "batery" | "state" | "apci-week"> }> = [
    { name: 'APERTURA Y CIERRE', value: 'ap-ci' },
    { name: 'EVENTO DE ALARMA', value: 'event-alarm' },
];



type ResultAccountScreenProps = NativeStackNavigationProp<RootStackParamList, 'Drawer'>;

interface Props extends DrawerScreenProps<RootDrawerParamList, 'SelectAccountScreen'> { };

export const SelectAccountScreen = ({ navigation }: Props) => {
    const [isShow, setIsShow] = useState<boolean>(false);
    const stack = useNavigation<ResultAccountScreenProps>();

    const {
        theme: { theme: { colors, fonts, roundness } },
        config: { orientation, accountsSelected },
    } = useAppSelector(state => state);

    const { control, handleSubmit, reset, setValue: setValueForm, formState } = useForm<Accout>({ defaultValues: { name: '', report: '' } });
    const [report, setReport] = useState<typeof reports>();
    const [dates, setDates] = useState<Array<{ name: string, date?: formatDate }>>();
    const [isSelected, setIsSelected] = useState(false);
    const isFocus = useIsFocused();
    const AppDispatch = useAppDispatch();
    const { notification } = useContext(NotificationContext);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Consulta individual',
            headerRight: (() =>
                <IconButton
                    icon={'help-circle'}
                    onPress={() => setIsShow(true)}
                />
            ),
        })
    }, [navigation]);

    const goToSearch = () => {
        if (accountsSelected.length > 1) AppDispatch(updateAccounts(accountsSelected.slice(0, 1)));
        stack.navigate('Search', { type: 'Account' });
    }

    const onSubmit: SubmitHandler<Accout> = async (props) => {
        if (dates && accountsSelected.length > 0 && report) {
            const missingDates = dates.filter(s => s.date === undefined).map(name => name.name);
            if (missingDates?.length === 0) {
                const start = dates.find(f => f.name === 'Fecha inicio')?.date?.date.date ?? modDate({}).date.date;
                const end = dates.find(f => f.name === 'Fecha final')?.date?.date.date ?? modDate({}).date.date;
                stack.navigate('ResultAccountScreen', { account: accountsSelected[0], end, report: report[0].value, start, keys: getKeys(report[0].value), typeAccount: 1, filter: isSelected });
            } else {
                notification({
                    type: 'error',
                    title: 'Error al asignar Fechas',
                    text: `Fechas faltantes:\n${missingDates}`
                });
            }
        }
    };

    const _renderSelectAccount = useCallback(() => {
        return (
            <Controller
                control={control}
                rules={{ required: { message: 'Debe seleccionar una cuenta', value: true } }}
                name='name'
                render={({ field: { value, onChange }, fieldState: { error } }) =>
                    <>
                        <TextInput
                            mode='outlined'
                            value={value}
                            label={'Seleccione una cuenta'}
                            placeholder={'Seleccione una cuenta'}
                            showSoftInputOnFocus={false}
                            right={
                                <TextInput.Icon
                                    icon={value !== '' ? 'close' : 'menu-down'}
                                    forceTextInputFocus={false}
                                    onPress={() => {
                                        if (value !== '') {
                                            AppDispatch(updateAccounts([]));
                                        } else {
                                            goToSearch();
                                        }
                                    }}
                                />
                            }
                            onPressIn={goToSearch}
                        />
                        {error && <Text variant='titleSmall' style={[{ marginHorizontal: 15, color: colors.danger }]}>{error.message}</Text>}
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
                                data={reports}
                                onChange={(value) => {
                                    setReport(value);
                                    if (value.length > 0) {
                                        onChange(value[0].name);
                                    } else {
                                        onChange('')
                                    }
                                }}
                            />
                            {error && <Text style={[fonts.titleSmall, { marginLeft: 15, color: colors.danger }]}>{error.message}</Text>}
                        </>
                    }
                />
            )
        }
        return undefined;
    }, [control, report, setReport, reports, colors, orientation])

    useEffect(() => {
        if (accountsSelected.length > 0) {
            setValueForm('name', accountsSelected[0].Nombre);
        } else {
            setValueForm('name', '');
        }
    }, [accountsSelected, isFocus]);

    return (
        <View style={[{ flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center' }]}>
            <View style={[
                { width: '100%' },
                orientation === Orientation.landscape && { width: '80%' }
            ]}>
                <ScrollView>
                    {
                        <KeyboardAvoidingView>
                            {_renderSelectAccount()}
                            {_renderSelectReport()}
                            <Pressable
                                onPress={() => setIsSelected(!isSelected)}
                                android_ripple={{ color: Color(colors.primary).fade(.9).toString() }}
                            >
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
                            <View style={[
                                orientation === Orientation.landscape && {
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end'
                                }
                            ]}>
                                <Calendar
                                    calendars={calendars}
                                    backgroundColor={colors.background}
                                    textColor={colors.text}
                                    colorOutline={colors.primary}
                                    limitDays={30}
                                    onChange={setDates}
                                    Textstyle={fonts.titleMedium}
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
                    <Dialog.Title>Consulta individual</Dialog.Title>
                    <Dialog.Content>
                        <Text variant='labelMedium'>Seleccione el inicio y fin de la consulta{'\n'}</Text>
                        <Text variant='labelMedium'>Recuerde que solo se puede consultar hasta 30 dias naturales{'\n'}</Text>
                        <Text variant='titleSmall'>APERTURA Y CIERRE</Text>
                        <Text variant='labelMedium'>Con este reporte podra consultar los horarios en los que se recibieron los eventos de apertura y cierre{'\n'}</Text>
                        <Text variant='titleSmall'>EVENTO DE ALARMA</Text>
                        <Text variant='labelMedium'>Con este reporte podra ver los eventos de alarma, asi como los eventos generados por su sistema de alarma</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setIsShow(false)}>Cerrar</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View >
    )
}