# Rediseño del flujo de selección de contexto y creación de gastos

**Fecha:** 2026-07-29
**Estado:** Aprobado

## Resumen

Rediseñar la pantalla **Gastos** (`/gastos/index.tsx`) para separar las responsabilidades de filtrar/contextualizar (HeroSection + GroupSelector) y crear gastos (FloatingAddButton), compartiendo un único estado de contexto.

---

## Principio rector

`FilterState` es la **única fuente de verdad**. Ningún componente guarda estado duplicado (`selectedGroup`, `selectedCategory`, `activeFilter`, etc.). Todo deriva de `FilterState`.

---

## 1. FilterState — Estado compartido

```ts
export type FilterCategory
  | 'all'
  | 'personal'
  | 'couple'
  | 'group';

type FilterState = {
  category: FilterCategory;
  groupId: string | null;
};
```

Vive en `gastos/index.tsx`. Se inicializa siempre como:

```ts
const [filter, setFilter] = useState<FilterState>({
  category: 'all',
  groupId: null,
});
```

**Estado inicial predecible:** Siempre `category: 'all'`, independientemente de cuántas parejas o grupos tenga el usuario.

Toda la pantalla depende exclusivamente de `filter`:

```
FilterState
  ↓
  filtra grupos (GroupSection)
  ↓
  filtra gastos (getExpenses)
  ↓
  calcula estadísticas (Total Gastado, Transacciones)
  ↓
  controla el FloatingAddButton
```

### State Transitions

```
FilterState actual               Acción                          Nuevo FilterState
─────────────────────────────────────────────────────────────────────────────────────
{ all, null }                    Selecciona "Personal"          { personal, personalGroup.id }
{ all, null }                    Selecciona "Parejas >"         Vista Parejas (no cambia FilterState aún)
{ all, null }                    Selecciona "Grupos >"          Vista Grupos (no cambia FilterState aún)
{ personal, X }                  Selecciona "Todos"             { all, null }
{ personal, X }                  Selecciona "Parejas >"         Vista Parejas
{ couple, null }                 Selecciona pareja específica   { couple, pareja.id }
{ couple, X }                    "Todas las parejas"            { couple, null }
{ couple, X }                    "Todos"                        { all, null }
{ group, null }                  Selecciona grupo específico    { group, grupo.id }
{ group, X }                     "Todos los grupos"             { group, null }
{ group, X }                     "Todos"                        { all, null }
```

### Grupo eliminado externamente

Si el `groupId` almacenado en `FilterState` ya no existe (otro usuario eliminó el grupo), el filtro se resetea automáticamente a:

```ts
{ category: filter.category, groupId: null }
```

Se mantiene la categoría pero se limpia el `groupId`. Si la categoría tampoco tiene grupos disponibles, cae a `{ category: 'all', groupId: null }`.

### GroupSelector es controlado

GroupSelector **nunca** mantiene el filtro seleccionado internamente. Solo mantiene estado de UI:

```ts
currentView: 'main' | 'couples' | 'groups'
```

Pero nunca `selectedGroup` ni `selectedCategory`. Todo viene desde `value`. Así se evitan dos fuentes de verdad.

---

## 2. GroupSelector — Selector de contexto en HeroSection

### Responsabilidad

Únicamente responde a: *"¿Qué información quiero visualizar?"*

NO crea gastos, NO abre formularios, NO ejecuta lógica de creación. Solo modifica `FilterState`.

### Props

```ts
interface GroupSelectorProps {
  value: FilterState;
  onChange: (filter: FilterState) => void;
  personalGroups: GroupResponse[];
  coupleGroups: GroupResponse[];
  sharedGroups: GroupResponse[];
  variant?: 'light' | 'dark';
}
```

Usa `value`/`onChange` como cualquier componente controlado de React.

### Navegación jerárquica (modal interno)

El modal maneja `currentView: 'main' | 'couples' | 'groups'`.

**Vista principal:**
```
Todos         → { category: 'all', groupId: null }
Personal      → { category: 'personal', groupId: personalGroup.id }
Parejas >     → cambia a view 'couples'
Grupos >      → cambia a view 'groups'
```

**Vista Parejas:**
```
← Parejas
Todas las parejas  → { category: 'couple', groupId: null }
Andrea             → { category: 'couple', groupId: andreaId }
Laura              → { category: 'couple', groupId: lauraId }
```

**Vista Grupos:**
```
← Grupos
Todos los grupos   → { category: 'group', groupId: null }
Roommates          → { category: 'group', groupId: roommatesId }
```

**Auto-select:** Si `coupleGroups.length === 1`, se selecciona automáticamente sin mostrar submenú. Misma regla para `sharedGroups`.

### Comportamiento visual

El botón en el Hero muestra el nombre del contexto actual según el estado:
- `all` → "Todos"
- `personal` → "Personal"
- `couple` + `groupId` → nombre de la pareja
- `couple` + `groupId === null` → "Parejas"
- `group` + `groupId` → nombre del grupo
- `group` + `groupId === null` → "Grupos"

---

## 3. GastosScreen — Flujo de datos

### Filtrado de grupos

```ts
const filteredGroups = groups.filter(g => {
  if (filter.category === 'all') return true;
  if (filter.category === 'personal' && g.type === 'PERSONAL') return true;
  if (filter.category === 'couple' && g.type === 'COUPLE') {
    return filter.groupId ? g.id === filter.groupId : true;
  }
  if (filter.category === 'group' && g.type === 'GROUP') {
    return filter.groupId ? g.id === filter.groupId : true;
  }
  return false;
});
```

