import { useEffect } from "react";

import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import { LoadingAnimation } from "../../shared/LoadingAnimation";

export default function Docs() {
    const router = useRouter();
    const docsRedirectUrl = import.meta.env.VITE_DOCS_URL;

    useEffect(() => {
        if (!docsRedirectUrl) {
            toast.error("Redirection Failed", {
                description: "Documentation URL configuration is missing.",
                duration: 3000,
                action: {
                    label: "Undo",
                    onClick: () => {},
                },
            });

            const fallbackTimer = setTimeout(() => {
                router.history.back();
            }, 2000);

            return () => clearTimeout(fallbackTimer);
        }

        const redirectTimer = setTimeout(() => {
            window.location.replace(docsRedirectUrl);
        }, 800);

        return () => clearTimeout(redirectTimer);
    }, [docsRedirectUrl, router]);

    return (
        <div className="bg-background flex min-h-screen w-screen flex-col items-center justify-center gap-3 select-none">
            {/* Premium Micro Block Animation */}
            <LoadingAnimation />

            {/* Sleek Minimalist Messaging Frame */}
            <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col items-center gap-0.5 text-center duration-500">
                <h1 className="text-foreground font-sans text-lg font-semibold tracking-tight">
                    Redirecting to documentation
                </h1>
                <p className="text-muted-foreground text-xs font-medium tracking-wide">
                    Please wait a moment
                </p>
            </div>
        </div>
    );
}
