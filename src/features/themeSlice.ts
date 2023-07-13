import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppTheme } from '../types/types';
import { CombinedDefaultTheme } from "../config/Theming";
import { RootState } from "../app/store";
import Values from "values.js";
import Color from "color";
import { getMD3 } from "../functions/functions";
import { TonalPalette } from "../interface/interface";


interface ThemeState {
    theme: AppTheme;
    Primary: TonalPalette;
    whithSystem: boolean;
}

const prelmoColor: string = '#7c46a3';

const initialState: ThemeState = {
    theme: CombinedDefaultTheme,
    Primary: getMD3(prelmoColor).tonals,
    whithSystem: false,
}
type colors = Pick<AppTheme, 'colors'>['colors'];

const getColors = ({ colors, Primary, light }: { colors: colors, Primary: TonalPalette, light: boolean }): colors => {
    const deg = new Values(Primary["T-40"]).all(2).reverse();
    return light
        ? {
            ...colors,
            primary: Primary["T-40"],
            onPrimary: Primary["T-100"],
            primaryContainer: Primary["T-90"],
            onPrimaryContainer: Primary["T-10"],

            secondary: Primary["T-40"],
            onSecondary: Primary["T-100"],
            secondaryContainer: Primary["T-90"],
            onSecondaryContainer: Primary["T-10"],

            tertiary: Primary["T-40"],
            onTertiary: Primary["T-40"],
            tertiaryContainer: Primary["T-40"],
            onTertiaryContainer: Primary["T-40"],

            background: Primary["T-99"],
            onBackground: Primary["T-10"],
            surface: Primary["T-99"],
            onSurface: Primary["T-10"],

            surfaceVariant: Primary["T-99"],
            onSurfaceVariant: Primary["T-30"],
            outline: Primary["T-50"],

            elevation: {
                level0: 'transparent',
                level1: deg[(deg.length) - 5].hexString(),
                level2: deg[(deg.length) - 8].hexString(),
                level3: deg[(deg.length) - 11].hexString(),
                level4: deg[(deg.length) - 12].hexString(),
                level5: deg[(deg.length) - 14].hexString(),
            },

            //navigator
            card: Primary["T-99"],
            text: Primary["T-10"],
            border: Primary["T-20"],
            notification: Primary["T-20"],
        }
        : {
            ...colors,
            primary: Primary["T-80"],
            onPrimary: Primary["T-20"],
            primaryContainer: Primary["T-30"],
            onPrimaryContainer: Primary["T-90"],

            secondary: Primary["T-90"],
            onSecondary: Primary["T-30"],
            secondaryContainer: Primary["T-40"],
            onSecondaryContainer: Primary["T-95"],

            tertiary: Primary["T-90"],
            onTertiary: Primary["T-90"],
            tertiaryContainer: Primary["T-90"],
            onTertiaryContainer: Primary["T-90"],

            background: Primary["T-0"],
            onBackground: Primary["T-90"],
            surface: Primary["T-10"],
            onSurface: Primary["T-95"],

            surfaceVariant: Primary["T-30"],
            onSurfaceVariant: Primary["T-95"],
            outline: Primary["T-90"],

            elevation: {
                level0: 'transparent',
                level1: deg[15 + 5].hexString(),
                level2: deg[15 + 8].hexString(),
                level3: deg[15 + 11].hexString(),
                level4: deg[15 + 12].hexString(),
                level5: deg[15 + 14].hexString(),
            },

            //navigator
            card: Primary["T-10"],
            text: Primary["T-95"],
            border: Primary["T-60"],
            notification: Primary["T-80"],
        }
}


const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        updateTheme: (state, action: PayloadAction<AppTheme>) => {
            state.theme = action.payload;

            if (state.theme.dark) {
                state.theme = { ...state.theme, colors: getColors({ colors: state.theme.colors, light: false, Primary: state.Primary }) }
            } else {
                state.theme = { ...state.theme, colors: getColors({ colors: state.theme.colors, light: true, Primary: state.Primary }) }
            }
        },
        updateWithSystem: (state, action: PayloadAction<boolean>) => {
            state.whithSystem = action.payload;
        },
        updatePrimaryColor: (state, action: PayloadAction<string | undefined>) => {
            // state.Primary = new Values(action.payload ?? prelmoColor).all(20).reverse();
            state.Primary = getMD3(action.payload ?? prelmoColor).tonals;


            if (state.theme.dark) {
                state.theme = { ...state.theme, colors: getColors({ colors: state.theme.colors, light: false, Primary: state.Primary }) }
            } else {
                state.theme = { ...state.theme, colors: getColors({ colors: state.theme.colors, light: true, Primary: state.Primary }) }
            }
        }
    },
});

export const {
    updateTheme,
    updateWithSystem,
    updatePrimaryColor
} = themeSlice.actions;

export const Theme = (state: RootState) => state.theme;
export default themeSlice.reducer;