import { useState, useCallback } from "react";
import { Sparkles, RotateCcw, Check } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  unit: string;
  percentage: number;
  color: string;
}

const COLORS = [
  "hsl(160, 84%, 45%)", "hsl(43, 96%, 61%)", "hsl(200, 80%, 70%)",
  "hsl(280, 60%, 65%)", "hsl(340, 70%, 60%)", "hsl(20, 90%, 60%)",
  "hsl(100, 50%, 50%)", "hsl(220, 70%, 60%)", "hsl(50, 80%, 55%)",
  "hsl(170, 60%, 50%)", "hsl(0, 70%, 60%)", "hsl(130, 50%, 55%)",
];

const initialParticipants: Participant[] = [
  { id: "1", name: "María García", unit: "1ºA", percentage: 15, color: COLORS[0] },
  { id: "2", name: "Juan López", unit: "1ºB", percentage: 12, color: COLORS[1] },
  { id: "3", name: "Ana Martínez", unit: "2ºA", percentage: 10, color: COLORS[2] },
  { id: "4", name: "Carlos Ruiz", unit: "2ºB", percentage: 18, color: COLORS[3] },
  { id: "5", name: "Laura Sánchez", unit: "3ºA", percentage: 8, color: COLORS[4] },
  { id: "6", name: "Pedro Fernández", unit: "3ºB", percentage: 14, color: COLORS[5] },
  { id: "7", name: "Isabel Moreno", unit: "4ºA", percentage: 11, color: COLORS[6] },
  { id: "8", name: "David Jiménez", unit: "4ºB", percentage: 12, color: COLORS[7] },
];

export function SolarDistribution() {
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [showConfetti, setShowConfetti] = useState(false);

  const total = participants.reduce((sum, p) => sum + p.percentage, 0);
  const isComplete = total === 100;

  const updatePercentage = useCallback((id: string, value: number) => {
    setParticipants(prev =>
      prev.map(p => p.id === id ? { ...p, percentage: value } : p)
    );
  }, []);

  const suggestFairDistribution = () => {
    const equal = Math.floor(100 / participants.length);
    const remainder = 100 - equal * participants.length;
    setParticipants(prev =>
      prev.map((p, i) => ({
        ...p,
        percentage: equal + (i < remainder ? 1 : 0),
      }))
    );
  };

  const resetDistribution = () => {
    setParticipants(initialParticipants);
  };

  // Trigger confetti when reaching 100%
  const prevComplete = isComplete;
  if (isComplete && !showConfetti) {
    setTimeout(() => setShowConfetti(true), 100);
    setTimeout(() => setShowConfetti(false), 2000);
  }

  // Donut chart calculation
  const size = 200;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={suggestFairDistribution}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl solar-gradient text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
        >
          <Sparkles className="w-4 h-4" />
          Sugerir reparto justo
        </button>
        <button
          onClick={resetDistribution}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reiniciar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut chart */}
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center relative">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth={strokeWidth}
            />
            {/* Segments */}
            {participants.map((p) => {
              const segmentLength = (p.percentage / 100) * circumference;
              const offset = circumference - (cumulativePercent / 100) * circumference;
              cumulativePercent += p.percentage;
              return (
                <circle
                  key={p.id}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={p.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                  strokeDashoffset={offset}
                  className="transition-all duration-500 ease-out"
                  style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))" }}
                />
              );
            })}
          </svg>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-heading font-bold transition-colors duration-300 ${isComplete ? "text-primary" : total > 100 ? "text-destructive" : "text-foreground"}`}>
              {total}%
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">
              {isComplete ? "¡Completo!" : total > 100 ? "Excedido" : "Asignado"}
            </span>
            {isComplete && (
              <div className="mt-1">
                <Check className="w-5 h-5 text-primary animate-scale-in" />
              </div>
            )}
          </div>

          {/* Confetti particles */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-fade-in"
                  style={{
                    background: COLORS[i % COLORS.length],
                    top: `${30 + Math.random() * 40}%`,
                    left: `${20 + Math.random() * 60}%`,
                    animation: `float 1.5s ease-out ${i * 0.1}s forwards`,
                    opacity: 0.8,
                  }}
                />
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-1.5 w-full">
            {participants.map((p) => (
              <div key={p.id} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
                <span className="text-muted-foreground truncate">{p.unit}</span>
                <span className="font-medium text-foreground ml-auto">{p.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="lg:col-span-2 space-y-3">
          {/* Completion bar */}
          <div className="glass-card rounded-xl px-4 py-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progreso del reparto</span>
              <span className={`font-semibold ${isComplete ? "text-primary" : total > 100 ? "text-destructive" : "text-foreground"}`}>
                {total}% / 100%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isComplete ? "solar-gradient" : total > 100 ? "bg-destructive" : "bg-primary/60"
                }`}
                style={{ width: `${Math.min(total, 100)}%` }}
              />
            </div>
          </div>

          {/* Participant sliders */}
          {participants.map((p, i) => (
            <div
              key={p.id}
              className="glass-card rounded-xl px-4 py-3 group hover-lift animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: p.color }}
                  >
                    {p.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.unit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={p.percentage}
                    onChange={(e) => updatePercentage(p.id, Math.max(0, Math.min(100, Number(e.target.value))))}
                    className="w-14 text-right text-sm font-semibold bg-transparent text-foreground border-none outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
              {/* Custom slider */}
              <div className="relative h-6 flex items-center">
                <div className="absolute inset-x-0 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{
                      width: `${p.percentage}%`,
                      background: `linear-gradient(90deg, ${p.color}88, ${p.color})`,
                    }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={p.percentage}
                  onChange={(e) => updatePercentage(p.id, Number(e.target.value))}
                  className="absolute inset-x-0 w-full h-6 opacity-0 cursor-pointer"
                />
                {/* Thumb */}
                <div
                  className="absolute w-5 h-5 rounded-full border-2 border-card shadow-md transition-all duration-200 pointer-events-none"
                  style={{
                    left: `calc(${p.percentage * 2}% - 10px)`,
                    background: p.color,
                    boxShadow: `0 0 8px ${p.color}44`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
