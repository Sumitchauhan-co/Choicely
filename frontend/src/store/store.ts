import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
    isAuthenticated: boolean;
    setAuthenticated: (status: boolean) => void;
    clearAuth: () => void;
}

let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => {
    accessToken = token;
};
export const getAccessToken = () => accessToken;

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            set => ({
                isAuthenticated: false,
                setAuthenticated: status =>
                    set(
                        { isAuthenticated: status },
                        false,
                        "auth/setAuthenticated"
                    ),
                clearAuth: () => {
                    setAccessToken(null);
                    set({ isAuthenticated: false }, false, "auth/clearAuth");
                },
            }),
            {
                name: "auth-storage",
                partialize: state => ({
                    isAuthenticated: state.isAuthenticated,
                }),
            }
        )
    )
);
