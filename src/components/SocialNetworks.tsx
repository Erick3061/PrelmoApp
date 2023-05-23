import Color from 'color';
import React, { useContext } from 'react';
import { Linking, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useAppSelector } from '../app/hooks';

export const SocialNetworks = () => {
    const { theme: { theme: { colors, dark } } } = useAppSelector(state => state);
    const iconColor: string = dark ? colors.primary : Color(colors.primary).darken(.3).toString();
    return (
        <View style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', paddingVertical: 5, justifyContent: 'space-evenly', width: '100%', paddingHorizontal: 10 }}>
            <IconButton iconColor={iconColor} icon='web' onPress={() => Linking.openURL('https://pem-sa.com')} />
            <IconButton iconColor={iconColor} icon='facebook' onPress={() => Linking.openURL('fb://page/557351134421255')
                .catch(() => Linking.openURL('https://www.facebook.com/PEMSA-Protecci%C3%B3n-Electr%C3%B3nica-Monterrey-SA-de-CV-557351134421255')
                    .catch(() => {
                        // dispatch(updateError({ open: true, msg: 'Error al abrir el enlace' }))
                    })
                )} />
            <IconButton iconColor={iconColor} icon='twitter' onPress={() => Linking.openURL('https://twitter.com/pemsa_85')} />
            <IconButton iconColor={iconColor} icon='instagram' onPress={() => Linking.openURL('https://instagram.com/pemsa_85/')} />
        </View>
    )
}
