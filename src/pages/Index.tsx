import { Zap, Building2, Users, AlertTriangle, AlertCircle, ArrowRight, Plus, Clock, CheckCircle2, Send, BarChart3 } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { useNavigate } from "react-router-dom";
import { mockCommunities } from "@/lib/mock-data";
import { PROJECT_PHASES, ProjectPhase, validateProject } from "@/lib/types";
import { useMemo } from "react";

const Index = () => {
  const navigate = useNavigate();

  // Compute issues for all communities
  const communitiesWithIssues = useMemo(() =>
    mockCommunities.map(c => ({
      community: c,
      issues: validateProject(c),
    })),
    []
  );

  const allErrors = communitiesWithIssues.flatMap(c => c.issues.filter(i => i.type === "error").map(i => ({ ...i, communityName: c.community.name, communityId: c.community.id })));
  const allWarnings = communitiesWithIssues.flatMap(c => c.issues.filter(i => i.type === "warning").map(i => ({ ...i, communityName: c.community.name, communityId: c.community.id })));

  // Phase counts
  const phaseCounts = PROJECT_PHASES.map(p => ({
    ...p,
    count: mockCommunities.filter(c => c.phase === p.id).length,
  }));

  // KPI counts
  const activeCount = mockCommunities.filter(c => c.phase === "activo").length;
  const inProgressCount = mockCommunities.filter(c => ["vecinos", "reparto", "firmas"].includes(c.phase)).length;
  const blockedCount = communitiesWithIssues.filter(c => c.issues.some(i => i.type === "error")).length;
  const readyToSend = mockCommunities.filter(c => c.phase === "listo");

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Panel de Control</h1>
          <p className="text-muted-foreground text-xs mt-0.5">Gestión de autoconsumo colectivo</p>
        </div>
        <button
          onClick={() => navigate("/communities/new")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Nueva comunidad
        </button>
      </div>

      {/* Status Pipeline */}
      <div className="border border-border rounded-lg p-4">
        <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Pipeline de estados</h3>
        <div className="flex gap-1">
          {phaseCounts.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate("/communities")}
              className={`flex-1 px-2 py-2 rounded-md text-center transition-colors hover:bg-muted/60 ${
                p.count > 0 ? "bg-muted/40" : ""
              }`}
            >
              <p className="text-lg font-semibold text-foreground">{p.count}</p>
              <p className="text-[10px] text-muted-foreground truncate">{p.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={CheckCircle2} title="Activas" value={activeCount} delay={0} />
        <KpiCard icon={Clock} title="En progreso" value={inProgressCount} delay={80} />
        <KpiCard icon={AlertTriangle} title="Bloqueadas" value={blockedCount} delay={160} />
        <KpiCard icon={Send} title="Listas para enviar" value={readyToSend.length} delay={240} />
      </div>

      {/* Critical Issues + Pending Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Critical Issues */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <h3 className="text-sm font-medium text-foreground">Incidencias críticas</h3>
            {allErrors.length > 0 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-destructive/15 text-destructive">{allErrors.length}</span>
            )}
          </div>
          {allErrors.length > 0 ? (
            <div className="space-y-1.5">
              {allErrors.slice(0, 5).map((err, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/communities/${err.communityId}`)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-muted/40 transition-colors"
                >
                  <p className="text-xs font-medium text-foreground">{err.communityName}</p>
                  <p className="text-[11px] text-destructive">{err.message}</p>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground py-4 text-center">Sin incidencias críticas ✓</p>
          )}
        </div>

        {/* Pending Actions */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-medium text-foreground">Acciones pendientes</h3>
            {allWarnings.length > 0 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">{allWarnings.length}</span>
            )}
          </div>
          {allWarnings.length > 0 ? (
            <div className="space-y-1.5">
              {allWarnings.slice(0, 5).map((warn, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/communities/${warn.communityId}`)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-muted/40 transition-colors"
                >
                  <p className="text-xs font-medium text-foreground">{warn.communityName}</p>
                  <p className="text-[11px] text-amber-600">{warn.message}</p>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground py-4 text-center">Sin acciones pendientes ✓</p>
          )}
        </div>
      </div>

      {/* Ready to Send */}
      {readyToSend.length > 0 && (
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Send className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium text-foreground">Listas para enviar</h3>
          </div>
          <div className="space-y-1.5">
            {readyToSend.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted/40 transition-colors">
                <div>
                  <p className="text-xs font-medium text-foreground">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.address}, {c.city}</p>
                </div>
                <button
                  onClick={() => navigate(`/communities/${c.id}`)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-[11px] font-medium hover:bg-primary/90 transition-colors"
                >
                  Enviar <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Static Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Tiempo medio de activación</p>
          <p className="text-2xl font-semibold text-foreground">45 <span className="text-sm font-normal text-muted-foreground">días</span></p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Tasa de completado</p>
          <p className="text-2xl font-semibold text-foreground">{Math.round((activeCount / mockCommunities.length) * 100)}%</p>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-2">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(activeCount / mockCommunities.length) * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
