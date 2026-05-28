import { useEffect, useMemo, useState } from "react";

import Autoplay from "embla-carousel-autoplay";

import { CardSpotlight } from "@/components/ui/card-spotlight";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";

export function AuthBanner() {
    const [isDark, setIsDark] = useState(() =>
        typeof document !== "undefined"
            ? document.documentElement.classList.contains("dark")
            : false
    );

    useEffect(() => {
        const checkTheme = () =>
            setIsDark(document.documentElement.classList.contains("dark"));

        checkTheme();

        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    const autoplayPlugin = useMemo(
        () => [Autoplay({ delay: 3500, stopOnInteraction: false })],
        []
    );

    const slides = [
        {
            quote: "“The easiest way to capture audience feedback live without complex layouts or manual code search inputs.”",
            feature: "Live Feedback Loop",
        },
        {
            quote: "“Create beautiful, engaging real-time polls that seamlessly blend into your existing presentations and apps.”",
            feature: "Instant Integration",
        },
        {
            quote: "“Analyze responses instantly with centralized dashboards designed specifically for modern developers.”",
            feature: "Centralized Analytics",
        },
    ];

    return (
        <CardSpotlight
            radius={200}
            {...(isDark
                ? {
                      color: "var(--spotlight-color, rgba(255, 255, 255, 0.255))",
                  }
                : {})}
            className="dark:from-primary/10 dark:via-accent/5 dark:to-background dark:border-border relative hidden flex-col justify-center overflow-hidden border-l border-neutral-200 bg-linear-to-br from-neutral-100 via-neutral-50 to-white p-0 text-neutral-900 transition-colors duration-300 select-none md:flex dark:text-white"
        >
            <div className="relative z-20 flex h-full w-full cursor-grab items-center p-12 active:cursor-grabbing">
                <Carousel
                    plugins={autoplayPlugin}
                    className="w-full"
                    opts={{
                        loop: true,
                        align: "start",
                        watchDrag: true,
                    }}
                >
                    <CarouselContent>
                        {slides.map((slide, idx) => (
                            <CarouselItem key={idx} className="space-y-4">
                                <div className="dark:bg-primary/10 dark:text-primary inline-flex items-center gap-1.5 rounded-full bg-neutral-900/10 px-3 py-1 text-xs font-semibold text-neutral-800">
                                    <span className="dark:bg-primary flex h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-800" />
                                    {slide.feature}
                                </div>
                                <blockquote>
                                    <p className="dark:text-foreground text-2xl leading-relaxed font-medium tracking-tight text-neutral-900">
                                        {slide.quote}
                                    </p>
                                </blockquote>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </CardSpotlight>
    );
}
