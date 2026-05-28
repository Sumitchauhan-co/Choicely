// src/routes/_appLayout.tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const Route = createFileRoute("/_appLayout")({
    component: AppLayoutComponent,
});

function AppLayoutComponent() {
    return (
        <div className="bg-background text-foreground flex min-h-screen flex-col">
            {/* Navbar sits safely here */}
            <Navbar />

            <Outlet />

            <Footer />
        </div>
    );
}
