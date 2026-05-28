import { createFileRoute } from "@tanstack/react-router";

import About from "@/components/About";

export const Route = createFileRoute("/_appLayout/about")({
    component: RouteComponent,
});

function RouteComponent() {
    return <About />;
}
