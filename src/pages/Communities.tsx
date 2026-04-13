import { Search, ArrowUpDown, Building2 } from "lucide-react";
import { CommunityCard } from "@/components/dashboard/CommunityCard";
import { useState, useMemo } from "react";
import { mockCommunities } from "@/lib/mock-data";
import { validateProject, ProjectPhase } from "@/lib/types";

type Filter = "todos" | "problemas" | "progreso" | "listas" | "activas";
type SortBy = "issues" | "phase" | "progress";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "problemas", label: "Problemas" },
  { id: "progreso", label: "En progreso" },
  { id: "listas", label: "Listas" },
  { id: "activas", label: "Activas" },
];

const PHASE_ORDER: ProjectPhase[] = ["configuracion", "vecinos", "reparto", "firmas", "listo", "enviado", "activo"];

const Communities = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");
  const [sortBy, setSortBy] = useState<SortBy>("phase");

  const communitiesData = useMemo(() =>
    mockCommunities.map(c => {
      const issues = validateProject(c);
      const active = c.participants.filter(p => p.status !== "exited");
      return {
        id: c.id,
        name: c.name,
        address: `${c.address}, ${c.city}`,
        participants: active.length,
        power: c.potenciaInstalada,
        distributed: Math.round(active.reduce((s, p) => s + p.beta, 0) * 100),
        phase: c.phase,
        gestorEnabled: c.gestorEnabled,
        distribuidora: c.distribuidora,
        cau: c.cau,
        issues: issues.filter(i => i.type === "error").length,
        warnings: issues.filter(i => i.type === "warning").length,
      };
    }),
    []
  );

  const filtered = useMemo(() => {
    let result = communitiesData.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase()) ||
      c.cau.toLowerCase().includes(search.toLowerCase())
    );

    switch (filter) {
      case "problemas": result = result.filter(c => c.issues > 0); break;
      case "progreso": result = result.filter(c => ["vecinos", "reparto", "firmas"].includes(c.phase)); break;
      case "listas": result = result.filter(c => c.phase === "listo"); break;
      case "activas": result = result.filter(c => c.phase === "activo"); break;
    }

    switch (sortBy) {
      case "issues": result.sort((a, b) => b.issues - a.issues); break;
      case "phase": result.sort((a, b) => PHASE_ORDER.indexOf(a.phase) - PHASE_ORDER.indexOf(b.phase)); break;
      case "progress": result.sort((a, b) => b.distributed - a.distributed); break;
    }

    return result;
  }, [communitiesData, search, filter, sortBy]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-foreground">Comunidades</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{communitiesData.length} instalaciones de autoconsumo</p>
      </div>

      {/* Search + Filters + Sort */}
      <div className="space-y-3">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre, dirección o CAU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="bg-card border border-border rounded-lg px-2.5 py-2 text-xs text-foreground focus:outline-none"
            >
              <option value="phase">Por fase</option>
              <option value="issues">Por incidencias</option>
              <option value="progress">Por progreso</option>
            </select>
          </div>
        </div>

        <div className="flex gap-1.5">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((community, i) => (
            <div key={community.id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
              <CommunityCard {...community} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Building2 className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <h3 className="font-semibold text-foreground text-sm mb-1">
            {search || filter !== "todos" ? "Sin resultados" : "Crea tu primera comunidad"}
          </h3>
          <p className="text-muted-foreground text-xs max-w-sm">
            {search || filter !== "todos" ? "No hay comunidades que coincidan con los filtros." : "Registra tu primera instalación de autoconsumo colectivo."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Communities;
