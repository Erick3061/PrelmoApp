import { DrawerActions } from '@react-navigation/native';
import { Stack, useNavigation } from 'expo-router';
import React from 'react';
import { IconButton } from 'react-native-paper';

export default function GroupLayout() {
    const nav = useNavigation();
    return (
        <Stack>
            <Stack.Screen name='index'
                options={{
                    headerLeft: () => <IconButton icon={'menu'} onPress={() => nav.dispatch(DrawerActions.toggleDrawer)} />,
                    title: 'Grupal'
                }}
            />
            <Stack.Screen name='list-group' options={{ title: 'Seleccionar cuentas' }} />
        </Stack>
    )
}
