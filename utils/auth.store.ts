import { AuthState, AuthStatus, User } from "@/interface/auth.store.interface";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateCreator, create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const authStore: StateCreator<AuthState> = (set) => ({
    saved: null,
    status: AuthStatus.unauthorized,
    checkAuth: () => { },
    logIn: (user: User) => set((state) => ({ ...state, User: user, status: AuthStatus.authorized })),
    logOut: () => set((state) => ({ ...state, User: undefined, status: AuthStatus.unauthorized })),
    setData: ({ email, password }) => set((state) => ({ ...state, authData: { email, password } })),
    removeData: () => set((state) => ({ ...state, authData: undefined })),
});

const useAuthStore = create<AuthState>()(
    persist(
        authStore,
        { name: "authStore", storage: createJSONStorage(() => AsyncStorage) }
    )
);

export default useAuthStore;