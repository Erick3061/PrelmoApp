import React from 'react';
import { Linking, View } from 'react-native';
import { IconButton } from 'react-native-paper';

export const SocialNetworks = () => {
    // const iconColor: string = dark ? colors.primary : Color(colors.primary).darken(.3).toString();
    const size: number = 30;
    return (
        <View style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', paddingVertical: 5, justifyContent: 'space-evenly', width: '100%', paddingHorizontal: 10, marginBottom: 10 }}>
            <IconButton size={size} icon='web' onPress={() => Linking.openURL('https://pem-sa.com')} />
            <IconButton size={size} icon='facebook' onPress={() => Linking.openURL('fb://page/557351134421255')
                .catch(() => Linking.openURL('https://www.facebook.com/PEMSA-Protecci%C3%B3n-Electr%C3%B3nica-Monterrey-SA-de-CV-557351134421255')
                    .catch(() => {
                        // dispatch(updateError({ open: true, msg: 'Error al abrir el enlace' }))
                    })
                )} />
            <IconButton size={size} icon='twitter' onPress={() => Linking.openURL('https://twitter.com/pemsa_85')} />
            <IconButton size={size} icon='instagram' onPress={() => Linking.openURL('https://instagram.com/pemsa_85/')} />
        </View>
    )
}