### Filtrado de gastos

```ts
const filteredExpenses = allExpenses.filter(e =>
  filteredGroupIds.has(e.groupId)
);
```

Estadísticas y lista de recientes se calculan sobre `filteredExpenses`.

---

## 4. FloatingAddButton — Botón completamente tonto

```tsx
<FloatingAddButton onPress={handleCreateExpense} />
```

No tiene lógica interna. No recibe `icon` ni `size` en este contexto.

Toda la lógica de decisión vive en el screen:

```ts
function handleCreateExpense() {
  if (filter.groupId) {
    // Caso 1: contexto específico → abrir CreateExpenseSheet directo
    const group = groups.find(g => g.id === filter.groupId)!;
    openCreateExpenseSheet(group);
  } else {
    // Caso 2: contexto múltiple → abrir DestinationSelector
    openDestinationSelector();
  }
}
```

---

## 5. DestinationSelector — Nuevo BottomSheet

### Responsabilidad

Ayudar al usuario a elegir **dónde** registrar el gasto cuando el contexto no especifica un grupo único.

No reutiliza el selector del Hero. Sus objetivos son distintos:
- Hero → filtrar visualización
- DestinationSelector → elegir destino de creación

### Props

```ts
interface DestinationSelectorProps {
  visible: boolean;
  onClose: () => void;
  filter: FilterState;            // el FilterState completo
  personalGroups: GroupResponse[];
  coupleGroups: GroupResponse[];
  sharedGroups: GroupResponse[];
  onSelect: (group: GroupResponse) => void;  // grupo completo
}
```

Recibe `filter` en lugar de `context` para escalar a futuros tipos de espacio (`trip`, `company`, `family`). Internamente hace `switch(filter.category)`.

### Header dinámico

| filter.category | Título | Subtítulo |
|---|---|---|
| `all` | Seleccionar destino | Selecciona dónde deseas registrar el gasto. |
| `couple` | Seleccionar pareja | Elige la pareja donde registrarás este gasto. |
| `group` | Seleccionar grupo | Elige el grupo donde registrarás este gasto. |

### Contenido

- `all` → lista completa: Personal + todas las parejas + todos los grupos
- `couple` → solo parejas
- `group` → solo grupos
- `personal` → no aplica (nunca se abre porque hay `groupId`)

### Efímero — no guarda estado

DestinationSelector es **completamente efímero**:
- Abre
- Usuario toca una opción
- Devuelve `onSelect(group)`
- Se cierra
- No recuerda nada

El contexto ya lo recuerda el Hero (FilterState).

### Regla crítica: DestinationSelector nunca modifica FilterState

Cuando el usuario elige "Andrea" en el DestinationSelector, el Hero **no cambia**. Sigue mostrando el contexto anterior (ej: "Parejas → Todas las parejas"). El destino solo aplica para ese gasto, no cambia el contexto de navegación.

Esto mantiene separados los conceptos de **navegación** (Hero) y **acción** (FAB), que es el objetivo central del rediseño.

### Flujo

```
DestinationSelector
  → usuario selecciona grupo
  → onSelect(group)
  → screen cierra DestinationSelector
  → screen abre CreateExpenseSheet con group
```

---

## 6. CreateExpenseSheet — Detección automática de modo personal

### Props actualizadas

```ts
interface CreateExpenseSheetProps {
  visible: boolean;
  onClose: () => void;
  group: GroupResponse;         // ahora recibe el grupo completo
  members: Member[];
  onCreateExpense?: (payload: { ... }) => void;
}
```

### Modo simplificado (personal)

El componente **detecta automáticamente** si está en modo personal:

```ts
const isPersonal = group.type === 'PERSONAL'
  || group.members.length === 1;
```

Sin prop `simplified`. Sin booleano externo.

Cuando `isPersonal` es `true`:
- Oculta: "Pagado por", "Participantes", "Tipo de división"
- `paidById` se setea automáticamente al único miembro
- Muestra solo: Valor, Descripción, Categoría, Fecha, Comprobante

---

## 7. Árbol de archivos (cambios)

### Modificar
- `src/app/(protected)/gastos/index.tsx` — FilterState, nuevo GroupSelector wiring, nueva lógica FAB, DestinationSelector
- `src/components/ui/group-selector.tsx` — Rediseño completo (jerárquico, value/onChange, grupos reales)
- `src/components/dashboard/FloatingAddButton.tsx` — Simplificar (solo onPress, sin icon por defecto de gastos)
- `src/components/movements/create-expense-sheet.tsx` — Detección automática modo personal, recibir `group` completo

### Crear
- `src/components/movements/destination-selector.tsx` — Nuevo BottomSheet selector de destino

---

## 8. Reglas de diseño

1. **FilterState es la única fuente de verdad** — no crear estados duplicados (`selectedGroup`, `selectedCategory`, `activeFilter`)
2. **Cada componente tiene una responsabilidad** — el Hero filtra, el FAB crea
3. **Componentes tontos** — FAB no contiene lógica de negocio
4. **Auto-detección** — CreateExpenseSheet detecta modo personal, no recibe flags
5. **Grupos completos en interfaces** — pasar `GroupResponse` completo, no campos sueltos
6. **FilterState completo como prop** — DestinationSelector recibe todo el filter para escalar a nuevos tipos
7. **GroupSelector es controlado** — solo mantiene `currentView` como estado UI, nunca `selectedGroup`/`selectedCategory`
8. **DestinationSelector es efímero** — no guarda estado, no modifica FilterState, solo devuelve el destino elegido
