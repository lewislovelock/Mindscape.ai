import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"

interface Therapist {
  name: string
  description: string
}

export function TherapistSelector({ onSelect }: { onSelect: (therapist: string) => void }) {
  const [therapists, setTherapists] = useState<Record<string, Therapist>>({})

  useEffect(() => {
    fetch("http://localhost:8000/therapists")
      .then(res => res.json())
      .then(setTherapists)
  }, [])

  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-[240px] h-[48px] rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 shadow-lg">
        <SelectValue placeholder="Select Therapist" className="text-gray-300/80" />
      </SelectTrigger>
      <SelectContent className="rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-xl animate-in fade-in-80 slide-in-from-top-2">
        <div className="p-2 space-y-1">
          {Object.entries(therapists).map(([key, therapist]) => (
            <SelectItem 
              key={key} 
              value={key}
              className="rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/10 focus:bg-white/10 data-[highlighted]:bg-white/10 py-2 px-3"
            >
              <div className="flex flex-col">
                <span className="font-medium text-white/90">{therapist.name}</span>
                <span className="text-sm text-gray-400/80">{therapist.description}</span>
              </div>
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  )
} 