import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import Pdf from 'react-native-pdf';
import { RootStackParamList } from '../types/types';
import { Loading } from '../components/Loading';
import { Button, Text } from 'react-native-paper';
import { useAppSelector } from '../app/hooks';
import { NotificationContext } from '../components/Notification/NotificationtContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PdfScreen'>;
export const PdfScreen = ({ navigation, route: { params: { name, url } } }: Props) => {
    const { theme: { colors, dark } } = useAppSelector(state => state.theme);
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const { handleError } = useContext(NotificationContext);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: name,
        })
    }, [navigation, dark]);

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
                    onLoadComplete={() => { setLoading(false) }}
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