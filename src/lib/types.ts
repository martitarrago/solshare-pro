// Core domain types for Repartio SaaS

export type Distribuidora = "iberdrola" | "endesa" | "ufd" | "e-redes" | "viesgo" | "otra";

export const DISTRIBUIDORAS: { id: Distribuidora; label: string }[] = [
  { id: "iberdrola", label: "i-DE (Iberdrola)" },
  { id: "endesa", label: "e-distribución (Endesa)" },
  { id: "ufd", label: "UFD (Naturgy)" },
  { id: "e-redes", label: "e-Redes (EDP)" },
  { id: "viesgo", label: "Viesgo" },
  { id: "otra", label: "Otra" },
];

export type CoeficientMode = "fixed" | "variable";
export type SuggestionMethod = "equal" | "quota" | "consumption" | "power" | "investment";

export const SUGGESTION_METHODS: { id: SuggestionMethod; label: string; description: string }[] = [
  { id: "equal", label: "Partes iguales", description: "Mismo porcentaje para todos" },
  { id: "quota", label: "Por cuota de participación", description: "Según coeficiente de propiedad" },
  { id: "consumption", label: "Por consumo histórico", description: "Proporcional al consumo anual" },
  { id: "power", label: "Por potencia contratada", description: "Según kW contratados" },
  { id: "investment", label: "Por inversión", description: "Según aportación económica" },
];

export interface Participant {
  id: string;
  name: string;
  cups: string; // 22 chars
  email: string;
  unit: string;
  beta: number; // 0-1 (coefficient β)
  potenciaContratada?: number; // kW
  consumoAnual?: number; // kWh
  inversionAportada?: number; // €
  cuotaParticipacion?: number; // %
  status: "active" | "pending" | "exited";
  entryDate: string;
  exitDate?: string;
}

export interface Community {
  id: string;
  name: string;
  address: string;
  city: string;
  cau: string; // CAU code
  distribuidora: Distribuidora;
  potenciaInstalada: number; // kWp
  numPaneles: number;
  participants: Participant[];
  coeficientMode: CoeficientMode;
  gestorEnabled: boolean;
  gestorName?: string;
  gestorNif?: string;
  status: "active" | "pending" | "inactive";
  createdAt: string;
}

export interface BetaHistoryEntry {
  id: string;
  date: string;
  description: string;
  participants: { name: string; cups: string; beta: number }[];
}

export interface TxtGenerationResult {
  content: string;
  distribuidora: Distribuidora;
  cau: string;
  generatedAt: string;
  isValid: boolean;
  errors: string[];
}

// CUPS validation: must be ES + 16 digits + 2 alphanumeric control
export function validateCUPS(cups: string): { valid: boolean; error?: string } {
  if (!cups) return { valid: false, error: "CUPS obligatorio" };
  const clean = cups.replace(/\s/g, "").toUpperCase();
  if (clean.length !== 22) return { valid: false, error: `Debe tener 22 caracteres (tiene ${clean.length})` };
  if (!/^ES\d{16}[A-Z0-9]{2}[A-Z]{2}$/.test(clean)) return { valid: false, error: "Formato inválido. Ej: ES0021000000000001AA1P" };
  return { valid: true };
}

// CAU validation
export function validateCAU(cau: string): { valid: boolean; error?: string } {
  if (!cau) return { valid: false, error: "CAU obligatorio" };
  const clean = cau.replace(/\s/g, "").toUpperCase();
  if (clean.length < 10) return { valid: false, error: "CAU demasiado corto" };
  return { valid: true };
}
