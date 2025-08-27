import Calendar from '@/components/Calendar';
import { Select } from '@/components/Select';
import { getKeys, modDate } from '@/helper/functions';
import { Orientation } from '@/interface/app.store.interface';
import { formatDate } from '@/interface/helpers.interface';
import { TypeReport } from '@/interface/hooks.interface';
import { ThemeMode } from '@/interface/theme.store.interface';
import useAppStore from '@/utils/app.store';
import useNotificationStore from '@/utils/notification.store';
import useThemeStore from '@/utils/theme.store';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import Drawer from 'expo-router/drawer';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { Button, Dialog, IconButton, Portal, Text, TextInput } from 'react-native-paper';

const calendars = [
    { label: 'Fecha inicio', date: modDate({ dateI: new Date(), addDay: -30 }).DATE },
    { label: 'Fecha final', date: modDate({ dateI: new Date() }).DATE },
];
const reports: { name: string, value: Exclude<TypeReport, "batery" | "state" | "apci-week"> }[] = [
    { name: 'APERTURA Y CIERRE', value: 'ap-ci' },
    { name: 'EVENTO DE ALARMA', value: 'event-alarm' },
];
interface Account {
    name: string;
    report: string;
    start: string;
    end: string;
}

export default function IndividualIndex() {
    const { control, handleSubmit, reset, setValue: setValueForm, formState } = useForm<Account>({ defaultValues: { name: '', report: '' } });
    const orientation = useAppStore(store => store.orientation);
    const accountsSelected = useAppStore(store => store.accountsSelected);
    const updateAccounts = useAppStore(store => store.updateAccounts);
    const handleError = useNotificationStore(state => state.handleError);
    const [isShow, setIsShow] = useState<boolean>(false);
    const [report, setReport] = useState<typeof reports>();
    const [dates, setDates] = useState<{ name: string, date?: formatDate }[]>();

    const mode = useThemeStore(state => state.mode);

    const router = useRouter();
    const navigation = useNavigation();

    const onSubmit: SubmitHandler<Account> = async (props) => {
        if (dates && accountsSelected.length > 0 && report) {
            const missingDates = dates.filter(s => s.date === undefined).map(name => name.name);
            if (missingDates?.length === 0 && report.length > 0 && accountsSelected.length > 0) {
                const start = dates.find(f => f.name === 'Fecha inicio')?.date?.date.date ?? modDate({ dateI: new Date() }).date.date;
                const end = dates.find(f => f.name === 'Fecha final')?.date?.date.date ?? modDate({ dateI: new Date() }).date.date;
                router.push({ pathname: '/(menu)/(individual)/result-account', params: { account: JSON.stringify(accountsSelected[0]), end, start, report: report[0].value, typeAccount: 1, keys: JSON.stringify(getKeys(report[0].value)) } });
            } else
                handleError(`Fechas faltantes:\n${missingDates}`);
        }
    };

    useEffect(() => {
        if (accountsSelected.length > 0) {
            setValueForm('name', accountsSelected[0].Nombre);
        } else {
            setValueForm('name', '');
        }
    }, [accountsSelected, setValueForm]);

    const DialogRender = (
        <Portal>
            <Dialog visible={isShow} onDismiss={() => setIsShow(false)}>
                <Dialog.Title>Consulta individual</Dialog.Title>
                <Dialog.Content style={[orientation === Orientation.landscape && { maxHeight: 150 }]}>
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
    )

    const goToSearch = useCallback(
        () => {
            if (accountsSelected.length > 1) updateAccounts(accountsSelected.slice(0, 1));
            router.push({ pathname: '/(menu)/(individual)/list-account', params: { type: 'Account' } })
        },
        [accountsSelected, router, updateAccounts],
    )



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
                            caretHidden
                            right={
                                <TextInput.Icon
                                    icon={value !== '' ? 'close' : 'menu-down'}
                                    forceTextInputFocus={false}
                                    onPress={(value !== '') ? () => updateAccounts([]) : goToSearch}
                                />
                            }
                            onPressIn={goToSearch}
                        />
                        {error && <Text variant='bodySmall' style={[{ marginLeft: 15, color: mode === ThemeMode.dark ? 'lightcoral' : 'darkred' }]}>{error.message}</Text>}
                    </>
                }
            />
        )
    }, [control, goToSearch, mode, updateAccounts]);

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
                            {error && <Text variant='bodySmall' style={[{ marginLeft: 15, color: mode === ThemeMode.dark ? 'lightcoral' : 'darkred' }]}>{error.message}</Text>}
                        </>
                    }
                />
            )
        }
        return undefined;
    }, [control, report, mode])

    return (
        <>
            <Drawer.Screen options={{ headerLeft: () => (<IconButton icon={'menu'} onPress={() => navigation.dispatch(DrawerActions.openDrawer)} />), headerRight: () => (<IconButton icon={'help-circle'} onPress={() => setIsShow(true)} />) }} />
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
                                <View style={[
                                    orientation === Orientation.landscape && {
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }
                                ]}>
                                    <View style={[
                                        orientation === Orientation.landscape && {
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end'
                                        }
                                    ]}>
                                        <Calendar
                                            calendars={calendars}
                                            limitDays={30}
                                            onChange={setDates}
                                        />
                                        <View style={{ padding: 10, alignItems: 'flex-end' }}>
                                            <Button
                                                style={{ marginVertical: 5 }}
                                                mode='contained'
                                                onPress={handleSubmit(onSubmit)}
                                                contentStyle={{ paddingVertical: 5 }}
                                            >CONSULTAR</Button>
                                        </View>
                                    </View>
                                </View>
                            </KeyboardAvoidingView>
                        }
                    </ScrollView>
                </View>
                {DialogRender}
            </View >
        </>
    )
}