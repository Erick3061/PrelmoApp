import Loading from '@/components/Loading';
import { ReciclerData } from '@/components/ReciclerData';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { Group } from '@/interface/hooks.interface';
import UserService from '@/services/user.service';
import useAppStore from '@/utils/app.store';
import useNotificationStore from '@/utils/notification.store';
import useThemeStore from '@/utils/theme.store';
import { useQuery } from '@tanstack/react-query';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Searchbar } from 'react-native-paper';

export default function ListGroup() {
    const [filter, setFilter] = useState<Group[]>([]);
    const [textQueryValue, setTextQueryValue] = useState<string>('');
    const groupSelected = useAppStore(state => state.groupsSelected);
    const updateGroup = useAppStore(state => state.updateGroups);
    const handleError = useNotificationStore(state => state.handleError);
    const theme = useThemeStore(state => state.theme);

    const debaucedValue = useDebouncedValue(textQueryValue, 300);

    const router = useRouter();

    const { type } = useGlobalSearchParams();


    const { isFetching, isLoading, refetch, isError, error, data } = useQuery({
        queryKey: ['MyGroups'],
        queryFn: UserService.GetMyGroups
    });


    const Search = () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Searchbar
                style={{ marginVertical: 10, marginHorizontal: 10, flex: 1 }}
                placeholder="Buscar grupo"
                onChangeText={setTextQueryValue}
                value={textQueryValue}
            />
        </View>
    )

    const update = (item: Group) => {
        updateGroup([item]);
        router.back();
    }

    useEffect(() => {
        if (isError) handleError(error.message);
    }, [error, handleError, isError]);

    useEffect(() => {
        if (data) setFilter(data.groups);
    }, [data])

    useEffect(() => {
        if (data) setFilter(() => data.groups.filter(f => String(f['Nombre']).toLowerCase().includes(debaucedValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))));
    }, [data, debaucedValue]);

    useEffect(() => {
        if (textQueryValue.length === 0 && data) setFilter(data.groups);
    }, [data, textQueryValue]);

    return (
        <View style={{ flex: 1, padding: 10, backgroundColor: theme.colors.background }}>
            <Loading loading={isLoading} />
            {Search()}
            <ReciclerData
                data={filter}
                labelField='Nombre'
                valueField='Codigo'
                loading={isFetching}
                onChange={update}
                selected={groupSelected}
                onRefresh={refetch}
            />
        </View>
    )
}