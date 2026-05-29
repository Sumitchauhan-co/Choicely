import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    resolve: {
        alias: { "@": path.resolve(__dirname, "./src") },
    },
    plugins: [
        tanstackRouter({ target: "react", autoCodeSplitting: true }),
        react(),
        tailwindcss(),
    ],
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        if (
                            id.includes("react-icons") ||
                            id.includes("lucide-react")
                        )
                            return "vendor-icons";
                        if (
                            id.includes("framer-motion") ||
                            id.includes("motion")
                        )
                            return "vendor-animations";
                        if (
                            id.includes("recharts") ||
                            id.includes("d3") ||
                            id.includes("chart.js")
                        )
                            return "vendor-charts";
                        if (id.includes("@tanstack")) return "vendor-router";
                        if (
                            id === "react" ||
                            id.includes("node_modules/react/") ||
                            id.includes("node_modules/react-dom/")
                        )
                            return "vendor-react-core";
                        if (id.includes("canvas-reveal-effect")) {
                            return "vendor-canvas";
                        }
                    }
                },
            },
        },
    },
});
