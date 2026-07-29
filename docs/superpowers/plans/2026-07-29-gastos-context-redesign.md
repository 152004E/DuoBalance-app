# Gastos Context Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Gastos screen to separate filtering (HeroSection/GroupSelector) from expense creation (FloatingAddButton) using a shared `FilterState` as the single source of truth.

**Architecture:** A controlled `FilterState` (`{ category, groupId }`) lives in `gastos/index.tsx` and drives all filtering, statistics, and the FAB behavior. GroupSelector is a controlled component (`value`/`onChange`) with hierarchical navigation. FAB is a dumb button; the screen decides what to open. If context already identifies a group, `CreateExpenseSheet` opens directly; otherwise a `DestinationSelector` BottomSheet lets the user pick the destination.

**Tech Stack:** React Native + Expo Router, TypeScript, NativeWind/Tailwind, Reanimated.

## Global Constraints

- FilterState is the **sole source of truth** — no duplicated state (`selectedGroup`, `selectedCategory`, etc.)
- GroupSelector is **controlled** — only owns `currentView` UI state, never `selectedGroup`
- DestinationSelector is **ephemeral** — never modifies FilterState, never remembers selection
- CreateExpenseSheet auto-detects personal mode via `group.type === 'PERSONAL'` — no `simplified` prop
- All components pass entire `GroupResponse` objects — never individual fields like `groupId`, `groupName`
- Verify all changes with `pnpm tsc --noEmit`

---

## File Structure

### Modified
| File | Responsibility |
|------|---------------|
| `src/types/filter.ts` | Shared `FilterCategory` and `FilterState` types |
| `src/components/dashboard/FloatingAddButton.tsx` | Dumb button — only `onPress`, no internal logic |
| `src/components/movements/create-expense-sheet.tsx` | Accept `group` prop, auto-detect personal mode, simplify form when personal |
| `src/components/ui/group-selector.tsx` | Hierarchical selector (main/couples/groups views), controlled via `value`/`onChange`, receives real groups data |
| `src/app/(protected)/gastos/index.tsx` | Wire FilterState, GroupSelector, FAB logic, DestinationSelector, filtered rendering |

### Created
| File | Responsibility |
|------|---------------|
| `src/components/movements/destination-selector.tsx` | BottomSheet to pick a destination group when context has no specific groupId |

---

### Task 1: Create shared FilterState types

**Files:**
- Create: `src/types/filter.ts`

**Interfaces:**
- Produces: `FilterCategory`, `FilterState` (used by all subsequent tasks)

- [ ] **Step 1: Create `src/types/filter.ts`**

```ts
export type FilterCategory = 'all' | 'personal' | 'couple' | 'group';

export interface FilterState {
  category: FilterCategory;
  groupId: string | null;
}
```

- [ ] **Step 2: Verify with TypeScript**

Run: `pnpm tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/types/filter.ts
git commit -m "feat: add shared FilterState types"
```

---

### Task 2: Simplify FloatingAddButton

**Files:**
- Modify: `src/components/dashboard/FloatingAddButton.tsx`

**Interfaces:**
- Consumes: none (no changes to interface semantics)
- Produces: `<FloatingAddButton onPress={handler} />` — same interface but cleaner

- [ ] **Step 1: Read current file**

Read `src/components/dashboard/FloatingAddButton.tsx` to see current implementation.

- [ ] **Step 2: Rewrite `FloatingAddButton.tsx`**

Remove `icon` and `size` props. Keep it as a simple circle button with `+` icon:

```tsx
import { TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface FloatingAddButtonProps {
  onPress?: () => void;
}

export function FloatingAddButton({ onPress }: FloatingAddButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute bottom-6 right-6 z-50 h-12 w-12 items-center justify-center rounded-full bg-[#10B981] shadow-lg"
    >
      <FontAwesome6 name="plus" size={24} color="white" />
    </TouchableOpacity>
  );
}
```

