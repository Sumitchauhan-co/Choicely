import { Link } from "@tanstack/react-router";
import { MoveLeft } from "lucide-react";

import { LoadingAnimation } from "../shared/LoadingAnimation";

import { Button } from "@/components/ui/button";

export default function GlobalNotFound() {
    return (
        <div className="bg-background text-foreground relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 antialiased select-none md:px-12">
            {/* Ambient High-Tech Grid Background Mask */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_75%,transparent_100%)] bg-[size:16px_28px]" />

            {/* Soft Central Radial Glow */}
            <div className="bg-primary/5 dark:bg-primary/10 pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

            {/* Content Layout Area */}
            <div className="relative w-full max-w-xl space-y-8 py-12 text-center">
                {/* Embedded Loading Telemetry Indicator */}
                <div className="flex scale-110 justify-center">
                    <LoadingAnimation />
                </div>

                {/* Typography Matrix */}
                <div className="space-y-4">
                    <h1 className="from-foreground via-foreground/90 to-foreground/20 bg-gradient-to-b bg-clip-text font-mono text-8xl leading-none font-black tracking-tighter text-transparent md:text-9xl">
                        404
                    </h1>

                    <div className="space-y-3">
                        <h2 className="text-primary mx-auto w-fit rounded-full px-3 py-1 font-mono text-lg font-bold tracking-widest uppercase backdrop-blur-xs">
                            Route Missing
                        </h2>

                        <p className="text-muted-foreground/80 mx-auto max-w-sm font-sans text-sm leading-relaxed font-medium">
                            The requested enclave path does not match any
                            registered endpoints in this system workspace.
                        </p>
                    </div>
                </div>

                {/* Navigation Action */}
                <div className="flex items-center justify-center pt-2">
                    <Link to="/">
                        <Button
                            variant="default"
                            size="default"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 cursor-pointer gap-3 rounded-2xl px-6 text-xs font-bold shadow-md transition-all duration-200 active:scale-[0.98]"
                        >
                            <MoveLeft className="h-4 w-4 stroke-[2.5]" />
                            <span className="text-sm">Return to Base</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
