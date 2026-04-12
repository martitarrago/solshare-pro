import { Community, Participant, BetaHistoryEntry } from "./types";

const mockParticipants: Participant[] = [
  { id: "p1", name: "María García López", cups: "ES0021000000000001AA1P", email: "maria@email.com", unit: "1ºA", beta: 0.15, potenciaContratada: 4.6, consumoAnual: 3200, status: "active", entryDate: "2025-01-15" },
  { id: "p2", name: "Juan López Martín", cups: "ES0021000000000002BB2P", email: "juan@email.com", unit: "1ºB", beta: 0.12, potenciaContratada: 3.45, consumoAnual: 2800, status: "active", entryDate: "2025-01-15" },
  { id: "p3", name: "Ana Martínez Ruiz", cups: "ES0021000000000003CC3P", email: "ana@email.com", unit: "2ºA", beta: 0.10, potenciaContratada: 3.45, consumoAnual: 2100, status: "active", entryDate: "2025-01-15" },
  { id: "p4", name: "Carlos Ruiz Sánchez", cups: "ES0021000000000004DD4P", email: "carlos@email.com", unit: "2ºB", beta: 0.18, potenciaContratada: 5.75, consumoAnual: 4500, status: "active", entryDate: "2025-02-01" },
  { id: "p5", name: "Laura Sánchez Díaz", cups: "ES0021000000000005EE5P", email: "laura@email.com", unit: "3ºA", beta: 0.08, potenciaContratada: 3.45, consumoAnual: 1900, status: "pending", entryDate: "2026-03-01" },
  { id: "p6", name: "Pedro Fernández Gil", cups: "ES0021000000000006FF6P", email: "pedro@email.com", unit: "3ºB", beta: 0.14, potenciaContratada: 4.6, consumoAnual: 3100, status: "active", entryDate: "2025-01-15" },
  { id: "p7", name: "Isabel Moreno Vega", cups: "ES0021000000000007GG7P", email: "isabel@email.com", unit: "4ºA", beta: 0.11, potenciaContratada: 3.45, consumoAnual: 2400, status: "active", entryDate: "2025-01-15" },
  { id: "p8", name: "David Jiménez Roca", cups: "ES0021000000000008HH8P", email: "david@email.com", unit: "4ºB", beta: 0.12, potenciaContratada: 4.6, consumoAnual: 2900, status: "active", entryDate: "2025-01-15" },
];

export const mockCommunities: Community[] = [
  {
    id: "1", name: "Residencial Aurora", address: "Av. del Sol 42", city: "Madrid",
    cau: "CAU-2024-001-MADRID", distribuidora: "iberdrola",
    potenciaInstalada: 45, numPaneles: 120,
    participants: mockParticipants,
    coeficientMode: "fixed", gestorEnabled: false,
    status: "active", createdAt: "2025-01-15",
  },
  {
    id: "2", name: "Edificio Lumina", address: "C/ Luna 15", city: "Barcelona",
    cau: "CAU-2024-002-BCN", distribuidora: "endesa",
    potenciaInstalada: 30, numPaneles: 80,
    participants: mockParticipants.slice(0, 5),
    coeficientMode: "fixed", gestorEnabled: true, gestorName: "SolarGest S.L.", gestorNif: "B12345678",
    status: "active", createdAt: "2025-03-01",
  },
  {
    id: "3", name: "Torres del Parque", address: "Pl. Verde 3", city: "Valencia",
    cau: "CAU-2024-003-VLC", distribuidora: "ufd",
    potenciaInstalada: 80, numPaneles: 200,
    participants: mockParticipants.slice(0, 3),
    coeficientMode: "variable", gestorEnabled: false,
    status: "pending", createdAt: "2026-01-10",
  },
];

export const mockBetaHistory: BetaHistoryEntry[] = [
  {
    id: "h1", date: "2026-03-15", description: "Reparto actualizado — Carlos Ruiz aumenta cuota",
    participants: mockParticipants.map(p => ({ name: p.name, cups: p.cups, beta: p.beta })),
  },
  {
    id: "h2", date: "2025-06-01", description: "Reparto inicial tras alta de la instalación",
    participants: mockParticipants.map(p => ({ name: p.name, cups: p.cups, beta: p.beta * 0.95 })),
  },
];
