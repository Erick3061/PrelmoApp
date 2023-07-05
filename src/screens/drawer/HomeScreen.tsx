import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Orientation } from '../../types/types';
import { useAppSelector } from '../../app/hooks';
import { Text } from 'react-native-paper';
import { SocialNetworks } from '../../components/SocialNetworks';
import { CombinedDarkTheme, CombinedDefaultTheme } from '../../config/Theming';
import Values from 'values.js';
import { ScrollView } from 'react-native-gesture-handler';

export const HomeScreen = () => {
    const {
        theme: { theme: { dark, colors } },
        config: { orientation }
    } = useAppSelector(state => state);

    // const deg = new Values(colors.primary).all(2);
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
                        dark && { tintColor: colors.onSurface }
                    ]}
                    source={require('../../assets/prelmo2.png')}
                />
            </View>
            <View style={[
                { flex: 1, justifyContent: 'center', alignItems: 'center' }
            ]}>
                <Text variant='titleMedium' style={[styles.text]}>central monitoreo 24hrs</Text>
                <Text variant='titleMedium' style={[styles.text]}>222 141 12 30</Text>
                <SocialNetworks />
                <Text variant='labelLarge'>By PEMSA development</Text>
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