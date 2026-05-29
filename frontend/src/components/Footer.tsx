"use client";

import { Link } from "@tanstack/react-router";
import { Blocks } from "lucide-react";

const footerLinks = [
    // {
    //     title: "Pages",
    //     links: [
    //         { name: "All Products", to: "/products" as const },
    //         { name: "Studio", to: "/studio" as const },
    //         { name: "Clients", to: "/clients" as const },
    //         { name: "Pricing", to: "/pricing" as const },
    //         { name: "Blog", to: "/blog" as const },
    //     ],
    // },
    {
        title: "Socials",
        links: [
            { name: "Github", to: "https://github.com/Sumitchauhan-co" },
            { name: "X", to: "https://x.com/SUMITCH433" },
            {
                name: "LinkedIn",
                to: "https://www.linkedin.com/in/sumit-chauhan-10679a384?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
            },
        ],
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", to: "/about" as const },
            { name: "Terms of Service", to: "/about" as const },
            { name: "Cookie Policy", to: "/about" as const },
        ],
    },
    {
        title: "Register",
        links: [
            { name: "Sign Up", to: "/signup" as const },
            { name: "Sign In", to: "/signin" as const },
            { name: "Forgot Password", to: "/forgot-password" as const },
        ],
    },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-border/60 bg-background relative w-full overflow-hidden border-t pt-12 pb-28 transition-colors duration-200 sm:pt-20 md:pb-36">
            {/* ─── MAIN FOOTER GRID CONTAINER ─── */}
            <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-8 md:px-12">
                <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-12 md:gap-4">
                    {/* Left Column: Brand Info */}
                    <div className="flex flex-col space-y-4 md:col-span-4">
                        <Link to="/" className="flex w-fit items-center gap-2">
                            <span className="text-foreground bg-foreground/5 rounded-lg p-1">
                                <Blocks className="h-6 w-6" />
                            </span>
                            <span className="text-foreground text-xl font-bold tracking-tight select-none">
                                Choicely
                            </span>
                        </Link>
                        <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
                            © copyright Choicely {currentYear}. All rights
                            reserved.
                        </p>
                    </div>

                    {/* Right Columns: Links Matrix */}
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:col-span-8 md:pl-8">
                        {footerLinks.map(group => (
                            <div
                                key={group.title}
                                className="flex flex-col space-y-4"
                            >
                                <h4 className="text-foreground text-sm font-semibold tracking-tight">
                                    {group.title}
                                </h4>
                                <ul className="flex flex-col space-y-3">
                                    {group.links.map(link => (
                                        <li key={link.name}>
                                            {link.to === "#" ? (
                                                <a
                                                    href="#"
                                                    className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors duration-150"
                                                >
                                                    {link.name}
                                                </a>
                                            ) : (
                                                <Link
                                                    to={link.to}
                                                    className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors duration-150"
                                                >
                                                    {link.name}
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* brand name */}
            <div className="pointer-events-none absolute bottom-0 left-1/2 z-0 flex h-fit w-full -translate-x-1/2 translate-y-4 items-center justify-center overflow-hidden select-none sm:translate-y-8 md:translate-y-12">
                <h1 className="text-foreground transform-gpu text-[7rem] leading-none font-black tracking-tighter whitespace-nowrap opacity-[0.03] select-none sm:text-[10rem] md:text-[13rem] lg:text-[17rem] xl:text-[21rem]">
                    Choicely
                </h1>
            </div>
        </footer>
    );
}
