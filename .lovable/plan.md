

## Plan: Generate Repartio Functional Specification (DOCX)

### What
Create a professional DOCX document cataloging all functional features of Repartio, following the exact structure provided in your message.

### How
1. **Install `docx` package** globally via npm
2. **Write generation script** (`/tmp/generate_doc.js`) using docx-js with:
   - US Letter page size, 1" margins, Arial font
   - Styled headings (H1-H3) for each section
   - Bullet lists for features using proper `LevelFormat.BULLET`
   - Tables for structured data (validators, data model enums, distributors)
   - Professional formatting — no colors, clean typography
3. **Generate** → `/mnt/documents/Repartio_Functional_Spec.docx`
4. **QA** — convert to PDF/images via LibreOffice and inspect every page

### Document sections (8 total)
1. Overview — purpose & regulation context
2. Application Structure — routing, state, AI integration
3. Sidebar Navigation — nav items & behavior
4. Pages & Functions — Dashboard, Comunidades, Proyecto Detalle, Nueva Comunidad (detailed breakdowns with sub-bullets)
5. Validators — CUPS, distributor detection, allocation sum, project validator
6. Generators — TXT files, Acuerdo HTML
7. AI Chat Assistant — access points, backend, context awareness
8. Data Model — phases, modalities, connection types, distributors, signature states

### Output
- `/mnt/documents/Repartio_Functional_Spec.docx`
- Estimated ~8-10 pages

