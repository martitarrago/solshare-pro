import { Users, Zap, ShieldCheck, AlertTriangle } from "lucide-react";
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
  warnings?: number;
  documentProgress?: { done: number; total: number };
}

const phaseConfig: Record<ProjectPhase, { label: string; badgeClass: string }> = {
  configuracion: { label: "Configuración", badgeClass: "bg-muted text-muted-foreground" },
  vecinos: { label: "Vecinos", badgeClass: "badge-info" },
  reparto: { label: "Reparto", badgeClass: "badge-warning" },
  firmas: { label: "Firmas", badgeClass: "badge-warning" },
  listo: { label: "Listo", badgeClass: "badge-success" },
  enviado: { label: "Enviado", badgeClass: "badge-info" },
  activo: { label: "Activo", badgeClass: "badge-active" },
};

export function CommunityCard({ id, name, address, participants, power, distributed, phase, gestorEnabled, issues }: CommunityCardProps) {
  const navigate = useNavigate();
  const phaseInfo = phaseConfig[phase];
  const phaseStep = PROJECT_PHASES.find(p => p.id === phase)?.step || 1;

  return (
    <button
      onClick={() => navigate(`/communities/${id}`)}
      className="bg-card border border-border rounded-xl p-5 text-left w-full group transition-all duration-200 hover:border-primary/30 hover:shadow-sm"
    >
      <div className="flex items-start justify-between mb-1.5">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
          {name}
        </h3>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${phaseInfo.badgeClass}`}>
          {phaseInfo.label}
        </span>
      </div>

      {issues && issues > 0 && (
        <div className="flex items-center gap-1.5 text-[10px] badge-warning px-2 py-1 rounded-md mb-2 w-fit">
          <AlertTriangle className="w-3 h-3" />
          {issues} incidencia{issues > 1 ? "s" : ""}
        </div>
      )}

      <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{address}</p>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{participants}</div>
        <div className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" />{power} kWp</div>
        {gestorEnabled && <ShieldCheck className="w-3.5 h-3.5 text-primary" />}
        <div className="ml-auto text-[11px] tabular-nums font-semibold text-foreground">{distributed}%</div>
      </div>

      {/* Phase progress */}
      <div className="mt-3 flex gap-0.5">
        {PROJECT_PHASES.map((p) => (
          <div
            key={p.id}
            className={`h-1 flex-1 rounded-full transition-all ${
              p.step <= phaseStep ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </button>
  );
}
