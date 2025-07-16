import { ThemeMode } from '@/interface/theme.store.interface';
import useAuthStore from '@/utils/auth.store';
import useThemeStore from '@/utils/theme.store';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { QueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Avatar, Card, Drawer as DP, IconButton } from 'react-native-paper';

export default function Layout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer drawerContent={props => <MenuContent {...props} />}>
                <Drawer.Screen name='index' options={{ title: 'Inicio' }} />
                <Drawer.Screen name='about' options={{ title: 'Acerca de Prelmo' }} />
                <Drawer.Screen name='profile' options={{ title: 'Perfil' }} />
                <Drawer.Screen name='individual' options={{ title: 'Individual' }} />
                <Drawer.Screen name='group' options={{ title: 'Grupo' }} />
                <Drawer.Screen name='custom' options={{ title: 'Avanzado' }} />
            </Drawer>
        </GestureHandlerRootView>
    );
}

const MenuContent = ({ state }: DrawerContentComponentProps) => {
    const { index, routeNames } = state;
    const User = useAuthStore(state => state.User);
    const logOut = useAuthStore(state => state.logOut);
    const mode = useThemeStore(state => state.mode);
    const updateMode = useThemeStore(state => state.updateMode);
    const router = useRouter();
    const queryClient = new QueryClient();

    const changeTheme = () => mode === ThemeMode.dark ? updateMode(ThemeMode.light) : updateMode(ThemeMode.dark);

    return (
        <DrawerContentScrollView>
            {
                User &&
                <Card.Title
                    title={`Hola, ${User.fullName.split(' ').slice(0, 1)}`}
                    titleStyle={{ fontWeight: '700' }}
                    subtitle={User.email}
                    left={(props) => <Avatar.Text label={User.fullName.split(' ').map(el => el[0]).join('').slice(0, 1).toUpperCase()} size={45} />}
                />
            }
            <DP.Item
                label='Inicio'
                icon={'home'}
                active={(routeNames[index] === 'index') && true}
                onPress={() => router.navigate('/(drawer)')}
            />
            <DP.Section title='Consultas'>
                <DP.Item
                    active={routeNames[index] === 'individual' && true}
                    icon={`file${routeNames[index] === 'SelectAccountScreen' ? '' : '-outline'}`}
                    label="Individual"
                    onPress={() => router.navigate('/(drawer)/individual')}
                />
                <DP.Item
                    active={routeNames[index] === 'group' && true}
                    icon={`file-multiple${routeNames[index] === 'SelectGroupsScreen' ? '' : '-outline'}`}
                    label="Grupal"
                    onPress={() => router.navigate('/(drawer)/group')}
                />
                <DP.Item
                    active={routeNames[index] === 'custom' && true}
                    icon={`file-cog${routeNames[index] === 'SelectAccountsScreen' ? '' : '-outline'}`}
                    label="Avanzado"
                    onPress={() => router.navigate('/(drawer)/custom')}
                />
            </DP.Section>
            <DP.Section title='Otros'>
                <DP.Item
                    active={routeNames[index] === 'downloads' && true}
                    icon={`file-download${routeNames[index] === 'DownloadScreen' ? '' : '-outline'}`}
                    label="Descargas"
                    onPress={() => router.navigate('/(drawer)/downloads')}
                />
                <DP.Item
                    active={routeNames[index] === 'profile' && true}
                    icon={`account-circle${routeNames[index] === 'PerfilScreen' ? '' : '-outline'}`}
                    label="Perfil"
                    onPress={() => router.navigate('/(drawer)/profile')}
                />
                <DP.Item
                    active={routeNames[index] === 'about' && true}
                    icon={'help'}
                    label="Acerca de Prelmo"
                    onPress={() => router.navigate('/(drawer)/about')}
                />
                <DP.Item
                    label={'Tema'}
                    onPress={changeTheme}
                    right={() => <IconButton icon={mode === ThemeMode.dark ? 'white-balance-sunny' : 'weather-night'} onPress={changeTheme} />}
                />
            </DP.Section>
            <DP.Item
                icon="logout"
                label='Cerrar sesión'
                onPress={() => {
                    queryClient.clear();
                    router.replace('/sing-in');
                    logOut();
                }}
            />
            {Platform.OS === 'ios' && <View style={{ height: 70 }} />}
        </DrawerContentScrollView>
    )
}