import type React from "react";

import { Link, useNavigate } from "@tanstack/react-router";
import {
    Blocks,
    LayoutDashboard,
    Layers,
    LogOut,
    LogIn,
    Loader2,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    useSidebar,
} from "@/components/ui/sidebar";
import { useUser, useSignout } from "@/hooks/useAuth";

// Strongly-typed navigation contract structure
interface NavigationItem {
    title: string;
    view: "analytics" | "polls";
    icon: React.ComponentType<{ className?: string }>;
}

interface DashboardSidebarProps {
    currentView: "analytics" | "polls";
    onViewChange: (view: "analytics" | "polls") => void;
}

const navigationItems: NavigationItem[] = [
    { title: "Analytics", view: "analytics", icon: LayoutDashboard },
    { title: "Polls", view: "polls", icon: Layers },
];

export function DashboardSidebar({
    currentView,
    onViewChange,
}: DashboardSidebarProps) {
    const { isMobile, toggleSidebar } = useSidebar();
    const navigate = useNavigate();

    // Fetch live user authentication state data
    const { data: user } = useUser();

    // Instantiate sign out tracking mutations
    const { mutate: signout, isPending: isSigningOut } = useSignout();

    // Determine dynamic strings or fallbacks based on session state status
    const userDisplayName = user
        ? `${user.firstName} ${user.lastName}`
        : "Workspace User";
    const userFirstLetter = userDisplayName.charAt(0).toUpperCase();
    const userEmail = user?.email || "user@workspace.internal";

    return (
        <Sidebar className="border-border bg-card border-r backdrop-blur-md dark:bg-zinc-950/50">
            {/* Header branding block */}
            <SidebarHeader className="border-border h-16 justify-center border-b px-4">
                <Link
                    to="/"
                    className="text-foreground flex cursor-pointer items-center gap-2.5 font-sans text-sm font-bold tracking-tight"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-900 text-zinc-50 shadow-xs dark:border-zinc-800 dark:bg-white dark:text-zinc-950">
                        <Blocks className="h-5 w-5 stroke-[2.2]" />
                    </div>
                    <span>Choicely</span>
                </Link>
            </SidebarHeader>

            {/* Structured inner scrolling lists content row */}
            <SidebarContent className="px-2 py-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-muted-foreground mb-2 px-2 text-[10px] font-bold tracking-wider uppercase">
                        Workspace
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {navigationItems.map(item => {
                                const isActive = currentView === item.view;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            className={`h-11 w-full rounded-xl font-bold transition-all ${
                                                isActive
                                                    ? "bg-black text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-950"
                                                    : "dark:hover:text-foreground text-zinc-600 hover:scale-[1.02] hover:bg-zinc-300 hover:text-black active:scale-[0.99] dark:text-zinc-400 dark:hover:bg-zinc-800"
                                            }`}
                                        >
                                            <button
                                                onClick={() => {
                                                    onViewChange(item.view);
                                                    if (isMobile)
                                                        toggleSidebar();
                                                }}
                                                className="flex w-full cursor-pointer items-center gap-3 text-xs"
                                            >
                                                <item.icon className="h-4 w-4 shrink-0" />
                                                <span>{item.title}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <div className="border-border mt-auto border-t bg-zinc-50/50 p-3 dark:bg-zinc-900/30">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            disabled={isSigningOut}
                            className="focus-visible:ring-ring flex w-full cursor-pointer items-center gap-3 rounded-xl p-2 text-left transition-colors duration-200 hover:bg-zinc-200/60 focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-zinc-900/60"
                        >
                            <div className="border-border flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-zinc-900 text-sm font-semibold text-zinc-50 shadow-sm dark:bg-zinc-100 dark:text-zinc-950">
                                {isSigningOut ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                    userFirstLetter
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-foreground truncate text-xs leading-none font-bold">
                                    {userDisplayName}
                                </p>
                            </div>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        side={`${isMobile ? "top" : "right"}`}
                        align="end"
                        sideOffset={12}
                        className="border-border/80 bg-popover/95 animate-in fade-in-50 slide-in-from-bottom-1 w-56 rounded-xl shadow-md backdrop-blur-md duration-150"
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
                                onClick={() => navigate({ to: "/signin" })}
                                className="cursor-pointer gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-900"
                            >
                                <LogIn className="text-muted-foreground h-3.5 w-3.5" />
                                <span>Signin</span>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </Sidebar>
    );
}
