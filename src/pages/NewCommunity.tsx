import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Building2, MapPin, Zap, Users, Plus, X, Check, Sun } from "lucide-react";

interface NewParticipant {
  name: string;
  unit: string;
}

const steps = [
  { id: 1, label: "Nombre", icon: Building2 },
  { id: 2, label: "Ubicación", icon: MapPin },
  { id: 3, label: "Potencia", icon: Zap },
  { id: 4, label: "Vecinos", icon: Users },
];

const NewCommunityWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [power, setPower] = useState("");
  const [panels, setPanels] = useState("");
  const [participants, setParticipants] = useState<NewParticipant[]>([]);
  const [newName, setNewName] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const canProceed = () => {
    switch (step) {
      case 1: return name.trim().length > 0;
      case 2: return address.trim().length > 0 && city.trim().length > 0;
      case 3: return power.trim().length > 0;
      case 4: return true;
      default: return false;
    }
  };

  const addParticipant = () => {
    if (newName && newUnit) {
      setParticipants([...participants, { name: newName, unit: newUnit }]);
      setNewName("");
      setNewUnit("");
    }
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
          <span className="font-semibold text-foreground">{name}</span> está lista para compartir el sol.
        </p>
        <p className="text-sm text-muted-foreground mt-1">Redirigiendo a comunidades...</p>
        {/* Confetti */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: i % 3 === 0 ? "hsl(43, 96%, 61%)" : i % 3 === 1 ? "hsl(160, 84%, 45%)" : "hsl(200, 80%, 70%)",
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
                animation: `float 2s ease-out ${i * 0.1}s forwards`,
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate("/communities")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Comunidades
      </button>

      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Nueva comunidad</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Configura tu nueva comunidad solar en unos pasos</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => {
          const StepIcon = s.icon;
          const isActive = s.id === step;
          const isDone = s.id < step;
          return (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive ? "bg-primary/10 text-primary" :
                isDone ? "bg-primary text-primary-foreground" :
                "bg-secondary text-muted-foreground"
              }`}>
                {isDone ? <Check className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full transition-colors duration-300 ${
                  isDone ? "bg-primary" : "bg-border"
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="glass-card rounded-2xl p-8 animate-fade-in" key={step}>
        {step === 1 && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-heading font-semibold text-lg text-foreground">¿Cómo se llama la comunidad?</h2>
            <p className="text-sm text-muted-foreground">Dale un nombre descriptivo que identifique la instalación.</p>
            <input
              type="text"
              placeholder="Ej. Residencial Aurora"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all text-sm"
              autoFocus
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-heading font-semibold text-lg text-foreground">¿Dónde se encuentra?</h2>
            <p className="text-sm text-muted-foreground">Dirección de la instalación solar.</p>
            <input
              type="text"
              placeholder="Dirección completa"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all text-sm"
              autoFocus
            />
            <input
              type="text"
              placeholder="Ciudad"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all text-sm"
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-heading font-semibold text-lg text-foreground">Datos de la instalación</h2>
            <p className="text-sm text-muted-foreground">Potencia y paneles de la instalación solar.</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Potencia (kWp)</label>
                <input
                  type="number"
                  placeholder="Ej. 45"
                  value={power}
                  onChange={(e) => setPower(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all text-sm"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Nº de paneles</label>
                <input
                  type="number"
                  placeholder="Ej. 120"
                  value={panels}
                  onChange={(e) => setPanels(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-heading font-semibold text-lg text-foreground">Añade los vecinos</h2>
            <p className="text-sm text-muted-foreground">Puedes añadirlos ahora o más tarde desde la comunidad.</p>

            {/* Add form */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nombre"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                onKeyDown={(e) => e.key === "Enter" && addParticipant()}
              />
              <input
                type="text"
                placeholder="Piso"
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                className="w-24 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                onKeyDown={(e) => e.key === "Enter" && addParticipant()}
              />
              <button
                onClick={addParticipant}
                className="px-3 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            {participants.length > 0 && (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {participants.map((p, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/50 text-sm animate-fade-in">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary">
                        {p.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-foreground">{p.name}</span>
                      <span className="text-muted-foreground text-xs">{p.unit}</span>
                    </div>
                    <button onClick={() => removeParticipant(i)} className="p-1 hover:bg-secondary rounded">
                      <X className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {participants.length === 0 && (
              <div className="text-center py-6">
                <Sun className="w-8 h-8 text-solar-gold/50 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Aún no has añadido vecinos</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            step === 1 ? "opacity-0 pointer-events-none" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Anterior
        </button>

        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl solar-gradient text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-md shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Siguiente
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl solar-gradient text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
          >
            <Check className="w-4 h-4" />
            Crear comunidad
          </button>
        )}
      </div>
    </div>
  );
};

export default NewCommunityWizard;
