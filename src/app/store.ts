import { configureStore } from "@reduxjs/toolkit";
import themeSlice from '../features/themeSlice';
import configSlice from '../features/configSlice';

export const store = configureStore({
    reducer: {
        theme: themeSlice,
        config: configSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;