- [ ] **Step 3: Verify with TypeScript**

Run: `pnpm tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add src/components/dashboard/FloatingAddButton.tsx
git commit -m "feat: simplify FloatingAddButton to dumb icon-only button"
```

---

### Task 3: Update CreateExpenseSheet — accept group, auto-detect personal mode

**Files:**
- Modify: `src/components/movements/create-expense-sheet.tsx`

**Interfaces:**
- Consumes: `GroupResponse` type (from `src/types/api.ts`)
- Produces: `<CreateExpenseSheet group={GroupResponse} members={Member[]} ... />`

- [ ] **Step 1: Read current file**

Read `src/components/movements/create-expense-sheet.tsx` to understand current structure.

- [ ] **Step 2: Update props interface**

Replace separate `groupId: string` and `groupName: string` with a single `group: GroupResponse`:

```ts
import type { GroupResponse } from '@/types/api';

interface CreateExpenseSheetProps {
  visible: boolean;
  onClose: () => void;
  group: GroupResponse;
  members: Member[];
  onCreateExpense?: (payload: {
    description: string;
    amount: number;
    category: string;
    splitType: 'EQUAL' | 'PERCENTAGE';
    groupId: string;
    paidById: string;
    splits?: { userId: string; percentage: number }[];
  }) => void;
}
```

- [ ] **Step 3: Add auto-detection for personal mode**

At the top of the component function, after the hooks:

```ts
const isPersonal = group.type === 'PERSONAL' || members.length === 1;
```

- [ ] **Step 4: Conditionally render sections**

Replace the "Pagado por" section with:

```tsx
{!isPersonal && (
  <>
    <Text className="mb-2 mt-5 text-sm font-semibold text-[#0F172A]">
      👤 Pagado por
    </Text>
    <View className="flex-row flex-wrap gap-2">
      {members.map((member) => {
        const isActive = paidBy === member.id;
        return (
          <Pressable
            key={member.id}
            onPress={() => setPaidBy(member.id)}
            className={`flex-row items-center gap-2 rounded-full px-4 py-2.5 ${
              isActive
                ? 'bg-[#10B981]'
                : 'border border-[#E2E8F0] bg-white'
            }`}
          >
            <FontAwesome6
              name="user"
              size={12}
              color={isActive ? 'white' : '#64748B'}
            />
            <Text
              className={`text-sm font-medium ${
                isActive ? 'text-white' : 'text-[#0F172A]'
              }`}
            >
              {member.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  </>
)}
```

Replace the "Participantes" section with:

```tsx
{!isPersonal && (
  <>
    <Text className="mb-2 mt-5 text-sm font-semibold text-[#0F172A]">
      👥 Participantes
    </Text>
    <View className="gap-2">
      {/* ... same participant rendering ... */}
    </View>
  </>
)}
```

Replace the "Tipo de división" section with:

```tsx
{!isPersonal && (
  <>
    <Text className="mb-2 mt-5 text-sm font-semibold text-[#0F172A]">
      🔄 Tipo de división
    </Text>
    <View className="flex-row gap-2">
      {/* ... same split type rendering ... */}
    </View>
  </>
)}
```

Also replace the percentage controls wrapper:

```tsx
{!isPersonal && splitType === 'PERCENTAGE' && selectedParticipants.length >= 2 && (
  {/* ... same percentage controls ... */}
)}
```

- [ ] **Step 5: Set default paidBy for personal mode**

In the `useEffect` that initializes state, add:

```ts
useEffect(() => {
  if (visible && members.length > 0) {
    setPaidBy(members[0].id);
    setSelectedParticipants(members.map((m) => m.id));
    setAmount('');
    setDescription('');
    setCategory('ALIMENTACIÓN');
    setDate(getTodayDate());
    setSplitType('EQUAL');
    setYourPercentage(50);
  }
}, [visible, members]);
```

Already sets `paidBy` to first member — that's correct for personal mode.

