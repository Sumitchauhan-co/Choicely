import { createFileRoute, redirect } from "@tanstack/react-router";
import { toast } from "sonner";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuthStore } from "@/store/store";

export const Route = createFileRoute("/dashboard")({
    beforeLoad: () => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;

        if (!isAuthenticated) {
            toast.error("Access Denied", {
                description: "Please sign in to access dashboard feature.",
            });
            throw redirect({
                to: "/signin",
                search: {
                    redirect: window.location.pathname,
                },
                replace: true,
            });
        }
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <DashboardLayout />;
}
