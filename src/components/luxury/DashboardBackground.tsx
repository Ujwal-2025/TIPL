"use client";

import FloatingCard from "./FloatingCard";

export default function DashboardBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent" />

            {/* Floating Cards - Layer 1 (Left) */}
            <FloatingCard
                position="left"
                rotation={-6}
                delay={0}
                duration={8}
                className="w-64 h-72 md:w-80 md:h-96"
            />

            {/* Floating Cards - Layer 2 (Right) */}
            <FloatingCard
                position="right"
                rotation={6}
                delay={0.5}
                duration={6.5}
                className="w-72 h-64 md:w-96 md:h-80"
            />

            {/* Floating Cards - Layer 3 (Center Back) */}
            <FloatingCard
                position="center"
                rotation={-3}
                delay={1}
                duration={7}
                className="w-80 h-60 md:w-96 md:h-72 z-0"
            />

            {/* Ambient Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full opacity-50" />
        </div>
    );
}
