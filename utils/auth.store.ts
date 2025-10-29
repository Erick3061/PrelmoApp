import { AuthState, AuthStatus, User } from "@/interface/auth.store.interface";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateCreator, create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const authStore: StateCreator<AuthState> = (set) => ({
    saved: null,
    status: AuthStatus.unauthorized,
    checkAuth: () => { },
    logIn: (user?: User) => set((state) => ({ ...state, User: user, status: user ? AuthStatus.authorized : AuthStatus.unauthorized })),
    logOut: () => set((state) => ({ ...state, User: undefined, status: AuthStatus.unauthorized })),
    setData: ({ email, password }) => set((state) => ({ ...state, authData: { email, password } })),
    removeData: () => set((state) => ({ ...state, authData: undefined })),
    // User: {
    //     id: "8CD6423E-F36B-1410-8445-000B15FD71D3",
    //     fullName: "Erick Andrade Ramos",
    //     email: "erick.andrade@pem-sa.com",
    //     termsAndConditions: true,
    //     isActive: true,
    //     roles: ["admin"],
    //     token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhDRDY0MjNFLUYzNkItMTQxMC04NDQ1LTAwMEIxNUZENzFEMyIsImlhdCI6MTc2MTc2MTkzMywiZXhwIjoxNzYxNzYyNTMzfQ.D2rOLZ4XCEfzrMvBkuIhLJ1Q7SowHZwyDrfoQPrR32amzom-2EqkdPKfKtl4MhFTElgOH_YADE8k3FlFuY9zkRptre9I9hbvUSW8rMDCqMeNQzcrMoE31-hOsQ7DkdwZ0AypvqMQZ20evxp8_cQ9XQHL-9C4c6y_PXd_hOmhOGmNa3SK5FSyi86TJ8-Ll--4nHfy9VmaeetF3U8TtIOEQJNjlHFmWN9uHWpNefHkuyw1DtCZw4vqpiDIhmnzaB7hJ9mY3NNOZGkzdWN-4Xz5eHhaGOGT427qG7bpCC9NqjLNjWTTiOaNNCMOqoDVudKYac5FIl-9V1k9XFa3xZfSow',
    //     refreshToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhDRDY0MjNFLUYzNkItMTQxMC04NDQ1LTAwMEIxNUZENzFEMyIsImlhdCI6MTc2MTc2MTkzMywiZXhwIjoxNzYxNzYyNTMzfQ.D2rOLZ4XCEfzrMvBkuIhLJ1Q7SowHZwyDrfoQPrR32amzom-2EqkdPKfKtl4MhFTElgOH_YADE8k3FlFuY9zkRptre9I9hbvUSW8rMDCqMeNQzcrMoE31-hOsQ7DkdwZ0AypvqMQZ20evxp8_cQ9XQHL-9C4c6y_PXd_hOmhOGmNa3SK5FSyi86TJ8-Ll--4nHfy9VmaeetF3U8TtIOEQJNjlHFmWN9uHWpNefHkuyw1DtCZw4vqpiDIhmnzaB7hJ9mY3NNOZGkzdWN-4Xz5eHhaGOGT427qG7bpCC9NqjLNjWTTiOaNNCMOqoDVudKYac5FIl-9V1k9XFa3xZfSow',
    // }
});

const useAuthStore = create<AuthState>()(
    persist(
        authStore,
        { name: "authStore", storage: createJSONStorage(() => AsyncStorage) }
    )
);

export default useAuthStore;