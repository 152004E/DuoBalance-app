import { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { FontAwesome6 } from '@expo/vector-icons';
import { Input } from '@/components/ui/input';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { BottomSheetHeader } from '@/components/ui/bottom-sheet-header';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/constants/categories';
import { formatAmountInput, parseAmount } from '@/utils/format';
import { resolveImageUrl } from '@/utils/image-url';
import Toast from 'react-native-toast-message';

const MAX_EXPENSE_AMOUNT = 2000000;
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

export type ReceiptSource = {
  uri: string;
  name?: string;
  type?: string;
};

export interface ExpensePayload {
  description: string;
  amount: number;
  category: ExpenseCategory;
  splitType: SplitType;
  groupId: string;
  splits?: { userId: string; percentage: number }[];
  receipt?: ReceiptSource;
  removeReceipt?: boolean;
}

interface CreateExpenseSheetProps {
  visible: boolean;
  onClose: () => void;
  group: GroupResponse;
  members: Member[];
  currentUserId?: string;
  onCreateExpense?: (payload: ExpensePayload) => Promise<void> | void;
  initialExpense?: ExpenseResponse | null;
  onUpdateExpense?: (payload: ExpensePayload) => Promise<void> | void;
}

function getTodayDate(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

type SheetView = 'MAIN' | 'SELECT_PAYER' | 'SELECT_SPLIT' | 'SELECT_PARTICIPANTS';

export function CreateExpenseSheet({
  visible,
  onClose,
  group,
  members,
  currentUserId,
  onCreateExpense,
  initialExpense,
  onUpdateExpense,
}: CreateExpenseSheetProps) {
  const isPersonal = group.type === 'PERSONAL' || members.length === 1;
  const isCouple = group.type === 'COUPLE' || members.length === 2;
  const isEditing = !!initialExpense;

  const youMember = members.find((m) => m.id === currentUserId) ?? members[0];
  const youMemberId = youMember?.id;

  const [activeView, setActiveView] = useState<SheetView>('MAIN');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('FOOD');
  const [date, setDate] = useState(getTodayDate());
  const [paidBy, setPaidBy] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [splitType, setSplitType] = useState<'EQUAL' | 'PERCENTAGE'>('EQUAL');
  const [yourPercentage, setYourPercentage] = useState(50);
  const [pickedReceipt, setPickedReceipt] = useState<ReceiptSource | null>(null);
  const [removeExistingReceipt, setRemoveExistingReceipt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
              initialExpense.splits.find((s) => s.userId === youMemberId)
                ?.percentage ?? 50,
            )
          : 50;

      const myMember =
        group.members.find((m) => m.user.id === youMemberId) ?? null;
      const partnerMember =
        group.members.find((m) => m.user.id !== youMemberId) ?? null;

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
      setPickedReceipt(null);
      setRemoveExistingReceipt(false);
      setActiveView('MAIN');
    }
  }, [resetKey, members]);

  const toggleParticipant = (id: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handlePickReceipt = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      exif: false,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setPickedReceipt({
        uri: asset.uri,
        name: asset.fileName ?? asset.uri.split('/').pop() ?? 'receipt.jpg',
        type: asset.mimeType ?? 'image/jpeg',
      });
      setRemoveExistingReceipt(false);
    }
  };

  const handleAmountChange = (t: string) => {
    const formatted = formatAmountInput(t);
    const parsed = parseAmount(formatted);
    if (parsed > MAX_EXPENSE_AMOUNT) {
      Toast.show({
        type: 'error',
        text1: 'Monto máximo: $2.000.000',
        text2: 'Si el valor es mayor, puedes registrarlo en otro gasto.',
        visibilityTime: 4500,
      });
      setAmount(formatAmountInput(String(MAX_EXPENSE_AMOUNT)));
      return;
    }
    setAmount(formatted);
  };

  const parsedAmount = parseAmount(amount);

  const isFormValid =
    amount.trim().length > 0 &&
    parsedAmount > 0 &&
    parsedAmount <= MAX_EXPENSE_AMOUNT &&
    description.trim().length >= 3 &&
    category.length > 0 &&
    date.trim().length > 0 &&
    paidBy.length > 0 &&
    selectedParticipants.length > 0;

  const header = (
    <BottomSheetHeader
      visible={visible}
      title={
        activeView === 'SELECT_PAYER'
          ? '¿Quién pagó?'
          : activeView === 'SELECT_SPLIT'
            ? 'Tipo de división'
            : activeView === 'SELECT_PARTICIPANTS'
              ? 'Participantes'
              : isEditing
                ? 'Editar gasto'
                : 'Nuevo gasto'
      }
      subtitle={
        activeView === 'MAIN'
          ? isEditing
            ? `Actualiza el gasto en ${group.name}`
            : `Registra un gasto compartido en ${group.name}`
          : ''
      }
      onClose={() => {
        if (activeView !== 'MAIN') {
          setActiveView('MAIN');
        } else {
          onClose();
        }
      }}
      logo={require('@/assets/images/logo-white-green-bg-without.png')}
    />
  );

  const handleBeforeClose = async () => {
    if (activeView !== 'MAIN') {
      setActiveView('MAIN');
      return false; // Prevent closing the sheet if in a sub-view
    }
    if (amount !== '' || description.trim() !== '' || pickedReceipt) {
      return new Promise<boolean>((resolve) => {
        Toast.show({
          type: 'confirmDiscard',
          text1: '¿Descartar gasto?',
          text2: 'Tienes información sin guardar.',
          autoHide: false,
          props: {
            onConfirm: () => {
              Toast.hide();
              resolve(true);
            },
            onCancel: () => {
              Toast.hide();
              resolve(false);
            },
          },
        });
      });
    }
    return true;
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      beforeClose={handleBeforeClose}
      header={header}
    >
      <View className="flex-1">
        {activeView === 'MAIN' && (
          <>
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
                onChangeText={handleAmountChange}
                keyboardType="number-pad"
                helperText={
                  parsedAmount > 0
                    ? 'Límite máximo de $2.000.000 por gasto'
                    : undefined
                }
              />

              <Input
                label="Descripción"
                iconLeft="note-sticky"
                placeholder="Ej: Mercado, Cena, Gasolina..."
                value={description}
                onChangeText={setDescription}
                maxLength={60}
              />

              {/* Category */}
              <Text className="mb-2 mt-5 text-sm font-semibold text-[#0F172A]">
                🏷️ Categoría
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="-mx-4 px-2"
              >
                <View className="flex-row gap-1">
                  {CATEGORIES.map((cat) => {
                    const isActive = category === cat.value;
                    return (
                      <Pressable
                        key={cat.value}
                        onPress={() => setCategory(cat.value)}
                        className={`rounded-full px-4 py-2 ${
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

              {/* Paid by Summary */}
              {!isPersonal && (
                <>
                  <View className="mb-2 mt-5 flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-[#0F172A]">
                      👤 Pagado por
                    </Text>
                    <Pressable
                      onPress={() => setActiveView('SELECT_PAYER')}
                      className="px-2 "
                    >
                      <Text className="text-sm font-semibold text-[#10B981]">
                        Cambiar
                      </Text>
                    </Pressable>
                  </View>
                  <Pressable
                    onPress={() => setActiveView('SELECT_PAYER')}
                    className="flex-row items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-2 px-4 active:bg-[#F1F5F9]"
                  >
                    <View className="flex-row items-center gap-3">
                      <FontAwesome6 name="user" size={14} color="#64748B" />
                      <Text className="text-base font-medium text-[#0F172A]">
                        {members.find((m) => m.id === paidBy)?.name ??
                          'Seleccionar'}
                      </Text>
                    </View>
                    <FontAwesome6
                      name="chevron-right"
                      size={12}
                      color="#94A3B8"
                    />
                  </Pressable>
                </>
              )}

              {/* Participants Summary */}
              {!isPersonal && !isCouple && (
                <>
                  <View className="mb-2 mt-5 flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-[#0F172A]">
                      👥 Participantes
                    </Text>
                    <Pressable
                      onPress={() => setActiveView('SELECT_PARTICIPANTS')}
                      className="px-2 py-1"
                    >
                      <Text className="text-sm font-semibold text-[#10B981]">
                        Cambiar
                      </Text>
                    </Pressable>
                  </View>
                  <Pressable
                    onPress={() => setActiveView('SELECT_PARTICIPANTS')}
                    className="flex-row items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 active:bg-[#F1F5F9]"
                  >
                    <View className="flex-1 flex-row flex-wrap items-center gap-1">
                      <Text className="text-base font-medium text-[#0F172A]">
                        {selectedParticipants.length === members.length
                          ? 'Todos los miembros'
                          : `${selectedParticipants.length} participante${selectedParticipants.length !== 1 ? 's' : ''}`}
                      </Text>
                    </View>
                    <FontAwesome6
                      name="chevron-right"
                      size={12}
                      color="#94A3B8"
                    />
                  </Pressable>
                </>
              )}

              {/* Split Type Summary */}
              {!isPersonal && (
                <>
                  <View className="mb-2 mt-5 flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-[#0F172A]">
                      🔄 Tipo de división
                    </Text>
                    <Pressable
                      onPress={() => setActiveView('SELECT_SPLIT')}
                      className="px-2 py-1"
                    >
                      <Text className="text-sm font-semibold text-[#10B981]">
                        Cambiar
                      </Text>
                    </Pressable>
                  </View>
                  <Pressable
                    onPress={() => setActiveView('SELECT_SPLIT')}
                    className="flex-row items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 active:bg-[#F1F5F9]"
                  >
                    <View className="flex-1">
                      {splitType === 'EQUAL' ? (
                        <View className="flex-row items-center gap-2">
                          <FontAwesome6
                            name="scale-balanced"
                            size={14}
                            color="#64748B"
                          />
                          <Text className="text-base font-medium text-[#0F172A]">
                            Partes iguales
                          </Text>
                        </View>
                      ) : (
                        <View className="gap-1">
                          <View className="flex-row justify-between">
                            <Text className="text-sm font-medium text-[#0F172A]">
                              Tú pagas
                            </Text>
                            <Text className="text-sm font-bold text-[#10B981]">
                              {yourPercentage}%
                            </Text>
                          </View>
                          <View className="flex-row justify-between">
                            <Text className="text-sm font-medium text-[#64748B]">
                              Tu pareja paga
                            </Text>
                            <Text className="text-sm font-bold text-[#64748B]">
                              {100 - yourPercentage}%
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                    <View className="ml-3">
                      <FontAwesome6
                        name="chevron-right"
                        size={12}
                        color="#94A3B8"
                      />
                    </View>
                  </Pressable>
                </>
              )}

              {/* Receipt */}
              <Text className="mb-2 mt-5 text-sm font-semibold text-[#0F172A]">
                🖼️ Comprobante (opcional)
              </Text>

              {pickedReceipt ? (
                <View className="gap-2">
                  <Image
                    source={{ uri: pickedReceipt.uri }}
                    className="h-40 w-full rounded-xl border border-[#E2E8F0] bg-[#f2f4f6]"
                    contentFit="cover"
                  />
                  <Pressable
                    onPress={() => {
                      setPickedReceipt(null);
                      if (initialExpense?.receiptUrl) {
                        setRemoveExistingReceipt(false);
                      }
                    }}
                    className="flex-row items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white py-2.5 active:bg-[#F2F4F6]"
                  >
                    <FontAwesome6 name="xmark" size={13} color="#EF4444" />
                    <Text className="text-sm font-semibold text-[#EF4444]">
                      Quitar foto
                    </Text>
                  </Pressable>
                </View>
              ) : initialExpense?.receiptUrl && !removeExistingReceipt ? (
                <View className="gap-2">
                  <Image
                    source={{
                      uri: resolveImageUrl(initialExpense.receiptUrl) ?? '',
                    }}
                    className="h-40 w-full rounded-xl border border-[#E2E8F0] bg-[#f2f4f6]"
                    contentFit="cover"
                  />
                  <Pressable
                    onPress={handlePickReceipt}
                    className="flex-row items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white py-2.5 active:bg-[#F2F4F6]"
                  >
                    <FontAwesome6 name="pen" size={13} color="#0F766E" />
                    <Text className="text-sm font-semibold text-[#0F766E]">
                      Reemplazar
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setRemoveExistingReceipt(true)}
                    className="flex-row items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white py-2.5 active:bg-[#F2F4F6]"
                  >
                    <FontAwesome6 name="trash-can" size={13} color="#EF4444" />
                    <Text className="text-sm font-semibold text-[#EF4444]">
                      Eliminar comprobante
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  onPress={handlePickReceipt}
                  className="flex-row items-center justify-center gap-2 rounded-xl border border-dashed border-[#94A3B8] bg-white py-8 active:opacity-80"
                >
                  <FontAwesome6 name="camera" size={20} color="#006c49" />
                  <Text className="text-sm text-[#006c49]">Agregar foto</Text>
                </Pressable>
              )}
            </ScrollView>

            <View className="border-t border-[#E2E8F0] px-5 pb-2 pt-4">
              <Button
                text={isEditing ? 'Guardar cambios' : 'Registrar gasto'}
                iconRight="check"
                isLoading={isSubmitting}
                loadingText={isEditing ? 'Guardando...' : 'Registrando...'}
                onPress={async () => {
                  if (isSubmitting) return;
                  setIsSubmitting(true);
                  try {
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

                    const payload: ExpensePayload = {
                      description,
                      amount: parseAmount(amount),
                      category: category as ExpenseCategory,
                      splitType: splitType as SplitType,
                      groupId: group.id,
                      splits,
                      ...(pickedReceipt && { receipt: pickedReceipt }),
                      ...(removeExistingReceipt && { removeReceipt: true }),
                    };

                    if (isEditing) {
                      await onUpdateExpense?.(payload);
                    } else {
                      await onCreateExpense?.(payload);
                    }
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={!isFormValid || isSubmitting}
                className="rounded-full py-4"
              />
            </View>
          </>
        )}

        {/* SELECT_PAYER VIEW */}
        {activeView === 'SELECT_PAYER' && (
          <View className="flex-1 px-5 pt-4">
            <Text className="mb-4 text-base font-semibold text-[#0F172A]">
              Selecciona quién pagó el gasto:
            </Text>
            <View className="gap-3">
              {members.map((member) => {
                const isActive = paidBy === member.id;
                return (
                  <Pressable
                    key={member.id}
                    onPress={() => {
                      setPaidBy(member.id);
                      setActiveView('MAIN');
                    }}
                    className={`flex-row items-center justify-between rounded-xl border p-4 ${
                      isActive
                        ? 'border-[#10B981] bg-[#F0FDF4]'
                        : 'border-[#E2E8F0] bg-white'
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <View
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          isActive ? 'bg-[#10B981]' : 'bg-[#F1F5F9]'
                        }`}
                      >
                        <FontAwesome6
                          name="user"
                          size={16}
                          color={isActive ? 'white' : '#64748B'}
                        />
                      </View>
                      <Text
                        className={`text-base font-medium ${
                          isActive ? 'text-[#0F172A]' : 'text-[#64748B]'
                        }`}
                      >
                        {member.name}
                      </Text>
                    </View>
                    {isActive && (
                      <FontAwesome6 name="check" size={16} color="#10B981" />
                    )}
                  </Pressable>
                );
              })}
            </View>
            <Button
              text="Volver"
              variant="secondary"
              className="mt-6 rounded-full py-4"
              onPress={() => setActiveView('MAIN')}
            />
          </View>
        )}

        {/* SELECT_PARTICIPANTS VIEW */}
        {activeView === 'SELECT_PARTICIPANTS' && (
          <ScrollView
            className="flex-1 px-5 pt-4"
            showsVerticalScrollIndicator={false}
          >
            <Text className="mb-4 text-base font-semibold text-[#0F172A]">
              ¿Quiénes participan en el gasto?
            </Text>
            <View className="gap-3">
              {members.map((member) => {
                const isSelected = selectedParticipants.includes(member.id);
                return (
                  <Pressable
                    key={member.id}
                    onPress={() => toggleParticipant(member.id)}
                    className={`flex-row items-center justify-between rounded-xl border px-4 py-4 ${
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
                          <FontAwesome6 name="check" size={10} color="white" />
                        )}
                      </View>
                      <Text className="text-base font-medium text-[#0F172A]">
                        {member.name}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
            <Button
              text="Aplicar participantes"
              className="mb-4 mt-6 rounded-full py-4"
              onPress={() => setActiveView('MAIN')}
            />
          </ScrollView>
        )}

        {/* SELECT_SPLIT VIEW */}
        {activeView === 'SELECT_SPLIT' && (
          <ScrollView
            className="flex-1 px-5 pt-4"
            showsVerticalScrollIndicator={false}
          >
            <View className="mb-6 flex-row gap-2">
              <Pressable
                onPress={() => setSplitType('EQUAL')}
                className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl border py-4 ${
                  splitType === 'EQUAL'
                    ? 'border-[#10B981] bg-[#F0FDF4]'
                    : 'border-[#E2E8F0] bg-white'
                }`}
              >
                <FontAwesome6
                  name="scale-balanced"
                  size={16}
                  color={splitType === 'EQUAL' ? '#10B981' : '#64748B'}
                />
                <Text
                  className={`text-base font-medium ${
                    splitType === 'EQUAL' ? 'text-[#10B981]' : 'text-[#64748B]'
                  }`}
                >
                  Igual
                </Text>
              </Pressable>
              {isCouple && (
                <Pressable
                  onPress={() => setSplitType('PERCENTAGE')}
                  className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl border py-4 ${
                    splitType === 'PERCENTAGE'
                      ? 'border-[#10B981] bg-[#F0FDF4]'
                      : 'border-[#E2E8F0] bg-white'
                  }`}
                >
                  <FontAwesome6
                    name="percent"
                    size={16}
                    color={splitType === 'PERCENTAGE' ? '#10B981' : '#64748B'}
                  />
                  <Text
                    className={`text-base font-medium ${
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

            {isCouple && splitType === 'PERCENTAGE' && (
              <View className="mb-6 rounded-xl border border-[#E2E8F0] bg-white p-6">
                <Text className="mb-4 text-center text-base font-medium text-[#0F172A]">
                  Tu porcentaje
                </Text>
                <View className="flex-row items-center justify-center gap-6">
                  <Pressable
                    onPress={() =>
                      setYourPercentage(Math.max(10, yourPercentage - 5))
                    }
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981]"
                  >
                    <Text className="text-2xl font-bold text-white">−</Text>
                  </Pressable>
                  <Text className="text-4xl font-extrabold text-[#10B981]">
                    {yourPercentage}%
                  </Text>
                  <Pressable
                    onPress={() =>
                      setYourPercentage(Math.min(90, yourPercentage + 5))
                    }
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981]"
                  >
                    <Text className="text-2xl font-bold text-white">+</Text>
                  </Pressable>
                </View>
                <Text className="mt-4 text-center text-sm text-[#64748B]">
                  Tu pareja recibirá el {100 - yourPercentage}%
                </Text>
              </View>
            )}

            <Button
              text="Aplicar cambios"
              className="mb-4 mt-2 rounded-full py-4"
              onPress={() => setActiveView('MAIN')}
            />
          </ScrollView>
        )}
      </View>
    </BottomSheet>
  );
}
