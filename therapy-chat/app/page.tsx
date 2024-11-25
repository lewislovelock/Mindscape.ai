"use client"

import { ChatInterface } from "@/components/chat/ChatInterface"
import { TherapistSelector } from "@/components/chat/TherapistSelector"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-800 text-white relative">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
      
      <div className="container mx-auto px-4 py-8 relative">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            AI Therapy Companion
          </h1>
          <p className="text-xl text-gray-300/80 max-w-2xl mx-auto">
            Experience compassionate and understanding therapy sessions with our AI-powered therapists. Available 24/7, completely confidential.
          </p>
        </div>

        {/* Therapist Selection */}
        <div className="flex justify-center mb-8">
          <TherapistSelector onSelect={(therapist) => {
            // Handle therapist selection
          }} />
        </div>

        {/* Chat Interface */}
        <ChatInterface />

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {["24/7 Availability", "Multiple Therapists", "Secure & Private"].map((title, i) => (
            <div key={i} className="rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-6 hover:border-white/20 transition-all shadow-lg hover:shadow-xl">
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-gray-300/80">Access therapeutic support whenever you need it, day or night.</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}