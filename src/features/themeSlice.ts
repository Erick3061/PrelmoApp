import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppTheme } from '../types/types';
import { CombinedDefaultTheme } from "../config/Theming";
import { RootState } from "../app/store";
import Values from "values.js";
import Color from "color";


interface ThemeState {
    theme: AppTheme;
    Primary: Array<Values>;
    whithSystem: boolean;
}

const prelmoColor: string = '#7c46a3';
// const prelmoColor: string = '#0061a4';
// const prelmoColor: string = '#000';

const initialState: ThemeState = {
    theme: CombinedDefaultTheme,
    Primary: new Values(prelmoColor).all(20).reverse(),
    whithSystem: false,
}
type colors = Pick<AppTheme, 'colors'>['colors'];

const getColors = ({ colors, Primary, light }: { colors: colors, Primary: Array<Values>, light: boolean }): colors => {
    const deg = new Values(Primary[4].hexString()).all(2).reverse();
    return light
        ? {
            ...colors,
            primary: Primary[4].hexString(),
            onPrimary: Primary[10].hexString(),
            primaryContainer: Primary[9].hexString(),
            onPrimaryContainer: Primary[1].hexString(),

            secondary: Primary[4].hexString(),
            onSecondary: Primary[9].hexString(),
            secondaryContainer: Primary[9].hexString(),
            onSecondaryContainer: Primary[2].hexString(),

            tertiary: Primary[4].hexString(),
            onTertiary: Primary[4].hexString(),
            tertiaryContainer: Primary[4].hexString(),
            onTertiaryContainer: Primary[4].hexString(),

            background: Color(Primary[9].hexString()).lighten(0.16).toString(),//Neutral99
            onBackground: Primary[1].hexString(),//Neutral10
            surface: Color(Primary[9].hexString()).lighten(0.16).toString(),//Neutral99
            onSurface: Primary[1].hexString(),//Neutral10

            surfaceVariant: Color(Primary[9].hexString()).fade(.8).toString(),//Neutral90
            onSurfaceVariant: Primary[2].hexString(),//Neutral10
            outline: Color(Primary[2].hexString()).fade(.6).toString(),//Neutral90

            elevation: {
                level0: 'transparent',
                level1: deg[(deg.length) - 5].hexString(),
                level2: deg[(deg.length) - 8].hexString(),
                level3: deg[(deg.length) - 11].hexString(),
                level4: deg[(deg.length) - 12].hexString(),
                level5: deg[(deg.length) - 14].hexString(),
            },

            //navigator
            card: Color(Primary[9].hexString()).lighten(0.12).toString(),
            text: Primary[1].hexString(),
            border: Primary[2].hexString(),
            notification: Primary[2].hexString(),
        }
        : {
            ...colors,
            primary: Primary[8].hexString(),
            onPrimary: Primary[2].hexString(),
            primaryContainer: Primary[3].hexString(),
            onPrimaryContainer: Primary[9].hexString(),

            secondary: Primary[4].hexString(),
            onSecondary: Primary[9].hexString(),
            secondaryContainer: Primary[9].hexString(),
            onSecondaryContainer: Primary[2].hexString(),

            tertiary: Primary[9].hexString(),
            onTertiary: Primary[9].hexString(),
            tertiaryContainer: Primary[9].hexString(),
            onTertiaryContainer: Primary[9].hexString(),

            background: Color(Primary[1].hexString()).lighten(0.16).toString(),//Neutral99
            onBackground: Primary[9].hexString(),//Neutral10
            surface: Color(Primary[1].hexString()).lighten(0.16).toString(),//Neutral99
            onSurface: Primary[9].hexString(),//Neutral10

            surfaceVariant: Color(Primary[1].hexString()).fade(.8).toString(),//Neutral90
            onSurfaceVariant: Primary[9].hexString(),//Neutral10
            outline: Color(Primary[9].hexString()).fade(.6).toString(),//Neutral90

            elevation: {
                level0: 'transparent',
                level1: deg[15 + 5].hexString(),
                level2: deg[15 + 8].hexString(),
                level3: deg[15 + 11].hexString(),
                level4: deg[15 + 12].hexString(),
                level5: deg[15 + 14].hexString(),
            },

            //navigator
            card: Color(Primary[1].hexString()).lighten(0.12).toString(),
            text: Primary[9].hexString(),
            border: Primary[8].hexString(),
            notification: Primary[8].hexString(),
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
            state.Primary = new Values(action.payload ?? prelmoColor).all(20).reverse();

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