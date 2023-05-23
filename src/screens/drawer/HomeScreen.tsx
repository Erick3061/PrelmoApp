import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Orientation } from '../../types/types';
import { useAppSelector } from '../../app/hooks';
import { Text } from 'react-native-paper';
import { SocialNetworks } from '../../components/SocialNetworks';

export const HomeScreen = () => {
    const {
        theme: { theme: { dark, colors } },
        config: { orientation }
    } = useAppSelector(state => state);
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
                        { resizeMode: 'contain', width: '70%', height: 100, alignSelf: 'center' },
                        dark && { tintColor: colors.onSurface }
                    ]}
                    source={require('../../assets/prelmo.png')}
                />
            </View>
            <View style={[
                { flex: 1, justifyContent: 'center', alignItems: 'center' }
            ]}>
                <Text variant='titleLarge' style={[styles.text, { fontWeight: 'bold' }]}>central monitoreo pemsa 24hrs</Text>
                <Text variant='titleLarge' style={[styles.text, { fontWeight: 'bold' }]}>222 141 12 30</Text>
                <SocialNetworks />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        textTransform: 'uppercase',
        paddingVertical: 15,
    }
});