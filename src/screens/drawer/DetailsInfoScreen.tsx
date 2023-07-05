import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, TouchableOpacity, View } from 'react-native';
import { Orientation, RootStackParamList } from '../../types/types';
import { useAppSelector } from '../../app/hooks';
import { Text } from 'react-native-paper';
import { SocialNetworks } from '../../components/SocialNetworks';
import VersionNumber from 'react-native-version-number';


interface Props extends NativeStackScreenProps<RootStackParamList, 'DetailsInfoScreen'> { };
export const DetailsInfoScreen = ({ navigation, route }: Props) => {
    const {
        theme: { theme: { colors, dark } },
        config: { orientation }
    } = useAppSelector(state => state);
    return (
        <View
            style={[
                { flex: 1, padding: 15, alignItems: 'center', justifyContent: 'center' },
                orientation === Orientation.landscape && { flexDirection: 'row', padding: 15 }
            ]}
        >
            <View style={[
                { width: '70%', height: 100, alignSelf: 'center' },
                orientation === Orientation.landscape && {
                    width: '50%'
                }
            ]}>
                <Image
                    style={[
                        { resizeMode: 'contain', width: '100%', height: '100%', alignSelf: 'center' },
                        dark && { tintColor: colors.onSurface },
                        orientation === Orientation.landscape && {
                            width: '50%'
                        }
                    ]}
                    source={require('../../assets/prelmo.png')}
                />
            </View>
            <View style={[
                orientation === Orientation.landscape && {
                    flex: 1,
                },
                { alignItems: 'center' }
            ]}>
                <View style={{ paddingHorizontal: 25, alignItems: 'center' }}>
                    <Text style={{ marginVertical: 10, fontWeight: '700' }} variant='titleMedium'>Versión: {VersionNumber.appVersion}</Text>
                    <Text style={{ fontWeight: 'bold' }} variant='titleSmall'>© 2021-2023 PRELMO</Text>
                    <Text style={{ fontWeight: 'bold' }} variant='titleSmall'>® PRELMO</Text>
                </View>
                <SocialNetworks />
                <Text variant='labelLarge' style={[{ fontWeight: 'bold' }]}>By PEMSA development</Text>
                <TouchableOpacity style={{ marginVertical: 15 }} onPress={() => navigation.navigate('TCAP')} >
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }} variant='titleMedium'>Términos, condiciones y aviso de privacidad</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
