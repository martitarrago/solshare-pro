import { Zap, Users, AlertTriangle, AlertCircle, ArrowRight, Plus, Clock, CheckCircle2, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockCommunities } from "@/lib/mock-data";
import { PROJECT_PHASES, validateProject } from "@/lib/types";
import { useMemo } from "react";

const Index = () => {
  const navigate = useNavigate();

  const communitiesWithIssues = useMemo(() =>
    mockCommunities.map(c => ({ community: c, issues: validateProject(c) })), []
  );

  const allErrors = communitiesWithIssues.flatMap(c => c.issues.filter(i => i.type === "error").map(i => ({ ...i, communityName: c.community.name, communityId: c.community.id })));
  const allWarnings = communitiesWithIssues.flatMap(c => c.issues.filter(i => i.type === "warning").map(i => ({ ...i, communityName: c.community.name, communityId: c.community.id })));

  const phaseCounts = PROJECT_PHASES.map(p => ({
    ...p,
    count: mockCommunities.filter(c => c.phase === p.id).length,
  }));

  const activeCount = mockCommunities.filter(c => c.phase === "activo").length;
  const inProgressCount = mockCommunities.filter(c => ["vecinos", "reparto", "firmas"].includes(c.phase)).length;
  const blockedCount = communitiesWithIssues.filter(c => c.issues.some(i => i.type === "error")).length;
  const readyToSend = mockCommunities.filter(c => c.phase === "listo");

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Panel de Control</h1>
        <button
          onClick={() => navigate("/communities/new")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Nueva comunidad
        </button>
      </div>

      {/* KPI row — compact */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: CheckCircle2, label: "Activas", value: activeCount, color: "text-primary" },
          { icon: Clock, label: "En curso", value: inProgressCount, color: "text-foreground" },
          { icon: AlertTriangle, label: "Bloqueadas", value: blockedCount, color: "text-destructive" },
          { icon: Send, label: "Listas", value: readyToSend.length, color: "text-primary" },
        ].map((kpi) => (
          <div key={kpi.label} className="border border-border rounded-lg px-3 py-3 flex items-center gap-3">
            <kpi.icon className={`w-4 h-4 ${kpi.color} flex-shrink-0`} />
            <div>
              <p className="text-xl font-semibold text-foreground tabular-nums leading-none">{kpi.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline — horizontal bar chart style */}
      <div className="border border-border rounded-lg p-3">
        <div className="flex gap-0.5">
          {phaseCounts.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate("/communities")}
              className={`flex-1 py-2 rounded text-center transition-colors ${
                p.count > 0 ? "bg-primary/10 hover:bg-primary/15" : "hover:bg-muted/60"
              }`}
            >
              <p className={`text-sm font-semibold tabular-nums ${p.count > 0 ? "text-primary" : "text-muted-foreground"}`}>{p.count}</p>
              <p className="text-[9px] text-muted-foreground truncate px-1">{p.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Issues — side by side, compact */}
      <div className="grid grid-cols-2 gap-3">
        {/* Errors */}
        <div className="border border-border rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertCircle className="w-3.5 h-3.5 text-destructive" />
            <span className="text-xs font-medium text-foreground">Errores</span>
            {allErrors.length > 0 && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-destructive/15 text-destructive ml-auto">{allErrors.length}</span>
            )}
          </div>
          {allErrors.length > 0 ? (
            <div className="space-y-0.5">
              {allErrors.slice(0, 4).map((err, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/communities/${err.communityId}`)}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-muted/50 transition-colors"
                >
                  <p className="text-[11px] text-destructive truncate">{err.communityName}: {err.message}</p>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground py-3 text-center">Sin errores ✓</p>
          )}
        </div>

        {/* Warnings */}
        <div className="border border-border rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-medium text-foreground">Avisos</span>
            {allWarnings.length > 0 && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 ml-auto">{allWarnings.length}</span>
            )}
          </div>
          {allWarnings.length > 0 ? (
            <div className="space-y-0.5">
              {allWarnings.slice(0, 4).map((w, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/communities/${w.communityId}`)}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-muted/50 transition-colors"
                >
                  <p className="text-[11px] text-amber-600 truncate">{w.communityName}: {w.message}</p>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground py-3 text-center">Sin avisos ✓</p>
          )}
        </div>
      </div>

      {/* Ready to send + metrics row */}
      <div className="grid grid-cols-3 gap-3">
        {readyToSend.length > 0 && (
          <div className="border border-border rounded-lg p-3 col-span-2">
            <div className="flex items-center gap-1.5 mb-2">
              <Send className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-foreground">Listas para enviar</span>
            </div>
            {readyToSend.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-muted/40 transition-colors">
                <p className="text-[11px] text-foreground">{c.name}</p>
                <button
                  onClick={() => navigate(`/communities/${c.id}`)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-medium hover:bg-primary/90"
                >
                  Enviar <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className={`grid gap-3 ${readyToSend.length > 0 ? "grid-cols-1" : "grid-cols-2 col-span-3"}`}>
          <div className="border border-border rounded-lg p-3">
            <p className="text-[10px] text-muted-foreground">Tiempo medio</p>
            <p className="text-xl font-semibold text-foreground mt-1">45<span className="text-xs font-normal text-muted-foreground ml-0.5">días</span></p>
          </div>
          <div className="border border-border rounded-lg p-3">
            <p className="text-[10px] text-muted-foreground">Completado</p>
            <p className="text-xl font-semibold text-foreground mt-1">{Math.round((activeCount / Math.max(mockCommunities.length, 1)) * 100)}%</p>
            <div className="h-1 bg-muted rounded-full overflow-hidden mt-1.5">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(activeCount / Math.max(mockCommunities.length, 1)) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
