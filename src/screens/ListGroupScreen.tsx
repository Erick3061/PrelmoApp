import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Props } from './SearchScreen';
import { useAppSelector, useAppDispatch, useGroups, useDebouncedValue } from '../app/hooks';
import { Loading } from '../components/Loading';
import { ReciclerData } from '../components/ReciclerData';
import { NotificationContext } from '../components/Notification/NotificationtContext';
import { Group } from '../interface/interface';
import { Searchbar } from 'react-native-paper';
import { updateGroups } from '../features/configSlice';

export const ListGroupScreen = ({ navigation, route: { params: { type } } }: Props) => {
    const { config: { groupsSelected } } = useAppSelector(state => state);
    const { isLoading, data, refetch, isFetching, error } = useGroups();
    const AppDispatch = useAppDispatch();
    const { handleError } = useContext(NotificationContext);
    const [textQueryValue, setTextQueryValue] = useState<string>('');
    const debaucedValue = useDebouncedValue(textQueryValue, 300);
    const [filter, setFilter] = useState<Array<Group>>([]);

    useEffect(() => {
        if (error) handleError(String(error));
    }, [error]);

    useEffect(() => {
        if (data) {
            setFilter(data.groups);
        }
    }, [data])

    useEffect(() => {
        if (data) {
            setFilter(() => data.groups.filter(f => String(f['Nombre']).toLowerCase().includes(debaucedValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))));
        }
    }, [debaucedValue]);

    useEffect(() => {
        if (textQueryValue.length === 0 && data) {
            setFilter(data.groups);
        }
    }, [textQueryValue]);

    const update = (item: Group) => {
        AppDispatch(updateGroups([item]));
        navigation.goBack();
    }

    return (
        <View style={{ flex: 1 }}>
            <Loading loading={isLoading} />
            <ReciclerData
                data={filter}
                labelField='Nombre'
                valueField='Codigo'
                loading={isFetching}
                onChange={update}
                selected={groupsSelected}
                onRefresh={() => refetch()}
            />
            <Searchbar
                style={{ marginVertical: 10, marginHorizontal: 10 }}
                placeholder="Buscar cuenta"
                onChangeText={setTextQueryValue}
                value={textQueryValue}
            />
        </View>
    )
}
