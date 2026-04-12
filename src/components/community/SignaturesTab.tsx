import { useState } from "react";
import { Send, CheckCircle2, Clock, PenLine } from "lucide-react";

interface Signer {
  id: string;
  name: string;
  unit: string;
  signed: boolean;
  signedAt?: string;
}

const initialSigners: Signer[] = [
  { id: "1", name: "María García", unit: "1ºA", signed: true, signedAt: "2026-03-10" },
  { id: "2", name: "Juan López", unit: "1ºB", signed: true, signedAt: "2026-03-11" },
  { id: "3", name: "Ana Martínez", unit: "2ºA", signed: true, signedAt: "2026-03-12" },
  { id: "4", name: "Carlos Ruiz", unit: "2ºB", signed: false },
  { id: "5", name: "Laura Sánchez", unit: "3ºA", signed: false },
  { id: "6", name: "Pedro Fernández", unit: "3ºB", signed: true, signedAt: "2026-03-13" },
  { id: "7", name: "Isabel Moreno", unit: "4ºA", signed: false },
  { id: "8", name: "David Jiménez", unit: "4ºB", signed: true, signedAt: "2026-03-14" },
];

export function SignaturesTab() {
  const [signers] = useState<Signer[]>(initialSigners);
  const signed = signers.filter(s => s.signed).length;
  const total = signers.length;
  const progress = (signed / total) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Progress hero */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-semibold text-foreground">Firmas del acuerdo</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Acuerdo de reparto de energía solar 2026</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
            <Send className="w-4 h-4" />
            Enviar recordatorio
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progreso de firmas</span>
            <span className="font-semibold text-foreground">{signed} de {total}</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full solar-gradient transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Avatar row */}
        <div className="flex items-center gap-1 flex-wrap">
          {signers.map((s, i) => {
            const initials = s.name.split(" ").map(n => n[0]).join("");
            return (
              <div
                key={s.id}
                className={`relative w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  s.signed
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-100"
                    : "bg-muted text-muted-foreground scale-90 opacity-50"
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
                title={`${s.name} (${s.unit})`}
              >
                {initials}
                {s.signed && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-card flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Signers list */}
      <div className="space-y-2">
        {signers.map((s, i) => {
          const initials = s.name.split(" ").map(n => n[0]).join("");
          return (
            <div
              key={s.id}
              className="glass-card rounded-xl px-4 py-3 flex items-center gap-4 hover-lift animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
                  s.signed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.unit}</p>
              </div>
              {s.signed ? (
                <div className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/15 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Firmado · {new Date(s.signedAt!).toLocaleDateString("es-ES")}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                    <Clock className="w-3 h-3" />
                    Pendiente
                  </span>
                  <button className="p-2 rounded-lg hover:bg-secondary transition-colors" title="Solicitar firma">
                    <PenLine className="w-4 h-4 text-muted-foreground hover:text-primary" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
