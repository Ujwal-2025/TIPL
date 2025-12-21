"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import NavDropdown from "./NavDropdown";

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 z-50"
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Glassmorphic background */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md border-b border-white/6" />

            <div className="relative px-8 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex-shrink-0"
                >
                    <h1 className="text-white font-bold text-xl tracking-tight">TIPL</h1>
                </motion.div>

                {/* Navigation Links */}
                <motion.div
                    className="flex items-center gap-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    {/* Creation with Dropdown */}
                    <div className="relative">
                        <button
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                            className="text-white/90 hover:text-white transition-colors text-sm font-medium"
                        >
                            Creation
                        </button>
                        <AnimatePresence>
                            {isDropdownOpen && (
                                <NavDropdown
                                    onClose={() => setIsDropdownOpen(false)}
                                    items={["Employee", "Project", "Manager"]}
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Other Nav Links */}
                    {["Progress", "Salary", "Attendance"].map((item, index) => (
                        <motion.a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                        >
                            {item}
                        </motion.a>
                    ))}
                </motion.div>
            </div>
        </motion.nav>
    );
}
