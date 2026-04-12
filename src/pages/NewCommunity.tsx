import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Building2, MapPin, Zap, Users, Plus, X, Check, Sun, Hash, Globe } from "lucide-react";
import { DISTRIBUIDORAS, Distribuidora, validateCUPS, validateCAU } from "@/lib/types";

interface NewParticipant {
  name: string;
  unit: string;
  cups: string;
  email: string;
}

const steps = [
  { id: 1, label: "Datos básicos", icon: Building2 },
  { id: 2, label: "Instalación", icon: Zap },
  { id: 3, label: "Distribuidora", icon: Globe },
  { id: 4, label: "Vecinos", icon: Users },
];

const NewCommunityWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [cau, setCau] = useState("");
  const [cauError, setCauError] = useState("");
  const [power, setPower] = useState("");
  const [panels, setPanels] = useState("");
  const [distribuidora, setDistribuidora] = useState<Distribuidora>("iberdrola");
  const [participants, setParticipants] = useState<NewParticipant[]>([]);
  const [newName, setNewName] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [newCups, setNewCups] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [cupsError, setCupsError] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const canProceed = () => {
    switch (step) {
      case 1: return name.trim().length > 0 && address.trim().length > 0 && city.trim().length > 0;
      case 2: {
        const cauValid = validateCAU(cau);
        return power.trim().length > 0 && cauValid.valid;
      }
      case 3: return !!distribuidora;
      case 4: return true;
      default: return false;
    }
  };

  const addParticipant = () => {
    if (!newName) return;
    if (newCups) {
      const v = validateCUPS(newCups);
      if (!v.valid) { setCupsError(v.error || ""); return; }
    }
    setParticipants([...participants, { name: newName, unit: newUnit, cups: newCups.toUpperCase(), email: newEmail }]);
    setNewName(""); setNewUnit(""); setNewCups(""); setNewEmail(""); setCupsError("");
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleFinish = () => {
    setIsComplete(true);
    setTimeout(() => navigate("/communities"), 2500);
  };

  if (isComplete) {
    return (
      <div className="max-w-lg mx-auto flex flex-col items-center justify-center py-20 text-center animate-scale-in">
        <div className="w-24 h-24 rounded-full solar-gradient flex items-center justify-center mb-6 shadow-xl shadow-primary/30 animate-pulse-solar">
          <Check className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">¡Comunidad creada! ☀️</h2>
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">{name}</span> está lista.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          CAU: <span className="font-mono">{cau}</span> · {DISTRIBUIDORAS.find(d => d.id === distribuidora)?.label}
        </p>
        <p className="text-xs text-muted-foreground mt-1">Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <button onClick={() => navigate("/communities")} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Comunidades
      </button>

      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Nueva comunidad</h1>
        <p className="text-muted-foreground text-xs mt-0.5">Configura tu instalación de autoconsumo colectivo</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = s.id === step;
          const isDone = s.id < step;
          return (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive ? "bg-primary/10 text-primary" : isDone ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}>
                {isDone ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full transition-colors ${isDone ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="glass-card rounded-2xl p-7" key={step}>
        {step === 1 && (
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-1">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-heading font-semibold text-foreground">Datos de la comunidad</h2>
            <input type="text" placeholder="Nombre de la comunidad *" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all" autoFocus />
            <input type="text" placeholder="Dirección completa *" value={address} onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all" />
            <input type="text" placeholder="Ciudad *" value={city} onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all" />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-1">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-heading font-semibold text-foreground">Datos de la instalación</h2>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block uppercase tracking-wider font-semibold">
                Código de Autoconsumo (CAU) *
              </label>
              <input type="text" placeholder="Ej. CAU-2024-001-MADRID" value={cau}
                onChange={(e) => { setCau(e.target.value); setCauError(""); }}
                className={`w-full px-3 py-2.5 rounded-xl bg-secondary border text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all ${cauError ? "border-destructive" : "border-border"}`} autoFocus />
              {cauError && <p className="text-[10px] text-destructive mt-1">{cauError}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-muted-foreground mb-1 block uppercase tracking-wider font-semibold">Potencia (kWp) *</label>
                <input type="number" placeholder="Ej. 45" value={power} onChange={(e) => setPower(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground mb-1 block uppercase tracking-wider font-semibold">Nº de paneles</label>
                <input type="number" placeholder="Ej. 120" value={panels} onChange={(e) => setPanels(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-1">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-heading font-semibold text-foreground">Distribuidora eléctrica</h2>
            <p className="text-xs text-muted-foreground">Selecciona la distribuidora de la zona. El fichero TXT se generará en su formato específico.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DISTRIBUIDORAS.map(d => (
                <button
                  key={d.id}
                  onClick={() => setDistribuidora(d.id)}
                  className={`text-left px-4 py-3 rounded-xl border transition-all text-sm ${
                    distribuidora === d.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary/50 text-foreground hover:border-primary/30"
                  }`}
                >
                  <p className="font-medium text-xs">{d.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-1">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-heading font-semibold text-foreground">Participantes</h2>
            <p className="text-xs text-muted-foreground">Añade los vecinos con su CUPS (22 caracteres). También puedes hacerlo después.</p>

            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2">
                <input type="text" placeholder="Nombre *" value={newName} onChange={(e) => setNewName(e.target.value)}
                  className="col-span-3 px-2.5 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20"
                  onKeyDown={(e) => e.key === "Enter" && addParticipant()} />
                <input type="text" placeholder="Piso" value={newUnit} onChange={(e) => setNewUnit(e.target.value)}
                  className="col-span-1 px-2.5 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20" />
                <input type="text" placeholder="CUPS (22 chars)" value={newCups} onChange={(e) => { setNewCups(e.target.value); setCupsError(""); }}
                  className={`col-span-4 px-2.5 py-2 rounded-lg bg-secondary border text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20 ${cupsError ? "border-destructive" : "border-border"}`} />
                <input type="email" placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                  className="col-span-3 px-2.5 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20" />
                <button onClick={addParticipant} className="col-span-1 px-2.5 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              {cupsError && <p className="text-[10px] text-destructive">{cupsError}</p>}
            </div>

            {participants.length > 0 ? (
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {participants.map((p, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/50 text-xs animate-fade-in">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center text-[9px] font-bold text-primary flex-shrink-0">
                        {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="text-foreground font-medium truncate">{p.name}</span>
                      <span className="text-muted-foreground">{p.unit}</span>
                      {p.cups && <span className="text-[9px] font-mono text-muted-foreground/70 truncate">{p.cups}</span>}
                    </div>
                    <button onClick={() => removeParticipant(i)} className="p-1 hover:bg-secondary rounded">
                      <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Sun className="w-8 h-8 text-accent/40 mx-auto mb-2" />
                <p className="text-[10px] text-muted-foreground">Aún no has añadido participantes</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
            step === 1 ? "opacity-0 pointer-events-none" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Anterior
        </button>
        {step < 4 ? (
          <button
            onClick={() => {
              if (step === 2) {
                const v = validateCAU(cau);
                if (!v.valid) { setCauError(v.error || ""); return; }
              }
              setStep(step + 1);
            }}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl solar-gradient text-white font-medium text-xs hover:opacity-90 transition-opacity shadow-md shadow-primary/20 disabled:opacity-40"
          >
            Siguiente <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button onClick={handleFinish} className="flex items-center gap-2 px-5 py-2.5 rounded-xl solar-gradient text-white font-medium text-xs hover:opacity-90 shadow-md shadow-primary/20">
            <Check className="w-3.5 h-3.5" /> Crear comunidad
          </button>
        )}
      </div>
    </div>
  );
};

export default NewCommunityWizard;
