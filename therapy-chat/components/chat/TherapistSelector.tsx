"use client";

import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Therapist {
  name: string;
  description: string;
}

interface TherapistSelectorProps {
  onSelect: (therapist: string) => void;
}

export function TherapistSelector({ onSelect }: TherapistSelectorProps) {
  const t = useTranslations('chat');
  const [therapists, setTherapists] = useState<Record<string, Therapist>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await fetch('http://localhost:8000/therapists');
        if (!response.ok) throw new Error('Failed to fetch therapists');
        const data = await response.json();
        setTherapists(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load therapists');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[240px] h-[48px] rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <SelectValue placeholder={t('selectTherapist')} />
        </SelectTrigger>
      </Select>
    );
  }

  if (error) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[240px] h-[48px] rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <SelectValue placeholder="Error loading therapists" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-[240px] h-[48px] rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-200">
        <SelectValue placeholder={t('selectTherapist')} />
      </SelectTrigger>
      <SelectContent className="rounded-xl bg-slate-900/90 backdrop-blur-xl border border-white/10">
        {Object.entries(therapists).map(([id, therapist]) => (
          <SelectItem
            key={id}
            value={id}
            className="focus:bg-white/10 cursor-pointer text-white py-2 px-4"
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium">{therapist.name}</span>
              <span className="text-sm text-gray-400">{therapist.description}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 