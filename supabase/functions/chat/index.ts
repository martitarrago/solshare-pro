import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `Eres el asistente de Repartio, una herramienta de gestión de comunidades energéticas bajo la regulación española RD 244/2019 y RDL 7/2026.

Tu conocimiento incluye:
- Autoconsumo colectivo: modalidades (sin excedentes, con excedentes sin/con compensación)
- Coeficientes β de reparto: fijos y variables por hora, validación suma=1
- CUPS (Código Universal de Punto de Suministro): formato ES + 4 dígitos distribuidora + 12 dígitos + 2 alfanum + 2 control = 22 caracteres
- CAU (Código de Autoconsumo): identificador de la instalación
- Distribuidoras: e-distribución (Endesa, códigos 0021/0022/0024), i-DE (Iberdrola, 0023/0031), UFD (Naturgy, 0026/0029)
- Criterios de proximidad: mismo edificio, misma ref. catastral, baja tensión 500m/2000m
- Tipos de conexión: red interior vs red de distribución
- Gestor de Autoconsumo (RDL 7/2026): representante legal del colectivo
- Ficheros TXT estandarizados para distribuidoras con formato CUPS;hora;coeficiente
- Proceso de alta: configuración → vecinos → reparto → firmas → listo → enviado → activo

Responde siempre en español. Sé conciso y técnico cuando sea necesario. Si te preguntan algo fuera de tu ámbito, indícalo amablemente.`,
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Límite de peticiones alcanzado, inténtalo en unos segundos." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos agotados. Añade fondos en Settings > Workspace > Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Error del servicio de IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
