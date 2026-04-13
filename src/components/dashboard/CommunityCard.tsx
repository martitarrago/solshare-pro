import { Building2, Users, Zap, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProjectPhase, PROJECT_PHASES } from "@/lib/types";

interface CommunityCardProps {
  id: string;
  name: string;
  address: string;
  participants: number;
  power: number;
  distributed: number;
  phase: ProjectPhase;
  gestorEnabled?: boolean;
  distribuidora?: string;
  cau?: string;
  issues?: number;
  documentProgress?: { done: number; total: number };
}

const phaseConfig: Record<ProjectPhase, { label: string; color: string }> = {
  configuracion: { label: "Configuración", color: "bg-muted-foreground/20 text-muted-foreground" },
  vecinos: { label: "Vecinos", color: "bg-blue-100 text-blue-700" },
  reparto: { label: "Reparto", color: "bg-amber-100 text-amber-700" },
  firmas: { label: "Firmas", color: "bg-orange-100 text-orange-700" },
  listo: { label: "Listo", color: "bg-emerald-100 text-emerald-700" },
  enviado: { label: "Enviado", color: "bg-violet-100 text-violet-700" },
  activo: { label: "Activo", color: "bg-primary/15 text-primary" },
};

export function CommunityCard({ id, name, address, participants, power, distributed, phase, gestorEnabled, distribuidora, cau, issues, documentProgress }: CommunityCardProps) {
  const navigate = useNavigate();
  const phaseInfo = phaseConfig[phase];
  const phaseStep = PROJECT_PHASES.find(p => p.id === phase)?.step || 1;

  return (
    <button
      onClick={() => navigate(`/communities/${id}`)}
      className="glass-card rounded-xl p-4 text-left hover-lift w-full group"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${phaseInfo.color}`}>
          {phaseInfo.label}
        </span>
      </div>

      {/* Issue banner */}
      {issues && issues > 0 && (
        <div className="flex items-center gap-1.5 text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded mb-2">
          <AlertTriangle className="w-3 h-3" />
          {issues} incidencia{issues > 1 ? "s" : ""}
        </div>
      )}

      <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{address}</p>

      {(cau || distribuidora) && (
        <div className="flex flex-wrap gap-1 mb-3">
          {distribuidora && (
            <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
              {distribuidora.toUpperCase()}
            </span>
          )}
          {cau && (
            <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground truncate max-w-[140px]">
              {cau}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{participants}</div>
        <div className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" />{power} kWp</div>
        {gestorEnabled && <ShieldCheck className="w-3.5 h-3.5 text-primary" />}
        <div className="ml-auto text-[11px] tabular-nums font-medium text-foreground">{distributed}%</div>
      </div>

      {/* Step checklist progress */}
      <div className="mt-2.5 flex gap-0.5">
        {PROJECT_PHASES.map((p) => (
          <div
            key={p.id}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              p.step <= phaseStep ? "solar-gradient" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </button>
  );
}
