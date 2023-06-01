import React, { useContext, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Avatar, Button, Modal, Portal, Text, IconButton, Appbar } from 'react-native-paper';
import { useAppSelector } from '../../app/hooks';
import { style } from '../../../App';
import Animated, { BounceInDown, FadeIn, FadeInDown, FadeOut, FadeOutDown, SlideInDown } from 'react-native-reanimated';
import Color from 'color';
import { NotificationContext } from '../../components/Notification/NotificationtContext';
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
    const [open, setOpen] = useState<boolean>(false);
    const { handleError } = useContext(NotificationContext);
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
                                borderRadius: roundness * 3,
                                backgroundColor: colors.background,
                                borderWidth: 0,
                                paddingHorizontal: 15,
                                paddingVertical: 30,
                                alignItems: 'center',
                            }
                        ]}
                    >
                        <Avatar.Text label={User.fullName.slice(0, 1)} />
                        <Text style={{ marginTop: 10 }} variant='titleMedium'>{User.fullName}</Text>
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
