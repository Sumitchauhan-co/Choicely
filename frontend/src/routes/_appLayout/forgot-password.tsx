import { createFileRoute } from "@tanstack/react-router";

import ForgotPassword from "@/components/auth/ForgotPassword";

export const Route = createFileRoute("/_appLayout/forgot-password")({
    component: RouteComponent,
});

function RouteComponent() {
    return <ForgotPassword />;
}
