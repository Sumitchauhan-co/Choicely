"use client";

import { useState } from "react";

import { Link } from "@tanstack/react-router";
import { Menu, X, Blocks, Loader2 } from "lucide-react";

import { useSignout } from "../hooks/useAuth";
import { Button } from "./ui/button";

import { useAuthStore } from "@/store/store";
import { ModeToggle } from "@/theme/ModeToggle";

const navItems = [
    { name: "Home", to: "/" as const },
    { name: "Dashboard", to: "/dashboard" as const },
    { name: "Polls", to: "/poll" as const },
    { name: "About", to: "/about" as const },
    { name: "Contact", to: "/contact" as const },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    const { mutate: signoutMutation, isPending } = useSignout();

    const handleSignout = () => {
        signoutMutation(undefined, {
            onSuccess: () => {
                setIsOpen(false);
            },
            onError: () => {
                setIsOpen(false);
            },
        });
    };

    return (
        <header className="sticky top-0 z-50 mx-auto w-full max-w-7xl px-4 py-2">
            {/* Main Navbar Capsule Container */}
            <nav className="bg-card text-card-foreground border-border relative z-50 flex w-full items-center justify-between rounded-full border px-4 py-2.5 shadow-md transition-colors duration-200 md:px-6">
                {/* Left: Brand Logo */}
                <Link to="/" className="flex items-center">
                    <span className="text-foreground pl-2 text-lg font-bold tracking-tight select-none">
                        <Blocks />
                    </span>
                </Link>

                {/* Center: Desktop Navigation Links */}
                <div className="bg-muted/40 border-border/60 hidden items-center gap-1 rounded-full border p-1 md:flex">
                    {navItems.map(item => (
                        <Link
                            key={item.name}
                            to={item.to}
                            activeProps={{
                                className:
                                    "bg-primary text-primary-foreground font-semibold shadow-sm",
                            }}
                            inactiveProps={{
                                className:
                                    "text-muted-foreground hover:text-foreground hover:bg-accent/60",
                            }}
                            className="rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ease-in-out"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Right: Actions (Desktop Only) */}
                <div className="hidden items-center gap-4 md:flex">
                    {isAuthenticated ? (
                        <Button
                            type="button"
                            onClick={handleSignout}
                            disabled={isPending}
                            className="bg-primary text-primary-foreground flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium shadow-sm transition-opacity hover:opacity-90"
                        >
                            {isPending && (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            )}
                            <span>
                                {isPending ? "Signing Out..." : "Sign Out"}
                            </span>
                        </Button>
                    ) : (
                        <Link
                            to="/signin"
                            className="bg-primary text-primary-foreground rounded-full px-5 py-2 text-sm font-medium shadow-sm transition-opacity hover:opacity-90"
                        >
                            Sign In
                        </Link>
                    )}
                    <ModeToggle />
                </div>

                {/* Mobile Controls Container */}
                <div className="flex items-center gap-2 md:hidden">
                    <ModeToggle />
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle Menu"
                        className="text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer rounded-full p-2 transition-colors"
                    >
                        {isOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Dropdown Panel Container */}
            {isOpen && (
                <div className="bg-card border-border animate-in fade-in slide-in-from-top-2 absolute right-4 left-4 z-40 mt-2 flex flex-col gap-3 rounded-3xl border p-4 shadow-xl duration-200 md:hidden">
                    <div className="flex flex-col gap-1">
                        {navItems.map(item => (
                            <Link
                                key={item.name}
                                to={item.to}
                                onClick={() => setIsOpen(false)}
                                activeProps={{
                                    className:
                                        "bg-primary text-primary-foreground font-semibold",
                                }}
                                inactiveProps={{
                                    className:
                                        "text-muted-foreground hover:bg-accent hover:text-foreground",
                                }}
                                className="rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    <hr className="border-border/60 my-1" />
                    {isAuthenticated ? (
                        <button
                            type="button"
                            onClick={handleSignout}
                            disabled={isPending}
                            className="bg-primary text-primary-foreground flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-2.5 text-center text-sm font-medium shadow-sm transition-all hover:opacity-90 disabled:pointer-events-none disabled:opacity-70"
                        >
                            {isPending && (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            )}
                            {isPending ? "Signing Out..." : "Sign Out"}
                        </button>
                    ) : (
                        <Link
                            to="/signin"
                            onClick={() => setIsOpen(false)}
                            className="bg-primary text-primary-foreground w-full rounded-full px-5 py-2.5 text-center text-sm font-medium shadow-sm transition-opacity hover:opacity-90"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            )}
        </header>
    );
}
