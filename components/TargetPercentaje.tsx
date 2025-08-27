import useThemeStore from '@/utils/theme.store';
import Color from 'color';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { IconButton, Surface, Text } from 'react-native-paper';
import Donut from './Donut';

interface Props {
    percentage?: number;
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
export const TargetPercentaje = ({ percentage, icon, text, textLarge, style, amount }: Props) => {
    const theme = useThemeStore(state => state.theme);
    return (
        <Surface style={[{ padding: 5, width: 130, height: 90, justifyContent: 'space-between', alignItems: 'center', borderRadius: 10, margin: 5 }, style]}>
            <IconButton
                size={15}
                icon={icon ? icon.name : 'home'}
                iconColor={icon ? theme.dark ? Color(icon?.backgroundColor).lighten(.1).hex() : Color(icon?.backgroundColor).darken(.4).hex() : undefined}
                style={{ padding: 0, margin: 0, position: 'absolute', top: 0, left: 0 }}
            />
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: 10, marginTop: 10 }}>
                {amount && (
                    <Text
                        variant="labelSmall">
                        {amount}
                    </Text>
                )}
                <Donut radius={20} color={theme.dark ? Color(icon?.backgroundColor).lighten(.1).hex() : Color(icon?.backgroundColor).darken(.4).hex() ?? theme.colors.primary} percentage={percentage ?? 0} strokeWidth={5} />
            </View>
            <Text variant='labelSmall' style={{ textAlign: 'center', fontWeight: 'bold', color: theme.dark ? Color(icon?.backgroundColor).lighten(.2).hex() : Color(icon?.backgroundColor).darken(.5).hex() }}>{textLarge}</Text>
        </Surface>
    )
}
