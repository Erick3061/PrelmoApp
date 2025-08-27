import { DrawerActions } from '@react-navigation/native';
import { Stack, useNavigation } from 'expo-router';
import React from 'react';
import { IconButton } from 'react-native-paper';

export default function IndividualLayout() {
    const nav = useNavigation();
    return (
        <Stack>
            <Stack.Screen name='index'
                options={{
                    headerLeft: () => <IconButton icon={'menu'} onPress={() => nav.dispatch(DrawerActions.toggleDrawer)} />,
                    title: 'Individual'
                }}
            />
            <Stack.Screen name='list-account' options={{ title: 'Buacar cuenta' }} />
        </Stack>
    )
}
