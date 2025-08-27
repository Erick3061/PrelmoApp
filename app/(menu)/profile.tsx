import useAuthStore from '@/utils/auth.store'
import { useRouter } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import { Avatar, Button, Card, Text } from 'react-native-paper'

const Profile = () => {
    const router = useRouter();

    const User = useAuthStore(state => state.User);
    return (
        <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            {
                User
                    ?
                    <Card
                        style={[
                            {
                                borderRadius: 10,
                                borderWidth: 0,
                                paddingVertical: 40,
                                paddingHorizontal: 20,
                                alignItems: 'center',
                                elevation: 5
                            }
                        ]}
                    >
                        <Card.Content style={{ alignItems: 'center', display: 'flex', gap: 5 }}>
                            <Avatar.Text label={User.fullName.slice(0, 1)} />
                            <Text style={{ marginTop: 10, fontWeight: 'bold' }} variant='titleLarge'>{User.fullName}</Text>
                            <Text style={{}}>{User.email}</Text>
                            <Button
                                style={{ marginVertical: 10 }}
                                mode='contained'
                                onPress={() => router.navigate('/changePassword')}
                            >Cambiar contraseña</Button>
                        </Card.Content>
                    </Card>
                    : null
            }
        </View >
    )
}

export default Profile