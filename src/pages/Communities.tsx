import { Plus, Search, ArrowUpDown } from "lucide-react";
import { CommunityCard } from "@/components/dashboard/CommunityCard";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Comunidades</h1>
          <p className="text-muted-foreground text-xs mt-0.5">{communitiesData.length} instalaciones de autoconsumo</p>
        </div>
        <button
          onClick={() => navigate("/communities/new")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Nueva comunidad
        </button>
      </div>

      {/* Search + Filters + Sort */}
      <div className="space-y-3">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre, dirección o CAU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-md border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
            />
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="bg-background border border-border rounded-md px-2 py-1 text-xs text-foreground focus:outline-none"
            >
              <option value="phase">Por fase</option>
              <option value="issues">Por incidencias</option>
              <option value="progress">Por progreso</option>
            </select>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((community, i) => (
            <div key={community.id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
              <CommunityCard {...community} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h3 className="font-medium text-foreground text-sm mb-1">
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
