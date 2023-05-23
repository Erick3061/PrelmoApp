import { Service } from "../types/types";
import axios from 'axios';
import Storage from 'react-native-encrypted-storage';
import { useAppSelector } from "../app/hooks";
import { User } from "../interface/interface";

export async function getToken() {
    console.log('entro a getToken');
    // useAppSelector()

    // try {
    //     const token: string = await Storage.getItem(Service["Encrypted-Token"]) ?? '';
    //     const refreshToken: string = await Storage.getItem(Service["Encrypted-RefreshToken"]) ?? '';
    //     const newToken = await axios.get('auth/check-auth', { baseURL: state.domain, headers: { Authorization: `Bearer ${refreshToken}` } })
    //         .then(async resp => {
    //             const data = resp.data as User;
    //             try {
    //                 await Storage.setItem(Service["Encrypted-Token"], data.token);
    //                 await Storage.setItem(Service["Encrypted-RefreshToken"], data.refreshToken);
    //                 return data.token;
    //             } catch { return undefined }
    //         })
    //         .catch(async err => { return undefined });
    //     return newToken ?? token;
    // } catch (error) { return '' }
}