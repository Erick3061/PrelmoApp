import { AppStore, Orientation, Saved } from '@/interface/app.store.interface';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';
import { StateCreator, create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const appStore: StateCreator<AppStore> = (set, get) => ({
    domain: 'https://api-consultas.prelmo.com/v1',
    directory: '',
    instance: axios.create(),
    saved: null,
    orientation: Orientation.portrait,
    screenHeight: 0,
    screenWidth: 0,
    firstEntry: true,
    isCompatible: false,
    accountsSelected: [],
    setInstance: (instance: AxiosInstance) => { set({ instance }) },
    setOrientation: (orientation: Orientation) => { set({ orientation }) },
    setScreen: ({ height, width }: { height: number, width: number }) => { set({ screenHeight: height, screenWidth: width }) },
    updateIsCompatible: (isCompatible: boolean) => { set({ isCompatible }) },
    setSaved: (saved: Saved | null) => { set({ saved }) },
    updateFE: (firstEntry: boolean) => { set({ firstEntry }) },
    updateAccounts: (accounts) => set(state => ({ ...state, accountsSelected: accounts }))
});

const useAppStore = create<AppStore>()(
    persist(
        appStore,
        { name: "AppStore", storage: createJSONStorage(() => AsyncStorage) }
    )
);

export default useAppStore;