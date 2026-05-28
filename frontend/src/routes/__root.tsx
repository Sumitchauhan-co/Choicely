import { createRootRoute, Outlet } from "@tanstack/react-router";

import LayoutContainer from "../layout/LayoutContainer";

import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
    component: () => (
        <LayoutContainer>
            <Outlet />
            <Toaster richColors closeButton position="bottom-right" />
        </LayoutContainer>
    ),
});
