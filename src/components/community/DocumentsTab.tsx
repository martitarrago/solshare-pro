import { useState } from "react";
import { FileText, Download, Eye, Clock, CheckCircle2, Loader2, Sparkles } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  status: "generated" | "sent" | "pending";
}

const mockDocuments: Document[] = [
  { id: "1", name: "Acuerdo de reparto Q1 2026", type: "PDF", date: "2026-03-15", status: "sent" },
  { id: "2", name: "Certificado de coeficientes", type: "PDF", date: "2026-02-20", status: "generated" },
  { id: "3", name: "Informe de producción Feb", type: "XLSX", date: "2026-03-01", status: "sent" },
];

const statusConfig = {
  generated: { label: "Generado", icon: CheckCircle2, className: "text-primary bg-primary/15" },
  sent: { label: "Enviado", icon: CheckCircle2, className: "text-solar-sky bg-solar-sky/15" },
  pending: { label: "Pendiente", icon: Clock, className: "text-solar-gold bg-solar-gold/15" },
};

export function DocumentsTab() {
  const [generating, setGenerating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Generate button */}
      <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden">
        <div className="w-14 h-14 rounded-2xl solar-gradient flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
          {generating ? (
            <Loader2 className="w-7 h-7 text-white animate-spin" />
          ) : (
            <FileText className="w-7 h-7 text-white" />
          )}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-heading font-semibold text-foreground">
            {generating ? "Generando documento..." : "Generar nuevo documento"}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {generating
              ? "Preparando el fichero de reparto con los coeficientes actuales"
              : "Crea el fichero de reparto oficial con los datos actuales de la comunidad"
            }
          </p>
        </div>
        {!generating && (
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl solar-gradient text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-md shadow-primary/20 flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            Generar
          </button>
        )}

        {/* Solar confetti */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: i % 2 === 0 ? "hsl(43, 96%, 61%)" : "hsl(160, 84%, 45%)",
                  top: `${10 + Math.random() * 80}%`,
                  left: `${5 + Math.random() * 90}%`,
                  animation: `float 2s ease-out ${i * 0.08}s forwards`,
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Document list */}
      <div className="space-y-2">
        <h3 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
          Historial de documentos
        </h3>
        {mockDocuments.map((doc, i) => {
          const status = statusConfig[doc.status];
          const StatusIcon = status.icon;
          return (
            <div
              key={doc.id}
              className="glass-card rounded-xl px-4 py-3 flex items-center gap-4 hover-lift group animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                <p className="text-xs text-muted-foreground">{doc.type} · {new Date(doc.date).toLocaleDateString("es-ES")}</p>
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${status.className}`}>
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 rounded-lg hover:bg-secondary">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-2 rounded-lg hover:bg-secondary">
                  <Download className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