- [ ] **Step 6: Update subtitle to use group.name**

```tsx
const header = (
  <BottomSheetHeader
    visible={visible}
    title="Nuevo gasto"
    subtitle={`Registra un gasto compartido en ${group.name}`}
    onClose={onClose}
    gradientPaddingBottom={600}
  />
);
```

- [ ] **Step 7: Update form submit to use group.id**

In the `onPress` handler, replace `groupId` usage:

```tsx
onPress={() => {
  const splits = members
    .filter((m) => selectedParticipants.includes(m.id))
    .map((m) => ({
      userId: m.id,
      percentage:
        splitType === 'EQUAL'
          ? Math.round(100 / selectedParticipants.length)
          : m.id === members[0]?.id
            ? yourPercentage
            : 100 - yourPercentage,
    }));

  onCreateExpense?.({
    description,
    amount: parseFloat(amount),
    category,
    splitType,
    groupId: group.id,
    paidById: paidBy,
    splits,
  });
}}
```

- [ ] **Step 8: Remove unused import**

No longer need to import `useState`, `useEffect`, `FontAwesome6`, `View`, `Text`, `ScrollView`, `Pressable` — keep all since they're still used.

- [ ] **Step 9: Verify with TypeScript**

Run: `pnpm tsc --noEmit`

- [ ] **Step 10: Commit**

```bash
git add src/components/movements/create-expense-sheet.tsx
git commit -m "feat: update CreateExpenseSheet to accept group object and auto-detect personal mode"
```

---

### Task 4: Create DestinationSelector BottomSheet

**Files:**
- Create: `src/components/movements/destination-selector.tsx`

**Interfaces:**
- Consumes: `FilterState` (from `src/types/filter.ts`), `GroupResponse` (from `src/types/api.ts`)
- Produces: `<DestinationSelector filter={FilterState} ... onSelect={(group) => void} />`

- [ ] **Step 1: Create `src/components/movements/destination-selector.tsx`**

```tsx
import { useState, useRef, useCallback } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { BottomSheetHeader } from '@/components/ui/bottom-sheet-header';
import type { GroupResponse } from '@/types/api';
import type { FilterState } from '@/types/filter';

interface DestinationSelectorProps {
  visible: boolean;
  onClose: () => void;
  filter: FilterState;
  personalGroups: GroupResponse[];
  coupleGroups: GroupResponse[];
  sharedGroups: GroupResponse[];
  onSelect: (group: GroupResponse) => void;
}

interface DestItem {
  group: GroupResponse;
  icon: string;
  iconColor: string;
  label: string;
}

function useItemAnimations(count: number) {
  const anims = useRef(
    Array.from({ length: count }, () => ({
      opacity: { value: 0 },
      translateX: { value: 30 },
    })),
  ).current;
  return anims;
}

const TYPE_CONFIG: Record<string, { icon: string; color: string }> = {
  PERSONAL: { icon: 'user', color: '#0F766E' },
  COUPLE: { icon: 'heart', color: '#EC4899' },
  GROUP: { icon: 'users', color: '#8B5CF6' },
};

export function DestinationSelector({
  visible,
  onClose,
  filter,
  personalGroups,
  coupleGroups,
  sharedGroups,
  onSelect,
}: DestinationSelectorProps) {
  const getHeaderConfig = () => {
    switch (filter.category) {
      case 'couple':
        return {
          title: 'Seleccionar pareja',
          subtitle: 'Elige la pareja donde registrarás este gasto.',
        };
      case 'group':
        return {
          title: 'Seleccionar grupo',
          subtitle: 'Elige el grupo donde registrarás este gasto.',
        };
      default:
        return {
          title: 'Seleccionar destino',
          subtitle: 'Selecciona dónde deseas registrar el gasto.',
        };
    }
  };

  const buildItems = (): DestItem[] => {
    switch (filter.category) {
      case 'couple':
        return coupleGroups.map((g) => ({
          group: g,
          ...TYPE_CONFIG.COUPLE,
          label: g.name,
        }));
      case 'group':
        return sharedGroups.map((g) => ({
          group: g,
          ...TYPE_CONFIG.GROUP,
          label: g.name,
        }));
      default:
        return [
          ...personalGroups.map((g) => ({
            group: g,
            ...TYPE_CONFIG.PERSONAL,
            label: g.name,
          })),
          ...coupleGroups.map((g) => ({
            group: g,
            ...TYPE_CONFIG.COUPLE,
            label: g.name,
          })),
          ...sharedGroups.map((g) => ({
            group: g,
            ...TYPE_CONFIG.GROUP,
            label: g.name,
          })),
        ];
    }
  };

  const items = buildItems();
  const config = getHeaderConfig();

  const header = (
    <BottomSheetHeader
      visible={visible}
      title={config.title}
      subtitle={config.subtitle}
      onClose={onClose}
      gradientPaddingBottom={500}
    />
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      header={header}
      heightRatio={0.5}
    >
      <View className="flex-1 px-5 pt-2">
        <FlatList
          data={items}
          keyExtractor={(item) => item.group.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                onSelect(item.group);
              }}
              className="flex-row items-center gap-4 rounded-2xl px-1 py-4 active:bg-[#F8FAFC]"
            >
              <View
                className="h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: `${item.iconColor}26` }}
              >
                <FontAwesome6
                  name={item.icon as any}
                  size={18}
                  color={item.iconColor}
                />
              </View>
              <Text className="text-base font-semibold text-[#0F172A]">
                {item.label}
              </Text>
            </Pressable>
          )}
        />
      </View>
    </BottomSheet>
  );
}
```

