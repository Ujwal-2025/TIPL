"use client";

import Navbar from "@/components/luxury/Navbar";
import HeroSection from "@/components/luxury/HeroSection";
import DashboardBackground from "@/components/luxury/DashboardBackground";

export default function LuxuryPage() {
    return (
        <div className="relative w-full min-h-screen bg-black">
            {/* Primary Background */}
            <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black" />

            {/* Grid Pattern Background */}
            <div
                className="fixed inset-0 opacity-5"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)
          `,
                    backgroundSize: "50px 50px",
                }}
            />

            {/* Floating Dashboard Cards Background */}
            <DashboardBackground />

            {/* Navigation */}
            <Navbar />

            {/* Hero Section */}
            <HeroSection />

            {/* Noise Texture */}
            <div
                className="fixed inset-0 pointer-events-none opacity-5"
                style={{
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /></filter><rect width="100" height="100" filter="url(%23noise)" /></svg>')`,
                }}
            />
        </div>
    );
}
