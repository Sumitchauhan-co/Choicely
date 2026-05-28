import { createFileRoute } from "@tanstack/react-router";

import DashboardPolls from "@/components/dashboard/DashboardPolls";

export const Route = createFileRoute("/dashboard/polls")({
    component: RouteComponent,
});

function RouteComponent() {
    return <DashboardPolls />;
}
