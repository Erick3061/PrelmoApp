import React from 'react'
import { View } from 'react-native'
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { ReciclerData } from '../components/ReciclerData';
import { updateAccounts } from '../features/configSlice';

export const AccountsSelectedScreen = () => {
    const { config: { accountsSelected } } = useAppSelector(state => state);
    const AppDispatch = useAppDispatch();
    return (
        <View style={{ flex: 1 }}>
            <ReciclerData
                data={accountsSelected}
                labelField='Nombre'
                valueField='CodigoCte'
                loading={false}
                selected={[]}
                onChange={(item) => AppDispatch(updateAccounts(accountsSelected.filter(f => f.CodigoCte !== item.CodigoCte)))}
            />
        </View>
    )
}
