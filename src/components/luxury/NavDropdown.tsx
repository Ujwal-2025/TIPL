"use client";

import { motion } from "framer-motion";

interface NavDropdownProps {
    items: string[];
    onClose: () => void;
}

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
                <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    onClick={onClose}
                >
                    {item}
                </motion.a>
            ))}
        </motion.div>
    );
}
