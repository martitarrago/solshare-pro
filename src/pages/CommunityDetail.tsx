import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Users, Zap, Sun, TrendingUp, Leaf } from "lucide-react";
import { useState } from "react";
import { SolarDistribution } from "@/components/community/SolarDistribution";
import { ParticipantsList } from "@/components/community/ParticipantsList";
import { DocumentsTab } from "@/components/community/DocumentsTab";
import { SignaturesTab } from "@/components/community/SignaturesTab";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { SolarProductionChart } from "@/components/charts/SolarProductionChart";

const tabs = [
  { id: "overview", label: "Resumen" },
  { id: "distribution", label: "Reparto Solar" },
  { id: "participants", label: "Participantes" },
  { id: "documents", label: "Documentos" },
  { id: "signatures", label: "Firmas" },
];

const mockCommunity = {
  id: "1",
  name: "Residencial Aurora",
  address: "Av. del Sol 42, Madrid",
  participants: 12,
  power: 45,
  distributed: 100,
  status: "active" as const,
};

const CommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Back + Header */}
      <div>
        <button
          onClick={() => navigate("/communities")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Comunidades
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
              {mockCommunity.name}
              <Sun className="w-5 h-5 text-solar-gold" />
            </h1>
            <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{mockCommunity.address}</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{mockCommunity.participants} vecinos</span>
              <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" />{mockCommunity.power} kWp</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border/50">
        <nav className="flex gap-1 -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 rounded-t-lg whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div key={activeTab}>
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard icon={Zap} title="Producción hoy" value={185} suffix=" kWh" trend="+8%" delay={0} />
              <KpiCard icon={Users} title="Vecinos activos" value={10} delay={100} />
              <KpiCard icon={TrendingUp} title="Ahorro mensual" value={340} prefix="€" trend="+12%" delay={200} />
              <KpiCard icon={Leaf} title="CO₂ evitado" value={420} suffix=" kg" delay={300} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <SolarProductionChart />
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-heading font-semibold mb-3">Estado del reparto</h3>
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative w-28 h-28">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke="url(#solar-detail)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${mockCommunity.distributed * 2.64} 264`} />
                      <defs>
                        <linearGradient id="solar-detail" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(var(--solar-emerald))" />
                          <stop offset="100%" stopColor="hsl(var(--solar-gold))" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-heading font-bold">{mockCommunity.distributed}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">Energía repartida</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "distribution" && <SolarDistribution />}
        {activeTab === "participants" && <ParticipantsList />}
        {activeTab === "documents" && <DocumentsTab />}
        {activeTab === "signatures" && <SignaturesTab />}
      </div>
    </div>
  );
};

export default CommunityDetail;
