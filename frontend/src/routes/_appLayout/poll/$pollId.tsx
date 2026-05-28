import { createFileRoute } from "@tanstack/react-router";

import LivePoll from "@/components/poll/LivePoll";

export const Route = createFileRoute("/_appLayout/poll/$pollId")({
    component: RouteComponent,
});

function RouteComponent() {
    return <LivePoll />;
}
