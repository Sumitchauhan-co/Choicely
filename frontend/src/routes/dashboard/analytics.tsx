import { createFileRoute } from "@tanstack/react-router";

import DashboardAnalytics from "@/components/dashboard/Analytics";

export const Route = createFileRoute("/dashboard/analytics")({
    component: RouteComponent,
});

function RouteComponent() {
    return <DashboardAnalytics />;
}
