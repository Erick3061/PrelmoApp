import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle, G } from 'react-native-svg';

export default function Donut({ percentage, radius = 35, strokeWidth = 2, color, textColor }
    : { percentage: number, radius?: number, strokeWidth?: number, color: string, textColor?: string }) {
    const circumference = 2 * Math.PI * radius;
    const halfCircle = radius + strokeWidth;

    return (
        <View style={{ width: radius * 2, height: radius * 2, justifyContent: 'center', alignItems: 'center' }}>
            <Svg
                fill={'transparent'}
                height={radius * 2}
                width={radius * 2}
                viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
                <G transform={`rotate(-90 ${halfCircle} ${halfCircle})`}>
                    <Circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDashoffset={circumference - (circumference * percentage) / 100}
                        strokeDasharray={circumference}
                    />
                    <Circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinejoin="round"
                        strokeOpacity={.2}
                    />
                </G>
            </Svg>
            <Text
                style={[
                    StyleSheet.absoluteFillObject,
                    {
                        flex: 1, justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '40%',
                        fontSize: Platform.OS === 'ios' ? radius / 3.5 : radius / 3,
                        color: textColor ?? color,
                    },
                    styles.text
                ]}
            >{`${percentage < 100 ? percentage.toFixed(2) : percentage.toFixed(0)}%`}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    text: { fontWeight: '900', textAlign: 'center' },
});
