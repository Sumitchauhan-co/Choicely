import { createFileRoute } from "@tanstack/react-router";

import PollFeed from "@/components/poll/PollFeed";

export const Route = createFileRoute("/_appLayout/poll/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <PollFeed />;
}
