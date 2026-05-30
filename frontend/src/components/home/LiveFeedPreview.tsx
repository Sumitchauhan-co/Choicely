import { useState, useEffect } from "react";

import { Link } from "@tanstack/react-router";
import { Clock, ArrowUpRight, Terminal, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";

// Mocking 2 active polls with added 'name' fields for the identifier context mapping
const PREVIEW_POLLS = [
    {
        id: "poll-87a3",
        name: "NextJS-15",
        question:
            "Which state management model fits Next.js 15 Server Actions cleanly?",
        creator: "Sumit Chauhan",
        initials: "S",
        votes: 42,
        expiresInMinutes: 45,
    },
    {
        id: "poll-34b9",
        name: "Database-Opt",
        question:
            "Should database optimization rely on strict indexing or application-level caching patterns?",
        creator: "Alex Rivers",
        initials: "A",
        votes: 128,
        expiresInMinutes: 120,
    },
];

export default function LiveFeedPreview() {
    const [timeLeft, setTimeLeft] = useState(2700); // 45 minutes in seconds countdown
    const [sysLogs, setSysLogs] = useState<string[]>([
        "SYSTEM: Initializing live socket handshake...",
        "CLUSTER: Connected to enclave-node-04.",
        "TELEMETRY: Pulled active poll indexing maps.",
    ]);

    // Simulated WebSocket state hook references
    const mockLiveMetrics: Record<string, { totalVotes: number }> = {
        "poll-87a3": { totalVotes: 42 },
        "poll-34b9": { totalVotes: 131 },
    };

    // 1. Simulate active closing countdown micro-interactions
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 2700));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // 2. Simulate incoming system telemetry logs rolling in
    useEffect(() => {
        const logTemplates = [
            "VOTE: Session token validated for anonymous cluster user.",
            "METRIC: Real-time chart distribution re-computed.",
            "ROUTER: Pre-fetching active database page parameters.",
            "SECURITY: Session validation check cleared successfully.",
        ];

        const logInterval = setInterval(() => {
            const randomLog =
                logTemplates[Math.floor(Math.random() * logTemplates.length)];
            const timestamp = new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });

            setSysLogs(prev => [
                `[${timestamp}] ${randomLog}`,
                prev[0],
                prev[1],
            ]);
        }, 3000);

        return () => clearInterval(logInterval);
    }, []);

    const formatCountdown = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}m ${secs.toString().padStart(2, "0")}s`;
    };

    return (
        <section className="bg-background border-border/40 relative w-full overflow-hidden border-t px-4 py-16 sm:px-6 md:px-12 md:py-24">
            {/* Ambient Tech Grid Background Layer */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] bg-[size:24px_24px]" />

            <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-12">
                {/* Left Side: Context Marketing Copy Row */}
                <div className="max-w-xl space-y-5 text-left lg:col-span-5 lg:max-w-none">
                    <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-sans text-xs font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                        </span>
                        Live Active Stream
                    </div>
                    <h2 className="text-foreground/90 font-sans text-3xl leading-none font-black tracking-tight sm:text-4xl lg:text-5xl">
                        Precision Live Telemetry.
                        <br />
                        <span className="from-foreground via-foreground/80 to-muted-foreground bg-gradient-to-r bg-clip-text text-transparent">
                            Synced To Every Choice.
                        </span>
                    </h2>
                    <p className="text-muted-foreground/80 text-sm leading-relaxed font-medium md:text-base">
                        Watch instances process choices in real time. No
                        constant browser refreshes, no delayed cache updates.
                        Decisions sync across components instantly.
                    </p>
                    <div className="pt-2">
                        <Link to="/poll">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-border/80 hover:bg-muted/60 hover:text-foreground h-9 cursor-pointer gap-2 rounded-xl px-4 text-xs font-semibold shadow-xs transition-all duration-200"
                            >
                                Explore Live Network
                                <ArrowUpRight className="text-muted-foreground h-3.5 w-3.5" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Right Side: High-Premium Integrated Interface Panel Frame */}
                <div className="grid w-full gap-4 lg:col-span-7">
                    {/* Main Active Stream List Stack */}
                    <div className="w-full space-y-3.5">
                        {PREVIEW_POLLS.map((poll, idx) => {
                            const liveTotalVotes = mockLiveMetrics[poll.id]
                                ? mockLiveMetrics[poll.id].totalVotes
                                : poll.votes;

                            return (
                                <div
                                    key={poll.id}
                                    className="group bg-card/20 border-border/50 hover:border-primary/30 hover:bg-card/40 flex flex-col space-y-4 rounded-2xl border p-5 shadow-xs backdrop-blur-xs transition-all duration-300 hover:shadow-[0_0_30px_-15px_rgba(0,0,0,0.3)]"
                                >
                                    <div className="items-between flex justify-between gap-3 text-xs">
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="bg-primary/10 text-primary border-primary/20 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold uppercase select-none">
                                                    {poll.initials}
                                                </div>
                                                <span className="text-foreground/70 group-hover:text-foreground max-w-[90px] truncate font-semibold transition-colors sm:max-w-[130px]">
                                                    {poll.creator}
                                                </span>
                                            </div>
                                            {/* Styled Unique Poll Name Identifier tag block */}
                                            {poll.name && (
                                                <div className="bg-secondary text-secondary-foreground border-border/60 inline-flex max-w-[90px] shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 select-none sm:max-w-[120px]">
                                                    <Tag className="text-muted-foreground h-2.5 w-2.5 shrink-0" />
                                                    <span className="truncate font-sans text-[10px] font-bold tracking-tight uppercase">
                                                        {poll.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap justify-end gap-3 sm:gap-4">
                                            <div className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-2.5 py-1.5 font-mono text-xs font-bold text-emerald-600 tabular-nums shadow-2xs transition-colors group-hover:border-emerald-500/20 group-hover:bg-emerald-500/10 dark:text-emerald-400">
                                                <span className="relative flex h-1.5 w-1.5">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                                </span>
                                                votes: {liveTotalVotes}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/15 bg-amber-500/5 px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-amber-600 select-none dark:text-amber-400">
                                                    <Clock className="h-3 w-3 animate-pulse" />
                                                    {idx === 0
                                                        ? formatCountdown(
                                                              timeLeft
                                                          )
                                                        : "closes in 2h"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="text-foreground/90 group-hover:text-foreground text-left font-sans text-sm leading-snug font-semibold tracking-tight transition-colors md:text-base">
                                            {poll.question}
                                        </h3>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Integrated Horizontal Telemetry System Log Window */}
                    <div className="relative space-y-1.5 overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-50 p-4 text-left font-mono text-[10px] text-zinc-600 shadow-sm transition-colors duration-200 dark:border-zinc-900/60 dark:bg-zinc-950 dark:text-zinc-400 dark:shadow-md">
                        {/* Terminal / Logs Header Badge */}
                        <div className="absolute top-3.5 right-4 hidden items-center gap-1.5 text-zinc-400 select-none sm:flex dark:text-zinc-600">
                            <Terminal className="h-3 w-3" />
                            <span className="text-[9px] font-bold tracking-wider uppercase">
                                Logs
                            </span>
                        </div>

                        {/* Log Stream Map Render */}
                        {sysLogs.map((log, index) => (
                            <div
                                key={index}
                                className={`truncate tracking-tight transition-all duration-300 ${
                                    index === 0
                                        ? "text-primary/90 font-medium"
                                        : index === 1
                                          ? "text-zinc-700 dark:text-zinc-400"
                                          : "text-zinc-400 dark:text-zinc-500"
                                }`}
                            >
                                {log.startsWith("[")
                                    ? log
                                    : `[${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}] ${log}`}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
