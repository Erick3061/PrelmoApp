import { MD3DarkTheme, MD3LightTheme, adaptNavigationTheme } from "react-native-paper";
import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { AppTheme, IndicatorColors } from "../types/types";
import Color from "color";
const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
});

const Indicator: IndicatorColors = {
    colors: {
        info: '#3fc3ee',
        danger: '#ff7782',
        warning: '#dfd32b',
        success: '#3acf9e',
        question: '#87adbd',
        test: '#2bcadf',
        other: '#977220'
    }
}

export const CombinedDefaultTheme: AppTheme = {
    ...MD3LightTheme,
    ...LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        ...LightTheme.colors,
        ...Indicator.colors,

        primary: "rgb(124, 70, 163)",
        onPrimary: "rgb(255, 255, 255)",
        primaryContainer: "rgb(243, 218, 255)",
        onPrimaryContainer: "rgb(47, 0, 77)",
        secondary: "rgb(103, 90, 110)",
        onSecondary: "rgb(255, 255, 255)",
        secondaryContainer: "rgb(239, 220, 245)",
        onSecondaryContainer: "rgb(34, 23, 41)",
        tertiary: "rgb(129, 81, 84)",
        onTertiary: "rgb(255, 255, 255)",
        tertiaryContainer: "rgb(255, 218, 219)",
        onTertiaryContainer: "rgb(51, 16, 20)",
        error: "rgb(186, 26, 26)",
        onError: "rgb(255, 255, 255)",
        errorContainer: "rgb(255, 218, 214)",
        onErrorContainer: "rgb(65, 0, 2)",
        background: "rgb(255, 251, 255)",
        onBackground: "rgb(29, 27, 30)",
        surface: "rgb(255, 251, 255)",
        onSurface: "rgb(29, 27, 30)",
        surfaceVariant: "rgb(234, 223, 234)",
        onSurfaceVariant: "rgb(75, 69, 77)",
        outline: "rgb(124, 117, 126)",
        outlineVariant: "rgb(205, 195, 206)",
        shadow: "rgb(0, 0, 0)",
        scrim: "rgb(0, 0, 0)",
        inverseSurface: "rgb(50, 47, 51)",
        inverseOnSurface: "rgb(246, 239, 243)",
        inversePrimary: "rgb(226, 182, 255)",
        elevation: {
            level0: "transparent",
            level1: "rgb(248, 242, 250)",
            level2: "rgb(245, 237, 248)",
            level3: "rgb(241, 231, 245)",
            level4: "rgb(239, 229, 244)",
            level5: "rgb(237, 226, 242)"
        },
        surfaceDisabled: "rgba(29, 27, 30, 0.12)",
        onSurfaceDisabled: "rgba(29, 27, 30, 0.38)",
        backdrop: "rgba(52, 46, 55, 0.4)",

        info: Color(Indicator.colors.info).darken(.4).toString(),
        danger: Color(Indicator.colors.danger).darken(.4).toString(),
        warning: Color(Indicator.colors.warning).darken(.4).toString(),
        success: Color(Indicator.colors.success).darken(.4).toString(),
        question: Color(Indicator.colors.question).darken(.4).toString(),
        test: Color(Indicator.colors.test).darken(.4).toString(),
    },
};

export const CombinedDarkTheme: AppTheme = {
    ...MD3DarkTheme,
    ...DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        ...DarkTheme.colors,
        ...Indicator.colors,

        primary: "rgb(226, 182, 255)",
        onPrimary: "rgb(74, 15, 113)",
        primaryContainer: "rgb(98, 44, 137)",
        onPrimaryContainer: "rgb(243, 218, 255)",
        secondary: "rgb(210, 193, 217)",
        onSecondary: "rgb(56, 44, 63)",
        secondaryContainer: "rgb(79, 66, 86)",
        onSecondaryContainer: "rgb(239, 220, 245)",
        tertiary: "rgb(244, 183, 186)",
        onTertiary: "rgb(76, 37, 40)",
        tertiaryContainer: "rgb(102, 59, 62)",
        onTertiaryContainer: "rgb(255, 218, 219)",
        error: "rgb(255, 180, 171)",
        onError: "rgb(105, 0, 5)",
        errorContainer: "rgb(147, 0, 10)",
        onErrorContainer: "rgb(255, 180, 171)",
        background: "rgb(29, 27, 30)",
        onBackground: "rgb(231, 224, 229)",
        surface: "rgb(29, 27, 30)",
        onSurface: "rgb(231, 224, 229)",
        surfaceVariant: "rgb(75, 69, 77)",
        onSurfaceVariant: "rgb(205, 195, 206)",
        outline: "rgb(150, 142, 152)",
        outlineVariant: "rgb(75, 69, 77)",
        shadow: "rgb(0, 0, 0)",
        scrim: "rgb(0, 0, 0)",
        inverseSurface: "rgb(231, 224, 229)",
        inverseOnSurface: "rgb(50, 47, 51)",
        inversePrimary: "rgb(124, 70, 163)",
        elevation: {
            level0: "transparent",
            level1: "rgb(39, 35, 41)",
            level2: "rgb(45, 39, 48)",
            level3: "rgb(51, 44, 55)",
            level4: "rgb(53, 46, 57)",
            level5: "rgb(57, 49, 62)"
        },
        surfaceDisabled: "rgba(231, 224, 229, 0.12)",
        onSurfaceDisabled: "rgba(231, 224, 229, 0.38)",
        backdrop: "rgba(52, 46, 55, 0.4)",
    },
};