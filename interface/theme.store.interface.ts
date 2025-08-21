import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { Merge } from "react-hook-form";
import { MD3LightTheme } from "react-native-paper";

/**Enums */
export enum ThemeMode {
    dark = "dark",
    light = "light",
};

/**Types */
export type Theme = Omit<Merge<typeof MD3LightTheme, typeof NavigationDefaultTheme>, 'dark'> & { dark: boolean };

/**Interfaces */
// export interface ThemeColors {
//     primary: string;
//     surface: string;
//     onSurface: string;
//     outline: string;
//     error: string;
// }

export interface ThemeActions {
    updateMode: (mode: ThemeMode) => void;
    // updateColor: (primary: string) => void;
}

export interface ThemeState<T> extends ThemeActions {
    // colors: ThemeColors;
    mode: ThemeMode;
    theme: T;
}