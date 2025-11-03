import { Select } from '@/components/Select';
import { Orientation } from '@/interface/app.store.interface';
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

const reports: { name: string, value: Exclude<TypeReport, "ap-ci" | "event-alarm"> }[] = [
    { name: 'PROBLEMAS DE BATERIA', value: 'batery' },
    { name: 'ESTADO DE SUCURSALES', value: 'state' },
    { name: 'HORARIO DE APERTURAS Y CIERRES', value: 'apci-week' },
];

interface Group {
    name: string;
    report: string;
}

export default function GrupalIndex() {
    const { control, handleSubmit, reset, setValue: setValueForm, formState } = useForm<Group>({ defaultValues: { name: '', report: '' } });
    const orientation = useAppStore(store => store.orientation);
    const updateGroup = useAppStore(store => store.updateGroups);
    const groupsSelected = useAppStore(store => store.groupsSelected);
    const handleError = useNotificationStore(state => state.handleError);
    const [isShow, setIsShow] = useState<boolean>(false);
    const [report, setReport] = useState<typeof reports>();

    const mode = useThemeStore(state => state.mode);

    const router = useRouter();
    const navigation = useNavigation();

    const onSubmit: SubmitHandler<Group> = async (props) => {
        // if (dates && accountsSelected.length > 0 && report) {
        //     const missingDates = dates.filter(s => s.date === undefined).map(name => name.name);
        //     if (missingDates?.length === 0 && report.length > 0 && accountsSelected.length > 0) {
        //         const start = dates.find(f => f.name === 'Fecha inicio')?.date?.date.date ?? modDate({ dateI: new Date() }).date.date;
        //         const end = dates.find(f => f.name === 'Fecha final')?.date?.date.date ?? modDate({ dateI: new Date() }).date.date;
        //         router.push({ pathname: '/(menu)/(individual)/result-account', params: { account: JSON.stringify(accountsSelected[0]), end, start, report: report[0].value, typeAccount: 1, keys: JSON.stringify(getKeys(report[0].value)) } });
        //     } else
        //         handleError(`Fechas faltantes:\n${missingDates}`);
        // }
    };

    useEffect(() => {
        if (groupsSelected) {
            setValueForm('name', groupsSelected[0].Nombre);
        } else {
            setValueForm('name', '');
        }
    }, [groupsSelected, setValueForm]);

    const DialogRender = (
        <Portal>
            <Dialog visible={isShow} onDismiss={() => setIsShow(false)}>
                <Dialog.Title>Consulta por grupo</Dialog.Title>
                <Dialog.Content style={[
                    orientation === Orientation.landscape && {
                        maxHeight: 150
                    }
                ]}>
                    <ScrollView>
                        <Text variant='titleSmall'>PROBLEMAS DE BATERIA</Text>
                        <Text variant='labelMedium'>Rastrea los sistemas con fallos de batería.{'\n'}Este reporte consulta 30 días naturales.{'\n'}</Text>
                        <Text variant='titleSmall'>ESTADO DE SUCURSALES</Text>
                        <Text variant='labelMedium'>Permite consultar el estado de las sucursales al momento de realizar la petición.{'\n'}Los estados posibles son:{'\n'}{'\n'}
                            Abierto{'\n'}
                            Cerrado{'\n'}
                            Sin actividad{'\n'}</Text>
                        <Text variant='titleSmall'>HORARIO DE APERTURAS Y CIERRES</Text>
                        <Text variant='labelMedium'>Consulta primer apertura y ultimo cierre de cada día de todas las sucursales, este reporte consulta 7 días antes de la fecha de consulta.</Text>
                    </ScrollView>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setIsShow(false)}>Cerrar</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )

    const goToSearch = useCallback(
        () => {
            router.push({ pathname: '/(menu)/(group)/list-group' })
        },
        [router],
    )



    const _renderSelectAccount = useCallback(() => {
        return (
            <Controller
                control={control}
                rules={{ required: { message: 'Debe seleccionar un grupo', value: true } }}
                name='name'
                render={({ field: { value, onChange }, fieldState: { error } }) =>
                    <>
                        <TextInput
                            mode='outlined'
                            value={value}
                            label={'Seleccione un grupo'}
                            placeholder={'Seleccione un grupo'}
                            showSoftInputOnFocus={false}
                            caretHidden
                            right={
                                <TextInput.Icon
                                    icon={value !== '' ? 'close' : 'menu-down'}
                                    forceTextInputFocus={false}
                                // onPress={(value !== '') ? () => updateGroup() : goToSearch}
                                />
                            }
                            onPressIn={goToSearch}
                        />
                        {error && <Text variant='bodySmall' style={[{ marginLeft: 15, color: mode === ThemeMode.dark ? 'lightcoral' : 'darkred' }]}>{error.message}</Text>}
                    </>
                }
            />
        )
    }, [control, goToSearch, mode]);

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