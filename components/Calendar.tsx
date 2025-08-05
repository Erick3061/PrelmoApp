import { modDate } from '@/helper/functions';
import { Orientation } from '@/interface/app.store.interface';
import useAppStore from '@/utils/app.store';
import useCalendarStore from '@/utils/calendar.store';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Button, Chip, Surface, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Props } from '../interface/calendar.store';

const Calendar = (props: Props) => {

    const { calendars, height, backgroundColor, textColor, colorOutline, onChange, limitDays, Textstyle, hideInputs } = props;
    const dates = useCalendarStore(store => store.dates);
    const calendarSelected = useCalendarStore(store => store.calendarSelected);
    const setInitialDates = useCalendarStore(store => store.setInitialDates);
    const setCalendar = useCalendarStore(store => store.setCalendar);
    const onSelect = useCalendarStore(store => store.onSelect);
    const orientation = useAppStore(state => state.orientation);

    useEffect(() => {
        const dates = calendars.map(cal => { return { name: cal.label, date: modDate({ dateI: cal.date }) } });
        setInitialDates(dates);
    }, [calendars, setInitialDates]);

    useEffect(() => {
        if (dates) onChange(dates);
    }, [dates, onChange]);

    const _renderInputs = React.useCallback(() => {
        if (hideInputs) return undefined;
        if (dates)
            return (
                dates.map((calendar, idx) => {
                    return (
                        <View key={idx} style={{ display: 'flex', gap: 3 }}>
                            <Text variant='bodySmall' style={{ marginLeft: 5 }}>{calendar.name}</Text>
                            <Chip compact mode='outlined' icon='calendar' onPress={() => setCalendar(calendar.name)} >
                                {calendar.date?.date.date ?? '--/--/--'}
                            </Chip>
                        </View>
                    )
                })
            )
        return undefined
    }, [hideInputs, dates, setCalendar]);

    const _renderCalendar = React.useCallback(() => {
        if (calendarSelected && dates)
            return (Platform.OS === 'ios')
                ?
                <Modal visible={calendarSelected !== undefined ? true : false} transparent animationType='fade' supportedOrientations={['landscape', 'portrait']} >
                    <SafeAreaView style={[
                        { flex: 1, justifyContent: 'center', alignItems: 'center' },
                        orientation === Orientation.landscape && {
                            justifyContent: 'flex-start'
                        }
                    ]} >
                        <Pressable style={{ width: '100%', height: '100%' }} onPress={() => setCalendar(undefined)} />
                        <View style={[
                            { position: 'absolute' },
                            orientation === Orientation.landscape && {
                                top: 0
                            }
                        ]} >
                            <Surface style={{ borderRadius: 20, padding: 10 }}>
                                <DateTimePicker
                                    display={'inline'}
                                    locale="es-ES"
                                    value={dates.find(f => f.name === calendarSelected)?.date?.DATE ?? new Date()}
                                    mode={'date'}
                                    minimumDate={limitDays ? modDate({ dateI: new Date(), addDay: -limitDays }).DATE : undefined}
                                    maximumDate={modDate({ dateI: new Date() }).DATE}
                                    onChange={({ nativeEvent: { timestamp }, type }) => {
                                        if (calendarSelected && timestamp) {
                                            const date = modDate({ dateI: new Date(timestamp) });
                                            onSelect({ name: calendarSelected, date });
                                        }
                                    }}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <Button mode='contained' onPress={() => { setCalendar(undefined); }}>
                                        Cancelar
                                    </Button>
                                </View>
                            </Surface>
                        </View>
                    </SafeAreaView>
                </Modal>
                :
                (calendarSelected !== undefined) &&
                <DateTimePicker
                    value={dates.find(f => f.name === calendarSelected)?.date?.DATE ?? new Date()}
                    mode={'date'}
                    minimumDate={limitDays ? modDate({ dateI: new Date(), addDay: -limitDays }).DATE : undefined}
                    maximumDate={modDate({ dateI: new Date() }).DATE}
                    onChange={({ nativeEvent: { timestamp }, type }) => {
                        if (calendarSelected && timestamp) {
                            const date = modDate({ dateI: new Date(timestamp) });
                            onSelect({ name: calendarSelected, date });
                        }
                    }}
                    style={{ outlineColor: 'red' }}
                />
        return undefined;
    }, [calendarSelected, dates, orientation, limitDays, setCalendar, onSelect])

    return (
        <View style={[styles.containerInputs]}>
            {_renderInputs()}
            {_renderCalendar()}
        </View>
    )
}

export default Calendar

const styles = StyleSheet.create({
    containerInputs: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    caontainerInput: {
        // borderBottomWidth: 1,
        borderWidth: .2,
        flexDirection: 'row',
        position: 'relative',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginTop: 10,
        marginBottom: 4,
        marginHorizontal: 1,
        borderRadius: 5,

    },
    containerLabel: {
        position: 'absolute',
        top: 2,
        left: 0,
    },
    label: {
        fontSize: 11,
        paddingHorizontal: 10
    },
    date: {
        paddingBottom: 3
    }
});