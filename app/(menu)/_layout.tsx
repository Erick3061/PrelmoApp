import { ThemeMode } from '@/interface/theme.store.interface';
import useAuthStore from '@/utils/auth.store';
import useThemeStore from '@/utils/theme.store';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { QueryClient } from '@tanstack/react-query';
import Drawer from 'expo-router/drawer';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Avatar, Card, Drawer as DrawerPaper, IconButton } from 'react-native-paper';

export default function _layout() {
    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'transparent' }}>
            <Drawer drawerContent={props => <MenuContent {...props} />}>
                <Drawer.Screen name='home' options={{ title: 'Inicio' }} />
                <Drawer.Screen name='(individual)' options={{ headerShown: false, title: 'Individual' }} />
                <Drawer.Screen name='(group)' options={{ headerShown: false, title: 'Grupal' }} />
            </Drawer>
        </GestureHandlerRootView>
    )
}

const MenuContent = ({ state, navigation }: DrawerContentComponentProps) => {
    const { logOut, User } = useAuthStore();
    const { theme, updateMode } = useThemeStore();
    const queryClient = new QueryClient();
    const changeTheme = () => theme.dark ? updateMode(ThemeMode.light) : updateMode(ThemeMode.dark);
    const request: { page: string, icon: string, name?: string }[] = [
        { page: '(individual)', icon: 'file-outline', name: 'Individual' },
        { page: '(group)', icon: 'file-multiple-outline', name: 'Grupo' },
        { page: '(avanzado)', icon: 'file-cog-outline', name: 'Avanzado' }
    ];
    const others: { page: string, icon: string }[] = [{ page: 'downloads', icon: 'file-download-outline' }, { page: 'profile', icon: 'account-circle-outline' }, { page: 'about', icon: 'help' }];

    return (
        <DrawerContentScrollView>
            {
                User &&
                <Card.Title
                    title={`Hola, ${User.fullName.split(' ').slice(0, 1)}`}
                    titleStyle={{ fontWeight: '700' }}
                    subtitle={User.email}
                    left={() => <Avatar.Text label={User.fullName.split(' ').map(el => el[0]).join('').slice(0, 1).toUpperCase()} size={45} />}
                />
            }
            <DrawerPaper.Item
                active={0 === state.index}
                label={state.routeNames[0]}
                key={state.routeNames[0]}
                onPress={() => navigation.jumpTo(state.routeNames[0])}
                icon={'home'}
            />
            <DrawerPaper.Section title='Reportes'>
                {
                    state.routeNames.map((item, index) => {
                        const find = request.find(f => f.page === item)
                        return (
                            find && <DrawerPaper.Item
                                active={index === state.index}
                                label={find.name ?? item}
                                key={item}
                                onPress={() => navigation.jumpTo(item)}
                                icon={find.icon}
                            />
                        )
                    })
                }
            </DrawerPaper.Section>
            <DrawerPaper.Section title='Otros'>
                {
                    state.routeNames.map((item, index) => {
                        const find = others.find(f => f.page === item)
                        return (
                            find && <DrawerPaper.Item
                                active={index === state.index}
                                label={item}
                                key={item}
                                onPress={() => navigation.jumpTo(item)}
                                icon={find.icon}
                            />
                        )
                    })
                }
                <DrawerPaper.Item
                    icon={'palette'}
                    label={'Tema'}
                    onPress={changeTheme}
                    right={() => <IconButton icon={theme.dark ? 'white-balance-sunny' : 'weather-night'} onPress={changeTheme} />}
                />
            </DrawerPaper.Section>
            <DrawerPaper.Item
                icon="logout"
                label='Cerrar sesión'
                onPress={() => {
                    queryClient.clear();
                    logOut();
                }}
            />
        </DrawerContentScrollView>
    )
}
