"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
    return (
        <motion.div
            className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            {/* Main Heading */}
            <motion.h1
                className="text-6xl sm:text-7xl lg:text-7xl font-bold text-white text-center uppercase tracking-tight max-w-4xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
            >
                Attend. Track.{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
                    Earn.
                </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
                className="mt-6 text-base sm:text-lg text-gray-400 text-center max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                Real-time GPS and biometric attendance tracking with intelligent salary
                calculation. Built for teams that value accuracy and fairness.
            </motion.p>

            {/* CTA: View Attendance only */}
            <motion.div
                className="mt-10 flex items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
            >
                <Link href="/attendance">
                    <motion.button
                        className="px-8 py-4 rounded-full bg-transparent text-white font-semibold text-base border border-indigo-500/50 hover:border-indigo-400 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        View Attendance
                    </motion.button>
                </Link>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <svg
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                </svg>
            </motion.div>
        </motion.div>
    );
}
