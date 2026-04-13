
# Añadir paso "Firmas" al stepper

Tienes razón — el componente `SignaturesTab` existe pero se eliminó del flujo al simplificar a 4 pasos. Hay que añadirlo como 5o paso.

## Cambios

### `src/pages/CommunityDetail.tsx`

1. **Añadir import** de `SignaturesTab` y el icono `PenLine` de Lucide
2. **Ampliar STEPS** a 5 pasos:
   - ① Detalles → ② Participantes → ③ Coeficientes → ④ Documento → ⑤ Firmas
3. **Añadir lógica de estado** para el paso Firmas:
   - Complete (verde): todos los participantes han firmado
   - Error (rojo): algún participante ha rechazado la firma
   - Pendiente (gris): hay firmas sin completar
4. **Renderizar `<SignaturesTab>`** cuando `activeStep === "firmas"`
5. **Actualizar `deriveProjectStatus`**: el estado "Validado" requiere que además de generar el .txt, todas las firmas estén completadas

Sin cambios en otros ficheros — el componente `SignaturesTab` ya está listo.
