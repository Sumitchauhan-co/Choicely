import { createFileRoute } from "@tanstack/react-router";

import ResetPassword from "@/components/auth/ResetPassword";

export const Route = createFileRoute("/_appLayout/reset-password")({
    component: RouteComponent,
});

function RouteComponent() {
    return <ResetPassword />;
}
