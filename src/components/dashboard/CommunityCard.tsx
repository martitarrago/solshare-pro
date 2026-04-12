import { Building2, Users, Zap, Sun, Cloud, Moon, ShieldCheck } from "lucide-react";
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
  active: { icon: Sun, label: "Activa", color: "text-solar-gold" },
  pending: { icon: Cloud, label: "Pendiente", color: "text-muted-foreground" },
  inactive: { icon: Moon, label: "Inactiva", color: "text-muted-foreground/60" },
};

export function CommunityCard({ id, name, address, participants, power, distributed, status, gestorEnabled, distribuidora, cau }: CommunityCardProps) {
  const navigate = useNavigate();
  const statusInfo = statusConfig[status];
  const StatusIcon = statusInfo.icon;

  return (
    <button
      onClick={() => navigate(`/communities/${id}`)}
      className="glass-card rounded-2xl p-5 text-left hover-lift group w-full transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          <Building2 className="w-5 h-5 text-foreground/70 group-hover:text-primary transition-colors" />
        </div>
        <div className="flex items-center gap-1.5">
          {gestorEnabled && <ShieldCheck className="w-3.5 h-3.5 text-primary" />}
          <StatusIcon className={`w-3.5 h-3.5 ${statusInfo.color}`} />
          <span className={`text-[10px] font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
        </div>
      </div>

      <h3 className="font-heading font-semibold text-sm text-foreground mb-0.5 group-hover:text-primary transition-colors">
        {name}
      </h3>
      <p className="text-xs text-muted-foreground mb-1 line-clamp-1">{address}</p>

      {(cau || distribuidora) && (
        <div className="flex flex-wrap gap-1 mb-3">
          {distribuidora && (
            <span className="text-[9px] font-mono bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">
              {distribuidora.toUpperCase()}
            </span>
          )}
          {cau && (
            <span className="text-[9px] font-mono bg-secondary px-1.5 py-0.5 rounded text-muted-foreground truncate max-w-[120px]">
              {cau}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1"><Users className="w-3 h-3" />{participants}</div>
        <div className="flex items-center gap-1"><Zap className="w-3 h-3" />{power} kWp</div>
      </div>

      <div className="mt-2.5">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">β repartido</span>
          <span className="font-medium text-foreground">{distributed}%</span>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full rounded-full solar-gradient transition-all duration-700" style={{ width: `${distributed}%` }} />
        </div>
      </div>
    </button>
  );
}
