"use client"

import { useState } from "react"
import { ChatInterface } from "@/components/chat/ChatInterface"
import { TherapistSelector } from "@/components/chat/TherapistSelector"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useTranslations } from 'next-intl'

export default function Home() {
  const t = useTranslations('hero')
  const tf = useTranslations('features')
  const [selectedTherapist, setSelectedTherapist] = useState<string>("janet")
  
  const handleTherapistSelect = (therapist: string) => {
    setSelectedTherapist(therapist);
    // You can add any additional logic here when a therapist is selected
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-blue-950 text-white relative">
      <div className="absolute inset-0 noise opacity-20 mix-blend-overlay pointer-events-none" />
      
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      
      <div className="container mx-auto px-4 py-8 relative">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-300/80 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Therapist Selection */}
        <div className="flex justify-center mb-8">
          <TherapistSelector onSelect={handleTherapistSelect} />
        </div>

        {/* Chat Interface */}
        <ChatInterface selectedTherapist={selectedTherapist} />

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            ['availability', tf('availability.title'), tf('availability.description')],
            ['therapists', tf('therapists.title'), tf('therapists.description')],
            ['privacy', tf('privacy.title'), tf('privacy.description')]
          ].map(([key, title, description]) => (
            <div key={key} className="rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-6 hover:border-white/20 transition-all shadow-lg hover:shadow-xl">
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-gray-300/80">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
} 