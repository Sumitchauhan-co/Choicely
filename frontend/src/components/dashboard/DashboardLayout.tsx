import { Link, Navigate, useNavigate, useSearch } from "@tanstack/react-router";
import { LogOut, Loader2, LogIn, Blocks } from "lucide-react";

import Analytics from "./Analytics";
import Polls from "./DashboardPolls";
import { DashboardSidebar } from "./DashboardSidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import {
    SidebarProvider,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";
import { useUser, useSignout } from "@/hooks/useAuth";
import { LoadingAnimation } from "@/shared/LoadingAnimation";
import { useAuthStore } from "@/store/store";
import { ModeToggle } from "@/theme/ModeToggle";

type ViewSelectorState = "analytics" | "polls";

type DashboardSearch = {
    view?: ViewSelectorState;
};

type DashboardNavigateOptions = {
    to?: string;
    search?: DashboardSearch | ((prev: DashboardSearch) => DashboardSearch);
    replace?: boolean;
};

function DashboardContent() {
    const navigate = useNavigate() as (
        options: DashboardNavigateOptions
    ) => void;

    const search = useSearch({ strict: false }) as DashboardSearch;
    const currentView: ViewSelectorState =
        search.view === "polls" ? "polls" : "analytics";

    const handleViewChange = (newView: ViewSelectorState) => {
        navigate({
            search: prev => ({ ...prev, view: newView }),
        });
    };

    const { open, isMobile } = useSidebar();
    const { data: user, isLoading } = useUser();
    const { mutate: signout, isPending: isSigningOut } = useSignout();
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    if (isLoading) {
        return (
            <div className="bg-background flex min-h-screen w-full flex-col items-center justify-center gap-3">
                <LoadingAnimation />
                <p className="text-accent-foreground font-mono text-xs tracking-wider">
                    Syncing session data...
                </p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    const userDisplayName = user
        ? `${user.firstName} ${user.lastName}`
        : "Workspace User";
    const userFirstLetter = userDisplayName.charAt(0).toUpperCase();
    const userEmail = user?.email || "";

    const shouldShowProfile = isMobile || !open;

    return (
        <div className="bg-background text-foreground selection:bg-primary/10 flex min-h-screen w-full antialiased">
            <DashboardSidebar
                currentView={currentView}
                onViewChange={handleViewChange}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="bg-background/80 sticky top-0 z-20 flex h-16 items-center justify-between border-b px-4 shadow-2xs backdrop-blur-md md:px-8">
                    <div className="flex items-center gap-4">
                        {shouldShowProfile && (
                            <Link
                                to="/"
                                className="flex cursor-pointer items-center justify-center gap-4 dark:text-white"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-900 shadow-xs dark:border-zinc-800 dark:bg-white dark:text-zinc-50">
                                    <Blocks className="h-5 w-5 stroke-[2.2]" />
                                </div>
                                <div className="bg-border h-4 w-px shrink-0" />
                            </Link>
                        )}
                        <SidebarTrigger className="border-border/60 hover:bg-muted h-9 w-9 cursor-pointer rounded-xl border transition-colors dark:hover:bg-zinc-900" />
                        <div className="bg-border hidden h-4 w-px shrink-0 sm:block" />
                        <div className="min-w-0">
                            <span className="text-muted-foreground/90 hidden items-center truncate font-mono text-sm font-bold tracking-wider uppercase sm:flex">
                                Dashboard{" > "}
                                {currentView === "analytics"
                                    ? "Analytics"
                                    : "Polls"}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        <ModeToggle />

                        {shouldShowProfile && (
                            <div className="animate-in fade-in zoom-in-95 duration-200">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            disabled={isSigningOut}
                                            className="border-border/60 focus-visible:ring-ring flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border bg-zinc-900 text-sm font-semibold text-zinc-50 shadow-sm transition-all duration-200 hover:scale-[1.03] focus-visible:ring-1 focus-visible:outline-hidden active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950"
                                            aria-label="Open session options"
                                        >
                                            {isSigningOut ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                                userFirstLetter
                                            )}
                                        </button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        align="end"
                                        className="border-border/80 bg-popover/95 animate-in fade-in-50 slide-in-from-top-1 mt-1.5 w-56 rounded-xl shadow-md backdrop-blur-md duration-150"
                                    >
                                        <DropdownMenuLabel className="p-3 font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-foreground truncate text-xs leading-none font-bold">
                                                    {userDisplayName}
                                                </p>
                                                <p className="text-muted-foreground mt-0.5 truncate text-[10px] leading-none font-medium">
                                                    {userEmail}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>

                                        <DropdownMenuSeparator />

                                        {user ? (
                                            <DropdownMenuItem
                                                onClick={() => signout()}
                                                className="text-destructive focus:bg-destructive/10 dark:focus:bg-destructive/20 focus:text-destructive cursor-pointer gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors"
                                            >
                                                <LogOut className="h-3.5 w-3.5" />
                                                <span>Signout</span>
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    navigate({ to: "/signin" })
                                                }
                                                className="cursor-pointer gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-900"
                                            >
                                                <LogIn className="text-muted-foreground h-3.5 w-3.5" />
                                                <span>Signin</span>
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>
                </header>

                <main className="animate-in fade-in mx-auto w-full flex-1 p-4 duration-200 md:p-8">
                    {currentView === "analytics" ? <Analytics /> : <Polls />}
                </main>
            </div>
        </div>
    );
}

export default function DashboardLayout() {
    return (
        <SidebarProvider>
            <DashboardContent />
        </SidebarProvider>
    );
}
