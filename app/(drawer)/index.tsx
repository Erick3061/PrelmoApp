import { SocialNetworks } from '@/components/SocialNetworks';
import { Orientation } from '@/interface/app.store.interface';
import { ThemeMode } from '@/interface/theme.store.interface';
import useAppStore from '@/utils/app.store';
import useThemeStore from '@/utils/theme.store';
import React from 'react';
import { Image, View } from 'react-native';
import { Text } from 'react-native-paper';

const Index = () => {
    const orientation = useAppStore(state => state.orientation);
    const mode = useThemeStore(state => state.mode);
    const theme = useThemeStore(state => state.theme);
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
                        mode === ThemeMode.dark ? { tintColor: theme.colors.onSurface } : { tintColor: theme.colors.primary }
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

export default Index;