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
    },
};