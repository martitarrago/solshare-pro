import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Users, Zap, Sun, TrendingUp, Leaf, ShieldCheck, FileText, Hash, AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState, useMemo } from "react";
import { BetaCoefficients } from "@/components/community/BetaCoefficients";
import { ParticipantsListPro } from "@/components/community/ParticipantsListPro";
import { DocumentsTab } from "@/components/community/DocumentsTab";
import { SignaturesTab } from "@/components/community/SignaturesTab";
import { TxtGeneratorTab } from "@/components/community/TxtGeneratorTab";
import { GestorPanel } from "@/components/community/GestorPanel";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { SolarProductionChart } from "@/components/charts/SolarProductionChart";
import { mockCommunities } from "@/lib/mock-data";
import { Participant, CoeficientMode, PROJECT_PHASES, validateProject } from "@/lib/types";

const tabs = [
  { id: "overview", label: "Resumen", icon: Sun },
  { id: "coefficients", label: "Coeficientes β", icon: Hash },
  { id: "participants", label: "Participantes", icon: Users },
  { id: "txt", label: "Fichero TXT", icon: FileText },
  { id: "documents", label: "Documentos", icon: FileText },
  { id: "signatures", label: "Firmas", icon: FileText },
];

const phaseColors: Record<string, string> = {
  configuracion: "bg-muted-foreground/20 text-muted-foreground",
  vecinos: "bg-blue-100 text-blue-700",
  reparto: "bg-amber-100 text-amber-700",
  firmas: "bg-orange-100 text-orange-700",
  listo: "bg-emerald-100 text-emerald-700",
  enviado: "bg-violet-100 text-violet-700",
  activo: "bg-primary/15 text-primary",
};

const CommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const baseCommunity = mockCommunities.find(c => c.id === id) || mockCommunities[0];

  const [participants, setParticipants] = useState<Participant[]>(baseCommunity.participants);
  const [coefMode, setCoefMode] = useState<CoeficientMode>(baseCommunity.coeficientMode);
  const [gestorEnabled, setGestorEnabled] = useState(baseCommunity.gestorEnabled);
  const [gestorName, setGestorName] = useState(baseCommunity.gestorName || "");
  const [gestorNif, setGestorNif] = useState(baseCommunity.gestorNif || "");

  const community = useMemo(() => ({
    ...baseCommunity,
    participants,
    coeficientMode: coefMode,
    gestorEnabled,
    gestorName,
    gestorNif,
  }), [baseCommunity, participants, coefMode, gestorEnabled, gestorName, gestorNif]);

  const activeParticipants = participants.filter(p => p.status !== "exited");
  const totalBeta = activeParticipants.reduce((s, p) => s + p.beta, 0);
  const betaValid = Math.abs(totalBeta - 1) < 0.001;

  // Validation
  const issues = useMemo(() => validateProject(community), [community]);
  const errors = issues.filter(i => i.type === "error");
  const warnings = issues.filter(i => i.type === "warning");

  // Phase progress
  const currentPhaseStep = PROJECT_PHASES.find(p => p.id === community.phase)?.step || 1;
  const phaseLabel = PROJECT_PHASES.find(p => p.id === community.phase)?.label || "";

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      {/* Back + Header */}
      <div>
        <button onClick={() => navigate("/communities")} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3">
          <ArrowLeft className="w-3.5 h-3.5" /> Comunidades
        </button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-heading font-bold text-foreground">{community.name}</h1>
              {gestorEnabled && (
                <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                  <ShieldCheck className="w-3 h-3" /> Gestor activo
                </span>
              )}
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${phaseColors[community.phase] || ""}`}>
                {phaseLabel}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{community.address}, {community.city}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{activeParticipants.length} participantes</span>
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{community.potenciaInstalada} kWp</span>
              <span className="font-mono text-[10px] bg-secondary px-1.5 py-0.5 rounded">CAU: {community.cau}</span>
              <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded">{community.distribuidora.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Phase Progress Bar (7 steps) */}
      <div className="border border-border rounded-lg p-4">
        <div className="flex items-center gap-1">
          {PROJECT_PHASES.map((p, i) => (
            <div key={p.id} className="flex items-center flex-1">
              <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] font-medium w-full justify-center transition-all ${
                p.step < currentPhaseStep ? "bg-primary text-primary-foreground" :
                p.step === currentPhaseStep ? "bg-primary/15 text-primary border border-primary/30" :
                "bg-muted text-muted-foreground"
              }`}>
                {p.step < currentPhaseStep ? <CheckCircle2 className="w-3 h-3" /> : <span>{p.step}</span>}
                <span className="hidden lg:inline">{p.label}</span>
              </div>
              {i < PROJECT_PHASES.length - 1 && (
                <div className={`w-2 h-0.5 flex-shrink-0 ${p.step < currentPhaseStep ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Validation Banner */}
      {(errors.length > 0 || warnings.length > 0) && (
        <div className="border border-border rounded-lg p-4 space-y-2">
          {errors.map((e, i) => (
            <div key={`e${i}`} className="flex items-start gap-2 text-xs">
              <AlertCircle className="w-3.5 h-3.5 text-destructive flex-shrink-0 mt-0.5" />
              <span className="text-destructive">{e.message}</span>
              {e.action && (
                <button className="ml-auto text-[10px] font-medium text-primary hover:underline whitespace-nowrap">{e.action}</button>
              )}
            </div>
          ))}
          {warnings.map((w, i) => (
            <div key={`w${i}`} className="flex items-start gap-2 text-xs">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span className="text-amber-600">{w.message}</span>
              {w.action && (
                <button className="ml-auto text-[10px] font-medium text-primary hover:underline whitespace-nowrap">{w.action}</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border/50">
        <nav className="flex gap-0.5 -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 text-xs font-medium transition-all border-b-2 rounded-t-lg whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {tab.label}
              {tab.id === "coefficients" && (
                <span className={`ml-1.5 text-[9px] px-1 py-0.5 rounded ${betaValid ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`}>
                  {betaValid ? "✓" : `${(totalBeta * 100).toFixed(0)}%`}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div key={activeTab}>
        {activeTab === "overview" && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <KpiCard icon={Zap} title="Producción hoy" value={185} suffix=" kWh" trend="+8%" delay={0} />
              <KpiCard icon={Users} title="Participantes activos" value={activeParticipants.length} delay={100} />
              <KpiCard icon={TrendingUp} title="Ahorro mensual" value={340} prefix="€" trend="+12%" delay={200} />
              <KpiCard icon={Leaf} title="CO₂ evitado" value={420} suffix=" kg" delay={300} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2"><SolarProductionChart /></div>
              <div className="space-y-4">
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-heading font-semibold text-sm mb-3">Coeficientes β</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Suma total</span>
                    <span className={`text-sm font-mono font-bold ${betaValid ? "text-primary" : "text-accent"}`}>
                      {(totalBeta * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${betaValid ? "solar-gradient" : "bg-accent/70"}`}
                      style={{ width: `${Math.min(totalBeta * 100, 100)}%` }} />
                  </div>
                  <p className={`text-[10px] mt-2 ${betaValid ? "text-primary" : "text-accent"}`}>
                    {betaValid ? "✓ Válido — listo para generar TXT" : "⚠ Ajusta coeficientes para generar fichero"}
                  </p>
                </div>

                <GestorPanel
                  enabled={gestorEnabled}
                  gestorName={gestorName}
                  gestorNif={gestorNif}
                  onToggle={setGestorEnabled}
                  onUpdate={(n, nif) => { setGestorName(n); setGestorNif(nif); }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "coefficients" && (
          <BetaCoefficients
            participants={participants}
            mode={coefMode}
            onModeChange={setCoefMode}
            onParticipantsChange={setParticipants}
          />
        )}

        {activeTab === "participants" && (
          <ParticipantsListPro
            participants={participants}
            onParticipantsChange={setParticipants}
          />
        )}

        {activeTab === "txt" && <TxtGeneratorTab community={community} />}
        {activeTab === "documents" && <DocumentsTab community={community} />}
        {activeTab === "signatures" && <SignaturesTab community={community} />}
      </div>
    </div>
  );
};

export default CommunityDetail;
