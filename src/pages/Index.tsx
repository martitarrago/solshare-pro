import { Zap, Building2, Users, Leaf, TrendingUp, ArrowRight } from "lucide-react";
import { SolarOrb } from "@/components/dashboard/SolarOrb";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { CommunityCard } from "@/components/dashboard/CommunityCard";
import { useNavigate } from "react-router-dom";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Buenos días", emoji: "☀️" };
  if (hour < 20) return { text: "Buenas tardes", emoji: "🌤️" };
  return { text: "Buenas noches", emoji: "🌙" };
};

const mockCommunities = [
  { id: "1", name: "Residencial Aurora", address: "Av. del Sol 42, Madrid", participants: 12, power: 45, distributed: 100, status: "active" as const },
  { id: "2", name: "Edificio Lumina", address: "C/ Luna 15, Barcelona", participants: 8, power: 30, distributed: 75, status: "active" as const },
  { id: "3", name: "Torres del Parque", address: "Pl. Verde 3, Valencia", participants: 20, power: 80, distributed: 45, status: "pending" as const },
];

const Index = () => {
  const greeting = getGreeting();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header with greeting + orb */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            {greeting.text}, Carlos {greeting.emoji}
          </h1>
          <p className="text-muted-foreground mt-1">
            Aquí tienes el resumen de tu energía solar
          </p>
        </div>
        <div className="hidden md:block">
          <SolarOrb />
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={Zap}
          title="Energía repartida"
          value={12450}
          suffix=" kWh"
          trend="+12%"
          delay={0}
        />
        <KpiCard
          icon={Building2}
          title="Comunidades activas"
          value={3}
          delay={100}
        />
        <KpiCard
          icon={Users}
          title="Vecinos conectados"
          value={40}
          trend="+5"
          delay={200}
        />
        <KpiCard
          icon={Leaf}
          title="CO₂ evitado"
          value={2840}
          suffix=" kg"
          trend="🌱"
          delay={300}
        />
      </div>

      {/* Motivational card */}
      <div className="glass-card rounded-2xl p-6 flex items-center gap-5 solar-gradient text-white">
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-7 h-7" />
        </div>
        <div className="flex-1">
          <p className="font-heading font-semibold text-lg">¡Tu comunidad brilla! ✨</p>
          <p className="text-white/80 text-sm mt-0.5">
            Este mes has ahorrado un 18% más que el anterior. Sigue así.
          </p>
        </div>
      </div>

      {/* Recent communities */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-semibold text-foreground">Comunidades recientes</h2>
          <button
            onClick={() => navigate("/communities")}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Ver todas <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockCommunities.map((community) => (
            <CommunityCard key={community.id} {...community} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
