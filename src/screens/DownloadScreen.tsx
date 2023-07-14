import React, { Suspense, useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, FlatList, ListRenderItemInfo, Pressable, RefreshControl, StyleSheet, View, Animated as NativeAnimated } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Loading } from '../components/Loading';
import RNFS from 'react-native-fs';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { MIMETypes, RootDrawerParamList, RootStackParamList } from '../types/types';
import Share from 'react-native-share';
import { Button, IconButton, Portal, Text } from 'react-native-paper';
import { useAppSelector } from '../app/hooks';
import { NotificationContext } from '../components/Notification/NotificationtContext';
import { IconMenu } from '../components/IconMenu';
import { useIsFocused } from '@react-navigation/native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import FileViewer from "react-native-file-viewer";


interface Props extends DrawerScreenProps<RootDrawerParamList, 'DownloadScreen'> { }

export const DownloadScreen = ({ navigation }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selected, setSelected] = useState<RNFS.ReadDirItem>();
    const [files, setFiles] = useState<Array<RNFS.ReadDirItem>>();
    const focused = useIsFocused();


    const {
        theme: { theme: { colors, roundness } },
        config: { directory }
    } = useAppSelector(state => state);

    const { notification, handleError } = useContext(NotificationContext);
    const focus = navigation.isFocused();

    const Read = async () => {
        try {
            setIsLoading(true);
            const readed = await RNFS.readDir(directory);
            setFiles(readed.reverse());
        } catch (error) {
            handleError(String(error))
        }
        finally {
            setIsLoading(false);
        }
    }

    const share = useCallback(async (item?: RNFS.ReadDirItem) => {
        const select = selected ?? item!;
        if (select) {
            try {
                const mime: MIMETypes = (select.name.includes('.pdf')) ? MIMETypes.pdf : (select.name.includes('.xlsx')) ? MIMETypes.xlsx : MIMETypes.desc;
                if (mime === MIMETypes.desc) { throw 'Error, formato de archivo no se puedo compartir' };

                let base64Data = await RNFS.readFile(select.path, 'base64');
                base64Data = `data:${mime};base64,` + base64Data;
                await Share.open({
                    url: base64Data
                })
            } catch (error) {
                // notification({ type: 'info', title: 'Información', text: `${error}` })
            }
        }
    }, [selected]);

    const renderLeftActions = (
        _progress: NativeAnimated.AnimatedInterpolation<number>,
        dragX: NativeAnimated.AnimatedInterpolation<number>,
        item: RNFS.ReadDirItem
    ) => {
        const scale = dragX.interpolate({
            inputRange: [-80, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });
        return (
            <NativeAnimated.View style={{ flexDirection: 'row', transform: [{ scale }] }}>
                {<IconButton icon={'delete'} iconColor={colors.error} onPress={async () => {
                    await RNFS.unlink(item.path);
                    Read();
                }} />}
                {<IconButton disabled={!item.isFile()} icon={'share-variant'} onPress={() => share(item)} />}
            </NativeAnimated.View>
        );
    };


    const Item = ({ item }: ListRenderItemInfo<RNFS.ReadDirItem>) => {
        const acron = item.name.split('.')[1];
        let icon: string = '';
        let color: string = colors.primary;
        if (acron === 'pdf') {
            icon = 'file-pdf-box';
            color = colors.danger;
        } else if (acron === 'xlsx') {
            icon = 'file-excel-box';
            color = colors.success;
        };

        return (
            <Swipeable
                friction={2}
                leftThreshold={80}
                enableTrackpadTwoFingerGesture
                rightThreshold={40}
                renderRightActions={(progress, drag, swioeable) => renderLeftActions(progress, drag, item)}
            >
                <Pressable
                    style={{ marginVertical: 5, flexDirection: 'row', width: '100%', height: 50, alignItems: 'center' }}
                    android_ripple={{ color: colors.elevation.level2 }}
                    onLongPress={() => item.isFile() && setSelected(item)}
                    onPress={async () => {
                        if (item.isFile()) {
                            const mime: MIMETypes = (item.name.includes('.pdf')) ? MIMETypes.pdf : (item.name.includes('.xlsx')) ? MIMETypes.xlsx : MIMETypes.desc;
                            if (mime === MIMETypes.desc) { Alert.alert('Error', 'formato de archivo no se puede abrir') };
                            FileViewer.open(item.path)
                        }
                    }}
                >
                    <IconButton icon={item.isFile() ? icon : 'folder'} size={45} iconColor={color} style={{ padding: 0, margin: 0 }} />
                    <View style={{ justifyContent: 'center', flex: 1, marginRight: 15 }}>
                        <Text variant='labelMedium' numberOfLines={1}>{item.name}</Text>
                        <Text variant='labelSmall' numberOfLines={1}>{`${item.mtime}`}</Text>
                    </View>
                </Pressable>
            </Swipeable>
        );
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Descargas',
            headerRight(props) {
                return (
                    <View style={{ marginHorizontal: 10 }}>
                        <IconMenu
                            menu={[
                                {
                                    children: 'Ver directorio',
                                    icon: 'folder',
                                    onPress() {
                                        Alert.alert('Directorio', directory);
                                    },
                                    contentStyle: { justifyContent: 'space-between' }
                                },
                                {
                                    children: 'Actualizar',
                                    icon: 'refresh',
                                    onPress() {
                                        Read();
                                    },
                                    contentStyle: { justifyContent: 'space-between' }
                                },
                            ]}
                        />
                    </View>
                )
            },
        })
    }, [navigation]);

    useEffect(() => {
        Read();
    }, [focus]);

    useEffect(() => {
        focused && Read();
    }, [focused]);

    return (
        <View style={{ flex: 1, padding: 5 }}>
            <Loading refresh={isLoading} />
            {/* <Text variant='labelMedium'>{directory}</Text> */}
            <FlatList
                data={files}
                ItemSeparatorComponent={() => <View style={[{ backgroundColor: colors.border, height: StyleSheet.hairlineWidth, }]} />}
                renderItem={Item}
                keyExtractor={(_item, index) => `file-${index}`}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={Read} />}
            />
            <Portal>
                {
                    selected &&
                    <View style={{ flex: 1, backgroundColor: colors.backdrop, justifyContent: 'center', alignItems: 'center' }} >
                        <Pressable style={{ width: '100%', height: '100%' }} onPress={() => setSelected(undefined)} />
                        <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={[{ shadowColor: colors.primary }, { backgroundColor: colors.background, position: 'absolute', padding: 15, borderRadius: roundness * 2, width: '80%' }]}>
                            <Text variant='titleSmall' style={{ marginBottom: 10 }}>{selected.name}</Text>
                            <Button
                                contentStyle={{ justifyContent: 'space-between', flexDirection: 'row-reverse' }}
                                style={[styles.btnMenu]}
                                children={'Eliminar'}
                                icon={'delete'}
                                onPress={async () => {
                                    try {
                                        await RNFS.unlink(selected.path);
                                        notification({ type: 'success', title: 'Archivo eliminado', subtitle: selected.name });
                                        setSelected(undefined);
                                        Read();

                                    } catch (error) { handleError(String(error)) }
                                }}
                            />
                            <Button
                                contentStyle={{ justifyContent: 'space-between', flexDirection: 'row-reverse' }}
                                style={[styles.btnMenu]}
                                children={'Compartir'}
                                icon={'share-variant'}
                                onPress={() => share()}
                            />
                        </Animated.View>
                    </View>
                }
            </Portal>
        </View >
    )
};

const styles = StyleSheet.create({
    btnMenu: {
        marginVertical: 10
    }
});