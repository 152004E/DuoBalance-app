# Plan de Implementación: Presupuesto y Flujo de Caja
**Fecha:** 22 de Septiembre de 2026

## Contexto y Decisiones de Producto
En la sesión de diseño de hoy, se discutió la arquitectura para el nuevo módulo de **Presupuestos**. Tras revisar varias opciones, se llegó a una arquitectura basada estrictamente en el **Flujo de Caja Real (Cash Flow)**, en lugar de basarse en los porcentajes teóricos de división.

### 1. El Presupuesto (Mi Resumen del Mes)
El objetivo es mostrar al usuario exactamente cuánto "Dinero Disponible" le queda en el mes.
- El usuario ingresará su **Salario / Ingreso**.
- Opcionalmente, podrá fijar un **Presupuesto (Límite)**. Si no lo hace, el sistema usará su salario como límite máximo por defecto.
- **Flujo de Caja Real:** El dinero disponible baja *únicamente* cuando el usuario saca plata de su bolsillo.
  - `Total Gastado = (Gastos donde el usuario es el pagador) + (Liquidaciones enviadas para pagar deudas) - (Liquidaciones recibidas de deudores)`.
  - Si un usuario paga $100 en pareja (50%), su dinero disponible baja $100.
  - Cuando su pareja le transfiere $50 a través de la app, su dinero disponible recupera esos $50 (porque entraron a su bolsillo).

### 2. Aprobación de Gastos (Flujo Anti-Fraude)
Para evitar que un usuario altere el presupuesto de otro, se añade un flujo de aprobación.
- Si el "Usuario 2" registra un gasto pero indica que el "Usuario 1" fue quien pagó, el gasto nacerá en estado `PENDING`.
- El "Usuario 1" recibirá una notificación para aceptar o rechazar el gasto.
- El gasto no afectará los balances ni el presupuesto de nadie hasta que el "Usuario 1" lo pase a estado `APPROVED`.

### 3. Trazabilidad Histórica
El usuario podrá ver en una interfaz cómo le fue en los meses anteriores.
- Vista de "Historial" con promedios y reportes de meses pasados (Ej: "En Agosto tu límite era $1M y gastaste $900k").

---

## Fases de Desarrollo Acordadas

### Fase 1: Backend - Base de Datos y Aprobación
1. **Modificar Schema (`schema.prisma`):**
   - Agregar el `enum ExpenseStatus { PENDING, APPROVED, REJECTED }`.
   - Agregar el modelo `UserBudget` (userId, month, year, income, budget).
2. **Actualizar Endpoints de Gastos:**
   - En `POST /expenses`, asignar `status = PENDING` si el creador no es el mismo que `paidBy`.
   - Crear endpoints para `PATCH /expenses/:id/approve` y `PATCH /expenses/:id/reject`.
3. **Controlador de Presupuesto:**
   - Crear la lógica de la ecuación de flujo de caja (Sumatoria de gastos pagados + envíos - cobros).

### Fase 2: Frontend - Aprobaciones
1. **Modelos:** Actualizar los tipos TypeScript en el frontend.
2. **Notificaciones:** Crear UI en el Dashboard para que el usuario pueda ver sus gastos "Por confirmar" y pueda aceptarlos o rechazarlos, similar a las liquidaciones.

### Fase 3: Frontend - Módulo de Presupuesto
1. **Bottom Sheet (`SetBudgetSheet`):** Formulario para ingresar el salario/ingreso y límite del mes.
2. **Widget "Mi Resumen del Mes":** Tarjeta principal en el grupo "Personal" o Dashboard con la barra de dinero disponible.
3. **Trazabilidad:** Pantalla para revisar el desempeño de presupuesto en meses pasados.
