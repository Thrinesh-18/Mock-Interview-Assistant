"use client";
import React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AnimatedBackground from "@/components/AnimatedBackground";

function Hero() {
  const features = [
    {
      title: "Resume-based questions",
      description:
        "Upload your resume and get interview questions tailored specifically to your experience and skills.",
      color: "bg-purple-500/20 text-purple-300",
    },
    {
      title: "JD-matched interviews",
      description:
        "Paste any job description and get a mock interview perfectly aligned to what that company is looking for.",
      color: "bg-teal-500/20 text-teal-300",
    },
    {
      title: "Real-time AI feedback",
      description:
        "Get instant, detailed feedback on your answers — covering clarity, confidence, and completeness.",
      color: "bg-blue-500/20 text-blue-300",
    },
    {
      title: "Share with candidates",
      description:
        "Send interview links directly to candidates via email and track completion.",
      color: "bg-orange-500/20 text-orange-300",
    },
    {
      title: "Performance analytics",
      description:
        "Track your progress over time with detailed analytics.",
      color: "bg-amber-500/20 text-amber-300",
    },
    {
      title: "Practice anytime",
      description:
        "Available 24/7 — practice at your own pace.",
      color: "bg-pink-500/20 text-pink-300",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Upload & setup",
      description: "Upload resume or paste job description",
    },
    {
      number: "02",
      title: "Take interview",
      description: "Answer AI-generated questions",
    },
    {
      number: "03",
      title: "Get feedback",
      description: "Receive detailed feedback",
    },
  ];

  return (
    <div className="min-h-screen text-white relative overflow-hidden">

      {/* Animated Background */}
      <AnimatedBackground />

      {/* Overlay for blending */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20">

        {/* Heading */}
        <h1 className="text-center text-4xl md:text-6xl font-bold mb-6 drop-shadow-[0_0_20px_rgba(0,255,255,0.4)]">
          {"Turn Preparation into Mastery with Mock Interview Assistant"
            .split(" ")
            .map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>

        <p className="text-center text-lg text-gray-300 max-w-xl mx-auto mb-8">
          Practice real interview scenarios, receive intelligent feedback,
          and build confidence.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mb-16">
          <Link href="/dashboard">
            <Button className="!px-10 py-8 text-md rounded-lg">Explore Now</Button>
          </Link>

          <button className="px-6 py-2 border border-white/20 rounded-lg  hover:bg-white/10">
            Contact Support
          </button>
        </div>

        {/* Features */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/5  border border-white/10 hover:bg-white/10 transition"
            >
              <h3 className="font-semibold mb-2 text-xl">{f.title}</h3>
              <p className="text-lg text-gray-400">{f.description}</p>
            </div>
          ))}
        </section>

        {/* Steps */}
        <section className="grid sm:grid-cols-3 gap-8 text-center">
          {steps.map((step, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-purple-400 font-bold mb-2">{step.number}</div>
              <h3 className="font-semibold mb-2 text-xl">{step.title}</h3>
              <p className="text-lg text-gray-400">{step.description}</p>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}

export default Hero;