# Plan de Trabajo - 17 de Septiembre 2026
**Objetivo Principal:** Terminar la funcionalidad de Notificaciones Push (PWA) y reestructurar el sistema de liquidaciones para soportar "Deuda Mensual" y "Deuda Total" con fechas de corte y límites.

## 1. Finalizar Notificaciones Push (PWA)
Actualmente el código base ya tiene el Service Worker y los VAPID keys correctos.
**Tareas a realizar hoy:**
- [ ] Hacer las pruebas manuales de suscripción en el navegador (Frontend).
- [ ] Confirmar que los gastos (`expenses.service.ts`) y pagos (`payments.service.ts`) disparan correctamente las notificaciones al otro usuario en el Backend.
- [ ] Asegurar que el `.env` del frontend tiene el `EXPO_PUBLIC_VAPID_KEY` subido y funcional.

## 2. Base de Datos: Fecha de Corte y Fecha Límite
Para soportar la diferencia entre lo que se debe "del mes" y la deuda "histórica", debemos agregar configuración al Grupo.
**Tareas a realizar hoy (Backend):**
- [ ] Modificar `prisma/schema.prisma` en el modelo `Group`:
  - `cutoffDay` (Int, por defecto 30 o 31): El día en que se cierra el mes.
  - `deadlineDay` (Int, por defecto 5): El día del mes siguiente máximo para pagar la deuda del mes anterior.
- [ ] Crear y correr la migración de Prisma (`npx prisma migrate dev`).

## 3. Lógica de Liquidaciones (Backend - `settlements.service.ts`)
Debemos adaptar los cálculos para que reflejen la realidad de una pareja:
- **Deuda del Mes (Ciclo Actual):** Se calcula sumando solo los gastos que ocurrieron entre el último `cutoffDay` y el próximo `cutoffDay`.
- **Deuda Total (Histórica):** Se calcula sumando TODOS los gastos históricos menos TODOS los pagos realizados.
- **La Consolidación (Regla de negocio):** Matemáticamente, la Deuda Total ya engloba la Deuda del Mes. Sin embargo, para la UI y las notificaciones, si la fecha actual sobrepasa el `deadlineDay`, la "Deuda del Mes" anterior pasa a ser exigible como "Deuda Total", y el nuevo "Mes" arranca en 0 hasta que haya nuevos gastos.
**Tareas a realizar hoy (Backend):**
- [ ] Actualizar el método `suggest()` para aceptar filtros por periodo y devolver el saldo del ciclo actual.
- [ ] Crear los métodos para notificaciones push en `settlements.controller.ts`:
  - `@Post('remind-monthly/:debtorId')` -> Envía push: *"Te recuerdo los gastos de este ciclo"*.
  - `@Post('remind-total/:debtorId')` -> Envía push: *"Te recuerdo la deuda total acumulada"*.

## 4. Integración Frontend (DuoBalance-app)
Una vez el backend esté listo, la interfaz gráfica debe reflejar esta dualidad.
**Tareas a realizar hoy (Frontend):**
- [ ] En la pantalla de Liquidación/Saldos, mostrar dos bloques distintos: 
  - Saldo del Mes Actual (con la fecha de corte visible).
  - Saldo Total Acumulado.
- [ ] Agregar botones de "Notificar/Recordar" independientes para cada tipo de saldo.
