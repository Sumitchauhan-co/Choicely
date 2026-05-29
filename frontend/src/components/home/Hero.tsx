import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Sparkles } from "./ui/Sparkles";

import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { Spotlight } from "@/components/ui/spotlight";

export default function HeroSection() {
    const words = ["audiences", "ecosystems", "networks", "platforms"];

    return (
        <section className="bg-background relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden pt-24 pb-16 transition-colors duration-200">
            {/* Background elements */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <Spotlight
                    className="-top-40 left-0 md:-top-20 md:left-60"
                    fill="var(--color-primary)"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,#000_70%,transparent_100%)] bg-[size:4rem_4rem] opacity-[0.10] md:bg-[size:5rem_5rem] dark:opacity-[0.20]" />
            </div>

            {/* Layout Wrapper Grid */}
            <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-center space-y-8 px-4 text-center sm:px-6 md:space-y-10">
                {/* Product Brand Banner */}
                <div className="flex w-full max-w-3xl flex-col items-center justify-center overflow-hidden rounded-md pt-4">
                    <h2 className="text-foreground relative z-20 mb-1 text-5xl font-semibold tracking-tighter select-none sm:text-7xl md:text-8xl lg:text-9xl">
                        Choicely
                    </h2>

                    <div className="relative h-25 w-full max-w-[40rem] px-4">
                        <div className="absolute inset-x-4 top-0 h-[2px] w-auto bg-gradient-to-r from-transparent via-amber-400 to-transparent blur-sm sm:inset-x-20 dark:via-indigo-500" />
                        <div className="absolute inset-x-4 top-0 h-px w-auto bg-gradient-to-r from-transparent via-amber-400 to-transparent sm:inset-x-20 dark:via-indigo-500" />
                        <div className="absolute inset-x-12 top-0 h-[4px] w-auto bg-gradient-to-r from-transparent via-yellow-500 to-transparent blur-sm sm:inset-x-40 dark:via-sky-500" />
                        <div className="absolute inset-x-12 top-0 h-px w-auto bg-gradient-to-r from-transparent via-yellow-500 to-transparent sm:inset-x-40 dark:via-sky-500" />

                        <Sparkles />
                    </div>
                </div>

                {/* Main Heading Text Banner */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-foreground flex max-w-4xl flex-col items-center justify-center text-2xl leading-[1.2] font-semibold tracking-tighter sm:text-3xl md:text-4xl md:leading-[1.1] lg:text-5xl"
                >
                    <span className="text-foreground">
                        Instant real-time voting built for modern
                    </span>
                    <span className="text-primary mt-1 flex h-[1.2em] items-center justify-center md:mt-2">
                        <LayoutTextFlip text="" words={words} duration={2800} />
                    </span>
                </motion.h1>

                {/* Subheading Summary Description */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-muted-foreground sm:text-'lg' max-w-2xl px-2 text-base leading-relaxed font-semibold tracking-tight md:text-xl"
                >
                    Create interactive polls, capture rapid crowd feedback, and
                    track streaming live metrics.
                </motion.p>

                {/* Interactive Navigation Calls to Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex w-full flex-col items-center gap-3.5 px-4 pt-4 sm:w-auto sm:flex-row sm:px-0"
                >
                    <Link
                        to="/poll/create"
                        className="group bg-primary text-primary-foreground shadow-primary/10 flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-center text-sm font-semibold shadow-lg transition-all hover:scale-[1.01] hover:opacity-95 active:scale-[0.99] sm:w-auto"
                    >
                        Create a Poll
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                    {/* <Link
                        to="/docs"
                        className="bg-card border-border text-foreground hover:bg-accent w-full rounded-full border px-8 py-3.5 text-center text-sm font-medium transition-colors sm:w-auto"
                    >
                        View Documentation
                    </Link> */}
                </motion.div>
            </div>
        </section>
    );
}
