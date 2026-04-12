import { TrendingUp, Leaf, Euro, TreePine } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { MonthlySavingsChart } from "@/components/charts/MonthlySavingsChart";
import { CumulativeSavingsChart } from "@/components/charts/CumulativeSavingsChart";
import { EnvironmentalImpact } from "@/components/charts/EnvironmentalImpact";

const Savings = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Ahorros globales</h1>
        <p className="text-muted-foreground text-sm mt-0.5">El impacto positivo de todas tus comunidades</p>
      </div>

      {/* Hero savings card */}
      <div className="glass-card rounded-2xl p-8 solar-gradient text-white flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
          <Euro className="w-8 h-8" />
        </div>
        <div>
          <p className="text-white/80 text-sm">Ahorro total acumulado</p>
          <p className="text-4xl font-heading font-bold mt-1">€10.160</p>
          <p className="text-white/70 text-sm mt-0.5">En todas tus comunidades durante 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Euro} title="Ahorro este mes" value={720} prefix="€" trend="+18%" delay={0} />
        <KpiCard icon={TrendingUp} title="Media mensual" value={847} prefix="€" delay={100} />
        <KpiCard icon={Leaf} title="CO₂ evitado" value={2840} suffix=" kg" trend="🌱" delay={200} />
        <KpiCard icon={TreePine} title="Equiv. árboles" value={142} trend="🌳" delay={300} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MonthlySavingsChart />
        <CumulativeSavingsChart />
      </div>

      <EnvironmentalImpact />
    </div>
  );
};

export default Savings;
