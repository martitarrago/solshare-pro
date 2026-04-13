import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle, FileCheck, Send, Zap, ChevronDown, ChevronRight,
  Sparkles, Clock, ArrowRight, Plus, ExternalLink,
} from "lucide-react";

// ── Mock data matching the user's spec ──────────────────────────────────────

interface MockCommunity {
  id: number;
  nombre: string;
  estado: "faltan_datos" | "pendiente_firma" | "listo_para_enviar" | "activado";
  errores: string[];
  fechaActivacion?: string;
  firmasPendientes?: string;
}

interface MockMovimiento {
  comunidad: string;
  accion: string;
  fecha: string;
}

const comunidades: MockCommunity[] = [
  { id: 1, nombre: "Edificio Lumina", estado: "faltan_datos", errores: ["La suma de coeficientes es 0.630000, debe ser 1.000000", "2 firma(s) pendiente(s)", "Documentos pendientes: CIE"] },
  { id: 2, nombre: "Torres del Parque", estado: "faltan_datos", errores: ["La suma de coeficientes es 0.370000, debe ser 1.000000", "Documentos pendientes: Acuerdo de reparto, Fichero TXT, CIE"] },
  { id: 3, nombre: "Polígono Solar Norte", estado: "faltan_datos", errores: ["La suma de coeficientes es 0.270000, debe ser 1.000000"] },
  { id: 4, nombre: "Urbanización Las Encinas", estado: "listo_para_enviar", errores: [] },
  { id: 5, nombre: "Residencial Aurora", estado: "pendiente_firma", errores: ["2 firma(s) pendiente(s)"], firmasPendientes: "10 de 12 propietarios han firmado" },
  { id: 6, nombre: "Comunidad Solar Vallés", estado: "activado", fechaActivacion: "2026-03-15", errores: [] },
];

const ultimosMovimientos: MockMovimiento[] = [
  { comunidad: "Residencial Aurora", accion: "María García ha firmado el acuerdo de reparto", fecha: "Hace 2 horas" },
  { comunidad: "Edificio Lumina", accion: "Estado cambiado de 'Configuración' a 'Vecinos'", fecha: "Hace 1 día" },
  { comunidad: "Urbanización Las Encinas", accion: "Documentación lista para enviar a distribuidora", fecha: "Hace 2 días" },
  { comunidad: "Comunidad Solar Vallés", accion: "Comunidad activada por la distribuidora", fecha: "Hace 5 días" },
  { comunidad: "Torres del Parque", accion: "Pedro López subió el documento CIE", fecha: "Hace 1 semana" },
];

// ── Pipeline states ─────────────────────────────────────────────────────────

type PipelineState = "faltan_datos" | "pendiente_firma" | "listo_para_enviar" | "activado";

const PIPELINE: { id: PipelineState; label: string; icon: typeof AlertCircle; color: string; glowColor: string; bgActive: string }[] = [
  { id: "faltan_datos", label: "Faltan datos", icon: AlertCircle, color: "text-amber-500", glowColor: "shadow-amber-400/50", bgActive: "bg-amber-500" },
  { id: "pendiente_firma", label: "Pendiente de firma", icon: FileCheck, color: "text-sky-500", glowColor: "shadow-sky-400/50", bgActive: "bg-sky-500" },
  { id: "listo_para_enviar", label: "Listo para enviar", icon: Send, color: "text-emerald-500", glowColor: "shadow-emerald-400/50", bgActive: "bg-emerald-500" },
  { id: "activado", label: "Activado", icon: Zap, color: "text-primary", glowColor: "shadow-primary/50", bgActive: "bg-primary" },
];

// ── Typewriter hook ─────────────────────────────────────────────────────────

const PLACEHOLDER_TEXTS = [
  "¿Cuántas comunidades tengo pendientes de firma?",
  "¿Qué errores tiene el Edificio Lumina?",
  "¿Cuándo se activó Residencial Aurora?",
  "¿Cuál es el siguiente paso para Torres del Parque?",
  "Envía la documentación de Urbanización Las Encinas",
];

