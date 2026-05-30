import { motion, type Variants } from "framer-motion";

export function LoadingAnimation() {
    const offsets = [
        [-6, -6], // Top-Left block steps out diagonally up
        [6, -4], // Top-Right block steps out wide right
        [6, 6], // Bottom-Right block steps down diagonally down
        [-4, 6], // Bottom-Left block steps out wide down
    ];

    const premiumEase = [0.16, 1, 0.3, 1] as const;

    const getVariant = (index: number): Variants => {
        return {
            animate: {
                x: [
                    0,
                    index === 1 ? offsets[1][0] : 0,
                    index === 2 ? offsets[2][0] : 0,
                    index === 3 ? offsets[3][0] : 0,
                    index === 0 ? offsets[0][0] : 0,
                    0,
                ],
                y: [
                    0,
                    index === 1 ? offsets[1][1] : 0,
                    index === 2 ? offsets[2][1] : 0,
                    index === 3 ? offsets[3][1] : 0,
                    index === 0 ? offsets[0][1] : 0,
                    0,
                ],
                transition: {
                    duration: 2.6,
                    ease: premiumEase,
                    repeat: Infinity,
                },
            },
        };
    };

    return (
        <div className="text-foreground relative flex items-center justify-center bg-transparent p-6 select-none">
            <motion.div
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                    duration: 2.6,
                    ease: "easeInOut",
                    repeat: Infinity,
                }}
                className="bg-primary/20 dark:bg-primary/15 absolute h-12 w-12 rounded-full blur-lg"
            />

            <div className="relative z-10 grid h-7 w-7 grid-cols-2 grid-rows-2">
                {/* Top-Left Module */}
                <motion.div
                    variants={getVariant(0)}
                    animate="animate"
                    className="border-primary h-full w-full rounded-xs border-[2.5px] bg-transparent shadow-xs"
                />

                {/* Top-Right Module */}
                <motion.div
                    variants={getVariant(1)}
                    animate="animate"
                    className="border-primary/90 dark:border-primary/90 h-full w-full rounded-xs border-[2.5px] bg-transparent shadow-xs"
                />

                {/* Bottom-Left Module */}
                <motion.div
                    variants={getVariant(3)}
                    animate="animate"
                    className="border-primary/80 dark:border-primary/80 h-full w-full rounded-xs border-[2.5px] bg-transparent shadow-xs"
                />

                {/* Bottom-Right Module */}
                <motion.div
                    variants={getVariant(2)}
                    animate="animate"
                    className="border-primary/70 dark:border-primary/70 h-full w-full rounded-xs border-[2.5px] bg-transparent shadow-xs"
                />
            </div>
        </div>
    );
}
