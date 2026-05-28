import { createFileRoute } from "@tanstack/react-router";

import SignIn from "@/components/auth/Signin";

export const Route = createFileRoute("/_appLayout/(auth)/signin")({
    component: RouteComponent,
});

function RouteComponent() {
    return <SignIn />;
}
