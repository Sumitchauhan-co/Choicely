import { Link } from "@tanstack/react-router";
import { Plus, Radio } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CTA() {
    return (
        <section className="bg-background border-border/30 relative w-full overflow-hidden border-t px-4 py-24 sm:px-6 md:px-12">
            {/* High-Tech Premium Grid Mesh Layer */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808004_1px,transparent_1px),linear-gradient(to_bottom,#80808004_1px,transparent_1px)] [mask-image:radial-gradient(circle_80%_at_50%_120%,#000_60%,transparent_100%)] bg-[size:32px_32px]" />

            {/* Deep Ambient Background Glow Handlers */}
            <div className="bg-primary/10 pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[350px] w-[500px] -translate-x-1/2 translate-y-1/3 rounded-full blur-[140px] sm:h-[450px] sm:w-[800px]" />
            <div className="pointer-events-none absolute -bottom-10 left-1/4 -z-10 h-[250px] w-[250px] rounded-full bg-emerald-500/5 blur-[100px]" />

            <div className="relative z-10 mx-auto max-w-4xl space-y-10 text-center">
                {/* Micro-Telemetry Badge Anchor */}

                {/* Primary Conversion Heading */}
                <div className="mx-auto max-w-2xl space-y-4">
                    <h2 className="text-foreground/90 font-sans text-3xl leading-tight font-black tracking-tight sm:text-5xl">
                        Ready to spin up a live interactive poll?
                    </h2>
                    <p className="text-muted-foreground/80 text-sm leading-relaxed font-medium sm:text-base">
                        Launch real-time, zero-refresh voting rooms instantly.
                        Share link coordinates with your team or audience and
                        watch feedback stream in over the wire.
                    </p>
                </div>

                {/* Interactive Action Command Group */}
                <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
                    <Link to="/poll/create" className="w-full sm:w-auto">
                        <Button
                            size="lg"
                            className="hover:shadow-primary/10 group h-12 w-full cursor-pointer gap-2 rounded-xl px-8 text-xs font-bold tracking-wide shadow-md transition-all duration-200 sm:w-auto"
                        >
                            <Plus className="h-4 w-4 shrink-0 transition-transform group-hover:rotate-90" />
                            Create Live Poll
                        </Button>
                    </Link>

                    <Link to="/poll" className="w-full sm:w-auto">
                        <Button
                            variant="outline"
                            size="lg"
                            className="bg-card/20 border-border/80 hover:bg-muted/50 hover:text-foreground h-12 w-full cursor-pointer gap-2 rounded-xl px-6 text-xs font-bold tracking-wide shadow-xs backdrop-blur-xs transition-all duration-200 sm:w-auto"
                        >
                            <Radio className="text-muted-foreground h-3.5 w-3.5 animate-pulse" />
                            Explore Active Feeds
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
