"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  // Animation state management
  const [logoMoved, setLogoMoved] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Check if both fields are filled
  const bothFieldsFilled = username.trim() !== "" && password.trim() !== "";

  // Trigger animations in sequence: logo center pulse -> slide left + shrink -> show form
  useEffect(() => {
    // Tighten sequence to remove idle gap
    const moveTimer = setTimeout(() => setLogoMoved(true), 1800); // start slide a bit sooner
    const formTimer = setTimeout(() => setShowForm(true), 2400); // bring form shortly after slide starts

    return () => {
      clearTimeout(moveTimer);
      clearTimeout(formTimer);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to tRPC + Prisma authentication
    console.log("Login attempt:", { username, password });
    router.push("/luxury");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black"
      style={{ backgroundColor: '#0E0F12' }}
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div
          className="relative flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16"
        >

          {/* LEFT SIDE: Logo */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ x: 0, scale: 1.3 }}
            animate={{
              x: logoMoved ? -320 : 0,
              scale: logoMoved ? 0.95 : [1.3, 1.38, 1.3],
            }}
            transition={{
              duration: logoMoved ? 0.9 : 1.8,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="relative w-72 h-72 lg:w-[22rem] lg:h-[22rem] flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* TIPL Logo Text */}
              <div className="text-center">
                <div 
                  className="text-8xl font-bold mb-4"
                  style={{ color: '#6366F1' }}
                >
                  TIPL
                </div>
                <p 
                  className="text-xl font-light tracking-widest"
                  style={{ color: '#A1A1AA' }}
                >
                  ATTENDANCE
                </p>
              </div>

              {/* Pulsing ring effect during animation */}
              {!logoMoved && (
                <motion.div
                  className="absolute inset-0 rounded-full border-4"
                  style={{ borderColor: '#6366F1' }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{
                    duration: 3,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE: Login Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                className="w-full max-w-md lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2"
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                {/* Welcome Heading */}
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                >
                  <h1 className="text-4xl lg:text-5xl font-bold" style={{ color: '#FFFFFF' }}>
                    Welcome to TIPL
                  </h1>
                  <p className="mt-2 text-lg" style={{ color: '#A1A1AA' }}>
                    Sign in to continue
                  </p>
                </motion.div>

                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Username Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <label
                      htmlFor="username"
                      className="block text-sm font-semibold mb-2"
                      style={{ color: '#FFFFFF' }}
                    >
                      Username
                    </label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-6 text-lg rounded-xl border transition-all duration-300 focus:ring-2"
                      style={{
                        backgroundColor: '#1A1D23',
                        borderColor: 'rgba(255,255,255,0.1)',
                        color: '#FFFFFF',
                      }}
                    />
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold mb-2"
                      style={{ color: '#FFFFFF' }}
                    >
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-6 text-lg rounded-xl border transition-all duration-300 focus:ring-2"
                      style={{
                        backgroundColor: '#1A1D23',
                        borderColor: 'rgba(255,255,255,0.1)',
                        color: '#FFFFFF',
                      }}
                    />
                  </motion.div>

                  {/* Button appears only when both fields are filled */}
                  <AnimatePresence>
                    {bothFieldsFilled && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                          duration: 0.5,
                          type: "spring",
                          stiffness: 200,
                        }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Button
                            type="submit"
                            className="w-full py-6 text-xl font-bold rounded-xl shadow-lg transition-all duration-300"
                            style={{
                              backgroundColor: '#6366F1',
                              color: '#FFFFFF',
                            }}
                          >
                            Let&apos;s Start
                          </Button>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Helper Text */}
                  <motion.div
                    className="text-center pt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <p
                      className="text-sm"
                      style={{ color: '#A1A1AA' }}
                    >
                      Need help?{' '}
                      <motion.a
                        href="#"
                        className="font-semibold underline"
                        style={{ color: '#6366F1' }}
                        whileHover={{ scale: 1.05 }}
                      >
                        Contact Support
                      </motion.a>
                    </p>
                  </motion.div>
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer pinned to bottom center */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
      >
        <p className="text-sm" style={{ color: '#A1A1AA' }}>
          © 2025 TIPL. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
