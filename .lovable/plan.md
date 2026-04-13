

# Repartio — Ultimate Visual Upgrade

## Current State Assessment

After reviewing every page and component, these are the areas that need polish:

1. **Inconsistent spacing & density** — Some sections use `space-y-8`, others `space-y-5`, `space-y-6`. Card padding varies between `p-4`, `p-5`, `p-6`, `p-7`.
2. **Pipeline nodes look boxy** — The 6.5rem square nodes with rounded corners feel clunky. The animated pulse energy bar is distracting.
3. **Typography hierarchy is flat** — Everything uses Inter at similar weights. No clear visual rhythm between headings, labels, and body.
4. **Color usage is scattered** — Amber, sky, emerald, violet badges are functional but feel like a rainbow. No cohesive palette discipline.
5. **Sidebar branding is weak** — Small logo, thin text. Doesn't communicate "Repartio" as a product.
6. **Header bar is empty** — Just a sidebar toggle. Wasted real estate.
7. **Chat input blends into the page** — Needs stronger visual anchoring.
8. **Settings page is a skeleton** — Three buttons with no real content.
9. **Community cards lack hierarchy** — Too many tiny badges (CAU, distribuidora, phase, issues) compete for attention.
10. **NewCommunity wizard steps** — Functional but visually flat. Step indicators are cramped.
11. **No loading/empty states** — Plain text fallbacks.
12. **App.css still has Vite boilerplate** — Unused styles polluting the build.

---

## The Plan

### 1. Clean up foundations
- Delete `src/App.css` (Vite boilerplate, unused)
- Normalize spacing system: `space-y-6` page-level, `space-y-4` section-level, `gap-4` grids
- Standardize card padding to `p-5` everywhere
- Standardize border-radius to `rounded-xl` for cards, `rounded-lg` for inputs

### 2. Refine the color system
- Reduce pipeline state colors to a tighter palette: muted amber for warnings, primary green for success, slate for neutral
- Remove the rainbow effect — use opacity variations of 2-3 core colors instead of 5+ distinct hues
- Update badge styles to use subtle backgrounds with consistent border treatment

### 3. Upgrade the sidebar
- Larger, bolder "Repartio" wordmark with the solar gradient
- Add a subtle divider between nav items and footer
- Refine the user menu: slightly larger avatar, better spacing
- Add a "Nuevo" quick-action button at the bottom of nav items

### 4. Redesign the dashboard pipeline
- Replace the 4 square nodes with a horizontal segmented bar (like a progress stepper) — cleaner, more compact
- Remove the animated pulse energy bar (distracting)
- Show counts as inline badges within each segment
- Active segment gets a subtle bottom border highlight, not a glow

### 5. Polish the dashboard layout
- Move the AI chat input to the very top, right below the title — it's the primary action
- Tighten the community list rows: better alignment, consistent badge sizing
- Activity feed: reduce visual weight, use lighter dots and smaller text
- Add a subtle "Crear comunidad" CTA card when there are few communities

### 6. Improve community cards (Communities page)
- Remove CAU/distribuidora badges from the card face (move to detail page)
- Emphasize: name, phase badge, participant count, progress bar
- Better hover state with border color transition instead of translateY

### 7. Refine CommunityDetail page
- Tabs: use a cleaner underline style without background color on active tab
- Phase progress bar: thinner, more elegant, with check icons
- Validation banner: use a proper Alert component with icon + dismiss

### 8. Polish NewCommunity wizard
- Wider step indicators with clearer active/done/pending states
- Better input styling: taller inputs (py-2.5 → py-3), more breathing room
- Participant add form: simplify the 12-column grid to a cleaner 2-row layout on mobile

### 9. Settings page
- Add actual form sections (profile fields, notification toggles, template list)
- Use proper card containers with headers

### 10. Header bar upgrade
- Add breadcrumb navigation (e.g., "Comunidades > Edificio Lumina")
- Add a "Nueva comunidad" quick-action button on the right
- Keep sidebar trigger on the left

### 11. Global polish
- Add smooth page transitions (`animate-fade-in` is already there, ensure consistency)
- Empty states: add illustration-style icons with encouraging copy
- Ensure all interactive elements have visible focus rings for accessibility

---

## Technical Details

**Files to modify:**
- `src/index.css` — Tighten CSS custom properties, remove unused utilities
- `src/App.css` — Delete entirely
- `src/App.tsx` — Remove App.css import
- `src/components/layout/AppSidebar.tsx` — Sidebar redesign
- `src/components/layout/AppLayout.tsx` — Header with breadcrumbs
- `src/pages/Index.tsx` — Dashboard pipeline + layout overhaul
- `src/pages/Communities.tsx` — Card grid polish
- `src/pages/CommunityDetail.tsx` — Tabs + phase bar refinement
- `src/pages/NewCommunity.tsx` — Wizard step polish
- `src/pages/SettingsPage.tsx` — Flesh out with real sections
- `src/components/dashboard/CommunityCard.tsx` — Simplified card design
- `src/components/dashboard/KpiCard.tsx` — Minor spacing fix
- `tailwind.config.ts` — No changes needed, config is solid

**No new dependencies required.** All improvements use existing Tailwind + Lucide + shadcn/ui.

