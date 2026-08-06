import { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Input } from '@/components/ui/input';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { BottomSheetHeader } from '@/components/ui/bottom-sheet-header';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/constants/categories';
import { formatAmountInput, parseAmount } from '@/utils/format';
import type {
  ExpenseCategory,
  ExpenseResponse,
  GroupResponse,
  SplitType,
} from '@/types/api';

interface Member {
  id: string;
  name: string;
}

interface CreateExpenseSheetProps {
  visible: boolean;
  onClose: () => void;
  group: GroupResponse;
  members: Member[];
  currentUserId?: string;
  onCreateExpense?: (payload: {
    description: string;
    amount: number;
    category: ExpenseCategory;
    splitType: SplitType;
    groupId: string;
    splits?: { userId: string; percentage: number }[];
  }) => void;
  initialExpense?: ExpenseResponse | null;
  onUpdateExpense?: (payload: {
    description: string;
    amount: number;
    category: ExpenseCategory;
    splitType: SplitType;
    groupId: string;
    splits?: { userId: string; percentage: number }[];
  }) => void;
  heightRatio?: number;
  headerFinalTranslateY?: number;
}

function getTodayDate(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function CreateExpenseSheet({
  visible,
  onClose,
  group,
  members,
  currentUserId,
  onCreateExpense,
  initialExpense,
  onUpdateExpense,
  heightRatio = 0.75,
  headerFinalTranslateY,
}: CreateExpenseSheetProps) {
  const isPersonal = group.type === 'PERSONAL' || members.length === 1;
  const isCouple = group.type === 'COUPLE' || members.length === 2;
  const isEditing = !!initialExpense;

  // El "tú" de la división es el usuario logueado, no necesariamente members[0]
  const youMember = members.find((m) => m.id === currentUserId) ?? members[0];
  const youMemberId = youMember?.id;

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('FOOD');
  const [date, setDate] = useState(getTodayDate());
  const [paidBy, setPaidBy] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    [],
  );
  const [splitType, setSplitType] = useState<'EQUAL' | 'PERCENTAGE'>('EQUAL');
  const [yourPercentage, setYourPercentage] = useState(50);

  const resetKey = useMemo(() => (visible ? Date.now() : 0), [visible]);

  const getDefaultSplitType = (raw?: SplitType): 'EQUAL' | 'PERCENTAGE' =>
    raw === 'PERCENTAGE' ? 'PERCENTAGE' : 'EQUAL';

  useEffect(() => {
    if (visible && members.length > 0) {
      const payer = isPersonal
        ? youMemberId
        : initialExpense?.paidById &&
            members.some((m) => m.id === initialExpense.paidById)
          ? initialExpense.paidById
          : youMemberId;

      const participantIds =
        initialExpense && initialExpense.splits?.length
          ? initialExpense.splits.map((s) => s.userId)
          : members.map((m) => m.id);

      const defaultSplitType = getDefaultSplitType(initialExpense?.splitType);

      const initialYourPercentage =
        initialExpense && initialExpense.splits?.length
          ? Number(
              initialExpense.splits.find(
                (s) => s.userId === youMemberId,
              )?.percentage ?? 50,
            )
          : 50;

      // En parejas, el % por defecto es el configurado al crear la pareja
      // (splitPercentage del miembro actual, o el inverso del de la pareja si
      // el actual no lo tiene), o 50/50 si no existe.
      const myMember =
        group.members.find((m) => m.user.id === youMemberId) ?? null;
      const partnerMember =
        group.members.find((m) => m.user.id !== youMemberId) ?? null;
      // splitPercentage llega como string desde la API (Prisma Decimal):
      // convertir siempre a número antes de usarlo en el payload.
      const groupDefaultPercentage =
        isCouple && !isPersonal
          ? myMember?.splitPercentage != null
            ? Number(myMember.splitPercentage)
            : partnerMember?.splitPercentage != null
              ? 100 - Number(partnerMember.splitPercentage)
              : null
          : null;

      const defaultYourPercentage =
        groupDefaultPercentage != null ? groupDefaultPercentage : 50;
      const defaultSplit =
        groupDefaultPercentage != null && groupDefaultPercentage !== 50
          ? 'PERCENTAGE'
          : 'EQUAL';
      // En grupos de 3+ solo existe división EQUAL: forzar al editar para no
      // corromper splits de gastos PERCENTAGE heredados de la UI vieja.
      const resolvedSplitType: 'EQUAL' | 'PERCENTAGE' = isEditing
        ? isCouple
          ? defaultSplitType
          : 'EQUAL'
        : defaultSplit;

      setPaidBy(payer);
      setSelectedParticipants(participantIds);
      setAmount(
        initialExpense ? formatAmountInput(String(initialExpense.amount)) : '',
      );
      setDescription(initialExpense?.description ?? '');
      setCategory(initialExpense?.category ?? 'FOOD');
      setDate(getTodayDate());
      setSplitType(resolvedSplitType);
      setYourPercentage(
        isEditing ? initialYourPercentage : defaultYourPercentage,
      );
    }
  }, [resetKey, members]);

  const toggleParticipant = (id: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const isFormValid =
    amount.trim().length > 0 &&
    parseAmount(amount) > 0 &&
    description.trim().length >= 3 &&
    category.length > 0 &&
    date.trim().length > 0 &&
    paidBy.length > 0 &&
    selectedParticipants.length > 0;

  const header = (
    <BottomSheetHeader
      visible={visible}
      title={isEditing ? 'Editar gasto' : 'Nuevo gasto'}
      subtitle={
        isEditing
          ? `Actualiza el gasto en ${group.name}`
          : `Registra un gasto compartido en ${group.name}`
      }
      onClose={onClose}
      gradientPaddingBottom={600}
      logo={require('@/assets/images/logo-white-green-bg-without.png')}
    />
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      header={header}
      heightRatio={heightRatio}
      headerFinalTranslateY={headerFinalTranslateY}
    >
      <View className="flex-1">
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-4"
        >
          <Input
            label="Valor"
            iconLeft="dollar-sign"
            placeholder="$ 0"
            value={amount}
            onChangeText={(t) => setAmount(formatAmountInput(t))}
            keyboardType="number-pad"
          />

          <Input
            label="Descripción"
            iconLeft="note-sticky"
            placeholder="Ej: Mercado, Cena, Gasolina..."
            value={description}
            onChangeText={setDescription}
          />

          {/* Category */}
          <Text className="mb-2 mt-5 text-sm font-semibold text-[#0F172A]">
            🏷️ Categoría
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-5 px-5"
          >
            <View className="flex-row gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = category === cat.value;
                return (
                  <Pressable
                    key={cat.value}
                    onPress={() => setCategory(cat.value)}
                    className={`rounded-full px-4 py-2.5 ${
                      isActive
                        ? 'bg-[#10B981]'
                        : 'border border-[#E2E8F0] bg-white'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        isActive ? 'text-white' : 'text-[#64748B]'
                      }`}
                    >
                      {cat.emoji} {cat.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <Input
            label="Fecha"
            iconLeft="calendar"
            placeholder="dd/mm/aaaa"
            value={date}
            onChangeText={setDate}
          />

          {/* Paid by */}
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

          {/* Participants — solo para grupos de 3+; en parejas siempre participan ambos */}
          {!isPersonal && !isCouple && (
            <>
              <Text className="mb-2 mt-5 text-sm font-semibold text-[#0F172A]">
                👥 Participantes
              </Text>
              <View className="gap-2">
                {members.map((member) => {
                  const isSelected = selectedParticipants.includes(member.id);
                  return (
                    <Pressable
                      key={member.id}
                      onPress={() => toggleParticipant(member.id)}
                      className={`flex-row items-center justify-between rounded-xl border px-4 py-3 ${
                        isSelected
                          ? 'border-[#10B981] bg-[#F0FDF4]'
                          : 'border-[#E2E8F0] bg-white'
                      }`}
                    >
                      <View className="flex-row items-center gap-3">
                        <View
                          className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                            isSelected
                              ? 'border-[#10B981] bg-[#10B981]'
                              : 'border-[#94A3B8]'
                          }`}
                        >
                          {isSelected && (
                            <FontAwesome6
                              name="check"
                              size={10}
                              color="white"
                            />
                          )}
                        </View>
                        <Text className="text-sm font-medium text-[#0F172A]">
                          {member.name}
                        </Text>
                      </View>
                      {isSelected && (
                        <Text className="text-xs text-[#64748B]">
                          {splitType === 'EQUAL'
                            ? `${Math.round(100 / selectedParticipants.length)}%`
                            : `${member.id === youMemberId ? yourPercentage : 100 - yourPercentage}%`}
                        </Text>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          {/* Split Type — porcentaje solo en parejas; grupos de 3+ solo igual */}
          {!isPersonal && (
            <>
              <Text className="mb-2 mt-5 text-sm font-semibold text-[#0F172A]">
                🔄 Tipo de división
              </Text>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => setSplitType('EQUAL')}
                  className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl border py-3 ${
                    splitType === 'EQUAL'
                      ? 'border-[#10B981] bg-[#F0FDF4]'
                      : 'border-[#E2E8F0] bg-white'
                  }`}
                >
                  <FontAwesome6
                    name="scale-balanced"
                    size={14}
                    color={splitType === 'EQUAL' ? '#10B981' : '#64748B'}
                  />
                  <Text
                    className={`text-sm font-medium ${
                      splitType === 'EQUAL'
                        ? 'text-[#10B981]'
                        : 'text-[#64748B]'
                    }`}
                  >
                    Igual
                  </Text>
                </Pressable>
                {isCouple && (
                  <Pressable
                    onPress={() => setSplitType('PERCENTAGE')}
                    className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl border py-3 ${
                      splitType === 'PERCENTAGE'
                        ? 'border-[#10B981] bg-[#F0FDF4]'
                        : 'border-[#E2E8F0] bg-white'
                    }`}
                  >
                    <FontAwesome6
                      name="percent"
                      size={14}
                      color={splitType === 'PERCENTAGE' ? '#10B981' : '#64748B'}
                    />
                    <Text
                      className={`text-sm font-medium ${
                        splitType === 'PERCENTAGE'
                          ? 'text-[#10B981]'
                          : 'text-[#64748B]'
                      }`}
                    >
                      Porcentaje
                    </Text>
                  </Pressable>
                )}
              </View>
            </>
          )}

          {/* Percentage controls — solo en parejas */}
          {isCouple && splitType === 'PERCENTAGE' && (
            <View className="mt-4 rounded-xl border border-[#E2E8F0] bg-white p-4">
              <Text className="mb-3 text-center text-sm font-medium text-[#0F172A]">
                Tu porcentaje
              </Text>
              <View className="flex-row items-center justify-center gap-4">
                <Pressable
                  onPress={() =>
                    setYourPercentage(Math.max(10, yourPercentage - 5))
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10B981]"
                >
                  <Text className="text-lg font-bold text-white">−</Text>
                </Pressable>
                <Text className="text-2xl font-extrabold text-[#10B981]">
                  {yourPercentage}%
                </Text>
                <Pressable
                  onPress={() =>
                    setYourPercentage(Math.min(90, yourPercentage + 5))
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10B981]"
                >
                  <Text className="text-lg font-bold text-white">+</Text>
                </Pressable>
              </View>
              <Text className="mt-2 text-center text-xs text-[#64748B]">
                Tu pareja recibirá el {100 - yourPercentage}%
              </Text>
            </View>
          )}

          {/* Receipt (placeholder) */}
          <Text className="mb-2 mt-5 text-sm font-semibold text-[#0F172A]">
            🖼️ Comprobante (opcional)
          </Text>
          <Pressable className="flex-row items-center justify-center gap-2 rounded-xl border border-dashed border-[#94A3B8] bg-white py-8 active:opacity-80">
            <FontAwesome6 name="camera" size={20} color="#94A3B8" />
            <Text className="text-sm text-[#64748B]">Agregar foto</Text>
          </Pressable>
        </ScrollView>

        <View className="border-t border-[#E2E8F0] px-5 pb-2 pt-4">
          <Button
            text={isEditing ? 'Guardar cambios' : 'Registrar gasto'}
            iconRight="check"
            onPress={() => {
              const splits = members
                .filter((m) => selectedParticipants.includes(m.id))
                .map((m) => ({
                  userId: m.id,
                  percentage: Number(
                    splitType === 'EQUAL'
                      ? Math.round(100 / selectedParticipants.length)
                      : m.id === youMemberId
                        ? yourPercentage
                        : 100 - yourPercentage,
                  ),
                }));

              const payload = {
                description,
                amount: parseAmount(amount),
                category: category as ExpenseCategory,
                splitType: splitType as SplitType,
                groupId: group.id,
                splits,
              };

              if (isEditing) {
                onUpdateExpense?.(payload);
              } else {
                onCreateExpense?.(payload);
              }
            }}
            disabled={!isFormValid}
            className="rounded-full py-4"
          />
        </View>
      </View>
    </BottomSheet>
  );
}