- [ ] **Step 2: Verify with TypeScript**

Run: `pnpm tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/components/movements/destination-selector.tsx
git commit -m "feat: create DestinationSelector BottomSheet component"
```

---

### Task 5: Redesign GroupSelector — hierarchical, controlled

**Files:**
- Modify: `src/components/ui/group-selector.tsx` (full rewrite)

**Interfaces:**
- Consumes: `FilterState`, `FilterCategory` (from `src/types/filter.ts`), `GroupResponse` (from `src/types/api.ts`)
- Produces: `<GroupSelector value={FilterState} onChange={handler} personalGroups={[]} coupleGroups={[]} sharedGroups={[]} variant="dark" />`

- [ ] **Step 1: Read current file**

Read `src/components/ui/group-selector.tsx` to understand current structure.

- [ ] **Step 2: Rewrite `group-selector.tsx`**

```tsx
import { useState, useMemo } from 'react';
import { View, Text, Pressable, Modal, FlatList } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import type { GroupResponse } from '@/types/api';
import type { FilterState, FilterCategory } from '@/types/filter';

type ViewLevel = 'main' | 'couples' | 'groups';

interface GroupSelectorProps {
  value: FilterState;
  onChange: (filter: FilterState) => void;
  personalGroups: GroupResponse[];
  coupleGroups: GroupResponse[];
  sharedGroups: GroupResponse[];
  variant?: 'light' | 'dark';
}

const TYPE_ICONS: Record<string, { icon: string; color: string }> = {
  personal: { icon: 'user', color: '#0F766E' },
  couple: { icon: 'heart', color: '#EC4899' },
  group: { icon: 'users', color: '#8B5CF6' },
};

function getButtonLabel(value: FilterState, personalGroups: GroupResponse[], coupleGroups: GroupResponse[], sharedGroups: GroupResponse[]): string {
  if (value.category === 'all') return 'Todos';
  if (value.category === 'personal') return 'Personal';
  if (value.category === 'couple') {
    if (value.groupId) {
      const g = coupleGroups.find(g => g.id === value.groupId);
      return g ? g.name : 'Parejas';
    }
    return 'Parejas';
  }
  if (value.category === 'group') {
    if (value.groupId) {
      const g = sharedGroups.find(g => g.id === value.groupId);
      return g ? g.name : 'Grupos';
    }
    return 'Grupos';
  }
  return 'Todos';
}

export function GroupSelector({
  value,
  onChange,
  personalGroups,
  coupleGroups,
  sharedGroups,
  variant = 'light',
}: GroupSelectorProps) {
  const [open, setOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewLevel>('main');

  const label = getButtonLabel(value, personalGroups, coupleGroups, sharedGroups);

  const selectedTypeIcon = useMemo(() => {
    if (value.category === 'personal') return TYPE_ICONS.personal;
    if (value.category === 'couple') return TYPE_ICONS.couple;
    if (value.category === 'group') return TYPE_ICONS.group;
    return { icon: 'layer-group', color: '#0F766E' };
  }, [value.category]);

  const needsCoupleSubmenu = coupleGroups.length > 1;
  const needsGroupSubmenu = sharedGroups.length > 1;

  const handleOpen = () => {
    setCurrentView('main');
    setOpen(true);
  };

  const renderMainView = () => (
    <FlatList
      data={[
        { id: 'all', name: 'Todos', type: 'all' as const, icon: 'layer-group', color: '#64748B' },
        { id: 'personal', name: 'Personal', type: 'personal' as const, icon: 'user', color: '#0F766E' },
        ...(needsCoupleSubmenu
          ? [{ id: '__couples__', name: 'Parejas', type: 'couple' as const, icon: 'chevron-right', color: '#EC4899', isSubmenu: true as const }]
          : coupleGroups.map(g => ({ id: g.id, name: g.name, type: 'couple' as const, icon: 'heart', color: '#EC4899', isSubmenu: false as const }))
        ),
        ...(needsGroupSubmenu
          ? [{ id: '__groups__', name: 'Grupos', type: 'group' as const, icon: 'chevron-right', color: '#8B5CF6', isSubmenu: true as const }]
          : sharedGroups.map(g => ({ id: g.id, name: g.name, type: 'group' as const, icon: 'users', color: '#8B5CF6', isSubmenu: false as const }))
        ),
      ]}
      keyExtractor={item => item.id}
      renderItem={({ item }) => {
        const isSelected = item.type === value.category && (
          item.id === value.groupId || (item.id === value.category && !value.groupId)
        );
        const isSelectedMain = value.category === 'all' && item.id === 'all';

        if ('isSubmenu' in item && item.isSubmenu) {
          return (
            <Pressable
              onPress={() => {
                if (item.id === '__couples__') setCurrentView('couples');
                if (item.id === '__groups__') setCurrentView('groups');
              }}
              className="flex-row items-center gap-3 px-4 py-3.5 active:bg-[#F8FAFC]"
            >
              <Text className="flex-1 text-base font-medium text-[#0F172A]">{item.name}</Text>
              <FontAwesome6 name="chevron-right" size={14} color="#CBD5E1" />
            </Pressable>
          );
        }

        return (
          <Pressable
            onPress={() => {
              if (item.id === 'all') onChange({ category: 'all', groupId: null });
              else if (item.id === 'personal') {
                const pg = personalGroups[0];
                onChange({ category: 'personal', groupId: pg?.id ?? null });
              } else {
                onChange({ category: item.type as FilterCategory, groupId: item.id });
              }
              setOpen(false);
            }}
            className={`flex-row items-center gap-3 px-4 py-3.5 active:bg-[#F8FAFC] ${
              isSelected || isSelectedMain ? 'bg-[#10B981]/10 border-l-4 border-[#10B981]' : ''
            }`}
          >
            <FontAwesome6 name={item.icon as any} size={16} color={isSelected || isSelectedMain ? '#10B981' : item.color} solid />
            <Text className={`text-base ${isSelected || isSelectedMain ? 'font-bold text-[#10B981]' : 'font-medium text-[#0F172A]'}`}>
              {item.name}
            </Text>
          </Pressable>
        );
      }}
    />
  );

  const renderCouplesView = () => (
    <FlatList
      data={[
        { id: '__back__', name: 'Parejas', isBack: true },
        { id: '__all_couples__', name: 'Todas las parejas', groupId: null as string | null },
        ...coupleGroups.map(g => ({ id: g.id, name: g.name, groupId: g.id })),
      ]}
      keyExtractor={item => item.id}
      renderItem={({ item }) => {
        if ('isBack' in item && item.isBack) {
          return (
            <Pressable
              onPress={() => setCurrentView('main')}
              className="flex-row items-center gap-3 px-4 py-3.5 active:bg-[#F8FAFC]"
            >
              <FontAwesome6 name="arrow-left" size={16} color="#0F172A" />
              <Text className="text-base font-semibold text-[#0F172A]">{item.name}</Text>
            </Pressable>
          );
        }

        const isSelected = value.category === 'couple' && value.groupId === item.groupId;

        return (
          <Pressable
            onPress={() => {
              onChange({ category: 'couple', groupId: item.groupId as string | null });
              setOpen(false);
            }}
            className={`flex-row items-center gap-3 px-4 py-3.5 active:bg-[#F8FAFC] ${
              isSelected ? 'bg-[#10B981]/10 border-l-4 border-[#10B981]' : ''
            }`}
          >
            <FontAwesome6 name="heart" size={16} color={isSelected ? '#10B981' : '#EC4899'} solid />
            <Text className={`text-base ${isSelected ? 'font-bold text-[#10B981]' : 'font-medium text-[#0F172A]'}`}>
              {item.name}
            </Text>
          </Pressable>
        );
      }}
    />
  );

  const renderGroupsView = () => (
    <FlatList
      data={[
        { id: '__back__', name: 'Grupos', isBack: true },
        { id: '__all_groups__', name: 'Todos los grupos', groupId: null as string | null },
        ...sharedGroups.map(g => ({ id: g.id, name: g.name, groupId: g.id })),
      ]}
      keyExtractor={item => item.id}
      renderItem={({ item }) => {
        if ('isBack' in item && item.isBack) {
          return (
            <Pressable
              onPress={() => setCurrentView('main')}
              className="flex-row items-center gap-3 px-4 py-3.5 active:bg-[#F8FAFC]"
            >
              <FontAwesome6 name="arrow-left" size={16} color="#0F172A" />
              <Text className="text-base font-semibold text-[#0F172A]">{item.name}</Text>
            </Pressable>
          );
        }

        const isSelected = value.category === 'group' && value.groupId === item.groupId;

        return (
          <Pressable
            onPress={() => {
              onChange({ category: 'group', groupId: item.groupId as string | null });
              setOpen(false);
            }}
            className={`flex-row items-center gap-3 px-4 py-3.5 active:bg-[#F8FAFC] ${
              isSelected ? 'bg-[#10B981]/10 border-l-4 border-[#10B981]' : ''
            }`}
          >
            <FontAwesome6 name="users" size={16} color={isSelected ? '#10B981' : '#8B5CF6'} solid />
            <Text className={`text-base ${isSelected ? 'font-bold text-[#10B981]' : 'font-medium text-[#0F172A]'}`}>
              {item.name}
            </Text>
          </Pressable>
        );
      }}
    />
  );

  return (
    <View className="relative">
      <Pressable
        onPress={handleOpen}
        className={`flex-row items-center gap-2 rounded-xl border px-4 py-2.5 shadow-sm active:opacity-80 ${
          variant === 'dark'
            ? 'border-white/30 bg-white/10'
            : 'border-[#E2E8F0] bg-white'
        }`}
      >
        <FontAwesome6 name={selectedTypeIcon.icon as any} size={14} color={variant === 'dark' ? 'white' : selectedTypeIcon.color} solid />
        <Text className={`font-semibold ${variant === 'dark' ? 'text-white' : 'text-[#0F172A]'}`}>{label}</Text>
        <FontAwesome6 name="chevron-down" size={12} color={variant === 'dark' ? 'white' : '#64748B'} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 bg-black/30" onPress={() => setOpen(false)}>
          <View className="mx-4 mt-32 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-lg">
            {currentView === 'main' && renderMainView()}
            {currentView === 'couples' && renderCouplesView()}
            {currentView === 'groups' && renderGroupsView()}
            <View className="h-px bg-[#E2E8F0]" />
            <Pressable
              onPress={() => setOpen(false)}
              className="flex-row items-center gap-3 px-4 py-3.5 active:bg-[#F8FAFC]"
            >
              <FontAwesome6 name="plus" size={16} color="#10B981" solid />
              <Text className="text-base font-semibold text-[#10B981]">Crear grupo</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
```

