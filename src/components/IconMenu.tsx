import React, { useEffect, useState } from 'react';
import { Button, ButtonProps, IconButton, Menu, } from 'react-native-paper';
import { useAppSelector } from '../app/hooks';
import { Platform, View } from 'react-native';
import Color from 'color';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface IconPropsMenu {
    menu?: Array<ButtonProps>;
    disabled?: boolean;
    iconsize?: number;
}

export const IconMenu = React.forwardRef<any, IconPropsMenu>(
    ({ disabled, menu, iconsize }: IconPropsMenu, ref) => {
        const {
            theme: { theme: { colors } },
            config: { orientation }
        } = useAppSelector(state => state);

        const [open, setOpen] = useState<boolean>(false);
        const size: number = 25;

        useEffect(() => {
            setOpen(false);
        }, [orientation]);


        return (
            <Menu
                visible={open}
                onDismiss={() => { setOpen(false) }}
                anchor={<IconButton disabled={disabled} icon={open ? 'dots-horizontal-circle' : 'dots-vertical-circle'} onPress={() => setOpen(true)} size={iconsize ?? size} />}>
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
            </Menu>

        )
    });