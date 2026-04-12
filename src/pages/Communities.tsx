import { Plus, Sun, Search } from "lucide-react";
import { CommunityCard } from "@/components/dashboard/CommunityCard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const mockCommunities = [
  { id: "1", name: "Residencial Aurora", address: "Av. del Sol 42, Madrid", participants: 12, power: 45, distributed: 100, status: "active" as const },
  { id: "2", name: "Edificio Lumina", address: "C/ Luna 15, Barcelona", participants: 8, power: 30, distributed: 75, status: "active" as const },
  { id: "3", name: "Torres del Parque", address: "Pl. Verde 3, Valencia", participants: 20, power: 80, distributed: 45, status: "pending" as const },
  { id: "4", name: "Villa Solar", address: "C/ Girasol 8, Sevilla", participants: 6, power: 20, distributed: 100, status: "active" as const },
  { id: "5", name: "Conjunto Helio", address: "Av. Energía 22, Málaga", participants: 15, power: 60, distributed: 0, status: "inactive" as const },
];

const Communities = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const filtered = mockCommunities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Comunidades</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{mockCommunities.length} comunidades registradas</p>
        </div>
        <button
          onClick={() => navigate("/communities/new")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl solar-gradient text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Nueva comunidad
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar comunidad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((community, i) => (
            <div key={community.id} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <CommunityCard {...community} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-solar-sand flex items-center justify-center mb-4 animate-float">
            <Sun className="w-10 h-10 text-solar-gold" />
          </div>
          <h3 className="font-heading font-semibold text-foreground text-lg mb-1">
            {search ? "Sin resultados" : "Tu primera comunidad te espera"}
          </h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            {search
              ? "No hay comunidades que coincidan con tu búsqueda."
              : "Crea tu primera comunidad solar y empieza a compartir el sol con tus vecinos."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Communities;