- [ ] **Step 3: Verify with TypeScript**

Run: `pnpm tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/group-selector.tsx
git commit -m "feat: redesign GroupSelector with hierarchical navigation and controlled value/onChange"
```

---

### Task 6: Rewrite GastosScreen — wire FilterState, new components, filtered rendering

**Files:**
- Modify: `src/app/(protected)/gastos/index.tsx`

**Interfaces:**
- Consumes: All previous tasks' components and types
- Depends on: `FilterState` (types/filter.ts), GroupSelector (task 5), CreateExpenseSheet (task 3), DestinationSelector (task 4), FloatingAddButton (task 2)

- [ ] **Step 1: Read current file**

Read `src/app/(protected)/gastos/index.tsx` to understand current structure.

- [ ] **Step 2: Update imports**

Replace the old imports:

```tsx
import { useCallback, useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect, useScrollToTop } from 'expo-router';
import { HeroSection } from '@/components/layout/HeroSection';
import { useAuth } from '@/hooks/use-auth';
import { useGroups } from '@/hooks/use-groups';
import { GroupSelector, type GroupOption } from '@/components/ui/group-selector';
import { GroupSection } from '@/components/ui/group-section';
import { RecentExpensesCard, type RecentExpense } from '@/components/expenses/recent-expenses-card';
import { FloatingAddButton } from '@/components/dashboard/FloatingAddButton';
import { CreateExpenseSheet } from '@/components/movements/create-expense-sheet';
import { DestinationSelector } from '@/components/movements/destination-selector';
import { getExpenses } from '@/services/api/expenses';
import type { ExpenseResponse, GroupResponse } from '@/types/api';
import type { FilterState } from '@/types/filter';
```

