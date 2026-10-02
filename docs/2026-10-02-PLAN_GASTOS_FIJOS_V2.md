# Plan: Gastos Fijos y Plantillas (Actualización V2)

## Goal Description
Implementar un sistema de "Gastos Fijos / Plantillas" contextual por grupo, permitiendo al usuario registrar gastos recurrentes (Diarios, Mensuales) o esporádicos ("de vez en cuando") mediante un flujo de aprobación manual con multiplicador. 

El diseño de interfaz será minimalista dentro del Grupo: una sola tarjeta pequeña con las opciones de [Agregar] y [Ver].

## Proposed Changes

### 1. Base de Datos (Prisma)
Se reemplaza la idea anterior por un modelo `FixedExpense` con soporte para gastos esporádicos (`OCCASIONAL`).

#### [MODIFY] duobalance-api/prisma/schema.prisma
```prisma
enum RecurrenceInterval {
  OCCASIONAL // "De vez en cuando" (Solo actúa como plantilla rápida)
  DAILY
  WEEKLY
  MONTHLY
}

model FixedExpense {
  id              String             @id @default(uuid())
  description     String
  baseAmount      Decimal            @db.Decimal(10, 2)
  category        ExpenseCategory
  recurrence      RecurrenceInterval @default(OCCASIONAL)
  lastProcessedAt DateTime?          // Última vez que se usó (útil para recordatorios diarios/mensuales)
  
  groupId         String
  group           Group              @relation(fields: [groupId], references: [id], onDelete: Cascade)
  
  userId          String             
  user            User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  @@index([groupId])
}
```

### 2. Backend API (NestJS)
#### [NEW] duobalance-api/src/fixed-expenses/*
Módulo para administrar `FixedExpense`.
- `GET /groups/:groupId/fixed-expenses`: Lista las plantillas.
- `POST /groups/:groupId/fixed-expenses`: Crea una nueva.
- `DELETE /fixed-expenses/:id`: Elimina la plantilla.
- `POST /fixed-expenses/:id/process`: Endpoint que recibe `{ action: 'ACCEPT' | 'IGNORE', quantity?: number }`. Calcula el monto final (`baseAmount * quantity`), inserta el movimiento real mediante `ExpensesService` y actualiza `lastProcessedAt`.

### 3. Frontend (UI en el Grupo)
La integración principal en el Dashboard de cada grupo.

#### [MODIFY] DuoBalance-app/src/app/(protected)/grupos/[id].tsx
Se añadirá una tarjeta (Card) pequeña "Gastos Fijos" con dos botones:
- **[Agregar]**: Navega a `/grupos/[id]/gastos-fijos` abriendo el modal de creación.
- **[Ver]**: Abre un BottomSheet (`FixedExpensesExecutionSheet`) en la misma pantalla del grupo.

#### [NEW] DuoBalance-app/src/components/expenses/fixed-expenses-execution-sheet.tsx
El modal que se abre al tocar **[Ver]**:
1. Muestra la lista de todos los gastos fijos configurados en este grupo.
2. Destaca visualmente cuáles están "Pendientes" (si son diarios/mensuales y no se han cobrado hoy/este mes).
3. Al tocar un gasto, muestra un selector de cantidad `[-] 2 [+]` y un botón para **"Registrar Gasto"**.
4. En la parte inferior del modal, hay un botón secundario que dice *"Administrar Gastos Fijos"*, el cual hace lo mismo que el botón `[Agregar]` inicial (lleva a la página completa de administración).

### 4. Frontend (Pantalla Completa de Administración)
#### [NEW] DuoBalance-app/src/app/(protected)/grupos/[id]/gastos-fijos.tsx
Una pantalla completa (con su `ScreenHeader`) dedicada a gestionar los gastos fijos del grupo.
- Lista todos los gastos fijos para poder eliminarlos o editarlos.
- Contiene un Modal para crear un nuevo Gasto Fijo. 
- Los campos del modal de creación serán: Descripción, Monto Base, Categoría y Frecuencia (Todos los días, Todos los meses, De vez en cuando).

## Verification Plan
1. **Automated Verification**: Chequeo estricto de tipos en Prisma y validación de endpoints de NestJS.
2. **Manual Verification**: 
   - Entrar a un Grupo.
   - En la tarjeta "Gastos Fijos", tocar [Agregar]. La app debe navegar a la pantalla completa y abrir el modal de creación.
   - Crear un gasto "De vez en cuando" (OCCASIONAL).
   - Volver al Grupo, tocar [Ver]. 
   - El modal debe mostrar el gasto. Al seleccionarlo y poner cantidad 2, debe registrar el movimiento final correctamente y cerrar el modal.
