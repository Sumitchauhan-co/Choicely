import { type MouseEvent } from "react";

import { KeyRound, PlusCircle, Radio, Sparkles } from "lucide-react";

const STEPS = [
    {
        id: "01",
        title: "Instantiate Poll",
        description:
            "Drop your question, add options, and specify an expiration timeline. No mandatory account creation bottlenecks for your community.",
        icon: PlusCircle,
        badge: "50ms latency",
        spotlightLight: "59, 130, 246", // Blue
        spotlightDark: "59, 130, 246",
        iconColor: "text-blue-500",
    },
    {
        id: "02",
        title: "Deploy Gateway Link",
        description:
            "Generate your secured web link to an isolated digital room. Seamlessly share this direct invitation across your public platforms or private networks with room key.",
        icon: KeyRound,
        badge: "Secure",
        spotlightLight: "168, 85, 247", // Purple
        spotlightDark: "168, 85, 247",
        iconColor: "text-purple-500",
    },
    {
        id: "03",
        title: "Stream Live Telemetry",
        description:
            "Watch data re-aggregate globally via real-time WebSocket pipelines. Zero page refreshes or stale state layers.",
        icon: Radio,
        badge: "WebSocket",
        spotlightLight: "16, 185, 129", // Emerald
        spotlightDark: "16, 185, 129",
        iconColor: "text-emerald-500",
        live: true,
    },
];

export default function HowItWorks() {
    // Track mouse coordinates locally per-card without triggering full component structural re-renders
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    };

    return (
        <section className="bg-background border-border/40 relative w-full overflow-hidden border-b px-6 py-24 transition-colors duration-200 md:px-12">
            {/* Ambient Base Layer Background Grid */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#80808004_1px,transparent_1px),linear-gradient(to_bottom,#80808004_1px,transparent_1px)] dark:bg-[size:32px_32px]" />
            <div className="bg-primary/5 pointer-events-none absolute top-0 left-1/2 h-[250px] w-[600px] -translate-x-1/2 rounded-full blur-[120px]" />

            <div className="relative z-10 mx-auto max-w-6xl space-y-16">
                {/* Header Copy Block */}
                <div className="mx-auto max-w-2xl space-y-4 text-center">
                    <div className="bg-primary/10 border-primary/20 text-primary inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 font-mono text-xs font-bold tracking-tight uppercase">
                        <Sparkles className="h-3 w-3" /> Architecture Footprint
                    </div>
                    <h2 className="text-foreground/90 font-sans text-3xl leading-none font-black tracking-tight md:text-5xl">
                        Engineered for Simplicity.
                    </h2>
                    <p className="text-muted-foreground/80 text-sm leading-relaxed font-medium md:text-base">
                        Three streamlined stages separating creation from
                        instantaneous analytical deployment. No administrative
                        friction.
                    </p>
                </div>

                {/* Spotlight Card Grid */}
                <div className="grid items-stretch gap-6 md:grid-cols-3">
                    {STEPS.map(step => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.id}
                                onMouseMove={handleMouseMove}
                                className="group border-border/60 bg-card/40 dark:bg-card/10 hover:border-foreground/20 hover:bg-card/70 dark:hover:bg-card/30 relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-xs backdrop-blur-xs transition-all duration-300 dark:shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]"
                                style={{
                                    // Injecting dynamic raw colors to handle light vs dark opacity layers in pure CSS
                                    ["--spotlight-light" as string]:
                                        step.spotlightLight,
                                    ["--spotlight-dark" as string]:
                                        step.spotlightDark,
                                }}
                            >
                                {/* 🌟 Premium Card Spotlight Layer (Pure CSS Hardware Accelerated) */}
                                <div
                                    className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                    style={{
                                        background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), 
                                            rgba(var(--spotlight-light), 0.06), 
                                            transparent 80%)`,
                                    }}
                                />
                                <div
                                    className="pointer-events-none absolute inset-0 -z-10 hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:block"
                                    style={{
                                        background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), 
                                            rgba(var(--spotlight-dark), 0.12), 
                                            transparent 80%)`,
                                    }}
                                />

                                {/* Subtle Highlight Inner Glow Line */}
                                <div
                                    className="border-primary/10 pointer-events-none absolute inset-0 rounded-2xl border opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                    style={{
                                        maskImage: `radial-gradient(180px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), black, transparent)`,
                                        WebkitMaskImage: `radial-gradient(180px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), black, transparent)`,
                                    }}
                                />

                                <div className="relative z-10 space-y-5">
                                    {/* Card Header Elements */}
                                    <div className="flex items-center justify-between">
                                        <div
                                            className={`border-border/40 rounded-xl border bg-zinc-100 p-2.5 dark:bg-zinc-900/80 ${step.iconColor} group-hover:border-primary/20 shadow-xs transition-colors`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-muted-foreground/10 group-hover:text-primary/10 font-mono text-3xl font-black transition-colors select-none">
                                            {step.id}
                                        </span>
                                    </div>

                                    {/* Body Text */}
                                    <div className="space-y-2 text-left">
                                        <h3 className="text-foreground/90 flex items-center gap-2 font-sans text-base font-bold tracking-tight">
                                            {step.title}
                                            {step.live && (
                                                <span className="relative flex h-2 w-2">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                                </span>
                                            )}
                                        </h3>
                                        <p className="text-muted-foreground/80 text-xs leading-relaxed font-medium md:text-sm">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Premium Micro-Metadata Footer */}
                                <div className="border-border/10 text-muted-foreground/60 relative z-10 mt-6 flex items-center justify-between border-t pt-6 font-mono text-[10px] font-bold tracking-wider uppercase">
                                    <span className="border-border/40 group-hover:text-foreground group-hover:border-border/80 rounded-md border bg-zinc-100 px-2.5 py-0.5 tabular-nums transition-all dark:bg-zinc-900/40">
                                        {step.badge}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
