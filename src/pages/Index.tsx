import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  AlertCircle, FileCheck, Send, Zap, ChevronRight,
  Sparkles, Clock, ArrowRight, Plus, ExternalLink, Loader2, X, CheckCircle2,
} from "lucide-react";
import { mockCommunities } from "@/lib/mock-data";
import { validateProject, validateAllocationSum, Community } from "@/lib/types";

// ── Pipeline states ─────────────────────────────────────────────────────────

type PipelineState = "faltan_datos" | "pendiente_firma" | "listo_para_enviar" | "activado";

function derivePipelineState(c: Community): PipelineState {
  if (c.phase === "activo" || c.phase === "enviado") return "activado";
  const issues = validateProject(c);
  const errors = issues.filter(i => i.type === "error");
  if (errors.length > 0) return "faltan_datos";
  const active = c.participants.filter(p => p.status !== "exited");
  const pendingSigs = active.filter(p => p.signatureState === "pending").length;
  if (pendingSigs > 0) return "pendiente_firma";
  const alloc = validateAllocationSum(c.participants);
  const hasTxt = c.documents.txt;
  if (alloc.valid && hasTxt && active.every(p => p.signatureState === "signed")) return "listo_para_enviar";
  return "faltan_datos";
}

interface DerivedCommunity {
  id: string;
  nombre: string;
  estado: PipelineState;
  errores: string[];
  fechaActivacion?: string;
  firmasPendientes?: string;
}

const PIPELINE: { id: PipelineState; label: string; icon: typeof AlertCircle; badgeClass: string }[] = [
  { id: "faltan_datos", label: "Faltan datos", icon: AlertCircle, badgeClass: "badge-warning" },
  { id: "pendiente_firma", label: "Pendiente firma", icon: FileCheck, badgeClass: "badge-info" },
  { id: "listo_para_enviar", label: "Listo para enviar", icon: Send, badgeClass: "badge-success" },
  { id: "activado", label: "Activado", icon: Zap, badgeClass: "badge-active" },
];

// ── Derive communities from mock data ───────────────────────────────────────

function buildDerivedCommunities(): DerivedCommunity[] {
  return mockCommunities.map(c => {
    const estado = derivePipelineState(c);
    const issues = validateProject(c);
    const active = c.participants.filter(p => p.status !== "exited");
    const pendingSigs = active.filter(p => p.signatureState === "pending").length;
    const signed = active.filter(p => p.signatureState === "signed").length;

    return {
      id: c.id,
      nombre: c.name,
      estado,
      errores: issues.filter(i => i.type === "error").map(i => i.message)
        .concat(issues.filter(i => i.type === "warning").map(i => i.message)),
      fechaActivacion: estado === "activado" ? c.createdAt : undefined,
      firmasPendientes: pendingSigs > 0 ? `${signed} de ${active.length} participantes han firmado` : undefined,
    };
  });
}

// ── Activity feed (derived from mock data) ──────────────────────────────────

const ultimosMovimientos = [
  { comunidad: "Residencial Aurora", accion: "Comunidad activa y en funcionamiento", fecha: "Hace 2 días" },
  { comunidad: "Edificio Lumina", accion: "Pendiente de firmas de participantes", fecha: "Hace 1 día" },
  { comunidad: "Torres del Parque", accion: "Coeficientes de reparto actualizados", fecha: "Hace 3 días" },
  { comunidad: "Urbanización Las Encinas", accion: "Documentación lista para enviar a distribuidora", fecha: "Hace 5 días" },
  { comunidad: "Polígono Solar Norte", accion: "Nuevo participante añadido", fecha: "Hace 1 semana" },
];

// ── Typewriter hook ─────────────────────────────────────────────────────────

const PLACEHOLDER_TEXTS = [
  "¿Cuántas comunidades tengo pendientes de firma?",
  "¿Qué errores tiene el Edificio Lumina?",
  "¿Cuál es el siguiente paso para Torres del Parque?",
  "Envía la documentación de Urbanización Las Encinas",
];

