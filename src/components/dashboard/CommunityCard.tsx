import { Building2, Users, Zap, Sun, Cloud, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CommunityCardProps {
  id: string;
  name: string;
  address: string;
  participants: number;
  power: number;
  distributed: number;
  status: "active" | "pending" | "inactive";
}

const statusConfig = {
  active: { icon: Sun, label: "Activa", color: "text-solar-gold" },
  pending: { icon: Cloud, label: "Pendiente", color: "text-muted-foreground" },
  inactive: { icon: Moon, label: "Inactiva", color: "text-muted-foreground/60" },
};

export function CommunityCard({ id, name, address, participants, power, distributed, status }: CommunityCardProps) {
  const navigate = useNavigate();
  const statusInfo = statusConfig[status];
  const StatusIcon = statusInfo.icon;

  return (
    <button
      onClick={() => navigate(`/communities/${id}`)}
      className="glass-card rounded-2xl p-5 text-left hover-lift group w-full transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          <Building2 className="w-5 h-5 text-foreground/70 group-hover:text-primary transition-colors" />
        </div>
        <div className="flex items-center gap-1.5">
          <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
          <span className={`text-xs font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
        </div>
      </div>

      <h3 className="font-heading font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
        {name}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{address}</p>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          <span>{participants}</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5" />
          <span>{power} kWp</span>
        </div>
      </div>

      {/* Distribution bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Repartido</span>
          <span className="font-medium text-foreground">{distributed}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full solar-gradient transition-all duration-700 ease-out"
            style={{ width: `${distributed}%` }}
          />
        </div>
      </div>
    </button>
  );
}
