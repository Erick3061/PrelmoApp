import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator } from 'react-native-paper';
import Animated, { Extrapolation, FadeIn, FadeOut, interpolate, interpolateColor, SlideInUp, SlideOutUp, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

const Loading = ({ loading, refresh }: { loading?: boolean, refresh?: boolean }) => {
    const offset = useSharedValue(0);
    const translate: number = .1;
    const duration: number = 600;

    const Animate = useCallback(
        () => {
            offset.value = withRepeat(withSequence(withTiming(-translate, { duration }), withTiming(translate, { duration })), 1000, true)
        },
        [offset],
    )

    const animatedStyles2 = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: interpolate(offset.value, [-translate, translate], [0, 1], { extrapolateRight: Extrapolation.CLAMP }) },
            ],
            backgroundColor: interpolateColor(offset.value, [-translate, 0, translate], ['rgb(234, 221, 255)', 'rgb(103, 80, 164)', 'rgb(234, 221, 255)'])
        };
    });

    useEffect(() => {
        Animate();
    }, [Animate]);

    return (
        loading ?
            <Animated.View entering={FadeIn} exiting={FadeOut} collapsable style={[
                { position: 'absolute', zIndex: 10, top: 0, justifyContent: 'center', alignItems: 'center' },
                loading && { width: '100%', height: '100%' },
            ]}>
                <Animated.View
                    style={[
                        { width: 25, height: 25, position: 'absolute', borderRadius: 100 },
                        animatedStyles2,
                    ]}
                /><ActivityIndicator />
            </Animated.View>
            :
            refresh
                ?
                <Animated.View entering={SlideInUp} exiting={SlideOutUp} style={[{ alignSelf: 'center', position: 'absolute', top: 10 }]}>
                    <ActivityIndicator />
                </Animated.View>
                :
                null
    )
}

export default Loading;