import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { View, KeyboardAvoidingView, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { NativeStackNavigationProp, } from '@react-navigation/native-stack';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Orientation, RootDrawerParamList, RootStackParamList, TypeReport } from '../../types/types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Button, Dialog, IconButton, Portal, Text, TextInput } from 'react-native-paper';
import { updateGroups } from '../../features/configSlice';
import { Select } from '../../components/select/Select';
import { getKeysAccount } from '../../functions/functions';

type Accout = {
    name: string;
    report: string;
}

const reports: Array<{ name: string, value: TypeReport }> = [
    { name: 'PROBLEMAS DE BATERIA', value: 'batery' },
    { name: 'ESTADO DE SUCURSALES', value: 'state' },
    { name: 'HORARIO DE APERTURAS Y CIERRES', value: 'apci-week' },
];

type ResultAccountScreenProps = NativeStackNavigationProp<RootStackParamList, 'Drawer'>;

interface Props extends DrawerScreenProps<RootDrawerParamList, 'SelectGroupsScreen'> { };

export const SelectGroupsScreen = ({ navigation, route }: Props) => {
    const stack = useNavigation<ResultAccountScreenProps>();
    const {
        theme: { theme: { colors, fonts, roundness } },
        config: { orientation, groupsSelected }
    } = useAppSelector(state => state);
    const AppDispatch = useAppDispatch();

    const { control, handleSubmit, reset, formState: { errors }, setValue } = useForm<Accout>({ defaultValues: { name: '', report: '' } });
    const [report, setReport] = useState<typeof reports>();
    const [isShow, setIsShow] = useState<boolean>(false);
    const isFocus = useIsFocused();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Consulta por grupo',
            headerRight: (() =>
                <IconButton
                    icon={'help-circle'}
                    onPress={() => setIsShow(true)}
                />
            ),
        })
    }, [navigation]);


    const goToSearch = () => {
        stack.navigate('Search', { type: 'Groups' });
    }

    const onSubmit: SubmitHandler<Accout> = async (props) => {
        if (groupsSelected.length > 0 && report && report?.length > 0) {
            stack.navigate('ResultAccountsScreen', {
                accounts: [{ name: groupsSelected[0].Nombre, code: groupsSelected[0].Codigo }],
                report: report[0].value,
                keys: getKeysAccount(report[0].value),
                typeAccount: groupsSelected[0].Tipo,
                nameGroup: groupsSelected[0].Nombre,
            });
        }
    };

    const _renderSelectGroup = useCallback(() => {
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
                            placeholder={'Seleccione una cuenta'}
                            showSoftInputOnFocus={false}
                            right={
                                <TextInput.Icon
                                    icon={value !== '' ? 'close' : 'menu-down'}
                                    forceTextInputFocus={false}
                                    onPress={() => {
                                        if (value !== '') {
                                            AppDispatch(updateGroups([]));
                                        } else {
                                            goToSearch();
                                        }
                                    }}
                                />
                            }
                            onPressIn={goToSearch}
                        />
                        {error && <Text
                            style={[fonts.titleSmall, { marginLeft: 15, color: colors.error }]}>{error.message}</Text>}
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
                            {error && <Text style={[fonts.titleSmall, { marginLeft: 15, color: colors.error }]}>{error.message}</Text>}
                        </>
                    }
                />
            )
        }
        return undefined;
    }, [control, report, setReport, reports, colors]);

    useEffect(() => {
        if (groupsSelected.length > 0) {
            setValue('name', groupsSelected[0].Nombre);
        } else {
            setValue('name', '');
        }
    }, [groupsSelected, isFocus]);

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
                            {_renderSelectGroup()}
                            {_renderSelectReport()}
                            <View style={{ padding: 10, alignItems: 'flex-end' }}>
                                <Button
                                    children='CONSULTAR'
                                    style={{ marginVertical: 5 }}
                                    mode='contained'
                                    onPress={handleSubmit(onSubmit)}
                                    contentStyle={{ paddingVertical: 5 }}
                                />
                            </View>
                        </KeyboardAvoidingView>
                    }
                </ScrollView>
            </View>
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
        </View >
    )
}