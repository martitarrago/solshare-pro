import { Shield, ShieldCheck, AlertTriangle } from "lucide-react";

interface GestorPanelProps {
  enabled: boolean;
  gestorName?: string;
  gestorNif?: string;
  onToggle: (enabled: boolean) => void;
  onUpdate: (name: string, nif: string) => void;
}

export function GestorPanel({ enabled, gestorName, gestorNif, onToggle, onUpdate }: GestorPanelProps) {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          enabled ? "bg-primary/15" : "bg-secondary"
        }`}>
          {enabled ? <ShieldCheck className="w-6 h-6 text-primary" /> : <Shield className="w-6 h-6 text-muted-foreground" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-heading font-semibold text-foreground">Gestor de Autoconsumo</h3>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent/15 text-accent">
              RDL 7/2026
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Activa la figura del Gestor de Autoconsumo para representar al grupo y realizar cambios en los coeficientes
            sin necesidad de recabar firma de todos los participantes cada vez.
          </p>
        </div>
        {/* Toggle */}
        <button
          onClick={() => onToggle(!enabled)}
          className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
            enabled ? "bg-primary" : "bg-muted"
          }`}
        >
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
            enabled ? "translate-x-6" : "translate-x-0.5"
          }`} />
        </button>
      </div>

      {enabled && (
        <div className="pt-3 border-t border-border/50 space-y-3 animate-fade-in">
          <div className="flex items-start gap-2 p-3 rounded-xl bg-accent/5 border border-accent/10">
            <AlertTriangle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground">
              Al activar el modo Gestor, esta persona/empresa podrá modificar coeficientes β y generar ficheros TXT en nombre del grupo.
              Los participantes recibirán notificación de cada cambio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block uppercase tracking-wider font-semibold">
                Nombre / Razón social
              </label>
              <input
                type="text"
                placeholder="Ej. SolarGest S.L."
                value={gestorName || ""}
                onChange={(e) => onUpdate(e.target.value, gestorNif || "")}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block uppercase tracking-wider font-semibold">
                NIF / CIF
              </label>
              <input
                type="text"
                placeholder="Ej. B12345678"
                value={gestorNif || ""}
                onChange={(e) => onUpdate(gestorName || "", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-primary font-medium">
            <ShieldCheck className="w-4 h-4" />
            El Gestor puede firmar en nombre del grupo según el RDL 7/2026
          </div>
        </div>
      )}
    </div>
  );
}
