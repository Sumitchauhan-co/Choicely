import { createFileRoute } from "@tanstack/react-router";

import CreatePoll from "@/components/poll/Create";

export const Route = createFileRoute("/_appLayout/poll/create")({
    component: RouteComponent,
});

function RouteComponent() {
    return <CreatePoll />;
}
