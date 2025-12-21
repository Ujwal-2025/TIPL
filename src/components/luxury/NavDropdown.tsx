"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface NavDropdownProps {
    items: string[];
    onClose: () => void;
}

// Map menu items to their specific page routes
const getItemLink = (item: string) => {
    const itemLower = item.toLowerCase();
    if (itemLower === 'employee') {
        return '/admin/creation/employee';
    }
    if (itemLower === 'manager') {
        return '/admin/creation/manager';
    }
    if (itemLower === 'project') {
        return '/admin/creation/project';
    }
    if (itemLower === 'attendance') {
        return '/admin/attendance/create';
    }
    return `#${itemLower}`;
};

export default function NavDropdown({ items, onClose }: NavDropdownProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full mt-2 left-0 bg-black/60 backdrop-blur-xl rounded-lg border border-white/10 overflow-hidden shadow-2xl"
        >
            {items.map((item, index) => (
                <Link key={item} href={getItemLink(item)}>
                    <motion.div
                        className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium cursor-pointer"
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        onClick={onClose}
                    >
                        {item}
                    </motion.div>
                </Link>
            ))}
        </motion.div>
    );
}
