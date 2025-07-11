import useAuthStore from '@/utils/auth.store';
import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

const Index = () => {
    const logOut = useAuthStore(store => store.logOut);
    return (
        <View>
            <Text>index</Text>
            <Button onPress={logOut}>logout</Button>
        </View>
    )
}

export default Index;