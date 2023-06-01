import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, TouchableOpacity, View } from 'react-native';
import { Orientation, RootStackParamList } from '../../types/types';
import { useAppSelector } from '../../app/hooks';
import { Text } from 'react-native-paper';
import { SocialNetworks } from '../../components/SocialNetworks';

interface Props extends NativeStackScreenProps<RootStackParamList, 'DetailsInfoScreen'> { };
export const DetailsInfoScreen = ({ navigation, route }: Props) => {
    const {
        theme: { theme: { colors, dark } },
        config: { orientation }
    } = useAppSelector(state => state);
    return (
        <View
            style={[
                { flex: 1, justifyContent: 'space-evenly', padding: 15 },
                orientation === Orientation.landscape && { flexDirection: 'row', padding: 15 }
            ]}
        >
            <Image
                style={[
                    { resizeMode: 'contain', width: '70%', height: 100, alignSelf: 'center' },
                    dark && { tintColor: colors.onSurface },
                    orientation === Orientation.landscape && {
                        width: '50%'
                    }
                ]}
                source={require('../../assets/prelmo.png')}
            />
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <View style={{ paddingHorizontal: 25 }}>
                    <Text variant='titleSmall' style={[, { paddingVertical: 10, textAlign: 'center' }]}>Versión: 1.0</Text>
                    <Text variant='titleSmall' style={[, { paddingVertical: 10, }]}>© 2021-2023 Protección Electrónica Monterrey S.A. de C.V</Text>
                    <Text variant='titleSmall' style={[, { paddingVertical: 10, }]}>® Protección Electrónica Monterrey S.A. de C.V</Text>
                    <TouchableOpacity style={{ marginVertical: 15 }} onPress={() => navigation.navigate('TCAP')} >
                        <Text variant='titleMedium' style={{ textAlign: 'center' }}>Términos y condiciones y aviso de privacidad</Text>
                    </TouchableOpacity>
                </View>
                <SocialNetworks />
            </View>
        </View>
    )
}
