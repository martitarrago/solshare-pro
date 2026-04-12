import { Zap, Building2, Users, Leaf, TrendingUp, ArrowRight, FileText, ShieldCheck } from "lucide-react";
import { SolarOrb } from "@/components/dashboard/SolarOrb";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { CommunityCard } from "@/components/dashboard/CommunityCard";
import { SolarProductionChart } from "@/components/charts/SolarProductionChart";
import { useNavigate } from "react-router-dom";
import { mockCommunities } from "@/lib/mock-data";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Buenos días", emoji: "☀️" };
  if (hour < 20) return { text: "Buenas tardes", emoji: "🌤️" };
  return { text: "Buenas noches", emoji: "🌙" };
};

const Index = () => {
  const greeting = getGreeting();
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
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            {greeting.text} {greeting.emoji}
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            Panel de gestión de autoconsumo colectivo
          </p>
        </div>
        <div className="hidden md:block"><SolarOrb /></div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={Zap} title="kW gestionados" value={totalKw} suffix=" kWp" trend="+12%" delay={0} />
        <KpiCard icon={Building2} title="Comunidades activas" value={mockCommunities.filter(c => c.status === "active").length} delay={100} />
        <KpiCard icon={Users} title="Participantes" value={totalParticipants} trend={`+${totalParticipants}`} delay={200} />
        <KpiCard icon={Leaf} title="CO₂ evitado" value={2840} suffix=" kg" trend="🌱" delay={300} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><SolarProductionChart /></div>
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-heading font-semibold text-sm mb-3">Acciones rápidas</h3>
            <div className="space-y-2">
              <button onClick={() => navigate("/communities/new")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg solar-gradient flex items-center justify-center"><Building2 className="w-4 h-4 text-white" /></div>
                <div><p className="text-xs font-medium text-foreground">Nueva comunidad</p><p className="text-[10px] text-muted-foreground">Registrar instalación</p></div>
              </button>
              <button onClick={() => navigate("/communities/1")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center"><FileText className="w-4 h-4 text-accent" /></div>
                <div><p className="text-xs font-medium text-foreground">Generar fichero TXT</p><p className="text-[10px] text-muted-foreground">Fichero de reparto</p></div>
              </button>
              <button onClick={() => navigate("/communities/2")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center"><ShieldCheck className="w-4 h-4 text-primary" /></div>
                <div><p className="text-xs font-medium text-foreground">Gestor de Autoconsumo</p><p className="text-[10px] text-muted-foreground">RDL 7/2026</p></div>
              </button>
            </div>
          </div>

          {/* Savings card */}
          <div className="glass-card rounded-2xl p-5 solar-gradient text-white">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="font-heading font-semibold text-sm">Ahorro total estimado</p>
            <p className="text-2xl font-heading font-bold mt-1">€10.160</p>
            <p className="text-white/70 text-[10px] mt-0.5">Acumulado 2026</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-heading font-semibold text-foreground">Comunidades</h2>
          <button onClick={() => navigate("/communities")} className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
            Ver todas <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities.map((c) => <CommunityCard key={c.id} {...c} />)}
        </div>
      </div>
    </div>
  );
};

export default Index;
