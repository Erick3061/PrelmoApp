import { SocialNetworks } from '@/components/SocialNetworks'
import { Orientation } from '@/interface/app.store.interface'
import { ThemeMode } from '@/interface/theme.store.interface'
import useAppStore from '@/utils/app.store'
import useThemeStore from '@/utils/theme.store'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { Text } from 'react-native-paper'

const About = () => {
    const orientation = useAppStore(store => store.orientation);
    const mode = useThemeStore(state => state.mode);
    const router = useRouter();

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
                        mode === ThemeMode.dark && { tintColor: 'gray' },
                        orientation === Orientation.landscape && {
                            width: '50%'
                        }
                    ]}
                    source={require('../../assets/images/prelmo.png')}
                />
            </View>
            <View style={[
                orientation === Orientation.landscape && {
                    flex: 1,
                },
                { alignItems: 'center' }
            ]}>
                <View style={{ paddingHorizontal: 25, alignItems: 'center' }}>
                    <Text style={{ marginVertical: 10, fontWeight: '700' }} variant='titleMedium'>Versión: </Text>
                    <Text style={{ fontWeight: 'bold' }} variant='titleSmall'>© 2021-2023 PRELMO</Text>
                    <Text style={{ fontWeight: 'bold' }} variant='titleSmall'>® PRELMO</Text>
                </View>
                <SocialNetworks />
                <Text variant='labelLarge' style={[{ fontWeight: 'bold' }]}>By PEMSA development</Text>
                <TouchableOpacity style={{ marginVertical: 15 }} onPress={() => router.navigate('/tcap')} >
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }} variant='titleMedium'>Términos, condiciones y aviso de privacidad</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default About