import React from "react";

import { AlertTriangle, X } from "lucide-react";

interface AlertBannerProps {
    message?: string;
    onClose?: () => void;
    className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
    message = "The service is currently unavailable.",
    onClose,
    className = "",
}) => {
    return (
        <div
            role="alert"
            className={`border-border bg-card/80 text-card-foreground relative flex w-full items-center justify-center gap-2.5 rounded-full border px-8 py-2 text-sm shadow-sm backdrop-blur-md transition-colors ${className}`}
        >
            <div className="flex items-center justify-center gap-2 text-center">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 dark:text-red-400" />
                <span className="text-foreground text-xs font-medium sm:text-sm">
                    {message}
                </span>
            </div>

            {onClose && (
                <button
                    onClick={onClose}
                    type="button"
                    aria-label="Close banner"
                    className="text-muted-foreground hover:bg-accent hover:text-foreground focus:ring-ring absolute top-1/2 right-3 inline-flex h-5 w-5 shrink-0 -translate-y-1/2 items-center justify-center rounded-full transition-colors focus:ring-1 focus:outline-none"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            )}
        </div>
    );
};

export default AlertBanner;
