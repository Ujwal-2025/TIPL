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
        return '/admin/attendance/group';
    }
    return `#${itemLower}`;
};

export default function NavDropdown({ items, onClose }: NavDropdownProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute top-full mt-4 left-1/2 -translate-x-1/2 flex flex-col gap-3"
        >
            {items.map((item, index) => (
                <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                >
                    <Link
                        href={getItemLink(item)}
                        className="glassy-nav__item px-6 py-3 text-white/85 hover:text-white transition-all duration-200 text-sm font-medium cursor-pointer whitespace-nowrap"
                        style={{ borderRadius: 8 }}
                        onClick={onClose}
                    >
                        {item}
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );
}
