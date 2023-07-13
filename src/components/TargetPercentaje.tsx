import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native'
import { useAppSelector } from '../app/hooks';
import Donut from './Donut';
import { style as StyleApp } from '../../App';
import { Text, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
    percentage?: number;
    max: number;
    icon?: {
        name: string;
        backgroundColor?: string;
        colorIcon?: string;
    }
    text: string;
    textLarge?: string;
    style?: StyleProp<ViewStyle>;
    amount?: number | string;
}
export const TargetPercentaje = ({ max, percentage, icon, text, textLarge, style, amount }: Props) => {
    const { theme: { theme: { colors, roundness } } } = useAppSelector(state => state);
    return (
        <View style={[StyleApp.shadow, {
            padding: 10,
            backgroundColor: colors.card, alignItems: 'center', margin: 5,
            shadowColor: colors.primary,
            borderRadius: roundness * 2, width: 140,
        }]}>
            <IconButton size={15} icon={icon ? icon.name : 'home'} iconColor={icon ? icon.backgroundColor : undefined} style={{ margin: 0, padding: 0, alignSelf: 'flex-start', position: 'absolute' }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                <Donut radius={25} color={colors.primary} max={max} percentage={percentage ?? 0} strokeWidth={5} />
                <View style={{ marginHorizontal: 5, alignItems: 'center' }}>
                    <Text variant='labelSmall' style={[{ color: colors.text, fontWeight: 'bold' }]}>{text}</Text>
                    {amount && <Text variant='labelSmall' style={[{ marginVertical: 2, fontWeight: '700' }]}>{amount}</Text>}
                </View>
            </View>
            <Text variant='labelSmall' style={{ textAlign: 'center' }}>{textLarge}</Text>
        </View>
    )
}
