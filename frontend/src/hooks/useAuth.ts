import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import api from "@/api/axios";
import { setAccessToken, useAuthStore } from "@/store/store";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export const authKeys = {
    user: ["user"] as const,
};

export function useUser() {
    const { clearAuth, setAuthenticated } = useAuthStore();

    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    return useQuery<User | null>({
        queryKey: authKeys.user,
        queryFn: async () => {
            try {
                const response = await api.get("/api/auth/get-user");
                const result = response.data?.data;

                if (result) {
                    setAuthenticated(true);
                    return result;
                }

                clearAuth();
                return null;
            } catch (error) {
                clearAuth();
                console.log(error);
                return null;
            }
        },
        enabled: true,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });
}

export function useUserProfile(userId?: string) {
    return useQuery<User | null>({
        queryKey: [...authKeys.user, userId],
        queryFn: async () => {
            if (!userId) return null;

            try {
                const response = await api.get(`/api/auth/profile/${userId}`);
                const result = response.data?.data?.user;

                if (result) {
                    return result;
                }

                return null;
            } catch (error) {
                console.error(error);
                return null;
            }
        },
        retry: false,
        staleTime: 1000 * 60 * 5,
    });
}

export function useSignin() {
    const queryClient = useQueryClient();
    const setAuthenticated = useAuthStore(state => state.setAuthenticated);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (credentials: Record<string, string>) => {
            const toastId = toast.loading("Verifying credentials...");

            try {
                const res = await api.post("/api/auth/signin", credentials);
                return { ...res.data, toastId };
            } catch (error) {
                let errorMessage = "Authentication failed";
                if (isAxiosError(error)) {
                    errorMessage =
                        error.response?.data?.message || errorMessage;
                }

                toast.error(errorMessage, { id: toastId });
                throw new Error(errorMessage, { cause: error });
            }
        },
        onSuccess: res => {
            const token = res?.data?.accessToken;
            const userData = res?.data?.user;
            const toastId = res?.toastId;

            if (token) setAccessToken(token);
            setAuthenticated(true);
            queryClient.setQueryData(authKeys.user, userData);

            const userFirstName = userData?.firstName || "User";

            toast.success(`Welcome back, ${userFirstName}!`, {
                id: toastId,
                description: "You've signed in successfully.",
                duration: 10000,
                action: {
                    label: "Go to Dashboard",
                    onClick: () => navigate({ to: "/dashboard" }),
                },
            });
        },
    });
}

export function useSignup() {
    const queryClient = useQueryClient();
    const setAuthenticated = useAuthStore(state => state.setAuthenticated);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (formData: Record<string, string>) => {
            const toastId = toast.loading("Creating your account...");

            try {
                const res = await api.post("/api/auth/signup", formData);
                return { ...res.data, toastId };
            } catch (error) {
                let errorMessage = "Registration failed. Try again.";
                if (isAxiosError(error)) {
                    errorMessage =
                        error.response?.data?.message || errorMessage;
                }

                toast.error(errorMessage, { id: toastId });
                throw new Error(errorMessage, { cause: error });
            }
        },
        onSuccess: res => {
            const token = res?.data?.accessToken;
            const userData = res?.data?.user;
            const toastId = res?.toastId;

            if (token) setAccessToken(token);
            setAuthenticated(true);

            if (userData) {
                queryClient.setQueryData(authKeys.user, userData);
            }

            toast.success("Welcome to Choicely!", {
                id: toastId,
                description: "Your workspace profile is ready.",
                duration: 10000,
                action: {
                    label: "Go to Dashboard",
                    onClick: () => navigate({ to: "/dashboard" }),
                },
            });
        },
    });
}

export function useSignout() {
    const queryClient = useQueryClient();
    const clearAuth = useAuthStore(state => state.clearAuth);
    const setAuthenticated = useAuthStore(state => state.setAuthenticated);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async () => {
            const toastId = toast.loading("Signing out...");

            try {
                await api.post("/api/auth/signout");
                return { toastId };
            } catch (error) {
                let errorMessage = "Sign out failed. Please try again.";
                if (isAxiosError(error)) {
                    errorMessage =
                        error.response?.data?.message || errorMessage;
                }

                toast.error(errorMessage, { id: toastId });
                throw new Error(errorMessage, { cause: error });
            }
        },
        onSuccess: data => {
            const toastId = data?.toastId;

            clearAuth();
            setAuthenticated(false);

            queryClient.setQueryData(authKeys.user, null);
            queryClient.removeQueries();

            toast.success("Signed out!", {
                id: toastId,
                description: "You have successfully signed out.",
                duration: 5000,
                action: {
                    label: "Go to Sign in",
                    onClick: () => navigate({ to: "/signin" }),
                },
            });
        },
    });
}

export function useContact() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (contactData: Record<string, string>) => {
            const toastId = toast.loading("Submitting...");

            try {
                const res = await api.post("/api/auth/contact", contactData);
                return { ...res.data, toastId };
            } catch (error) {
                let errorMessage =
                    "Failed to submit contact details. Please try again.";
                if (isAxiosError(error)) {
                    errorMessage =
                        error.response?.data?.message || errorMessage;
                }

                toast.error(errorMessage, { id: toastId });
                throw new Error(errorMessage, { cause: error });
            }
        },
        onSuccess: data => {
            const toastId = data?.toastId;

            queryClient.setQueryData(authKeys.user, null);
            queryClient.removeQueries();

            toast.success("Submitted contact details!", {
                id: toastId,
                description:
                    "Your contact details have successfully submitted.",
                duration: 5000,
                action: {
                    label: "okay",
                    onClick: () => {},
                },
            });
        },
    });
}

export function useForgotPassword() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Record<string, string>) => {
            const toastId = toast.loading("Sending...");

            try {
                await api.post("/api/auth/forgot-password", data);
                return { toastId };
            } catch (error) {
                let errorMessage =
                    "Failed to sent email. Please try again later.";
                if (isAxiosError(error)) {
                    errorMessage =
                        error.response?.data?.message || errorMessage;
                }

                toast.error(errorMessage, { id: toastId });
                throw new Error(errorMessage, { cause: error });
            }
        },
        onSuccess: data => {
            const toastId = data?.toastId;

            queryClient.setQueryData(authKeys.user, null);
            queryClient.removeQueries();

            toast.success("Email sent successfully!", {
                id: toastId,
                description:
                    "Url has been sent to your email to reset your password.",
                duration: 5000,
                action: {
                    label: "okay",
                    onClick: () => {},
                },
            });
        },
    });
}

export function useResetPassword() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Record<string, string>) => {
            const toastId = toast.loading("Submitting...");

            try {
                await api.post(
                    `/api/auth/reset-password?token=${data.token}`,
                    data
                );
                return { toastId };
            } catch (error) {
                let errorMessage = "Failed to submit. Please try again.";
                if (isAxiosError(error)) {
                    errorMessage =
                        error.response?.data?.message || errorMessage;
                }

                toast.error(errorMessage, { id: toastId });
                throw new Error(errorMessage, { cause: error });
            }
        },
        onSuccess: data => {
            const toastId = data?.toastId;

            queryClient.setQueryData(authKeys.user, null);
            queryClient.removeQueries();

            toast.success("Password updated!", {
                id: toastId,
                description: "New password has been successfully updated.",
                duration: 5000,
                action: {
                    label: "okay",
                    onClick: () => {},
                },
            });
        },
    });
}
