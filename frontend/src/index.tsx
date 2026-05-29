import { StrictMode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

import GlobalNotFound from "./components/GlobalNotFound";
import { useUser } from "./hooks/useAuth";
import { routeTree } from "./routeTree.gen";
import { LoadingAnimation } from "./shared/LoadingAnimation";
import { ThemeProvider } from "./theme/ThemeProvider";

import { TooltipProvider } from "@/components/ui/tooltip";

import "./index.css";

// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
});

const router = createRouter({
    routeTree: routeTree,
    defaultNotFoundComponent: () => <GlobalNotFound />,
    context: {
        queryClient,
    },
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

function AppContent() {
    const { isLoading } = useUser();

    if (isLoading) {
        return (
            <div className="bg-background text-foreground flex h-screen w-screen flex-col items-center justify-center">
                <LoadingAnimation />
            </div>
        );
    }
    return <RouterProvider router={router} />;
}

export function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <TooltipProvider>
                <QueryClientProvider client={queryClient}>
                    <AppContent />
                </QueryClientProvider>
            </TooltipProvider>
        </ThemeProvider>
    );
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <StrictMode>
            <App />
        </StrictMode>
    );
}
