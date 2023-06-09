import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { RootStackParamList } from '../types/types';
import { Loading } from '../components/Loading';
import { Appbar, Button, Text } from 'react-native-paper';
import { useAppSelector } from '../app/hooks';
import { NotificationContext } from '../components/Notification/NotificationtContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


type Props = NativeStackScreenProps<RootStackParamList, 'PdfScreen'>;
export const PdfScreen = ({ navigation, route: { params: { name, url } } }: Props) => {
    const { theme: { colors, dark } } = useAppSelector(state => state.theme);
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const { handleError } = useContext(NotificationContext);
    const insets = useSafeAreaInsets();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: name,
            header: ({ navigation, options: { }, back }) => {
                return (
                    <Appbar style={[dark && { backgroundColor: colors.card }]} safeAreaInsets={insets}>
                        {back && <Appbar.BackAction iconColor={colors.primary} onPress={() => navigation.goBack()} />}
                        <Appbar.Content title={name} style={[Platform.OS === 'ios' && { height: insets.top ?? 50, justifyContent: 'center' }]} />
                    </Appbar>
                )
            }
        })
    }, [navigation, dark, insets]);

    useEffect(() => {
        setLoading(true);
    }, []);

    const source = { uri: url, cache: true };

    return (
        <View style={{ flex: 1 }}>
            <Loading loading={loading} />
            {error &&
                <View style={{ width: '100%', height: '100%' }}>
                    <Text variant='titleMedium' style={{ color: colors.error, textAlign: 'center', padding: 15 }}>{error}</Text>
                    <Button style={{ alignSelf: 'center' }} icon='reload' children='recargar' mode='contained' onPress={() => { setLoading(true); setError(undefined) }} />
                </View>
            }
            {
                !error &&
                <Pdf
                    source={source}
                    onLoadComplete={(numberOfPages, filePath) => { setLoading(false) }}
                    onError={(error) => {
                        setError(String(error));
                        setLoading(false)
                        handleError(String(error));
                    }}
                    style={{ flex: 1 }}
                    trustAllCerts={false}
                />
            }
        </View>
    )
}
