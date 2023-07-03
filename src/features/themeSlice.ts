import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppTheme } from '../types/types';
import { CombinedDefaultTheme } from "../config/Theming";
import { RootState } from "../app/store";
import Values from "values.js";


interface ThemeState {
    theme: AppTheme;
    Primary: Array<Values>;
    whithSystem: boolean;
}

const prelmoColor: string = '#7c46a3';

const initialState: ThemeState = {
    theme: CombinedDefaultTheme,
    Primary: new Values(prelmoColor).all(20).reverse(),
    whithSystem: false,
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        updateTheme: (state, action: PayloadAction<AppTheme>) => {
            state.theme = action.payload;

            if (state.theme.dark) {
                state.theme = {
                    ...state.theme,
                    colors: {
                        ...state.theme.colors,
                        primary: state.Primary[8].hexString(),
                        onPrimary: state.Primary[2].hexString(),
                        primaryContainer: state.Primary[3].hexString(),
                        onPrimaryContainer: state.Primary[9].hexString(),

                        secondary: state.Primary[8].hexString(),
                        onSecondary: state.Primary[2].hexString(),
                        secondaryContainer: state.Primary[3].hexString(),
                        onSecondaryContainer: state.Primary[9].hexString(),

                        tertiary: state.Primary[8].hexString(),
                        onTertiary: state.Primary[2].hexString(),
                        tertiaryContainer: state.Primary[3].hexString(),
                        onTertiaryContainer: state.Primary[9].hexString(),

                        //navigator
                        card: state.Primary[1].hexString(),
                    }
                }
            } else {
                state.theme = {
                    ...state.theme,
                    colors: {
                        ...state.theme.colors,
                        primary: state.Primary[5].hexString(),
                        onPrimary: state.Primary[10].hexString(),
                        primaryContainer: state.Primary[9].hexString(),
                        onPrimaryContainer: state.Primary[1].hexString(),

                        secondary: state.Primary[8].hexString(),
                        onSecondary: state.Primary[2].hexString(),
                        secondaryContainer: state.Primary[3].hexString(),
                        onSecondaryContainer: state.Primary[9].hexString(),

                        tertiary: state.Primary[8].hexString(),
                        onTertiary: state.Primary[2].hexString(),
                        tertiaryContainer: state.Primary[3].hexString(),
                        onTertiaryContainer: state.Primary[9].hexString(),

                        //navigator
                        card: state.Primary[9].hexString(),
                    }
                }
            }
        },
        updateWithSystem: (state, action: PayloadAction<boolean>) => {
            state.whithSystem = action.payload;
        },
        updatePrimaryColor: (state, action: PayloadAction<string | undefined>) => {
            state.Primary = new Values(action.payload ?? prelmoColor).all(20).reverse();
            if (state.theme.dark) {
                state.theme = {
                    ...state.theme,
                    colors: {
                        ...state.theme.colors,
                        primary: state.Primary[8].hexString(),
                        onPrimary: state.Primary[2].hexString(),
                        primaryContainer: state.Primary[3].hexString(),
                        onPrimaryContainer: state.Primary[9].hexString(),

                        secondary: state.Primary[8].hexString(),
                        onSecondary: state.Primary[2].hexString(),
                        secondaryContainer: state.Primary[3].hexString(),
                        onSecondaryContainer: state.Primary[9].hexString(),

                        tertiary: state.Primary[8].hexString(),
                        onTertiary: state.Primary[2].hexString(),
                        tertiaryContainer: state.Primary[3].hexString(),
                        onTertiaryContainer: state.Primary[9].hexString(),

                        card: state.Primary[1].hexString(),
                    }
                }
            } else {
                state.theme = {
                    ...state.theme,
                    colors: {
                        ...state.theme.colors,
                        primary: state.Primary[5].hexString(),
                        onPrimary: state.Primary[10].hexString(),
                        primaryContainer: state.Primary[9].hexString(),
                        onPrimaryContainer: state.Primary[1].hexString(),

                        secondary: state.Primary[8].hexString(),
                        onSecondary: state.Primary[2].hexString(),
                        secondaryContainer: state.Primary[3].hexString(),
                        onSecondaryContainer: state.Primary[9].hexString(),

                        tertiary: state.Primary[8].hexString(),
                        onTertiary: state.Primary[2].hexString(),
                        tertiaryContainer: state.Primary[3].hexString(),
                        onTertiaryContainer: state.Primary[9].hexString(),

                        card: state.Primary[9].hexString(),
                    }
                }
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