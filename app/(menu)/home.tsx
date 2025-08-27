import { SocialNetworks } from '@/components/SocialNetworks';
import { Orientation } from '@/interface/app.store.interface';
import useAppStore from '@/utils/app.store';
import useThemeStore from '@/utils/theme.store';
import React from 'react';
import { Image, View } from 'react-native';
import { Text } from 'react-native-paper';

export default function Home() {
    const orientation = useAppStore(state => state.orientation);
    const { theme } = useThemeStore();

    return (
        <View style={[
            { flex: 1, justifyContent: 'space-around' },
            orientation === Orientation.landscape && {
                flexDirection: 'row'
            }
        ]}>
            <View style={[
                { flex: 1, justifyContent: 'flex-end' },
                orientation === Orientation.landscape && {
                    justifyContent: 'center'
                }
            ]}>
                <Image
                    style={[
                        { resizeMode: 'contain', width: '70%', height: '20%', alignSelf: 'center' },
                        theme.dark ? { tintColor: theme.colors.onSurface } : { tintColor: theme.colors.primary }
                    ]}
                    source={require('../../assets/images/prelmo2.png')}
                />
            </View>
            <View style={[
                { flex: 1, justifyContent: 'center', alignItems: 'center' }
            ]}>
                <Text variant='labelLarge'>By PEMSA development</Text>
                <SocialNetworks />
                <Text variant='titleMedium'>central monitoreo 24hrs</Text>
                <Text variant='titleMedium'>222 141 12 30</Text>
            </View>
        </View>
    )
}
