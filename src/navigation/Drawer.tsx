import { DrawerContentComponentProps, DrawerContentScrollView, createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react'
import { Orientation, RootDrawerParamList, RootStackParamList } from '../types/types';
import { HomeScreen } from '../screens/drawer/HomeScreen';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { Platform, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton, Switch, Text } from 'react-native-paper';
import { logOut } from '../features/configSlice';
import { Drawer as DrawerPapper } from 'react-native-paper';
import { DrawerActions } from '@react-navigation/native';
import { DownloadScreen } from '../screens/DownloadScreen';
import { DetailsInfoScreen } from '../screens/drawer/DetailsInfoScreen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SelectAccountScreen } from '../screens/drawer/SelectAccountScreen';
import { SelectGroupsScreen } from '../screens/drawer/SelectGroupsScreen';
import { SelectAccountsScreen } from '../screens/drawer/SelectAccountsScreen';
import { ProfileScreen } from '../screens/drawer/Profilescreen';
import { updateTheme } from '../features/themeSlice';
import { CombinedDarkTheme, CombinedDefaultTheme } from '../config/Theming';


const DrawerNav = createDrawerNavigator<RootDrawerParamList>();

interface Props extends NativeStackScreenProps<RootStackParamList, 'Drawer'> { };
export const Drawer = ({ }: Props) => {
    const AppDispatch = useAppDispatch();
    const { theme } = useAppSelector(state => state.theme);
    const { dark } = theme;
    return (
        <>
            <StatusBar backgroundColor={theme.colors.card} barStyle={theme.dark ? 'light-content' : 'dark-content'} />
            <DrawerNav.Navigator
                drawerContent={props => <MenuContent {...props} />}
                screenOptions={({ navigation, route }) => ({
                    headerLeft: ((props) => <IconButton icon='menu' onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />),
                    headerRight: () => <IconButton icon={dark ? 'white-balance-sunny' : 'weather-night'} onPress={() => {
                        !dark ? AppDispatch(updateTheme(CombinedDarkTheme))
                            : AppDispatch(updateTheme(CombinedDefaultTheme))
                    }} />
                })}
            >
                <DrawerNav.Screen name="HomeScreen" options={{ title: 'Inicio' }} component={HomeScreen} />
                <DrawerNav.Screen name="SelectAccountScreen" options={{ title: 'Individual' }} component={SelectAccountScreen} />
                <DrawerNav.Screen name="SelectGroupsScreen" options={{ title: 'Grupal' }} component={SelectGroupsScreen} />
                <DrawerNav.Screen name="SelectAccountsScreen" options={{ title: 'Avanzado' }} component={SelectAccountsScreen} />
                <DrawerNav.Screen name="DownloadScreen" options={{ title: 'Descargas' }} component={DownloadScreen} />
                <DrawerNav.Screen name="ProfileScreen" options={{ title: 'Perfil' }} component={ProfileScreen} />
                <DrawerNav.Screen name="DetailsInfoScreen" options={{ title: 'Detalles' }} component={DetailsInfoScreen} />
            </DrawerNav.Navigator >
        </>
    )
}


const MenuContent = ({ navigation, state, descriptors }: DrawerContentComponentProps) => {
    const { index, routeNames } = state;
    const {
        theme: { theme },
        config: { User, orientation }
    } = useAppSelector(state => state);
    const { colors, fonts, roundness, dark } = theme;
    const AppDispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const insets = useSafeAreaInsets();

    const changeTheme = () => {
        dark ? AppDispatch(updateTheme(CombinedDefaultTheme)) : AppDispatch(updateTheme(CombinedDarkTheme))
    }

    return (
        <View style={[
            { flex: 1 },
            Platform.OS === 'ios' && orientation === Orientation.portrait && { paddingTop: insets ? insets.top : 0 }
        ]}>
            <View style={{ padding: 10, paddingLeft: 0 }}>
                {
                    User &&
                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10, width: '100%' }}>
                        <View style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 100, height: 50, width: 50, justifyContent: 'center' }}>
                            <Text
                                variant="headlineSmall"
                                style={[
                                    {
                                        color: colors.background,
                                        textAlign: 'center'
                                    }]}
                            >{User.fullName.split(' ').map(el => el[0]).join('').slice(0, 1).toUpperCase()}</Text>
                        </View>
                        <View style={{ paddingHorizontal: 10, flex: 1 }}>
                            <Text variant='titleMedium'>Hola, <Text variant="titleMedium" style={{ fontWeight: '700' }}>{User.fullName.split(' ').slice(0, 1)}</Text></Text>
                            <Text variant="titleSmall" style={{ color: colors.outline }}>{User.email}</Text>
                            <Text variant="titleSmall" style={{ color: colors.outline }}>{User.roles}</Text>
                        </View>
                    </View>
                }
            </View>
            <DrawerContentScrollView>
                <DrawerPapper.Item
                    label='Inicio'
                    icon={'home'}
                    active={(routeNames[index] === 'HomeScreen') && true}
                    onPress={() => navigation.navigate<keyof RootDrawerParamList>("HomeScreen")}
                />
                <DrawerPapper.Section title='Consultas'>
                    <DrawerPapper.Item
                        active={routeNames[index] === 'SelectAccountScreen' && true}
                        icon={`file${routeNames[index] === 'SelectAccountScreen' ? '' : '-outline'}`}
                        label="Individual"
                        onPress={() => navigation.navigate<keyof RootDrawerParamList>('SelectAccountScreen')}
                    />
                    <DrawerPapper.Item
                        active={routeNames[index] === 'SelectGroupsScreen' && true}
                        icon={`file-multiple${routeNames[index] === 'SelectGroupsScreen' ? '' : '-outline'}`}
                        label="Grupal"
                        onPress={() => navigation.navigate<keyof RootDrawerParamList>('SelectGroupsScreen')}
                    />
                    <DrawerPapper.Item
                        active={routeNames[index] === 'SelectAccountsScreen' && true}
                        icon={`file-cog${routeNames[index] === 'SelectAccountsScreen' ? '' : '-outline'}`}
                        label="Avanzado"
                        onPress={() => navigation.navigate<keyof RootDrawerParamList>('SelectAccountsScreen')}
                    />
                </DrawerPapper.Section>
                <DrawerPapper.Section title='Otros'>
                    <DrawerPapper.Item
                        active={routeNames[index] === 'DownloadScreen' && true}
                        icon={`file-download${routeNames[index] === 'DownloadScreen' ? '' : '-outline'}`}
                        label="Descargas"
                        onPress={() => navigation.navigate<keyof RootDrawerParamList>('DownloadScreen')}
                    />
                    <DrawerPapper.Item
                        active={routeNames[index] === 'ProfileScreen' && true}
                        icon={`account-circle${routeNames[index] === 'PerfilScreen' ? '' : '-outline'}`}
                        label="Perfil"
                        onPress={() => navigation.navigate<keyof RootDrawerParamList>('ProfileScreen')}
                    />
                    <DrawerPapper.Item
                        active={routeNames[index] === 'DetailsInfoScreen' && true}
                        icon={'help'}
                        label="Acerca de Prelmo"
                        onPress={() => navigation.navigate<keyof RootDrawerParamList>('DetailsInfoScreen')}
                    />
                    <DrawerPapper.Item
                        label={'Tema'}
                        onPress={changeTheme}
                        right={() =>
                            <IconButton icon={dark ? 'white-balance-sunny' : 'weather-night'} onPress={() => {
                                !dark ? AppDispatch(updateTheme(CombinedDarkTheme))
                                    : AppDispatch(updateTheme(CombinedDefaultTheme))
                            }} />
                        }
                    />
                </DrawerPapper.Section>
                <DrawerPapper.Item
                    icon="logout"
                    label='Cerrar sesión'
                    onPress={() => {
                        queryClient.clear();
                        AppDispatch(logOut());
                    }}
                />
            </DrawerContentScrollView>
        </View>
    )
}

[]