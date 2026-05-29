import { Globe, BarChart3, Shield, Zap } from "lucide-react";

import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";

export default function BentoFeaturesSection() {
    const features = [
        {
            Icon: Zap,
            name: "Real-Time Instance Creation",
            description:
                "Deploy interactive workspace modules instantly with zero caching pipeline delays or configuration sync limits.",
            href: "/poll/create",
            cta: "Deploy instance",
            background: (
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_100%,#000_60%,transparent_100%)] bg-[size:14px_24px] opacity-80" />
            ),
            className: "col-span-3 lg:col-span-2",
        },
        {
            Icon: BarChart3,
            name: "Advanced Analytics Telemetry",
            description:
                "Visualize deployment metrics through high-performance responsive charts, tracking active users seamlessly.",
            href: "/dashboard/analytics",
            cta: "Open dashboard",
            background: (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent" />
            ),
            className: "col-span-3 lg:col-span-1",
        },
        {
            Icon: Globe,
            name: "Global Discovery Rooms",
            description:
                "Cast public interactive enclaves onto our public global indexing cluster network with a single click.",
            href: "/",
            cta: "Browse cluster",
            background: (
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-transparent" />
            ),
            className: "col-span-3 lg:col-span-1",
        },
        {
            Icon: Shield,
            name: "Private Enclave Sandboxes",
            description:
                "Lock down individual choice sessions behind encrypted access parameters, keeping internal strategy data secure.",
            href: "/poll/create",
            cta: "Secure space",
            background: (
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] [mask-image:radial-gradient(circle_at_center,transparent_20%,#000_100%)] bg-[size:20px_20px] opacity-40" />
            ),
            className: "col-span-3 lg:col-span-2",
        },
    ];

    return (
        <section className="bg-background border-border/40 relative w-full overflow-hidden border-t px-6 py-20 md:px-12">
            {/* Ambient Base Light Pattern */}
            <div className="bg-primary/5 dark:bg-primary/5 pointer-events-none absolute top-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full blur-3xl" />

            <div className="mx-auto max-w-6xl space-y-20 sm:space-y-24">
                {/* Section Header Text Block */}
                <div className="space-y-10 text-center sm:space-y-12">
                    <div className="bg-primary/5 border-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] font-bold tracking-widest uppercase sm:text-xs">
                        Infrastructure Ecosystem
                    </div>
                    <div className="flex flex-col gap-4 sm:gap-6">
                        <h2 className="text-foreground/90 font-sans text-3xl font-black tracking-tight md:text-5xl">
                            Architecture For Every Choice
                        </h2>
                        <p className="text-muted-foreground/80 mx-auto max-w-lg text-sm font-medium sm:text-[1rem]">
                            Choiceley unifies real-time interactive mapping data
                            and workspace metrics inside a single,
                            high-performance platform.
                        </p>
                    </div>
                </div>

                {/* MagicUI Responsive Bento Structural Block */}
                <BentoGrid className="w-full auto-rows-[220px] grid-cols-3 gap-6 sm:gap-4">
                    {features.map((feature, idx) => (
                        <BentoCard
                            key={idx}
                            {...feature}
                            // Custom layout override to inject TanStack local routing link engine seamlessly
                            className={`${feature.className} border-border/70 hover:border-primary/40 dark:hover:border-primary/20 bg-card/30 group overflow-hidden rounded-2xl border backdrop-blur-xs transition-all duration-300`}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
}