function useTypewriter(texts: string[], typingSpeed = 80, pauseMs = 3500) {
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

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
type Msg = { role: "user" | "assistant"; content: string };

const Index = () => {
  const navigate = useNavigate();
  const placeholder = useTypewriter(PLACEHOLDER_TEXTS);

  // Chat state
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Msg[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendChat = async (text: string) => {
    if (!text.trim() || chatLoading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    const allMessages = [...chatMessages, userMsg];
    setChatMessages(allMessages);
    setChatInput("");
    setChatLoading(true);
    setChatOpen(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setChatMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Error de red" }));
        upsert(`⚠️ ${err.error || "Error al contactar el asistente"}`);
        setChatLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsert(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      upsert("⚠️ Error de conexión. Inténtalo de nuevo.");
    }

    setChatLoading(false);
  };

  const comunidades = useMemo(() => buildDerivedCommunities(), []);

  const grouped = useMemo(() => {
    const map: Record<PipelineState, DerivedCommunity[]> = {
      faltan_datos: [], pendiente_firma: [], listo_para_enviar: [], activado: [],
    };
    comunidades.forEach(c => map[c.estado].push(c));
    return map;
  }, [comunidades]);

  const defaultExpanded = useMemo(() => {
    return PIPELINE.find(p => grouped[p.id].length > 0)?.id ?? "faltan_datos";
  }, [grouped]);

  const [activeState, setActiveState] = useState<PipelineState>(defaultExpanded);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-6">
      {/* 1. Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Panel de Control</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Resumen del estado de todas tus comunidades
        </p>
      </div>

      {/* 2. AI Chat — top placement */}
      <div className="space-y-3">
        {chatOpen && chatMessages.length > 0 && (
          <div className="border border-border rounded-xl bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Asistente IA
              </span>
              <button onClick={() => { setChatOpen(false); setChatMessages([]); }} className="p-1 rounded hover:bg-muted transition-colors">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto px-4 py-3 space-y-3">
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] text-sm leading-relaxed px-3.5 py-2.5 rounded-xl ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}>
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm prose-neutral [&_p]:m-0 [&_ul]:m-0 [&_ol]:m-0 [&_li]:m-0 [&_strong]:text-foreground">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : m.content}
                  </div>
                </div>
              ))}
              {chatLoading && chatMessages[chatMessages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-2">
                  <div className="bg-muted text-foreground text-sm px-3.5 py-2.5 rounded-xl rounded-bl-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); sendChat(chatInput); }}
          className="relative flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={chatInput ? "" : placeholder + "▏"}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50 text-foreground"
            disabled={chatLoading}
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || chatLoading}
            className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* 3. Pipeline — Horizontal Stepper */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="grid grid-cols-4 gap-2">
          {PIPELINE.map((state) => {
            const count = grouped[state.id].length;
            const isActive = activeState === state.id;
            const Icon = state.icon;

            return (
              <button
                key={state.id}
                onClick={() => setActiveState(state.id)}
                className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all ${
                  isActive
                    ? "bg-muted ring-1 ring-primary/20"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${state.badgeClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-medium truncate ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {state.label}
                  </p>
                  <p className="text-lg font-bold text-foreground leading-none mt-0.5">{count}</p>
                </div>
                {isActive && (
                  <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Community list for active state */}
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          {(() => {
            const state = PIPELINE.find(p => p.id === activeState)!;
            const Icon = state.icon;
            return (
              <>
                <div className={`w-5 h-5 rounded flex items-center justify-center ${state.badgeClass}`}>
                  <Icon className="w-3 h-3" />
                </div>
                <span className="text-sm font-semibold text-foreground">{state.label}</span>
                <span className="text-xs text-muted-foreground">
                  — {grouped[activeState].length} comunidad{grouped[activeState].length !== 1 ? "es" : ""}
                </span>
              </>
            );
          })()}
        </div>

        {grouped[activeState].length === 0 ? (
          <div className="px-4 py-12 text-center">
            <CheckCircle2 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
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

      {/* 5. Activity feed */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          Últimos movimientos
        </h2>
        <div className="relative border-l-2 border-border ml-2 space-y-0">
          {ultimosMovimientos.map((mov, i) => (
            <div key={i} className="relative pl-6 pb-4 last:pb-0">
              <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-primary/60 ring-2 ring-background" />
              <p className="text-[13px] text-foreground">
                <span className="font-medium">{mov.comunidad}</span>
                <span className="text-muted-foreground"> — {mov.accion}</span>
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{mov.fecha}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Community Row ───────────────────────────────────────────────────────────

function CommunityRow({ community: com, onNavigate }: { community: DerivedCommunity; onNavigate: () => void }) {
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
          <span className="text-[10px] px-2 py-0.5 rounded-full badge-warning font-medium">
            {com.errores.length} error{com.errores.length !== 1 ? "es" : ""}
          </span>
        )}
        {com.estado === "pendiente_firma" && (
          <span className="text-[10px] px-2 py-0.5 rounded-full badge-info font-medium">
            {com.firmasPendientes || "Firmas pendientes"}
          </span>
        )}
        {com.estado === "listo_para_enviar" && (
          <span className="text-[10px] px-2 py-0.5 rounded-full badge-success font-medium">
            Todo listo
          </span>
        )}
        {com.estado === "activado" && com.fechaActivacion && (
          <span className="text-[10px] px-2 py-0.5 rounded-full badge-active font-medium">
            Activa desde {new Date(com.fechaActivacion).toLocaleDateString("es-ES")}
          </span>
        )}
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pb-4 pl-11 space-y-2">
          {com.estado === "faltan_datos" && com.errores.map((err, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <AlertCircle className="w-3.5 h-3.5 text-destructive/70 mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{err}</span>
            </div>
          ))}

          {com.estado === "pendiente_firma" && (
            <div className="flex items-start gap-2 text-xs">
              <FileCheck className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{com.firmasPendientes || "Pendientes de firma"}</span>
            </div>
          )}

          {com.estado === "listo_para_enviar" && (
            <button
              onClick={(e) => { e.stopPropagation(); onNavigate(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              <Send className="w-3 h-3" /> Enviar a distribuidora
            </button>
          )}

          {com.estado === "activado" && (
            <p className="text-xs text-muted-foreground">
              ✅ Comunidad activa desde {com.fechaActivacion ? new Date(com.fechaActivacion).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }) : "—"}
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
