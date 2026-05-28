import { useEffect, useRef } from "react";

export function Sparkles() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        const particles: Array<{
            x: number;
            y: number;
            size: number;
            angle: number;
            speed: number;
            opacity: number;
            targetOpacity: number;
            vs: number;
        }> = [];

        const isDark = () =>
            document.documentElement.classList.contains("dark");

        const resizeCanvas = () => {
            canvas.width = canvas.parentElement?.clientWidth || 320;
            canvas.height = canvas.parentElement?.clientHeight || 80;
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const createParticle = (initFullCanvas = false) => {
            if (!canvas) return;
            const size = Math.random() * 1.4 + 0.3;
            const x = Math.random() * canvas.width;
            const y = initFullCanvas
                ? Math.random() * canvas.height
                : Math.random() * 10;

            const opacity = Math.random() * 0.7 + 0.2;

            particles.push({
                x,
                y,
                size,
                angle: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.12 + 0.04,
                opacity: opacity,
                targetOpacity: opacity,
                vs: Math.random() * 0.02 + 0.005,
            });
        };

        for (let i = 0; i < 300; i++) {
            createParticle(true);
        }

        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (particles.length < 800) {
                createParticle(false);
            }

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                p.angle += (Math.random() - 0.5) * 0.1;
                p.x += Math.cos(p.angle) * p.speed;
                p.y += Math.sin(p.angle) * p.speed + 0.02;

                if (Math.random() > 0.98) {
                    p.targetOpacity = Math.random() * 0.8 + 0.2;
                }
                if (p.opacity < p.targetOpacity) p.opacity += p.vs;
                if (p.opacity > p.targetOpacity) p.opacity -= p.vs;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y > canvas.height) {
                    p.y = 0;
                    p.x = Math.random() * canvas.width;
                }
                if (p.y < 0) p.y = canvas.height;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = isDark()
                    ? `rgba(255, 255, 255, ${p.opacity})`
                    : `rgba(0, 0, 0, ${p.opacity})`;
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none h-full w-full"
            style={{
                maskImage:
                    "radial-gradient(ellipse 55% 100% at top, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 85%)",
                WebkitMaskImage:
                    "radial-gradient(ellipse 55% 100% at top, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 85%)",
            }}
        />
    );
}
