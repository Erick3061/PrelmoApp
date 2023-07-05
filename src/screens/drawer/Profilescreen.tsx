import React from 'react';
import { View } from 'react-native';
import { Avatar, Button, Text, } from 'react-native-paper';
import { useAppSelector } from '../../app/hooks';
import { style } from '../../../App';
import Color from 'color';
import { useNavigation } from '@react-navigation/native';
import { RootDrawerParamList, RootStackParamList } from '../../types/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerScreenProps } from '@react-navigation/drawer';

type ResultAccountScreenProps = NativeStackNavigationProp<RootStackParamList, 'Drawer'>;
interface Props extends DrawerScreenProps<RootDrawerParamList, 'ProfileScreen'> { };

export const ProfileScreen = (props: Props) => {
    const {
        theme: { theme: { colors, roundness } },
        config: { User }
    } = useAppSelector(state => state);
    const stack = useNavigation<ResultAccountScreenProps>();


    return (
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            {
                User
                    ?
                    <View
                        style={[
                            style.shadow,
                            {
                                borderRadius: roundness,
                                backgroundColor: Color(colors.elevation.level1).lighten(.040).toString(),
                                borderWidth: 0,
                                padding: 40,
                                alignItems: 'center',
                                shadowColor: colors.primary,
                                elevation: 5
                            }
                        ]}
                    >
                        <Avatar.Text label={User.fullName.slice(0, 1)} />
                        <Text style={{ marginTop: 10, fontWeight: 'bold' }} variant='titleLarge'>{User.fullName}</Text>
                        <Text style={{ color: Color(colors.onSurface).fade(.5).toString() }}>{User.email}</Text>
                        <Button
                            style={{ marginVertical: 10 }}
                            mode='contained'
                            children='Cambiar contraseña'
                            onPress={() => stack.navigate('ChangePasswordScreen')}
                        />
                    </View>
                    : null
            }
        </View >
    )
}
