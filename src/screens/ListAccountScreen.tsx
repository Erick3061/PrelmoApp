import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { Props } from './SearchScreen';
import { useAppSelector, useAppDispatch, useMyAccounts, useDebouncedValue } from '../app/hooks';

import { NotificationContext } from '../components/Notification/NotificationtContext';
import { Account } from '../interface/interface';
import { IconButton, Searchbar } from 'react-native-paper';
import { updateAccounts } from '../features/configSlice';
import { Loading } from '../components/Loading';
import { ReciclerData } from '../components/ReciclerData';

export const ListAccountScreen = ({ navigation, route: { params: { type } } }: Props) => {
    const {
        config: { accountsSelected }
    } = useAppSelector(state => state);

    const { isLoading, data, refetch, isFetching, error } = useMyAccounts();
    const AppDispatch = useAppDispatch();
    const { handleError } = useContext(NotificationContext);
    const [textQueryValue, setTextQueryValue] = useState<string>('');
    const debaucedValue = useDebouncedValue(textQueryValue, 300);
    const [filter, setFilter] = useState<Array<Account>>([]);

    useEffect(() => {
        if (error) handleError(String(error));
    }, [error]);

    useEffect(() => {
        if (data) {
            setFilter(data.accounts);
        }
    }, [data])

    useEffect(() => {
        if (data) {
            setFilter(() => data.accounts.filter(f => String(f['Nombre']).toLowerCase().includes(debaucedValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))));
        }
    }, [debaucedValue]);

    useEffect(() => {
        if (textQueryValue.length === 0 && data) {
            setFilter(data.accounts);
        }
    }, [textQueryValue]);
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Buscar'
        })
    }, [navigation])

    const update = (item: Account) => {
        if (type === 'Account') {
            AppDispatch(updateAccounts([item]));
            navigation.goBack();
        } else {
            const exist = accountsSelected.find(f => f.CodigoCte === item.CodigoCte);
            if (exist) {
                AppDispatch(updateAccounts(accountsSelected.filter(f => f.CodigoCte !== item.CodigoCte)));
            } else {
                AppDispatch(updateAccounts([...accountsSelected, item]));
            }
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <Loading loading={isLoading} />
            <ReciclerData
                data={type === 'Accounts' ? filter.filter(f => (accountsSelected.find(b => b.CodigoCte === f.CodigoCte)) === undefined) : filter}
                labelField='Nombre'
                valueField='CodigoCte'
                loading={isFetching}
                onChange={update}
                selected={accountsSelected}
                onRefresh={() => refetch()}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Searchbar
                    style={{ marginVertical: 10, marginHorizontal: 10, flex: 1 }}
                    placeholder="Buscar cuenta"
                    onChangeText={setTextQueryValue}
                    value={textQueryValue}
                />
                {
                    type === 'Accounts' &&
                    <IconButton
                        style={{ marginRight: 10 }}
                        icon={'check-circle'}
                        onPress={() => navigation.goBack()}
                    />
                }
            </View>
        </View>
    )
}
