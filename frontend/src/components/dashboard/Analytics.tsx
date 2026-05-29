import { useState, useEffect } from "react";

import { Link } from "@tanstack/react-router";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { Globe, Layers, Plus, Vote, TrendingUp } from "lucide-react";
import { Bar, Doughnut } from "react-chartjs-2";

import { LoadingAnimation } from "../../shared/LoadingAnimation";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { usePollSocket } from "@/hooks/usePoll";
import { usePublicActivePolls, useUserCreatedPolls } from "@/hooks/usePoll";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function AnalyticsView() {
    const { data: publicPolls, isLoading: loadingPublic } =
        usePublicActivePolls();
    const { data: myPolls, isLoading: loadingMyPolls } = useUserCreatedPolls();

    // State to hold live aggregated votes mapping: { [pollId]: totalVotes }
    const [liveVotesMap, setLiveVotesMap] = useState<Record<string, number>>(
        {}
    );

    if (loadingPublic || loadingMyPolls) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                <LoadingAnimation />
                <p className="text-accent-foreground font-mono text-xs">
                    Compiling visual dashboard telemetry...
                </p>
            </div>
        );
    }

    const totalPublicActive = publicPolls?.length || 0;
    const totalMyPolls = myPolls?.length || 0;
    const publicCount = myPolls?.filter(p => p.isPublic).length || 0;
    const privateCount = myPolls?.filter(p => !p.isPublic).length || 0;

    // Core Aggregation calculation using state driven by individual socket tracking
    const totalVotesCast = Object.values(liveVotesMap).reduce(
        (acc, curr) => acc + curr,
        0
    );
    const averageVotesPerPoll =
        totalMyPolls > 0 ? (totalVotesCast / totalMyPolls).toFixed(1) : "0.0";

    // Handle reporting live metrics from child up to state tracker
    const handleLiveMetricUpdate = (pollId: string, totalVotes: number) => {
        if (liveVotesMap[pollId] !== totalVotes) {
            setLiveVotesMap(prev => ({
                ...prev,
                [pollId]: totalVotes,
            }));
        }
    };

    const barChartData = {
        labels: ["Global Active Rooms", "Your Instances"],
        datasets: [
            {
                label: "Instances Count",
                data: [totalPublicActive, totalMyPolls],
                backgroundColor: [
                    "rgba(59, 130, 246, 0.75)",
                    "rgba(168, 85, 247, 0.75)",
                ],
                borderColor: ["rgb(59, 130, 246)", "rgb(168, 85, 247)"],
                borderWidth: 1.5,
                borderRadius: 12,
                borderSkipped: false,
                maxBarThickness: 45,
            },
        ],
    };

    const pieChartData = {
        labels: ["Public Cluster", "Private Enclave"],
        datasets: [
            {
                data: [publicCount, privateCount],
                backgroundColor: [
                    "rgba(168, 85, 247, 0.8)",
                    "rgba(113, 113, 122, 0.4)",
                ],
                borderColor: ["rgb(168, 85, 247)", "rgb(113, 113, 122)"],
                borderWidth: 2,
                hoverOffset: 6,
            },
        ],
    };

    // Grab top 5 deployed polls matching live mapped data variables
    const activeTopPolls = myPolls?.slice(0, 5) || [];
    const votesChartData = {
        // Updated to use a clean short name identifier placeholder instead of long questions
        labels: activeTopPolls.map(p => p.name),
        datasets: [
            {
                label: "Live Streamed Votes",
                data: activeTopPolls.map(p => liveVotesMap[p.id] || 0),
                backgroundColor: "rgba(236, 72, 153, 0.75)",
                borderColor: "rgb(236, 72, 153)",
                borderWidth: 1.5,
                borderRadius: 8,
                borderSkipped: false,
                maxBarThickness: 30,
            },
        ],
    };

    return (
        <section className="animate-in fade-in w-full space-y-6 duration-200">
            {/* Invisible tracking layer to safely invoke custom hooks for each entity */}
            {myPolls?.map(poll => (
                <LivePollTracker
                    key={poll.id}
                    pollId={poll.id}
                    onMetricUpdate={handleLiveMetricUpdate}
                />
            ))}

            <div className="border-border/50 flex w-full items-center justify-between border-b pb-5">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">
                        Workspace Analytics
                    </h2>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                        Real-time data visualization metrics and active instance
                        telemetry logs.
                    </p>
                </div>

                <Link
                    to="/poll/create"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md px-4 text-sm font-medium shadow-sm transition-all active:scale-[0.98]"
                >
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                    <span className="hidden sm:block">Create Poll</span>
                </Link>
            </div>

            {/* Premium Metric Cards Grid */}
            <div className="grid w-full gap-4 sm:grid-cols-3">
                <div className="border-border/60 bg-card/40 hover:bg-card/60 rounded-2xl border p-5 shadow-xs backdrop-blur-md transition-all">
                    <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                        <Globe className="h-3.5 w-3.5 text-blue-500" />
                        Global Active Rooms
                    </div>
                    <div className="text-foreground mt-2 font-sans text-3xl font-black tracking-tight">
                        {totalPublicActive}
                    </div>
                    <p className="text-muted-foreground/70 mt-1 text-[10px] font-medium">
                        Currently receiving public incoming traffic
                    </p>
                </div>

                <div className="border-border/60 bg-card/40 hover:bg-card/60 rounded-2xl border p-5 shadow-xs backdrop-blur-md transition-all">
                    <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                        <Layers className="h-3.5 w-3.5 text-purple-500" />
                        Personal Instances
                    </div>
                    <div className="text-foreground mt-2 font-sans text-3xl font-black tracking-tight">
                        {totalMyPolls}
                    </div>
                    <p className="text-muted-foreground/70 mt-1 text-[10px] font-medium">
                        Cluster instances tied to your configuration
                    </p>
                </div>

                {/* Aggregated Real-time Live Socket Votes Counter Card */}
                <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-5 shadow-xs backdrop-blur-md transition-all hover:bg-pink-500/10">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-pink-500/80 uppercase">
                        <Vote className="h-3.5 w-3.5 text-pink-500" />
                        Aggregated Votes Feed
                    </div>
                    <div className="mt-2 font-sans text-3xl font-black tracking-tight text-pink-600 dark:text-pink-400">
                        {totalVotesCast}
                    </div>
                    <p className="text-muted-foreground/70 mt-1 text-[10px] font-medium">
                        Avg. {averageVotesPerPoll} submissions per active
                        instance
                    </p>
                </div>
            </div>

            {/* Premium Interactive Graphs Panel Setup */}
            <div className="grid w-full gap-4 md:grid-cols-3">
                {/* Main Feature Graph: Live Socket Streamed Volume Metrics */}
                <Card className="border-border/50 bg-card/30 w-full shadow-2xs backdrop-blur-xs md:col-span-2">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                                    Engagement Frequency Logs
                                </CardTitle>
                                <CardDescription className="text-muted-foreground/80 mt-0.5 text-[11px]">
                                    Metrics breakdown showing live socket
                                    accumulation indexes for top deployed polls.
                                </CardDescription>
                            </div>
                            <TrendingUp className="hidden h-4 w-4 text-pink-500 opacity-60 sm:block" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative h-64 pt-4">
                        <Bar
                            data={votesChartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        backgroundColor:
                                            "rgba(15, 23, 42, 0.95)",
                                        titleFont: { size: 11, weight: "bold" },
                                        bodyFont: { size: 11 },
                                        padding: 10,
                                        cornerRadius: 8,
                                    },
                                },
                                scales: {
                                    x: {
                                        grid: { display: false },
                                        ticks: {
                                            font: {
                                                family: "monospace",
                                                size: 10,
                                            },
                                            color: "rgba(150,150,150,0.8)",
                                        },
                                    },
                                    y: {
                                        border: { dash: [4, 4] },
                                        grid: {
                                            color: "rgba(150, 150, 150, 0.1)",
                                        },
                                        ticks: {
                                            font: {
                                                family: "monospace",
                                                size: 10,
                                            },
                                            color: "rgba(150,150,150,0.8)",
                                        },
                                    },
                                },
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Privacy Exposure Ring Configuration */}
                <Card className="border-border/50 bg-card/30 w-full shadow-2xs backdrop-blur-xs">
                    <CardHeader>
                        <CardTitle className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                            Privacy Exposure Distribution
                        </CardTitle>
                        <CardDescription className="text-muted-foreground/80 mt-0.5 text-[11px]">
                            Ratio allocation matching private vs public network
                            configurations.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="relative flex h-64 items-center justify-center p-4">
                        <div className="relative h-full max-h-[190px] w-full">
                            <Doughnut
                                data={pieChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    cutout: "75%",
                                    plugins: {
                                        legend: {
                                            position: "bottom",
                                            labels: {
                                                boxWidth: 8,
                                                usePointStyle: true,
                                                font: {
                                                    size: 10,
                                                    weight: "bold",
                                                },
                                                padding: 15,
                                            },
                                        },
                                        tooltip: {
                                            padding: 10,
                                            cornerRadius: 8,
                                        },
                                    },
                                }}
                            />
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-7">
                                <span className="text-2xl font-black tracking-tight">
                                    {totalMyPolls}
                                </span>
                                <span className="text-muted-foreground/60 text-[9px] font-bold tracking-wider uppercase">
                                    Total
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Workspace Volume Analytics Secondary Graph */}
                <Card className="border-border/50 bg-card/20 w-full shadow-2xs md:col-span-3">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                            Infrastructure Volume Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative h-44">
                        <Bar
                            data={barChartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                indexAxis: "y",
                                plugins: { legend: { display: false } },
                                scales: {
                                    x: {
                                        grid: {
                                            color: "rgba(150, 150, 150, 0.08)",
                                        },
                                        ticks: {
                                            font: {
                                                family: "monospace",
                                                size: 10,
                                            },
                                        },
                                    },
                                    y: {
                                        grid: { display: false },
                                        ticks: {
                                            font: { size: 11, weight: "bold" },
                                        },
                                    },
                                },
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

interface LivePollTrackerProps {
    pollId: string;
    onMetricUpdate: (pollId: string, totalVotes: number) => void;
}

// Sub-component designed specifically to safely host hooks at the top level
function LivePollTracker({ pollId, onMetricUpdate }: LivePollTrackerProps) {
    const { liveMetrics } = usePollSocket(pollId);
    const totalVotes = liveMetrics ? liveMetrics.totalVotes : 0;

    useEffect(() => {
        onMetricUpdate(pollId, totalVotes);
    }, [pollId, totalVotes, onMetricUpdate]);

    return null; // Invisible structural tracking item
}
