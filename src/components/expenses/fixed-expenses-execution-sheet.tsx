import { View, Text, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { BottomSheetHeader } from '@/components/ui/bottom-sheet-header';
import { getCategoryMeta } from '@/constants/categories';
import { api } from '@/services/api/client';
import { TextInput } from 'react-native';
import { formatAmountInput, parseAmount } from '@/utils/format';

interface FixedExpense {
  id: string;
  description: string;
  baseAmount: string | null;
  category: any;
  recurrence: string;
  scheduledDay: number | null;
  lastProcessedAt: string | null;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  groupId: string;
}

export function FixedExpensesExecutionSheet({ visible, onClose, groupId }: Props) {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [selectedExpense, setSelectedExpense] = useState<FixedExpense | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customAmount, setCustomAmount] = useState('');

  const { data: fixedExpenses = [], isLoading } = useQuery({
    queryKey: ['fixed-expenses', groupId],
    queryFn: async () => {
      const { data } = await api.get<FixedExpense[]>(`/groups/${groupId}/fixed-expenses`);
      return data;
    },
    enabled: visible,
  });

  const processMutation = useMutation({
    mutationFn: async ({ id, action, qty, amount }: { id: string; action: 'ACCEPT' | 'IGNORE'; qty?: number; amount?: number }) => {
      await api.post(`/fixed-expenses/${id}/process`, { action, quantity: qty, amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses', groupId] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['budget'] });
      setSelectedExpense(null);
      setQuantity(1);
      setCustomAmount('');
      onClose();
    },
  });

  const handleProcess = (action: 'ACCEPT' | 'IGNORE') => {
    if (!selectedExpense) return;
    const payload: any = { id: selectedExpense.id, action };
    
    if (selectedExpense.baseAmount !== null) {
      payload.qty = quantity;
    } else {
      if (action === 'ACCEPT') {
         if (!customAmount) return;
         payload.amount = parseAmount(customAmount);
      }
    }
    
    processMutation.mutate(payload);
  };

  const handleClose = () => {
    setSelectedExpense(null);
    setQuantity(1);
    setCustomAmount('');
    onClose();
  };

  const header = (
    <BottomSheetHeader
      visible={visible}
      title={selectedExpense ? "Registrar Gasto" : "Plantillas Rápidas"}
      subtitle={selectedExpense ? "Confirma el monto a registrar" : "Usa una plantilla para registrar rápido"}
      onClose={handleClose}
      logo={require('@/assets/images/logo-white-green-bg-without.png')}
    />
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      header={header}
    >
      <View className="flex-1">
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          {selectedExpense ? (
            <View className="bg-white rounded-xl p-5 border border-[#E2E8F0] mb-4">
               <View className="flex-row justify-between items-center mb-4">
                 <Text className="text-lg font-bold text-[#0F172A]">{selectedExpense.description}</Text>
                 <Pressable onPress={() => { setSelectedExpense(null); setCustomAmount(''); }} className="p-2 bg-[#F8FAFC] rounded-full">
                   <FontAwesome6 name="arrow-left" size={14} color="#64748B" />
                 </Pressable>
               </View>

               {selectedExpense.baseAmount !== null ? (
                 <>
                   <Text className="text-center text-sm text-[#64748B] mb-2">Monto Base</Text>
                   <Text className="text-center text-3xl font-bold text-[#006c49] mb-6">
                     ${Number(selectedExpense.baseAmount).toLocaleString('es-CL')}
                   </Text>

                   <View className="flex-row justify-center items-center gap-6 mb-8">
                     <Pressable 
                       onPress={() => setQuantity(Math.max(1, quantity - 1))}
                       className="w-12 h-12 rounded-full bg-[#E2E8F0] items-center justify-center active:bg-[#CBD5E1]"
                     >
                       <FontAwesome6 name="minus" size={16} color="#0F172A" />
                     </Pressable>
                     <Text className="text-2xl font-bold text-[#0F172A]">{quantity}</Text>
                     <Pressable 
                       onPress={() => setQuantity(quantity + 1)}
                       className="w-12 h-12 rounded-full bg-[#E2E8F0] items-center justify-center active:bg-[#CBD5E1]"
                     >
                       <FontAwesome6 name="plus" size={16} color="#0F172A" />
                     </Pressable>
                   </View>
                 </>
               ) : (
                 <>
                   <Text className="text-center text-sm text-[#64748B] mb-2">Monto a Registrar *</Text>
                   <TextInput
                     className="w-full text-center text-3xl font-bold text-[#006c49] mb-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-4"
                     placeholder="$ 0"
                     placeholderTextColor="#CBD5E1"
                     keyboardType="numeric"
                     value={customAmount ? `$ ${customAmount}` : ''}
                     onChangeText={(t) => setCustomAmount(formatAmountInput(t))}
                   />
                 </>
               )}

               <View className="flex-col gap-3">
                 <Pressable
                   onPress={() => handleProcess('ACCEPT')}
                   disabled={processMutation.isPending || (selectedExpense.baseAmount === null && !customAmount)}
                   className={`rounded-xl py-4 items-center active:opacity-80 ${processMutation.isPending || (selectedExpense.baseAmount === null && !customAmount) ? 'bg-[#CBD5E1]' : 'bg-[#006c49]'}`}
                 >
                   <Text className="text-white font-bold">{processMutation.isPending ? 'Procesando...' : 'Registrar Gasto'}</Text>
                 </Pressable>
                 <Pressable
                   onPress={() => handleProcess('IGNORE')}
                   disabled={processMutation.isPending}
                   className="bg-white border border-[#E2E8F0] rounded-xl py-4 items-center active:bg-[#F8FAFC]"
                 >
                   <Text className="text-[#64748B] font-bold">Ignorar / Omitir</Text>
                 </Pressable>
               </View>
            </View>
          ) : (
            <>
              {isLoading ? (
                <View className="items-center py-10">
                  <Text className="text-[#64748B]">Cargando...</Text>
                </View>
              ) : fixedExpenses.length === 0 ? (
                <View className="items-center py-10">
                  <Text className="text-[#64748B] text-center mb-4">No tienes plantillas configuradas en este grupo.</Text>
                </View>
              ) : (
                <View className="flex-col gap-3">
                  {fixedExpenses.map((expense: FixedExpense) => {
                    const meta = getCategoryMeta(expense.category);
                    return (
                      <Pressable 
                        key={expense.id}
                        onPress={() => {
                          setSelectedExpense(expense);
                          setQuantity(1);
                        }}
                        className="flex-row items-center justify-between p-4 bg-white border border-[#E2E8F0] rounded-xl active:bg-[#F8FAFC]"
                      >
                        <View className="flex-row items-center gap-3">
                          <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: meta.color }}>
                            <FontAwesome6 name={meta.icon as any} size={16} color="white" />
                          </View>
                          <View>
                            <Text className="font-bold text-[#0F172A]">{expense.description}</Text>
                            <Text className={`text-sm ${expense.baseAmount ? 'text-[#64748B]' : 'text-[#64748B] italic'}`}>
                              {expense.baseAmount ? `$${Number(expense.baseAmount).toLocaleString('es-CL')}` : 'Monto variable'}
                            </Text>
                          </View>
                        </View>
                        <FontAwesome6 name="chevron-right" size={14} color="#CBD5E1" />
                      </Pressable>
                    );
                  })}
                </View>
              )}

              <Pressable
                onPress={() => {
                  onClose();
                  router.push(`/grupos/${groupId}/gastos-fijos`);
                }}
                className="mt-6 flex-row items-center justify-center gap-2 py-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] active:bg-[#E2E8F0]"
              >
                <FontAwesome6 name="gear" size={14} color="#64748B" />
                <Text className="font-bold text-[#64748B]">Administrar Plantillas</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </View>
    </BottomSheet>
  );
}
