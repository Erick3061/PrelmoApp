import React, { useContext, useEffect } from 'react';
import Animated, { LightSpeedInRight, SlideOutRight, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Color from 'color';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Portal, IconButton, Text } from 'react-native-paper';
import { useAppSelector } from '../../app/hooks';
import { NotificationContext } from './NotificationtContext';
import { style } from '../../../App';

export const Notification = () => {
    const { show, content, closeNot, autoClose, timeOut, updateAutoClose } = useContext(NotificationContext);
    const { theme: { colors, dark, roundness } } = useAppSelector(state => state.theme);
    const backgroundColor: string = dark ? Color(colors.background).darken(.4).toString() : colors.background;
    const { top } = useSafeAreaInsets();

    const x = useSharedValue(0);

    const eventHandler = useAnimatedGestureHandler({
        onActive: ({ translationX }) => {
            x.value = translationX;
        },
    });

    const _style = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: x.value }]
        }
    });

    useEffect(() => {
        if (content && autoClose) {

            const close = setTimeout(() => {
                closeNot();
            }, timeOut);

            return () => {
                clearTimeout(close);
            }

        }
    }, [content, autoClose, timeOut]);

    return (
        <Portal>
            <SafeAreaView style={{ flex: 1, alignItems: 'center' }} pointerEvents='box-none'>
                {
                    (show && content) &&
                    <PanGestureHandler
                        onGestureEvent={eventHandler}
                        onEnded={closeNot}
                    >
                        <Animated.View entering={LightSpeedInRight}
                            exiting={SlideOutRight}
                            style={[
                                style.shadow,
                                styles.containerNot,
                                {
                                    backgroundColor,
                                    borderRadius: roundness * 2,
                                    borderLeftWidth: 4,
                                    borderColor: (content.type === 'error')
                                        ? colors.error
                                        : (content.type === 'info')
                                            ? colors.info
                                            : (content.type === 'question')
                                                ? colors.question
                                                : (content.type === 'success')
                                                    ? colors.success
                                                    : colors.warning,
                                    shadowColor: (content.type === 'error')
                                        ? colors.error
                                        : (content.type === 'info')
                                            ? colors.info
                                            : (content.type === 'question')
                                                ? colors.question
                                                : (content.type === 'success')
                                                    ? colors.success
                                                    : colors.warning,
                                    elevation: 5
                                },
                                _style
                            ]}
                        >
                            <Pressable
                                onPressIn={() => {
                                    updateAutoClose(false);
                                    x.value = 0;
                                }}
                            >
                                <View style={{ paddingRight: 40, minHeight: 40, justifyContent: 'center' }}>
                                    {content.title &&
                                        <Text
                                            variant='titleMedium'
                                            style={{ fontWeight: '700' }}
                                        >
                                            {content.title}
                                        </Text>
                                    }
                                    {content.subtitle &&
                                        <Text
                                            variant='titleSmall'
                                            style={{ fontWeight: '600' }}
                                        >
                                            {content.subtitle}
                                        </Text>
                                    }
                                    {content.text && <Text >{content.text}</Text>}
                                </View>

                            </Pressable>
                            <IconButton
                                icon='close'
                                iconColor={colors.primary}
                                style={{ position: 'absolute', right: 0, top: 0 }}
                                onPress={closeNot}
                            />
                        </Animated.View>
                    </PanGestureHandler>
                }
            </SafeAreaView>
        </Portal >
    )
}

const styles = StyleSheet.create({
    containerNot: {
        width: '95%',
        top: 10,
        paddingVertical: 5,
        paddingHorizontal: 10
    },
});
