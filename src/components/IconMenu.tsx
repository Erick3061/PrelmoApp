import React, { useEffect, useRef, useState } from 'react';
import { Button, ButtonProps, IconButton, Portal } from 'react-native-paper';
import { useAppSelector } from '../app/hooks';
import { Platform, Pressable, StatusBar, View } from 'react-native';
import Color from 'color';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInRight, LightSpeedInRight, SlideInRight, SlideOutRight } from 'react-native-reanimated';
import { Orientation } from '../types/types';
import { style } from '../../App';


interface IconPropsMenu {
    menu?: Array<ButtonProps>;
    disabled?: boolean;
    iconsize?: number;
}

export const IconMenu = React.forwardRef<any, IconPropsMenu>(
    ({ disabled, menu, iconsize }: IconPropsMenu, ref) => {
        const {
            theme: { theme: { colors, dark, roundness } },
            config: { orientation }
        } = useAppSelector(state => state);

        const [open, setOpen] = useState<boolean>(false);
        const size: number = 25;
        const icon = useRef<View>(null);
        const radius: number = roundness * 3;
        const backgroundColor: string = dark ? Color(colors.background).darken(.4).toString() : colors.background;

        useEffect(() => {
            setOpen(false);
        }, [orientation]);


        return (
            <>
                <IconButton
                    ref={icon}
                    size={iconsize ?? size}
                    disabled={disabled}
                    icon={open ? 'dots-horizontal-circle' : 'dots-vertical-circle'}
                    // iconColor={colors.primary}
                    onPress={() => {
                        setOpen(true);
                    }}
                />
                {
                    <Portal>
                        {
                            open &&
                            <SafeAreaView style={{ flex: 1, backgroundColor: colors.backdrop }}>
                                <StatusBar backgroundColor={colors.backdrop} />
                                <Animated.View entering={SlideInRight} exiting={SlideOutRight} style={{ flex: 1 }} pointerEvents='box-none'>
                                    <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)} />
                                    <Animated.View entering={LightSpeedInRight} style={[
                                        {
                                            position: 'absolute',
                                            top: 5,
                                            right: 15,
                                            backgroundColor: backgroundColor, padding: 10,
                                        },
                                        (orientation === Orientation.landscape) && { top: 15, right: 15 },
                                        style.shadow, { shadowColor: colors.primary, borderRadius: radius, shadowRadius: radius, elevation: 4 }
                                    ]}>
                                        {
                                            menu?.map((op, idx) => {
                                                return (
                                                    <Animated.View
                                                        entering={FadeInRight.delay(100 + ((idx + 1) * 20))}
                                                        key={idx + 1}>
                                                        <Button {...op}
                                                            onPress={(props) => {
                                                                op.onPress && op.onPress(props);
                                                                setOpen(!open);
                                                            }}
                                                        />
                                                        {Platform.OS === 'ios' && idx < menu.length - 1 && <View style={{ width: '100%', borderBottomWidth: 1, borderBottomColor: Color(colors.background).fade(.2).toString(), backgroundColor: colors.onSurface }} />}
                                                    </Animated.View>
                                                )
                                            })
                                        }
                                    </Animated.View>
                                </Animated.View>
                            </SafeAreaView>
                        }
                    </Portal>
                }
            </>
        )
    });