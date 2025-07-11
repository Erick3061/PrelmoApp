import { NotificationContext } from '@/utils/NotificationtContext';
import React, { useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Card, IconButton, Portal, Surface } from 'react-native-paper';
import Animated, { LightSpeedInRight, SlideOutRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Notification = () => {
    const { show, content, closeNot, autoClose, timeOut } = useContext(NotificationContext);

    useEffect(() => {
        if (content && autoClose) {
            const close = setTimeout(() => {
                closeNot();
            }, timeOut);
            return () => {
                clearTimeout(close);
            }
        }
    }, [content, autoClose, timeOut, closeNot]);

    return (
        <Portal>
            <SafeAreaView style={{ alignItems: 'center' }} pointerEvents='box-none'>
                {
                    (show && content) &&
                    <Animated.View
                        entering={LightSpeedInRight}
                        exiting={SlideOutRight}
                        style={[styles.containerNot]}
                    >
                        <Surface elevation={4}>
                            <Card.Title
                                title={content.title}
                                subtitle={content.text}
                                left={(props) => <Avatar.Icon {...props} icon="alert" />}
                                right={(props) => <IconButton {...props} icon="close" onPress={closeNot} />}
                            />
                        </Surface>
                    </Animated.View>
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
        paddingHorizontal: 10,

    },
    surface: {
        padding: 8,
        height: 80,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
