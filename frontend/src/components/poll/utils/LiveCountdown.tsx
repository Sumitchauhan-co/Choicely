import { useEffect, useState } from "react";

export function LiveCountdown({
    targetIsoString,
}: {
    targetIsoString: string;
}) {
    const [currentTime, setCurrentTime] = useState(() => Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000); // Smooth 1s ticks
        return () => clearInterval(interval);
    }, []);

    const targetTime = new Date(targetIsoString).getTime();
    const diffMs = targetTime - currentTime;

    if (diffMs <= 0) return <span>This poll has expired.</span>;

    const totalSeconds = Math.ceil(diffMs / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

    return (
        <span>This poll will remain open for another {parts.join(" ")}</span>
    );
}