- [ ] **Step 3: Remove static FILTER_OPTIONS**

Delete the `FILTER_OPTIONS` constant array and the `CATEGORY_ICONS` mapping (keep it, it's still used by `expenseToRecent`).

- [ ] **Step 4: Add state for FilterState, sheets, and selected group**

```tsx
const [filter, setFilter] = useState<FilterState>({
  category: 'all',
  groupId: null,
});
const [destSelectorVisible, setDestSelectorVisible] = useState(false);
const [creatingExpenseGroup, setCreatingExpenseGroup] = useState<{
  group: GroupResponse;
  members: { id: string; name: string }[];
} | null>(null);
```

- [ ] **Step 5: Add handler functions**

```tsx
const handleCreateExpense = useCallback(() => {
  if (filter.groupId) {
    const group = groups.find(g => g.id === filter.groupId);
    if (!group) {
      // Group no longer exists — reset filter
      setFilter({ category: filter.category, groupId: null });
      setDestSelectorVisible(true);
      return;
    }
    const members = group.members.map(m => ({
      id: m.user.id,
      name: m.user.firstName,
    }));
    setCreatingExpenseGroup({ group, members });
  } else {
    setDestSelectorVisible(true);
  }
}, [filter, groups]);

const handleDestSelect = useCallback((group: GroupResponse) => {
  setDestSelectorVisible(false);
  const members = group.members.map(m => ({
    id: m.user.id,
    name: m.user.firstName,
  }));
  setCreatingExpenseGroup({ group, members });
}, []);

const handleCloseCreateSheet = useCallback(() => {
  setCreatingExpenseGroup(null);
}, []);
```

- [ ] **Step 6: Update the HeroSection to use new GroupSelector**

```tsx
<HeroSection
  key={focusCount}
  variant="page"
  userName={user?.firstName ?? 'Usuario'}
  title="Gastos"
  subtitle="Gastos totales"
  height={220}
  rightAction={
    <GroupSelector
      value={filter}
      onChange={setFilter}
      personalGroups={personalGroups}
      coupleGroups={coupleGroups}
      sharedGroups={sharedGroups}
      variant="dark"
    />
  }
/>
```

- [ ] **Step 7: Update the filtering logic**

Replace the old filter logic:

```tsx
const filteredGroups = useMemo(() => groups.filter((g) => {
  if (filter.category === 'all') return true;
  if (filter.category === 'personal' && g.type === 'PERSONAL') return true;
  if (filter.category === 'couple' && g.type === 'COUPLE') {
    return filter.groupId ? g.id === filter.groupId : true;
  }
  if (filter.category === 'group' && g.type === 'GROUP') {
    return filter.groupId ? g.id === filter.groupId : true;
  }
  return false;
}), [groups, filter]);

const filteredGroupIds = useMemo(
  () => new Set(filteredGroups.map((g) => g.id)),
  [filteredGroups]
);

const filteredExpenses = useMemo(
  () => allExpenses.filter((e) => filteredGroupIds.has(e.groupId)),
  [allExpenses, filteredGroupIds]
);

const totalExpensesAll = useMemo(
  () => filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
  [filteredExpenses]
);

const totalTransactionsAll = filteredExpenses.length;

const recentExpenses = useMemo(
  () => filteredExpenses
    .slice(0, 10)
    .map((e) => expenseToRecent(e, user?.id ?? '')),
  [filteredExpenses, user?.id]
);
```

- [ ] **Step 8: Update the FloatingAddButton usage**

```tsx
<FloatingAddButton onPress={handleCreateExpense} />
```

- [ ] **Step 9: Add DestinationSelector and CreateExpenseSheet**

Before the closing `</SafeAreaView>`:

```tsx
<DestinationSelector
  visible={destSelectorVisible}
  onClose={() => setDestSelectorVisible(false)}
  filter={filter}
  personalGroups={personalGroups}
  coupleGroups={coupleGroups}
  sharedGroups={sharedGroups}
  onSelect={handleDestSelect}
/>

{creatingExpenseGroup && (
  <CreateExpenseSheet
    visible={!!creatingExpenseGroup}
    onClose={handleCloseCreateSheet}
    group={creatingExpenseGroup.group}
    members={creatingExpenseGroup.members}
    onCreateExpense={async (payload) => {
      // TODO: connect to API when expenses service is ready
      console.log('Create expense:', payload);
      handleCloseCreateSheet();
    }}
  />
)}
```

- [ ] **Step 10: Verify with TypeScript**

Run: `pnpm tsc --noEmit`

- [ ] **Step 11: Commit**

```bash
git add src/app/(protected)/gastos/index.tsx
git commit -m "feat: rewrite GastosScreen with FilterState-driven architecture"
```

---

## Self-Review Checklist

- [ ] **Spec coverage:** Every section in the spec (FilterState, GroupSelector, GastosScreen, FloatingAddButton, DestinationSelector, CreateExpenseSheet personal mode) has a corresponding task.
- [ ] **Placeholder scan:** No "TBD", "TODO", or incomplete code blocks.
- [ ] **Type consistency:** `FilterState` and `FilterCategory` defined in Task 1, used consistently across all tasks. `GroupResponse` used everywhere for group data.
- [ ] **Dependency order:** Tasks are ordered so that each only depends on prior tasks.
