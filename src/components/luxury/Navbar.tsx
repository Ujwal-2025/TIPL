"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import NavDropdown from "./NavDropdown";
import Link from "next/link";

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const pathname = usePathname();

    // Navigation links with their routes
    const navLinks = [
        { name: "Progress", href: "/admin/progress" },
        { name: "Salary", href: "/admin/salary" },
        { name: "Attendance", href: "/attendance" },
    ];

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
                    <Link href="/luxury">
                        <h1 className="text-white font-bold text-xl tracking-tight cursor-pointer">TIPL</h1>
                    </Link>
                </motion.div>

                {/* Navigation Links */}
                <motion.div
                    className="flex items-center gap-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    {/* Creation with Dropdown (keeps open while hovering trigger or menu) */}
                    <div
                        className="relative"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <button
                            className={cn(
                                "relative text-sm font-medium transition-all duration-200",
                                pathname?.startsWith('/admin/creation')
                                    ? "text-white after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-[2px] after:bg-white after:rounded-full after:shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                                    : "text-white/90 hover:text-white"
                            )}
                        >
                            Creation
                        </button>
                        <AnimatePresence>
                            {isDropdownOpen && (
                                <NavDropdown
                                    onClose={() => setIsDropdownOpen(false)}
                                    items={["Employee", "Project", "Manager", "Attendance"]}
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Other Nav Links */}
                    {navLinks.map((link, index) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.name} href={link.href}>
                                <motion.div
                                    className={cn(
                                        "relative text-sm font-medium cursor-pointer transition-all duration-200",
                                        isActive
                                            ? "text-white after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-[2px] after:bg-white after:rounded-full after:shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                                            : "text-white/80 hover:text-white"
                                    )}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                                >
                                    {link.name}
                                </motion.div>
                            </Link>
                        );
                    })}
                </motion.div>
            </div>
        </motion.nav>
    );
}
