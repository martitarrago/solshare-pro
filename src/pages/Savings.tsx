import { TrendingUp, Leaf, Euro, TreePine } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";

const Savings = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Ahorros globales</h1>
        <p className="text-muted-foreground text-sm mt-0.5">El impacto positivo de todas tus comunidades</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Euro} title="Ahorro total" value={8450} prefix="€" trend="+18%" delay={0} />
        <KpiCard icon={TrendingUp} title="Ahorro este mes" value={720} prefix="€" delay={100} />
        <KpiCard icon={Leaf} title="CO₂ evitado" value={2840} suffix=" kg" trend="🌱" delay={200} />
        <KpiCard icon={TreePine} title="Equiv. árboles" value={142} trend="🌳" delay={300} />
      </div>

      <div className="glass-card rounded-2xl p-8">
        <h3 className="font-heading font-semibold mb-4">Evolución del ahorro</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
          Gráficos detallados de ahorro — Fase 3
        </div>
      </div>
    </div>
  );
};

export default Savings;
