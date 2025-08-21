import { ThemeMode, ThemeState } from "@/interface/theme.store.interface";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import merge from 'deepmerge';
import { MD3DarkTheme, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';
import { StateCreator, create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
});

export const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
export const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

type Theme = typeof CombinedDefaultTheme | typeof CombinedDarkTheme;

const themeStore: StateCreator<ThemeState<Theme>> = (set) => ({
    mode: ThemeMode.light,
    theme: { ...CombinedDefaultTheme, colors: { ...CombinedDefaultTheme.colors, primary: 'rgb(111, 57, 150)' } },
    themeNavigator: { dark: false },
    updateMode: (mode) => set({ mode, theme: mode === ThemeMode.dark ? CombinedDarkTheme : { ...CombinedDefaultTheme, colors: { ...CombinedDefaultTheme.colors, primary: 'rgb(111, 57, 150)' } } }),
});

const useThemeStore = create<ThemeState<Theme>>()(
    persist(
        themeStore,
        { name: "themeStore", storage: createJSONStorage(() => AsyncStorage) }
    )
);

export default useThemeStore;