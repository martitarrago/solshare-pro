

## Repartio — Plan Revisado

### Cambio estructural clave

El sidebar se simplifica. Todo lo específico (coeficientes, documentos, participantes, firmas) vive **dentro de cada comunidad** como pestañas/secciones internas. El sidebar solo tiene navegación de alto nivel.

### Sidebar (simplificado)

```text
☀️  Repartio (logo)
─────────────────
🏠  Inicio
🏘️  Comunidades
📊  Ahorros globales
⚙️  Configuración
```

Solo 4 items. Limpio, sin ruido.

### Dentro de cada Comunidad (tabs internas)

Al entrar en una comunidad, se ve una **barra de pestañas horizontal** con:

```text
Resumen  ·  Reparto Solar  ·  Participantes  ·  Documentos  ·  Firmas
```

Cada pestaña abre su sección dentro del contexto de esa comunidad específica.

---

### Toques creativos y minimalistas

**1. "Orb solar" animado en el Dashboard**
Un círculo gradiente dorado-esmeralda que pulsa suavemente como un sol vivo. Su tamaño/brillo cambia según la producción solar del día. Puramente decorativo pero da vida.

**2. Cursor de reparto "rayo de sol"**
En la sección de coeficientes, los sliders tienen un thumb con forma de sol pequeño. Al arrastrar, deja un trail dorado sutil que se desvanece.

**3. Micro-interacciones con partículas**
Al completar el reparto al 100%, explotan partículas doradas suaves desde el centro. Al generar un documento, lluvia de confeti solar mínimo (3-4 partículas, no exagerado).

**4. Cards con "glass morphism" sutil**
Las cards de comunidades tienen un ligero efecto glass: fondo semi-transparente blanco con blur, borde de 1px con opacidad baja. Se siente flotante y moderno.

**5. Indicadores de estado orgánicos**
En vez de badges genéricos: un pequeño sol brillante = activa, sol parcialmente oculto por nube = pendiente, luna = inactiva. Minimalistas, solo contorno.

**6. Números que "crecen"**
Los KPIs hacen count-up animado al entrar en vista. Suave, 800ms, ease-out.

**7. Barra de completitud del reparto**
Una línea fina horizontal que va de transparente a dorado según se completa el 100%. Minimalísima pero satisfactoria.

**8. Empty states ilustrados**
Cuando no hay comunidades: un sol sonriente minimalista con líneas finas diciendo "Tu primera comunidad te espera". Cálido, no genérico.

**9. Greeting contextual**
"Buenos días, Carlos ☀️" / "Buenas tardes, Carlos 🌤️" / "Buenas noches, Carlos 🌙" según la hora.

**10. Transiciones entre pestañas**
Fade + slide horizontal sutil (150ms). Las pestañas activas tienen un underline animado que se desliza.

---

### Implementación por fases

**Fase 1 — Fundación** (lo que se construye ahora)
- Design system: colores Warm Solar, tipografía Sora/Manrope, variables CSS custom
- Layout: Sidebar colapsable + área de contenido principal
- Dashboard bento grid con KPIs, orb solar, greeting contextual, cards de comunidades recientes
- Página de Comunidades: grid de cards glassmorphism, botón crear, empty state ilustrado

**Fase 2 — Vista interna de comunidad**
- Header de comunidad con nombre, dirección, stats rápidos
- Sistema de pestañas (Resumen, Reparto Solar, Participantes, Documentos, Firmas)
- Tab Resumen: mini dashboard de la comunidad
- Tab Reparto Solar: sliders solares + donut interactivo + barra de completitud + asistente "sugerir reparto"
- Tab Participantes: lista con avatares, estados, añadir inline
- Tab Documentos: generación con animación, preview, historial
- Tab Firmas: progress visual con avatares que se iluminan

**Fase 3 — Ahorros y polish**
- Página de Ahorros globales con gráficos, métricas medioambientales
- Configuración
- Micro-animaciones finales (partículas, count-up, transiciones)

### Archivos principales a crear/modificar

- `tailwind.config.ts` — paleta Warm Solar, fuentes, animaciones custom
- `src/index.css` — variables CSS, imports de Google Fonts (Sora, Manrope)
- `src/components/layout/AppSidebar.tsx` — sidebar simplificado
- `src/components/layout/AppLayout.tsx` — layout con SidebarProvider
- `src/pages/Index.tsx` — Dashboard bento grid
- `src/pages/Communities.tsx` — grid de comunidades
- `src/pages/CommunityDetail.tsx` — vista interna con tabs
- `src/components/dashboard/SolarOrb.tsx` — orb animado
- `src/components/dashboard/KpiCard.tsx` — card KPI con count-up
- `src/components/dashboard/CommunityCard.tsx` — card glassmorphism
- `src/components/community/SolarDistribution.tsx` — sliders de reparto
- `src/components/community/ParticipantsList.tsx` — lista participantes
- `src/components/community/DocumentsTab.tsx` — documentos
- `src/components/community/SignaturesTab.tsx` — firmas
- `src/App.tsx` — rutas actualizadas

Se empezará por Fase 1 para tener la base visual y funcional sólida.

