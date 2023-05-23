import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, Image, ListRenderItemInfo, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Loading } from '../components/Loading';
import Color from 'color';
import RNFS from 'react-native-fs';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { MIMETypes, RootDrawerParamList } from '../types/types';
import Share from 'react-native-share';
import { Button, Portal, Text } from 'react-native-paper';
import { useAppSelector } from '../app/hooks';
import { NotificationContext } from '../components/Notification/NotificationtContext';
import { IconMenu } from '../components/IconMenu';


interface Props extends DrawerScreenProps<RootDrawerParamList, 'DownloadScreen'> { }

export const DownloadScreen = ({ navigation }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selected, setSelected] = useState<RNFS.ReadDirItem>();
    const [files, setFiles] = useState<Array<RNFS.ReadDirItem>>();

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

    const share = useCallback(async () => {
        if (selected) {
            try {
                const mime: MIMETypes = (selected.name.includes('.pdf')) ? MIMETypes.pdf : (selected.name.includes('.xlsx')) ? MIMETypes.xlsx : MIMETypes.desc;
                if (mime === MIMETypes.desc) { throw 'Error, formato de archivo no se puedo compartir' };

                let base64Data = await RNFS.readFile(selected.path, 'base64');
                base64Data = `data:${mime};base64,` + base64Data;
                await Share.open({
                    url: base64Data
                })
            } catch (error) { notification({ type: 'info', title: 'Información', text: `${error}` }) }
        }
    }, [selected]);


    const Item = ({ index, item, separators }: ListRenderItemInfo<RNFS.ReadDirItem>) => {
        const path = (item.name.split('.')[1] === 'pdf') ? require('../assets/pdf.png') : require('../assets/xls.png');
        const size: number = 35;
        return (
            <Pressable
                style={{ marginVertical: 5, flexDirection: 'row', width: '100%', height: 50, alignItems: 'center' }}
                android_ripple={{ color: Color(colors.primary).fade(.9).toString() }}
                onPress={() => item.isFile() && setSelected(item)}
            >
                {
                    item.isFile() && <Image
                        source={path}
                        style={[
                            {
                                width: size,
                                height: size,
                                resizeMode: 'contain',
                            }
                        ]}
                    />
                }
                <Text variant='labelMedium' style={{ flex: 1, paddingHorizontal: 5 }}>{item.name}</Text>
            </Pressable>
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
        Read();
    }, []);

    return (
        <View style={{ flex: 1, padding: 5 }}>
            <Loading refresh={isLoading} />
            <Text variant='labelMedium'>{directory}</Text>
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
                                onPress={share}
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