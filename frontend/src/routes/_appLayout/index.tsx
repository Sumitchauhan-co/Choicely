import { createFileRoute } from "@tanstack/react-router";

import BentoFeaturesSection from "@/components/home/BentoFeatures";
import CTA from "@/components/home/CTA";
import HeroSection from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import LiveFeedPreview from "@/components/home/LiveFeedPreview";

export const Route = createFileRoute("/_appLayout/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <>
            <HeroSection />
            <LiveFeedPreview />
            <BentoFeaturesSection />
            <HowItWorks />
            <CTA />
        </>
    );
}
