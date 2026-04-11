"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from 'react'

function Working() {
  const steps = [
    {
      title: "1. Upload Resume or Job Description",
      desc: "Upload your resume or paste a job description to customize your mock interview."
    },
    {
      title: "2. AI Generates Questions",
      desc: "The system creates interview questions based on your skills and role."
    },
    {
      title: "3. Take the Interview",
      desc: "Answer questions in real-time just like an actual interview."
    },
    {
      title: "4. Get Detailed Feedback",
      desc: "Receive scores, strengths, weaknesses, and suggestions."
    }
  ];
  
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10 text-[1.5rem]">

      {/* Hero Section */}
      <motion.div
  initial={{ opacity: 0, y: -30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="text-center"
>
  <h1 className="text-3xl font-bold">How It Works</h1>
  <p className="text-gray-600 mt-2">
    Practice real interview scenarios, receive intelligent feedback, and build the confidence to perform at your best when it matters most.
  </p>
</motion.div>

      {/* Steps Section */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="p-4 border rounded-lg bg-blue-100"
          >
            <h2 className="font-semibold">{step.title}</h2>
            <p className="text-gray-600">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Interview Preview */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="p-4 bg-blue-100 border rounded-lg"
      >
        <h2 className="font-semibold">Interview Example</h2>
        <p className="mt-2 font-medium">AI Interviewer:</p>
        <p className="text-gray-700">"Explain a challenging project you worked on."</p>

        <p className="mt-4 font-medium">Your Answer:</p>
        <p className="text-gray-500">Your response will appear here during the interview.</p>
      </motion.div>

      {/* Feedback Preview */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="p-4 border rounded-lg bg-blue-100"
      >
        <h2 className="font-semibold">Sample Feedback</h2>

        <p className="mt-2 text-blue-600 font-bold">Score: 8/10</p>

        <ul className="mt-2 space-y-1">
          <li className="text-green-600">✅ Strong technical knowledge</li>
          <li className="text-red-600">⚠️ Improve communication clarity</li>
          <li className="text-yellow-600">💡 Use structured answers (STAR method)</li>
        </ul>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-4"
      >
        {[
          { title: "🎯 Personalized", desc: "Tailored to your resume and role", color: "bg-green-100" },
          { title: "⚡ Instant Feedback", desc: "No waiting, improve immediately", color: "bg-blue-100" },
          { title: "📈 Track Progress", desc: "Monitor improvement over time", color: "bg-yellow-100" }
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-lg ${item.color}`}
          >
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Link href={`/dashboard`}>
         <Button className="!px-15 py-10 text-xl">Get Started <ArrowRight className="size-7"/></Button>
        </Link>
      </motion.div>

    </div>
  )
}

export default Working;

//