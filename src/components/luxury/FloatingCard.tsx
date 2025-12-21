"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingCardProps {
    className?: string;
    rotation?: number;
    delay?: number;
    duration?: number;
    position: "left" | "right" | "center";
}

export default function FloatingCard({
    className,
    rotation = 0,
    delay = 0,
    duration = 6,
    position,
}: FloatingCardProps) {
    const positionClasses = {
        left: "bottom-32 -left-32 lg:-left-24",
        right: "top-16 -right-32 lg:-right-24",
        center: "bottom-0 left-1/2 -translate-x-1/2",
    };

    return (
        <motion.div
            className={cn(
                "absolute opacity-85 pointer-events-none",
                positionClasses[position],
                className
            )}
            initial={{ y: 0 }}
            animate={{ y: [0, -20, 0] }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
            }}
            style={{ rotate: rotation }}
        >
            {/* Glassmorphic Card */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                {/* Fake Dashboard UI */}
                <div className="space-y-4">
                    {/* Header */}
                    <div className="space-y-2">
                        <div className="h-3 bg-white/10 rounded w-1/3" />
                        <div className="h-2 bg-white/5 rounded w-1/2" />
                    </div>

                    {/* Content Blocks */}
                    <div className="space-y-3 pt-2">
                        <div className="h-2 bg-white/10 rounded w-full" />
                        <div className="h-2 bg-white/10 rounded w-5/6" />
                        <div className="h-2 bg-white/10 rounded w-4/5" />
                    </div>

                    {/* Footer Stats */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="h-8 bg-white/5 rounded" />
                        <div className="h-8 bg-white/5 rounded" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
