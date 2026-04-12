import { Plus, Search } from "lucide-react";
import { CommunityCard } from "@/components/dashboard/CommunityCard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockCommunities } from "@/lib/mock-data";

const Communities = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const communities = mockCommunities.map(c => ({
    id: c.id,
    name: c.name,
    address: `${c.address}, ${c.city}`,
    participants: c.participants.filter(p => p.status !== "exited").length,
    power: c.potenciaInstalada,
    distributed: Math.round(c.participants.reduce((s, p) => s + p.beta, 0) * 100),
    status: c.status,
    gestorEnabled: c.gestorEnabled,
    distribuidora: c.distribuidora,
    cau: c.cau,
  }));

  const filtered = communities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.address.toLowerCase().includes(search.toLowerCase()) ||
    c.cau.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Comunidades</h1>
          <p className="text-muted-foreground text-xs mt-0.5">{communities.length} instalaciones de autoconsumo</p>
        </div>
        <button
          onClick={() => navigate("/communities/new")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Nueva comunidad
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nombre, dirección o CAU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 rounded-md border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
        />
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
            {search ? "Sin resultados" : "Crea tu primera comunidad"}
          </h3>
          <p className="text-muted-foreground text-xs max-w-sm">
            {search ? "No hay comunidades que coincidan." : "Registra tu primera instalación de autoconsumo colectivo."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Communities;
