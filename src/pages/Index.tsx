import { Zap, Building2, Users, Leaf, TrendingUp, ArrowRight, FileText, ShieldCheck, Plus } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { CommunityCard } from "@/components/dashboard/CommunityCard";
import { SolarProductionChart } from "@/components/charts/SolarProductionChart";
import { useNavigate } from "react-router-dom";
import { mockCommunities } from "@/lib/mock-data";

const Index = () => {
  const navigate = useNavigate();

  const communities = mockCommunities.map(c => ({
    id: c.id, name: c.name, address: `${c.address}, ${c.city}`,
    participants: c.participants.filter(p => p.status !== "exited").length,
    power: c.potenciaInstalada,
    distributed: Math.round(c.participants.reduce((s, p) => s + p.beta, 0) * 100),
    status: c.status,
  }));

  const totalKw = mockCommunities.reduce((s, c) => s + c.potenciaInstalada, 0);
  const totalParticipants = mockCommunities.reduce((s, c) => s + c.participants.filter(p => p.status !== "exited").length, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Panel de control</h1>
          <p className="text-muted-foreground text-xs mt-0.5">Gestión de autoconsumo colectivo</p>
        </div>
        <button
          onClick={() => navigate("/communities/new")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Nueva comunidad
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={Zap} title="kW gestionados" value={totalKw} suffix=" kWp" trend="+12%" delay={0} />
        <KpiCard icon={Building2} title="Comunidades" value={mockCommunities.filter(c => c.status === "active").length} delay={80} />
        <KpiCard icon={Users} title="Participantes" value={totalParticipants} delay={160} />
        <KpiCard icon={Leaf} title="CO₂ evitado" value={2840} suffix=" kg" delay={240} />
      </div>

      {/* Chart + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><SolarProductionChart /></div>
        <div className="space-y-3">
          {/* Quick actions */}
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-medium text-sm mb-3 text-foreground">Acciones rápidas</h3>
            <div className="space-y-1">
              {[
                { icon: Building2, label: "Nueva comunidad", desc: "Registrar instalación", onClick: () => navigate("/communities/new") },
                { icon: FileText, label: "Generar fichero TXT", desc: "Fichero de reparto", onClick: () => navigate("/communities/1") },
                { icon: ShieldCheck, label: "Gestor de Autoconsumo", desc: "RDL 7/2026", onClick: () => navigate("/communities/2") },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="w-full flex items-center gap-3 px-2.5 py-2 rounded-md hover:bg-muted transition-colors text-left"
                >
                  <action.icon className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium text-foreground">{action.label}</p>
                    <p className="text-[11px] text-muted-foreground">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Savings summary */}
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Ahorro total estimado</span>
            </div>
            <p className="text-xl font-semibold text-foreground">€10.160</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Acumulado 2026</p>
          </div>
        </div>
      </div>

      {/* Communities */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-foreground">Comunidades</h2>
          <button onClick={() => navigate("/communities")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            Ver todas <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {communities.map((c) => <CommunityCard key={c.id} {...c} />)}
        </div>
      </div>
    </div>
  );
};

export default Index;
