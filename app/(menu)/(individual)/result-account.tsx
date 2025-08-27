import Loading from '@/components/Loading';
import { TargetPercentaje } from '@/components/TargetPercentaje';
import { useReport } from '@/hooks/useReports';
import { Orientation } from '@/interface/app.store.interface';
import { Account, Alarm, AP, APCI, Bat, CI, Events, filterEvents, otros, Percentajes, Prue, TypeReport } from '@/interface/hooks.interface';
import useAppStore from '@/utils/app.store';
import useThemeStore from '@/utils/theme.store';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import Color from 'color';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Appbar, Surface, Text, ToggleButton } from 'react-native-paper';


const ResultAccount = () => {
  const { account, start, end, report, typeAccount } = useLocalSearchParams();
  const parsedAccount: Account = typeof account === 'string' ? JSON.parse(account) : account;
  const parsedStart: string = String(start);
  const parsedEnd: string = String(end);
  const parsedReport: TypeReport = report as TypeReport
  const parsedTypeAccount: number = +typeAccount;
  const [filter, setFilter] = useState<filterEvents>('ALL');
  const theme = useThemeStore(state => state.theme);
  const orientation = useAppStore(state => state.orientation);
  const router = useRouter();
  const navigation = useNavigation();

  const { data, isLoading, isFetching, refetch } = useReport({
    accounts: [parseInt(parsedAccount.CodigoCte)],
    dateStart: parsedStart,
    dateEnd: parsedEnd,
    type: parsedReport,
    typeAccount: parsedTypeAccount,
    key: String(parsedAccount.CodigoCte),
  });

  const pages: { title: string; key: filterEvents; nameIcon: string; color?: string; }[] =
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

  const _renderPercentajes = useCallback(() => {
    const Percentajes = (percentajes: Percentajes) => {
      {
        return Object.entries(percentajes).map((el, idx) => {
          const { label, total, percentaje, text, events } = el[1];
          const title: string = label ?? el[0];
          return (
            <TargetPercentaje
              key={JSON.stringify(el)}
              text={title}
              amount={`${events}/${total}`}
              percentage={percentaje}
              textLarge={text}
              icon={
                el[0] === 'Aperturas'
                  ? { name: 'lock-open', backgroundColor: '#3acf9e' }
                  : el[0] === 'Cierres'
                    ? { name: 'lock', backgroundColor: '#ff7782' }
                    : el[0] === 'APCI'
                      ? { name: 'shield', backgroundColor: '#3acf9e' }
                      : el[0] === 'Alarma'
                        ? { name: 'bell', backgroundColor: '#ff7782' }
                        : el[0] === 'Pruebas'
                          ? { name: 'cog', backgroundColor: '#2bcadf' }
                          : el[0] === 'Battery'
                            ? { name: 'battery', backgroundColor: '#dfd32b' }
                            : { name: 'help-circle', backgroundColor: '#977220' }
              }
            />
          );
        });
      }
    };

    if (data && data.cuentas) {
      if (data.cuentas.length === 1) {
        const { percentajes } = data;
        if (percentajes)
          return (
            <View style={{ marginHorizontal: 10 }}>
              {report === 'ap-ci' ? (
                <View
                  style={{
                    flexDirection:
                      orientation === Orientation.portrait ? 'row' : 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {Percentajes(percentajes)}
                </View>
              ) : (
                <ScrollView
                  horizontal={orientation === Orientation.portrait}
                  alwaysBounceHorizontal={orientation === Orientation.portrait}
                  showsHorizontalScrollIndicator={false}>
                  {Percentajes(percentajes)}
                </ScrollView>
              )}
            </View>
          );
        else return undefined;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }, [data, orientation, report]);


  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Events>) => (
      <Surface style={{ padding: 8, elevation: 1, borderRadius: 8, marginHorizontal: 10, marginVertical: 5 }}>
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
              estimatedItemSize={Events.length ?? 0}
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
    [data, refetch, renderItem],
  );

  const Header = useCallback(
    () => (
      <Appbar.Header mode='medium'>
        <Appbar.BackAction onPress={router.back} />
        <Appbar.Content title={
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30 }}>
            <View style={{ flex: 1 }}>
              <Text variant="titleSmall" numberOfLines={1} style={{ fontWeight: 'bold' }}> {parsedAccount.Nombre} </Text>
              <Text variant="labelSmall"> Entre las fechas:</Text>
              <Text variant="labelSmall"> {start} a {end} </Text>
            </View>
          </View>
        } />
        <Appbar.Action icon="refresh" onPress={() => refetch()} />
      </Appbar.Header>
    ),
    [end, parsedAccount.Nombre, refetch, router.back, start],
  )

  useEffect(() => {
    navigation.setOptions({
      header: () => <Header />
    });
  }, [Header, navigation])

  return (
    <View style={{ flex: 1 }}>
      {_renderPercentajes()}
      {_renderData(filter)}
      <ToggleButton.Row onValueChange={() => { }} value='' style={{ justifyContent: 'center', marginBottom: 20, marginTop: 10 }}>
        {
          pages.map((p) => (
            <ToggleButton
              key={p.key}
              value={p.key}
              icon={p.nameIcon}
              iconColor={theme.dark ? Color(p.color).lighten(.1).hex() : Color(p.color).darken(.4).hex() ?? '#000'}
              status={filter === 'ALL' ? 'checked' : filter === p.key ? 'checked' : 'unchecked'}
              onPress={() => setFilter(p.key)}
            />
          ))
        }
      </ToggleButton.Row>
      <Loading loading={isLoading} refresh={isFetching} />
    </View>
  );
}

export default ResultAccount