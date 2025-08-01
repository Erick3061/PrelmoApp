import Calendar from '@/components/Calendar';
import { Select } from '@/components/Select';
import { modDate } from '@/helper/functions';
import { Orientation } from '@/interface/app.store.interface';
import { formatDate } from '@/interface/helpers.interface';
import { TypeReport } from '@/interface/hooks.interface';
import { ThemeMode } from '@/interface/theme.store.interface';
import useAppStore from '@/utils/app.store';
import useThemeStore from '@/utils/theme.store';
import { useRouter } from 'expo-router';
import Drawer from 'expo-router/drawer';
import React, { useCallback, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { Button, Dialog, IconButton, Portal, Switch, Text, TouchableRipple } from 'react-native-paper';

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

const Individual = () => {
    const { control, handleSubmit, reset, setValue: setValueForm, formState } = useForm<Account>({ defaultValues: { name: '', report: '' } });

    const orientation = useAppStore(store => store.orientation);
    const [isSelected, setIsSelected] = useState(false);
    const [isShow, setIsShow] = useState<boolean>(false);
    const [report, setReport] = useState<typeof reports>();
    const [dates, setDates] = useState<{ name: string, date?: formatDate }[]>();

    const mode = useThemeStore(state => state.mode);

    const router = useRouter();


    const onSubmit: SubmitHandler<Account> = async (props) => {
        // if (dates && accountsSelected.length > 0 && report) {
        //     const missingDates = dates.filter(s => s.date === undefined).map(name => name.name);
        //     if (missingDates?.length === 0) {
        //         const start = dates.find(f => f.name === 'Fecha inicio')?.date?.date.date ?? modDate({}).date.date;
        //         const end = dates.find(f => f.name === 'Fecha final')?.date?.date.date ?? modDate({}).date.date;
        //         stack.navigate('ResultAccountScreen', { account: accountsSelected[0], end, report: report[0].value, start, keys: getKeys(report[0].value), typeAccount: 1, filter: isSelected });
        //     } else {
        //         notification({
        //             type: 'error',
        //             title: 'Error al asignar Fechas',
        //             text: `Fechas faltantes:\n${missingDates}`
        //         });
        //     }
        // }
    };

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
            <Drawer.Screen options={{ headerRight: () => (<IconButton icon={'help-circle'} onPress={() => setIsShow(true)} />) }} />
            <View style={[{ flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center' }]}>
                <View style={[
                    { width: '100%' },
                    orientation === Orientation.landscape && { width: '80%' }
                ]}>
                    <ScrollView>
                        {
                            <KeyboardAvoidingView>
                                {/* 
                                {_renderSelectAccount()}
                                */}
                                {_renderSelectReport()}
                                <View style={[
                                    orientation === Orientation.landscape && {
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }
                                ]}>
                                    <TouchableRipple onPress={() => setIsSelected(!isSelected)}>
                                        <View style={[
                                            {
                                                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                                                paddingVertical: 10, paddingHorizontal: 5
                                            }
                                        ]}>
                                            <Text variant='labelLarge'>Filtar eventos</Text>
                                            <Switch onChange={() => setIsSelected(!isSelected)} value={isSelected} />
                                        </View>
                                    </TouchableRipple>
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
export default Individual;