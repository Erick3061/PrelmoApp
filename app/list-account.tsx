import Loading from '@/components/Loading';
import { ReciclerData } from '@/components/ReciclerData';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { Account } from '@/interface/hooks.interface';
import UserService from '@/services/user.service';
import useAppStore from '@/utils/app.store';
import useNotificationStore from '@/utils/notification.store';
import useThemeStore from '@/utils/theme.store';
import { useQuery } from '@tanstack/react-query';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { IconButton, Searchbar } from 'react-native-paper';

const ListAccount = () => {
    const [filter, setFilter] = useState<Account[]>([]);
    const [textQueryValue, setTextQueryValue] = useState<string>('');

    const accountsSelected = useAppStore(state => state.accountsSelected);
    const updateAccounts = useAppStore(state => state.updateAccounts);
    const handleError = useNotificationStore(state => state.handleError);
    const theme = useThemeStore(state => state.theme);

    const debaucedValue = useDebouncedValue(textQueryValue, 300);

    const router = useRouter();

    const { type } = useGlobalSearchParams();


    const { isFetching, isLoading, refetch, isError, error, data } = useQuery({
        queryKey: ['MyAccounts'],
        queryFn: UserService.GetMyAccount
    });


    const Search = () => (
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
                    onPress={() => router.back()}
                />
            }
        </View>
    )

    const update = (item: Account) => {
        if (type === 'Account') {
            updateAccounts([item]);
            router.back();
        } else {
            const exist = accountsSelected.find(f => f.CodigoCte === item.CodigoCte);
            if (exist) updateAccounts(accountsSelected.filter(f => f.CodigoCte !== item.CodigoCte));
            else updateAccounts([...accountsSelected, item]);
        }
    }

    useEffect(() => {
        if (isError) handleError(error.message);
    }, [error, handleError, isError]);

    useEffect(() => {
        if (data) setFilter(data.accounts);
    }, [data])

    useEffect(() => {
        if (data) setFilter(() => data.accounts.filter(f => String(f['Nombre']).toLowerCase().includes(debaucedValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))));
    }, [data, debaucedValue]);

    useEffect(() => {
        if (textQueryValue.length === 0 && data) setFilter(data.accounts);
    }, [data, textQueryValue]);

    return (
        <View style={{ flex: 1, padding: 10, backgroundColor: theme.colors.background }}>
            <Loading loading={isLoading} />
            {Search()}
            <ReciclerData
                data={type === 'Accounts' ? filter.filter(f => (accountsSelected.find(b => b.CodigoCte === f.CodigoCte)) === undefined) : filter}
                labelField='Nombre'
                valueField='CodigoCte'
                loading={isFetching}
                onChange={update}
                selected={accountsSelected}
                onRefresh={refetch}
            />
        </View>
    )
}

export default ListAccount