"use client"
import React from 'react'
import { motion } from "motion/react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Bot, ArrowRight } from "lucide-react";
function Hero() {

const features = [
  {
    title: "Resume-based questions",
    description: "Upload your resume and get interview questions tailored specifically to your experience and skills.",
    icon: "📄",
    color: "bg-purple-100 text-purple-700",
  },
  {
    title: "JD-matched interviews",
    description: "Paste any job description and get a mock interview perfectly aligned to what that company is looking for.",
    icon: "💼",
    color: "bg-teal-100 text-teal-700",
  },
  {
    title: "Real-time AI feedback",
    description: "Get instant, detailed feedback on your answers — covering clarity, confidence, and completeness.",
    icon: "🤖",
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Share with candidates",
    description: "Send interview links directly to candidates via email and track who has completed their session.",
    icon: "👥",
    color: "bg-orange-100 text-orange-700",
  },
  {
    title: "Performance analytics",
    description: "Track your progress over time with detailed analytics on your strengths and areas to improve.",
    icon: "📊",
    color: "bg-amber-100 text-amber-700",
  },
  {
    title: "Practice anytime",
    description: "Available 24/7 — practice at your own pace with no scheduling or coordination needed.",
    icon: "⏰",
    color: "bg-pink-100 text-pink-700",
  },
]

const steps = [
  {
    number: "01",
    title: "Upload & setup",
    description: "Upload your resume or paste the job description to get started",
  },
  {
    number: "02",
    title: "Take the interview",
    description: "Answer AI-generated questions just like a real interview session",
  },
  {
    number: "03",
    title: "Get feedback",
    description: "Receive detailed, actionable feedback to sharpen your answers",
  },
]



  return (
    <div className="min-h-screen bg-blue-100 text-white">
    
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center bg-blue-100">
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          {"Turn Preparation into Mastery with Mock Interview Assistant"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          Practice real interview scenarios, receive intelligent feedback, and build the confidence to perform at your best when it matters most.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href={'/dashboard'}>
            <Button size={'lg'}>
              Explore Now
            </Button>
          </Link>

          <button className="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">
            Contact Support
          </button>
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
          className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
            <div className="bg-white">

      {/* Features */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-purple-600 uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-4xl font-semibold text-gray-900 tracking-tight mb-4">
            Everything you need to prepare
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-base">
            From resume parsing to real-time AI feedback — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-blue-100"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4 ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium text-purple-600 uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-4xl font-semibold text-gray-900 tracking-tight mb-16">
            Ready in 3 simple steps
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center relative rounded-3xl bg-blue-100">
                <div className="w-12 h-12 rounded-full border-2 border-purple-200 bg-purple-50 flex items-center justify-center text-purple-600 font-semibold text-sm mb-4">
                  {step.number}
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-6 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-px bg-purple-100" />
                )}
                <h3 className="text-base font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
          </div>
        </motion.div>
      </div>
    </div>
    </div>
  )
}

export default Hero