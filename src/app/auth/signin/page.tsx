"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.ok) {
            router.push("/dashboard");
        } else {
            alert("Invalid credentials");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0A1931' }}>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating Gradient Orbs */}
                <motion.div
                    className="absolute w-96 h-96 rounded-full blur-3xl opacity-30"
                    style={{ background: 'radial-gradient(circle, #4A7FA7 0%, transparent 70%)' }}
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -100, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    initial={{ top: '10%', left: '10%' }}
                />
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
                    style={{ background: 'radial-gradient(circle, #1A3D63 0%, transparent 70%)' }}
                    animate={{
                        x: [0, -150, 0],
                        y: [0, 100, 0],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    initial={{ bottom: '10%', right: '10%' }}
                />
                <motion.div
                    className="absolute w-80 h-80 rounded-full blur-3xl opacity-25"
                    style={{ background: 'radial-gradient(circle, #B3CFE5 0%, transparent 70%)' }}
                    animate={{
                        x: [0, 80, 0],
                        y: [0, -80, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    initial={{ top: '50%', right: '30%' }}
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Login Card */}
                    <motion.div
                        className="rounded-2xl shadow-2xl backdrop-blur-xl border-2 p-8"
                        style={{
                            backgroundColor: 'rgba(246, 250, 253, 0.95)',
                            borderColor: '#4A7FA7',
                        }}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        {/* Logo with Pulse/Breathing Effect */}
                        <motion.div
                            className="flex justify-center mb-8"
                            animate={{
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <motion.div
                                className="relative w-32 h-32"
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Image
                                    src="/tipl_logo.jpeg"
                                    alt="TIPL Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                                {/* Pulsing Ring Effect */}
                                <motion.div
                                    className="absolute inset-0 rounded-full border-4"
                                    style={{ borderColor: '#4A7FA7' }}
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 0, 0.5],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                            </motion.div>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            className="text-3xl font-bold text-center mb-2"
                            style={{ color: '#0A1931' }}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            Welcome Back
                        </motion.h1>
                        <motion.p
                            className="text-center mb-8"
                            style={{ color: '#1A3D63' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            Sign in to access your dashboard
                        </motion.p>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                            >
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: '#0A1931' }}
                                >
                                    Email Address
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full border-2 focus:ring-2 transition-all"
                                    style={{
                                        borderColor: '#B3CFE5',
                                        backgroundColor: '#FFFFFF',
                                    }}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                            >
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: '#0A1931' }}
                                >
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full border-2 focus:ring-2 transition-all"
                                    style={{
                                        borderColor: '#B3CFE5',
                                        backgroundColor: '#FFFFFF',
                                    }}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full text-lg font-semibold py-6 rounded-lg shadow-lg transition-all"
                                        style={{
                                            backgroundColor: '#4A7FA7',
                                            color: '#F6FAFD',
                                        }}
                                    >
                                        {isLoading ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                            />
                                        ) : (
                                            'Sign In'
                                        )}
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </form>

                        {/* Footer Links */}
                        <motion.div
                            className="mt-6 text-center space-y-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                        >
                            <p className="text-sm" style={{ color: '#1A3D63' }}>
                                Don't have an account?{' '}
                                <motion.a
                                    href="#"
                                    className="font-semibold underline"
                                    style={{ color: '#4A7FA7' }}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    Contact Admin
                                </motion.a>
                            </p>
                            <motion.p
                                className="text-xs"
                                style={{ color: '#1A3D63' }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <a href="#" className="hover:underline">
                                    Forgot Password?
                                </a>
                            </motion.p>
                        </motion.div>
                    </motion.div>

                    {/* Decorative Elements */}
                    <motion.div
                        className="mt-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                    >
                        <p className="text-sm" style={{ color: '#B3CFE5' }}>
                            © 2025 TIPL. All rights reserved.
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Animated Grid Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(#4A7FA7 1px, transparent 1px),
            linear-gradient(90deg, #4A7FA7 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px',
                }}
            />
        </div>
    );
}
