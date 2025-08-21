import { ThemeMode } from '@/interface/theme.store.interface';
import useThemeStore from '@/utils/theme.store';
import React from 'react';
import { Linking, View } from 'react-native';
import { IconButton } from 'react-native-paper';

export const SocialNetworks = () => {
    const theme = useThemeStore(state => state.theme);
    const mode = useThemeStore(state => state.mode);
    const iconColor: string = mode === ThemeMode.light ? theme.colors.primary : theme.colors.onSurface;
    const size: number = 30;
    return (
        <View style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', paddingVertical: 15, justifyContent: 'space-evenly', width: '100%', paddingHorizontal: 10, marginBottom: 10 }}>
            <IconButton iconColor={iconColor} size={size} icon='web' onPress={() => Linking.openURL('https://pem-sa.com')} />
            <IconButton iconColor={iconColor} size={size} icon='facebook' onPress={() => Linking.openURL('fb://page/557351134421255')
                .catch(() => Linking.openURL('https://www.facebook.com/PEMSA-Protecci%C3%B3n-Electr%C3%B3nica-Monterrey-SA-de-CV-557351134421255')
                    .catch(() => {
                        // dispatch(updateError({ open: true, msg: 'Error al abrir el enlace' }))
                    })
                )} />
            <IconButton iconColor={iconColor} size={size} icon='twitter' onPress={() => Linking.openURL('https://twitter.com/pemsa_85')} />
            <IconButton iconColor={iconColor} size={size} icon='instagram' onPress={() => Linking.openURL('https://instagram.com/pemsa_85/')} />
        </View>
    )
}
