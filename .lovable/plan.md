

# Repaso del frontend — Problemas encontrados

He revisado todos los ficheros del frontend. Estos son los problemas que hay que corregir:

## Problemas encontrados

### 1. NotFound.tsx en inglés
La página 404 tiene textos en inglés ("Oops! Page not found", "Return to Home"). Debe estar en español.

### 2. CommunityCard.tsx usa el pipeline antiguo de 7 fases
La barra de progreso del card muestra 7 segmentos (`PROJECT_PHASES` viejo) pero el detalle de comunidad ahora usa 5 pasos. Los badges de fase también usan las 7 fases antiguas. Hay que adaptar el card al nuevo modelo de 5 pasos o simplificar.

### 3. Communities.tsx usa `PHASE_ORDER` con 7 fases
El filtro y ordenación de la lista de comunidades usa `PHASE_ORDER` con las 7 fases antiguas. Debe alinearse con el nuevo sistema.

### 4. Resumen del wizard (NewCommunity.tsx) muestra Conexión y Proximidad
En el paso 5 "Resumen", se muestran los campos "Conexión" y "Proximidad" que se eliminaron del wizard. Deben quitarse del resumen ya que el usuario no los configuró — son valores por defecto que se editan después en Detalles.

### 5. Datos inconsistentes entre Index.tsx y mock-data.ts
El dashboard (`Index.tsx`) usa su propia lista hardcodeada de comunidades (`comunidades` array) que no coincide con `mockCommunities`. Por ejemplo, en el dashboard hay 6 comunidades con estados propios, pero en `mock-data.ts` hay 5 con datos diferentes. Esto causa que al hacer click en una comunidad del dashboard, se navegue a un ID que puede no coincidir.

## Plan de corrección

| Fichero | Cambio |
|---|---|
| `NotFound.tsx` | Traducir textos a español |
| `CommunityCard.tsx` | Eliminar barra de progreso de 7 fases. Mostrar badge con estado derivado (Borrador/Validado/Activo) en lugar de la fase antigua |
| `Communities.tsx` | Eliminar `PHASE_ORDER`. Adaptar filtros para usar lógica de validación en vez de fases |
| `NewCommunity.tsx` | Quitar líneas de Conexión y Proximidad del resumen (paso 5) |
| `Index.tsx` | Reemplazar mock local por `mockCommunities` importado + derivar estado del pipeline desde `validateProject` |

Ningún fichero nuevo ni dependencia necesaria.

