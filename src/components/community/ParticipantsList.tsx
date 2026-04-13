import { useState } from "react";
import { Plus, Mail, X } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  email: string;
  unit: string;
  percentage: number;
  status: "active" | "pending" | "invited";
}

const AVATAR_COLORS = [
  "bg-primary", "bg-accent", "bg-accent",
  "bg-purple-500", "bg-pink-500", "bg-orange-500",
  "bg-teal-500", "bg-indigo-500",
];

const initialParticipants: Participant[] = [
  { id: "1", name: "María García", email: "maria@email.com", unit: "1ºA", percentage: 15, status: "active" },
  { id: "2", name: "Juan López", email: "juan@email.com", unit: "1ºB", percentage: 12, status: "active" },
  { id: "3", name: "Ana Martínez", email: "ana@email.com", unit: "2ºA", percentage: 10, status: "active" },
  { id: "4", name: "Carlos Ruiz", email: "carlos@email.com", unit: "2ºB", percentage: 18, status: "pending" },
  { id: "5", name: "Laura Sánchez", email: "laura@email.com", unit: "3ºA", percentage: 8, status: "active" },
  { id: "6", name: "Pedro Fernández", email: "pedro@email.com", unit: "3ºB", percentage: 14, status: "invited" },
  { id: "7", name: "Isabel Moreno", email: "isabel@email.com", unit: "4ºA", percentage: 11, status: "active" },
  { id: "8", name: "David Jiménez", email: "david@email.com", unit: "4ºB", percentage: 12, status: "active" },
];

const statusLabels = {
  active: { label: "Activo", className: "bg-primary/15 text-primary" },
  pending: { label: "Pendiente", className: "bg-accent/15 text-accent" },
  invited: { label: "Invitado", className: "bg-accent/15 text-accent" },
};

export function ParticipantsList() {
  const [participants] = useState<Participant[]>(initialParticipants);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const handleAdd = () => {
    if (newName && newUnit) {
      setShowAddForm(false);
      setNewName("");
      setNewUnit("");
      setNewEmail("");
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {participants.length} participantes · {participants.filter(p => p.status === "active").length} activos
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl mint-gradient text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? "Cancelar" : "Añadir vecino"}
        </button>
      </div>

      {/* Add form inline */}
      {showAddForm && (
        <div className="glass-card rounded-2xl p-5 animate-scale-in space-y-3">
          <h3 className="font-heading font-semibold text-sm">Nuevo participante</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Nombre completo"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <input
              type="text"
              placeholder="Piso / Puerta (ej. 2ºA)"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <input
              type="email"
              placeholder="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Añadir
          </button>
        </div>
      )}

      {/* Participants list */}
      <div className="space-y-2">
        {participants.map((p, i) => {
          const initials = p.name.split(" ").map(n => n[0]).join("");
          const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
          const statusInfo = statusLabels[p.status];

          return (
            <div
              key={p.id}
              className="glass-card rounded-xl px-4 py-3 flex items-center gap-4 hover-lift animate-fade-in group"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-xl ${avatarColor} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                {initials}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusInfo.className}`}>
                    {statusInfo.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{p.unit} · {p.email}</p>
              </div>

              {/* Percentage */}
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-foreground">{p.percentage}%</p>
                <p className="text-[10px] text-muted-foreground">asignado</p>
              </div>

              {/* Actions */}
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-secondary">
                <Mail className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
