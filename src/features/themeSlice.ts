import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppTheme } from '../types/types';
import { CombinedDefaultTheme } from "../config/Theming";
import { RootState } from "../app/store";

interface ThemeState {
    theme: AppTheme;
    whithSystem: boolean;
}

const initialState: ThemeState = {
    theme: CombinedDefaultTheme,
    whithSystem: false,
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        updateTheme: (state, action: PayloadAction<AppTheme>) => {
            state.theme = action.payload;
        },
        updateWithSystem: (state, action: PayloadAction<boolean>) => {
            state.whithSystem = action.payload;
        }
    },
});

export const {
    updateTheme,
    updateWithSystem,

} = themeSlice.actions;

export const Theme = (state: RootState) => state.theme;
export default themeSlice.reducer;