function useTypewriter(texts: string[], typingSpeed = 45, pauseMs = 2000) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[idx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx <= current.length) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIdx));
        if (charIdx === current.length) {
          timeout = setTimeout(() => setDeleting(true), pauseMs);
          return;
        }
        setCharIdx(c => c + 1);
      }, typingSpeed);
    } else if (deleting && charIdx >= 0) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIdx));
        if (charIdx === 0) {
          setDeleting(false);
          setIdx(i => (i + 1) % texts.length);
          return;
        }
        setCharIdx(c => c - 1);
      }, typingSpeed / 2);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, idx, texts, typingSpeed, pauseMs]);

  return display;
}

// ── Component ───────────────────────────────────────────────────────────────

const Index = () => {
  const navigate = useNavigate();
  const placeholder = useTypewriter(PLACEHOLDER_TEXTS);

  const grouped = useMemo(() => {
    const map: Record<PipelineState, MockCommunity[]> = {
      faltan_datos: [], pendiente_firma: [], listo_para_enviar: [], activado: [],
    };
    comunidades.forEach(c => map[c.estado].push(c));
    return map;
  }, []);

  // Default expanded: first state with communities
  const defaultExpanded = useMemo(() => {
    return PIPELINE.find(p => grouped[p.id].length > 0)?.id ?? "faltan_datos";
  }, [grouped]);

  const [activeState, setActiveState] = useState<PipelineState>(defaultExpanded);

  const handleNodeClick = useCallback((id: PipelineState) => {
    setActiveState(prev => prev === id ? id : id);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-28">
      {/* 1. Welcome */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold solar-gradient-text">Panel de Control</h1>
        <p className="text-sm text-muted-foreground">
          Aquí tienes el resumen del estado de todas tus comunidades
        </p>
      </div>

      {/* 2. Pipeline — Electric Circuit */}
      <div className="relative">
        <div className="grid grid-cols-4 gap-0 relative">
          {/* Connecting cable line */}
          <div className="absolute top-[3.25rem] left-[12.5%] right-[12.5%] h-1 z-0">
            <div className="w-full h-full rounded-full bg-border relative overflow-hidden">
              {/* Animated energy flow */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-emerald-400 to-primary animate-pulse opacity-40 rounded-full" />
            </div>
          </div>

          {PIPELINE.map((state, i) => {
            const count = grouped[state.id].length;
            const isActive = activeState === state.id;
            const hasItems = count > 0;
            const Icon = state.icon;

            return (
              <button
                key={state.id}
                onClick={() => handleNodeClick(state.id)}
                className="relative z-10 flex flex-col items-center group cursor-pointer"
              >
                {/* Node — the "circuit nodo" */}
                <div className={`
                  relative w-[6.5rem] h-[6.5rem] rounded-2xl border-2 transition-all duration-300
                  flex flex-col items-center justify-center gap-1
                  ${isActive
                    ? `border-current ${state.color} bg-card shadow-lg ${state.glowColor} scale-105`
                    : hasItems
                      ? `border-border bg-card hover:border-current hover:${state.color} hover:shadow-md`
                      : "border-border/50 bg-muted/30 opacity-60"
                  }
                `}>
                  {/* Glow ring for active */}
                  {isActive && (
                    <div className={`absolute -inset-1 rounded-2xl ${state.bgActive} opacity-10 blur-md animate-pulse`} />
                  )}

                  {/* Energy bolt indicator */}
                  {hasItems && (
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${state.bgActive} shadow-md`}>
                      {count}
                    </div>
                  )}

                  <Icon className={`w-6 h-6 relative z-10 ${isActive ? state.color : hasItems ? "text-muted-foreground group-hover:" + state.color : "text-muted-foreground/50"}`} />
                  <span className={`text-[10px] font-medium text-center leading-tight px-1 relative z-10 ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {state.label}
                  </span>
                </div>

                {/* Connector dots */}
                {i < 3 && (
                  <div className="absolute top-[3.25rem] -right-1 w-2 h-2 rounded-full bg-border z-20" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Expanded community list for active state */}
      <div className="border border-border rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          {(() => {
            const state = PIPELINE.find(p => p.id === activeState)!;
            const Icon = state.icon;
            return (
              <>
                <Icon className={`w-4 h-4 ${state.color}`} />
                <span className="text-sm font-semibold text-foreground">{state.label}</span>
                <span className="text-xs text-muted-foreground ml-1">
                  — {grouped[activeState].length} comunidad{grouped[activeState].length !== 1 ? "es" : ""}
                </span>
              </>
            );
          })()}
        </div>

        {grouped[activeState].length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">No hay comunidades en este estado</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {grouped[activeState].map((com) => (
              <CommunityRow key={com.id} community={com} onNavigate={() => navigate(`/communities/${com.id}`)} />
            ))}
          </div>
        )}
      </div>

      {/* 4. Activity feed */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          Últimos movimientos
        </h2>
        <div className="relative border-l-2 border-border ml-2 space-y-0">
          {ultimosMovimientos.map((mov, i) => (
            <div key={i} className="relative pl-6 pb-5 last:pb-0 group">
              {/* Timeline dot */}
              <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background" />
              <p className="text-sm text-foreground">
                <span className="font-semibold">{mov.comunidad}</span>
                <span className="text-muted-foreground">: {mov.accion}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{mov.fecha}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Sticky AI Chat Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
        <div className="max-w-5xl mx-auto px-6 pb-4 pointer-events-auto">
          <div className="relative flex items-center gap-3 bg-card/95 backdrop-blur-xl border border-border rounded-2xl px-4 py-3 shadow-xl shadow-primary/5">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
            <input
              type="text"
              placeholder={placeholder + "▏"}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 text-foreground"
              onFocus={() => {
                // Open the floating chat assistant
                const chatBtn = document.querySelector<HTMLButtonElement>('[data-chat-toggle]');
                chatBtn?.click();
              }}
              readOnly
            />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-lg">
              <Sparkles className="w-3 h-3" /> IA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Community Row subcomponent ──────────────────────────────────────────────

function CommunityRow({ community: com, onNavigate }: { community: MockCommunity; onNavigate: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="hover:bg-muted/30 transition-colors">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full px-4 py-3 flex items-center gap-3 text-left"
      >
        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-90" : ""}`} />
        <span className="text-sm font-medium text-foreground flex-1">{com.nombre}</span>

        {com.estado === "faltan_datos" && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
            {com.errores.length} error{com.errores.length !== 1 ? "es" : ""}
          </span>
        )}
        {com.estado === "pendiente_firma" && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-medium">
            {com.firmasPendientes || com.errores[0]}
          </span>
        )}
        {com.estado === "listo_para_enviar" && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
            Todo listo
          </span>
        )}
        {com.estado === "activado" && com.fechaActivacion && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            Activa desde {new Date(com.fechaActivacion).toLocaleDateString("es-ES")}
          </span>
        )}
      </button>

      {/* Expanded details */}
      <div className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pb-4 pl-11 space-y-2">
          {com.estado === "faltan_datos" && com.errores.map((err, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{err}</span>
            </div>
          ))}

          {com.estado === "pendiente_firma" && (
            <div className="flex items-start gap-2 text-xs">
              <FileCheck className="w-3.5 h-3.5 text-sky-500 mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{com.firmasPendientes || com.errores[0]}</span>
            </div>
          )}

          {com.estado === "listo_para_enviar" && (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onNavigate(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg solar-gradient text-white text-xs font-medium hover:opacity-90 transition-opacity"
              >
                <Send className="w-3 h-3" /> Enviar a distribuidora
              </button>
            </div>
          )}

          {com.estado === "activado" && (
            <p className="text-xs text-muted-foreground">
              ✅ Comunidad activa y funcionando desde {com.fechaActivacion ? new Date(com.fechaActivacion).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }) : "—"}
            </p>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); onNavigate(); }}
            className="flex items-center gap-1 text-xs text-primary hover:underline mt-1"
          >
            Ir a la comunidad <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Index;
