"use client";

import { useMotionValue, motion, useMotionTemplate } from "motion/react";
import React, {
    type MouseEvent as ReactMouseEvent,
    useState,
    useEffect,
} from "react";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { cn } from "@/lib/utils";

export const CardSpotlight = ({
    children,
    radius = 350,
    color,
    className,
    ...props
}: {
    radius?: number;
    color?: string;
    children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const [isDark, setIsDark] = useState(() =>
        typeof document !== "undefined"
            ? document.documentElement.classList.contains("dark")
            : false,
    );

    useEffect(() => {
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };

        checkTheme();

        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    function handleMouseMove({
        currentTarget,
        clientX,
        clientY,
    }: ReactMouseEvent<HTMLDivElement>) {
        const { left, top } = currentTarget.getBoundingClientRect();

        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const [isHovering, setIsHovering] = useState(false);
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const lightModeGradient = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, rgba(0, 0, 0, 0.15) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 1) 85%, rgba(255, 255, 255, 1) 100%)`;

    const dynamicBackground =
        color ?? (isDark ? "#262626" : lightModeGradient);

    const dynamicMaskImage = useMotionTemplate`
    radial-gradient(
      ${radius}px circle at ${mouseX}px ${mouseY}px,
      white 0%,
      transparent 80%
    )
  `;

    return (
        <div
            className={cn(
                "group/spotlight p-10 rounded-md relative transition-colors duration-300",
                "bg-white border-neutral-200 text-neutral-900",
                "dark:bg-black dark:border-neutral-800 dark:text-white",
                className,
            )}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            <motion.div
                className="pointer-events-none absolute z-0 -inset-px rounded-md opacity-0 transition duration-300 group-hover/spotlight:opacity-100"
                style={{
                    backgroundImage: isDark
                        ? undefined
                        : (dynamicBackground as string),
                    backgroundColor: isDark
                        ? (dynamicBackground as string)
                        : undefined,
                    maskImage: dynamicMaskImage,
                    WebkitMaskImage: dynamicMaskImage,
                }}
            >
                {isHovering && (
                    <CanvasRevealEffect
                        animationSpeed={5}
                        containerClassName="bg-transparent absolute inset-0 pointer-events-none"
                        colors={
                            isDark
                                ? [
                                      [59, 130, 246],
                                      [139, 92, 246],
                                  ]
                                : [
                                      [245, 158, 11],
                                      [234, 179, 8],
                                  ]
                        }
                        dotSize={3}
                    />
                )}
            </motion.div>
            <div className="relative z-10">{children}</div>
        </div>
    );
};
