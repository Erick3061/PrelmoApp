import Loading from '@/components/Loading';
import { useReport } from '@/hooks/useReports';
import { Account, Alarm, AP, APCI, Bat, CI, Events, filterEvents, otros, Prue, TypeReport } from '@/interface/hooks.interface';
import useThemeStore from '@/utils/theme.store';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import Color from 'color';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, RefreshControl, View } from 'react-native';
import { Surface, Text, ToggleButton } from 'react-native-paper';


const ResultAccount = () => {
  const { account, start, end, report, typeAccount } = useLocalSearchParams();
  const parsedAccount: Account = typeof account === 'string' ? JSON.parse(account) : account;
  const parsedStart: string = String(start);
  const parsedEnd: string = String(end);
  const parsedReport: TypeReport = report as TypeReport
  const parsedTypeAccount: number = +typeAccount;
  const [filter, setFilter] = useState<filterEvents>('ALL');
  const theme = useThemeStore(state => state.theme);

  const { data, isLoading, isFetching, refetch } = useReport({
    accounts: [parseInt(parsedAccount.CodigoCte)],
    dateStart: parsedStart,
    dateEnd: parsedEnd,
    type: parsedReport,
    typeAccount: parsedTypeAccount,
    key: String(parsedAccount.CodigoCte),
  });

  const pages: {
    title: string;
    key: filterEvents;
    nameIcon: string;
    color?: string;
  }[] =
    report === 'ap-ci'
      ? [
        { title: 'Todos', key: 'ALL', nameIcon: 'check-all', color: theme.colors.primary },
        { title: 'Aperturas', key: 'AP', nameIcon: 'lock-open', color: '#3acf9e' },
        { title: 'Cierres', key: 'CI', nameIcon: 'lock', color: '#ff7782' },
      ]
      : [
        { title: 'Todos', key: 'ALL', nameIcon: 'check-all', color: theme.colors.primary },
        { title: 'Ap/Ci', key: 'APCI', nameIcon: 'shield', color: '#3acf9e' },
        { title: 'Alarmas', key: 'Alarm', nameIcon: 'bell', color: '#ff7782' },
        { title: 'Pruebas', key: 'Prue', nameIcon: 'cog', color: '#2bcadf' },
        { title: 'Baterias', key: 'Bat', nameIcon: 'battery', color: '#dfd32b' },
        { title: 'Otros', key: 'otros', nameIcon: 'help-circle', color: '#977220' },
      ];

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Events>) => (
      <Surface style={{ padding: 8, elevation: 5, borderRadius: 8, marginHorizontal: 10, marginVertical: 5 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text variant="labelLarge">{item.DescripcionEvent}</Text>
            <Text variant="labelSmall" style={{ textAlignVertical: 'top', marginRight: 5 }}>
              {item.FechaOriginal} {item.Hora}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text variant="labelSmall">Partición: {item.Particion}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 5,
          }}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={{ flex: 1 }}
            variant="labelSmall">
            {`${item.DescripcionZona} ${item.NombreUsuario}`.split('')
              .length <= 1
              ? 'Sistema / Llavero'
              : `${item.DescripcionZona} ${item.NombreUsuario}`}
          </Text>
          <Text variant="labelSmall">
            # {item.CodigoUsuario} {item.CodigoZona}
          </Text>
        </View>
      </Surface>
    ), []);

  const _renderData = useCallback(
    (filter?: filterEvents) => {
      if (data && data.cuentas) {
        if (data.cuentas.length === 1) {
          const { eventos }: Account = data.cuentas[0];
          let Events = eventos ?? [];

          if (filter) {
            switch (filter) {
              case 'AP':
                Events = Events.filter(f =>
                  AP.find(ff => ff === f.CodigoAlarma),
                );
                break;
              case 'CI':
                Events = Events.filter(f =>
                  CI.find(ff => ff === f.CodigoAlarma),
                );
                break;
              case 'APCI':
                Events = Events.filter(f =>
                  APCI.find(ff => ff === f.CodigoAlarma),
                );
                break;
              case 'Alarm':
                Events = Events.filter(f =>
                  Alarm.find(ff => ff === f.CodigoAlarma),
                );
                break;
              case 'Prue':
                Events = Events.filter(f =>
                  Prue.find(ff => ff === f.CodigoAlarma),
                );
                break;
              case 'Bat':
                Events = Events.filter(f =>
                  Bat.find(ff => ff === f.CodigoAlarma),
                );
                break;
              case 'otros':
                Events = Events.filter(f =>
                  otros.find(ff => ff === f.CodigoAlarma),
                );
                break;
            }
          }

          return (
            <FlashList
              data={Events}
              renderItem={renderItem}
              keyExtractor={(_, idx) => `${idx}`}
              removeClippedSubviews={true}
              estimatedItemSize={100}
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                if (isFetching) return;
                refetch();
              }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={() => refetch()}
                />
              }
            />
          );
        } else {
          return <Text>more accounts</Text>;
        }
      }
      return undefined;
    },
    [data, isFetching, refetch, renderItem],
  );

  useEffect(() => {
    return () => {
    }
  }, [data,])

  return (
    <>
      <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
        <Text variant="titleSmall">
          <View
            style={{
              width: 3,
              height: Platform.OS === 'ios' ? 13 : 11,
              // backgroundColor: colors.primary,
            }}
          />{' '}
          {parsedAccount.Nombre}
        </Text>
        <Text variant="labelSmall">
          <View
            style={{ width: 3, height: 10, /* backgroundColor: colors.primary */ }}
          />{' '}
          Entre las fechas {start} a {end}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        {_renderData(filter)}
      </View>
      <ToggleButton.Row onValueChange={() => { }} value={''} style={{ justifyContent: 'center', marginBottom: 15, marginTop: 10 }}>
        {
          pages.map((p) => (
            <ToggleButton
              key={p.key}
              value={p.key}
              icon={p.nameIcon}
              iconColor={p.color ?? '#000'}
              status={filter === 'ALL' ? 'checked' : filter === p.key ? 'checked' : 'unchecked'}
              onPress={() => setFilter(p.key)}
              rippleColor={Color(p.color).lighten(.5).hex()}
            />
          ))
        }
      </ToggleButton.Row>
      <Loading loading={isLoading} refresh={isFetching} />
    </>
  );
}

export default ResultAccount