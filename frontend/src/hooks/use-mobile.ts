import * as React from "react";

const MOBILE_BREAKPOINT = 768;

const getMql = () => {
    if (typeof window === "undefined") return null;
    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
};

export function useIsMobile() {
    const subscribe = React.useCallback((callback: () => void) => {
        const mql = getMql();
        if (!mql) return () => {};

        mql.addEventListener("change", callback);
        return () => mql.removeEventListener("change", callback);
    }, []);

    const getSnapshot = React.useCallback(() => {
        const mql = getMql();
        return mql ? mql.matches : false;
    }, []);

    const getServerSnapshot = () => false;

    return React.useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    );
}
