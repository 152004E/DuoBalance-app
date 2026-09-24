# Plan de Implementación: Consolidación de Gastos, Grupo Principal y Gastos Fijos
**Fecha:** 2026-09-24

## 1. Resumen Ejecutivo y Visión Central
Actualmente, DuoBalance aísla los gastos dentro de cada grupo. El objetivo de este diseño es crear un **Gran Libro Mayor (Ledger)** para el usuario, representado por un **Grupo Personal Principal**. 

La visión es que el usuario tenga un único lugar donde ver **todo lo que sale de su bolsillo**, sin importar si el gasto ocurrió en un viaje con amigos o en las compras de la pareja. Adicionalmente, se integrará el motor de **Gastos Fijos (Recurrentes)** para automatizar el descuento mensual de obligaciones financieras.

Al ser el centro del proyecto, este cambio requiere una arquitectura robusta de sincronización y prevención de doble contabilidad.

---

## 2. Feature: Grupo Personal Principal & Gastos Consolidados

### ¿Qué se busca?
Poder marcar un Grupo Personal como "Predeterminado" o "Principal". Todo lo que el usuario pague en otros grupos (Pareja, Compartidos) deberá reflejarse de alguna forma en este grupo principal.

### Análisis Contable: Dos formas de hacerlo (Pros y Contras)

Imagina que tú pagas una cena de $100.000 en un grupo de pareja (50/50). Tu pareja te debe $50.000. ¿Cómo llega esto al Grupo Personal Principal?

#### Enfoque A: "Flujo de Caja Real" (Recomendado)
- **El Gasto:** Cuando pagas los $100.000, se clona un gasto de **$100.000** en tu Grupo Personal. *(Porque físicamente esos 100k salieron de tu cuenta bancaria).*
- **El Reembolso (Liquidación):** Cuando tu pareja te paga su deuda de $50.000 (Settlement), el sistema registra un ingreso/reembolso de **+$50.000** en tu Grupo Personal.
- **✅ Pros:** Coincide exactamente con los extractos del banco del usuario.
- **❌ Contras:** Tu presupuesto temporalmente se ve afectado por $100.000 hasta que tu pareja te pague.

#### Enfoque B: "Impacto Patrimonial" (Tu cuota real)
- **El Gasto:** Cuando pagas los $100.000, el sistema calcula tu cuota real (50%) y solo registra un gasto de **$50.000** en tu Grupo Personal.
- **✅ Pros:** Tu presupuesto personal siempre refleja tu riqueza real, sin importar si tu pareja se demora en pagarte.
- **❌ Contras:** Si revisas tu cuenta bancaria verás que salieron $100.000, pero la app dice que solo gastaste $50.000. Puede causar confusión.

> **Decisión sugerida:** Basado en tu comentario de "llevar también qué son gastos", el **Enfoque B (Tu cuota real)** suele ser más fácil de entender para el usuario común que no sabe de contabilidad.

### Gestión del Grupo Principal y Seguridad
- **Ajustes:** En la vista de Configuración de un grupo Personal, habrá un switch: *"Establecer como Mi Grupo Principal"*.
- **Cierre / Eliminación:** 
  - Si un grupo es el Principal, **el botón de "Eliminar Grupo" se deshabilita**.
  - Si el usuario quiere eliminarlo, el sistema le pedirá: *"Primero debes asignar otro grupo como principal"*.
- **¿Qué pasa si el grupo deja de ser el principal?**
  - Los gastos que ya se sincronizaron se quedan allí (es historia inmutable).
  - A partir de ese momento, los nuevos gastos del usuario se enviarán al nuevo grupo principal.

### Desafíos Técnicos (Edge Cases)
- **Modificación en cascada:** Si editas el gasto en el grupo de la Pareja de $100k a $80k, el backend debe encontrar el gasto "espejo" en tu grupo personal y bajarlo a $40k. 
  - *Solución:* Añadir un campo `linkedExpenseId` en la tabla `Expense` para que el backend sepa que un gasto es el reflejo de otro.
- **Borrados:** Si se elimina el gasto en el grupo compartido, se debe hacer *soft-delete* automático del gasto espejo en el grupo principal.

---

## 3. Feature: Gastos Fijos (Recurrentes)

### ¿Qué se busca?
Automatizar el registro de suscripciones (Netflix), arriendos, cuotas de préstamos, etc., que ocurren todos los meses, restándolos automáticamente del presupuesto proyectado.

### Arquitectura de Implementación: ¿Cómo hacerlo?

#### Enfoque 1: Job en Segundo Plano (Cron Job)
- Crear una tabla `RecurringExpense`.
- Un servidor corre cada medianoche, revisa qué gastos fijos tocan cobrar hoy, y los clona físicamente en la tabla `Expense`.
- **✅ Pros:** Es la forma más limpia. Los gastos se mezclan perfectamente con el historial y pueden editarse individualmente mes a mes.
- **❌ Contras:** Requiere mantener un proceso en segundo plano (Worker) activo 24/7 en el servidor, lo cual consume más recursos.

#### Enfoque 2: "Lazy Evaluation" (Generación al inicio de sesión) - RECOMENDADO
- Crear una tabla `RecurringExpense` (Día de cobro, Monto, Descripción, Activo).
- En lugar de un cron, cuando el usuario abre la app y llama a `GET /dashboard`, el backend pregunta: *"¿He generado los gastos fijos de este usuario para este mes?"*.
- Si no, los genera todos de golpe en la tabla `Expense` y guarda un registro de `lastGeneratedMonth`.
- **✅ Pros:** No requiere infraestructura extra. Todo funciona con el tráfico natural de la aplicación. Mantiene el historial físico para trazabilidad y permite que el usuario los edite después de generados.

### Interfaz de Usuario
1. **Creación:** En el `CreateExpenseSheet`, añadir un switch: `[ ] Repetir este gasto cada mes`.
2. **Gestión:** Una nueva sección en el Perfil o en Movimientos llamada **"Suscripciones y Gastos Fijos"**, donde se puedan pausar, editar montos o cancelar cobros automáticos futuros.

---

## 4. Resumen del Plan de Trabajo (Siguientes Pasos)

### Fase 1: Motor del Grupo Principal
1. Modificar Prisma: Añadir `mainPersonalGroupId` a `User` y `linkedExpenseId` a `Expense`.
2. UI Ajustes: Añadir opción para marcar/desmarcar un grupo como principal, bloqueando su borrado.
3. Evento Backend: Interceptar la creación de gastos (`POST /expenses`) para generar el gasto clonado (el `share` del usuario) en su grupo principal. Actualizar el interceptor de edición y borrado.

### Fase 2: Motor de Gastos Fijos (Lazy Evaluation)
1. Modificar Prisma: Añadir tabla `RecurringExpense`.
2. UI Crear Gasto: Añadir switch "Repetir cada mes".
3. Lógica Backend: En la consulta del Dashboard o Login, revisar si existen gastos fijos sin procesar en el mes actual y generarlos.
4. UI Gestión: Pantalla de "Suscripciones" para administrar estos cobros.
