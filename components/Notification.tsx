import useNotificationStore from '@/utils/notification.store';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Card, IconButton, Portal, Text } from 'react-native-paper';
import Animated, { LightSpeedInRight, SlideOutRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Notification = () => {
    const show = useNotificationStore(state => state.show);
    const content = useNotificationStore(state => state.content);
    const autoClose = useNotificationStore(state => state.autoClose);
    const timeOut = useNotificationStore(state => state.timeOut);
    const closeNot = useNotificationStore(state => state.closeNot);

    useEffect(() => {
        if (content && autoClose) {
            const close = setTimeout(() => {
                closeNot();
            }, timeOut);
            return () => {
                clearTimeout(close);
            }
        }
    }, [content, closeNot, autoClose, timeOut]);

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
                        <Card>
                            <Card.Title
                                title={content.title}
                                subtitle={content.subtitle}
                                left={(props) =>
                                    (content.type === 'error') ?
                                        <Avatar.Icon {...props} icon="alert-circle"
                                        />
                                        : undefined
                                }
                                right={(props) => <IconButton {...props} icon="close" onPress={closeNot} />}
                            />
                            <Card.Content>
                                <Text>{content.text}</Text>
                            </Card.Content>
                        </Card>
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
