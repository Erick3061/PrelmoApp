import { ThemeMode, ThemeState } from "@/interface/theme.store.interface";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MD3DarkTheme } from 'react-native-paper';
import { StateCreator, create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


const themeStore: StateCreator<ThemeState> = (set) => ({
    mode: ThemeMode.light,
    themePaper: MD3DarkTheme,
    themeNavigator: {
        dark: false
    },
    updateMode: (mode) => set({ mode })
});

const useThemeStore = create<ThemeState>()(
    persist(
        themeStore,
        { name: "themeStore", storage: createJSONStorage(() => AsyncStorage) }
    )
);

export default useThemeStore;