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

---

## Plan de Pruebas (Checklist)
Sigue estos pasos en el emulador o en tu celular para probar el flujo completo. Marca las casillas con `[x]` a medida que vayas confirmando que funcionan.

### 1. Probar el Widget de Presupuesto (Estado Vacío)
- [ ] Abre la aplicación e ingresa al Dashboard.
- [ ] Verifica que el widget "Mi Dinero Disponible" te dice "No has definido tu presupuesto para este mes".
- [ ] Verifica que muestra un botón negro que dice "Configurar presupuesto".

### 2. Probar la Configuración del Presupuesto
- [ ] Toca el botón "Configurar presupuesto". Se debe levantar el Bottom Sheet.
- [ ] Escribe un valor en "Ingreso este mes" (ej. 1500000). Confirma que los puntos se ponen solos automáticamente a medida que escribes.
- [ ] Deja el Límite de Gasto vacío y dale a "Guardar configuración".
- [ ] Verifica que el widget en el Dashboard ahora muestre tu presupuesto con la barra verde en $0 gastado.

### 3. Probar el Flujo de Caja (Tus propios gastos)
- [ ] Ve a crear un gasto. Registra algo de $100.000 donde tú seas quien pagó.
- [ ] Vuelve al Dashboard. 
- [ ] Verifica que el widget ahora diga que has Gastado $100.000 y que la barra verde haya avanzado.

### 4. Probar la Aprobación Anti-Fraude (Gastos externos)
*(Necesitas dos cuentas para probar esto, por ejemplo en un Grupo de Pareja)*
- [ ] Entra con la **Cuenta de tu pareja (Usuario 2)**.
- [ ] Crea un gasto de $50.000, pero en "¿Quién pagó?", selecciona que fue el **Usuario 1 (Tu cuenta original)**.
- [ ] Inicia sesión nuevamente con tu **Cuenta Original (Usuario 1)**.
- [ ] Abre las notificaciones (campana arriba a la derecha). 
- [ ] Verifica que te salga una notificación bajo "Gastos por confirmar" de $50.000 diciendo "Alguien dice que pagaste".
- [ ] Toca en "Rechazar" o "Aceptar" y asegúrate de que desaparezca de la lista.
- [ ] Si tocaste "Aceptar", verifica que tu Presupuesto Gastado haya sumado esos $50.000.

### 5. Probar la Trazabilidad
- [ ] Toca el botón de "Historial" (esquina superior derecha del widget de presupuesto).
- [ ] Se debe abrir la pantalla "Historial de Gastos".
- [ ] Verifica que veas los últimos 6 meses hacia atrás.
- [ ] Verifica que el mes actual diga "En verde" o "Excedido" dependiendo de si gastaste más o menos de lo que definiste.
