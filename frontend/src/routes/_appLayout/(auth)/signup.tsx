import { createFileRoute } from "@tanstack/react-router";

import SignUp from "@/components/auth/Signup";

export const Route = createFileRoute("/_appLayout/(auth)/signup")({
    component: RouteComponent,
});

function RouteComponent() {
    return <SignUp />;
}
