import { Building2, Users, Zap, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CommunityCardProps {
  id: string;
  name: string;
  address: string;
  participants: number;
  power: number;
  distributed: number;
  status: "active" | "pending" | "inactive";
  gestorEnabled?: boolean;
  distribuidora?: string;
  cau?: string;
}

const statusConfig = {
  active: { label: "Activa", dotColor: "bg-emerald-500" },
  pending: { label: "Pendiente", dotColor: "bg-amber-400" },
  inactive: { label: "Inactiva", dotColor: "bg-muted-foreground/40" },
};

export function CommunityCard({ id, name, address, participants, power, distributed, status, gestorEnabled, distribuidora, cau }: CommunityCardProps) {
  const navigate = useNavigate();
  const statusInfo = statusConfig[status];

  return (
    <button
      onClick={() => navigate(`/communities/${id}`)}
      className="border border-border rounded-lg p-4 text-left hover:bg-muted/40 transition-colors w-full group"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-1.5">
          {gestorEnabled && <ShieldCheck className="w-3.5 h-3.5 text-primary" />}
          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
          <span className="text-[11px] text-muted-foreground">{statusInfo.label}</span>
        </div>
      </div>

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
        <div className="ml-auto text-[11px] tabular-nums font-medium text-foreground">{distributed}%</div>
      </div>

      <div className="mt-2">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${distributed}%` }} />
        </div>
      </div>
    </button>
  );
}
