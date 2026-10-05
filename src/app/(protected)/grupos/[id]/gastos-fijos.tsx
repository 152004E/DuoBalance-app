import { View, Text, ScrollView, Pressable, TextInput, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api/client';
import { useState } from 'react';
import { getCategoryMeta, CATEGORIES } from '@/constants/categories';
import { FontAwesome6 } from '@expo/vector-icons';
import { AlertModal } from '@/components/ui/alert-modal';

interface FixedExpense {
  id: string;
  description: string;
  baseAmount: string;
  category: any;
  recurrence: string;
}

export default function GastosFijosScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  
  // Form State
  const [description, setDescription] = useState('');
  const [baseAmount, setBaseAmount] = useState('');
  const [category, setCategory] = useState<any>('OTHER');
  const [recurrence, setRecurrence] = useState('OCCASIONAL');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  
  // Delete State
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  const { data: fixedExpenses = [], isLoading } = useQuery({
    queryKey: ['fixed-expenses', id],
    queryFn: async () => {
      const { data } = await api.get<FixedExpense[]>(`/groups/${id}/fixed-expenses`);
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      await api.post(`/groups/${id}/fixed-expenses`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses', id] });
      setIsCreating(false);
      setDescription('');
      setBaseAmount('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (expenseId: string) => {
      await api.delete(`/fixed-expenses/${expenseId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses', id] });
      setExpenseToDelete(null);
    },
  });

  const handleCreate = () => {
    if (!description || !baseAmount) return;
    createMutation.mutate({
      description,
      baseAmount: Number(baseAmount),
      category,
      recurrence,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <View className="pt-1">
        <ScreenHeader
          title="Gastos Fijos / Plantillas"
          subtitle="Configura pagos rápidos"
          onBack={() => router.back()}
        />
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-20 pt-4">
        {isCreating ? (
          <View className="bg-white rounded-xl p-5 border border-[#E2E8F0] mb-6 shadow-sm">
            <Text className="text-lg font-bold text-[#0F172A] mb-4">Nueva Plantilla</Text>
            
            <Text className="text-sm font-semibold text-[#64748B] mb-2">Descripción</Text>
            <TextInput
              className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-[#0F172A] mb-4"
              placeholder="Ej. Netflix, Arriendo, Sushi"
              value={description}
              onChangeText={setDescription}
            />

            <Text className="text-sm font-semibold text-[#64748B] mb-2">Monto Base</Text>
            <TextInput
              className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-[#0F172A] mb-4"
              placeholder="$0"
              keyboardType="numeric"
              value={baseAmount}
              onChangeText={setBaseAmount}
            />

            <Text className="text-sm font-semibold text-[#64748B] mb-2">Categoría</Text>
            <Pressable 
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              className="flex-row items-center justify-between w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 mb-4"
            >
              <View className="flex-row items-center gap-2">
                <FontAwesome6 name={getCategoryMeta(category).icon} size={14} color={getCategoryMeta(category).color} />
                <Text className="text-[#0F172A] font-semibold">{getCategoryMeta(category).label}</Text>
              </View>
              <FontAwesome6 name="chevron-down" size={12} color="#64748B" />
            </Pressable>

            {showCategoryPicker && (
              <View className="flex-row flex-wrap gap-2 mb-4 bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                {CATEGORIES.map(cat => (
                  <Pressable
                    key={cat.value}
                    onPress={() => {
                      setCategory(cat.value);
                      setShowCategoryPicker(false);
                    }}
                    className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full ${category === cat.value ? 'bg-[#006c49]' : 'bg-white border border-[#E2E8F0]'}`}
                  >
                    <Text className={category === cat.value ? 'text-white font-medium text-xs' : 'text-[#64748B] font-medium text-xs'}>{cat.label}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            <Text className="text-sm font-semibold text-[#64748B] mb-2">Tipo de Frecuencia</Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
              {[
                { id: 'OCCASIONAL', label: 'De vez en cuando' },
                { id: 'DAILY', label: 'Diario' },
                { id: 'WEEKLY', label: 'Semanal' },
                { id: 'MONTHLY', label: 'Mensual' }
              ].map(freq => (
                <Pressable
                  key={freq.id}
                  onPress={() => setRecurrence(freq.id)}
                  className={`px-4 py-2 rounded-full ${recurrence === freq.id ? 'bg-[#0F172A]' : 'bg-[#F1F5F9]'}`}
                >
                  <Text className={recurrence === freq.id ? 'text-white font-semibold' : 'text-[#64748B] font-semibold'}>{freq.label}</Text>
                </Pressable>
              ))}
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setIsCreating(false)}
                className="flex-1 py-3 rounded-xl bg-[#F1F5F9] items-center"
              >
                <Text className="text-[#64748B] font-bold">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleCreate}
                disabled={createMutation.isPending || !description || !baseAmount}
                className={`flex-1 py-3 rounded-xl items-center ${!description || !baseAmount ? 'bg-[#CBD5E1]' : 'bg-[#006c49]'}`}
              >
                <Text className="text-white font-bold">{createMutation.isPending ? 'Guardando...' : 'Guardar'}</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            onPress={() => setIsCreating(true)}
            className="flex-row items-center justify-center gap-2 bg-[#F1F5F9] border border-[#E2E8F0] border-dashed rounded-xl p-5 mb-6 active:bg-[#E2E8F0]"
          >
            <FontAwesome6 name="plus" size={16} color="#64748B" />
            <Text className="text-[#64748B] font-bold text-base">Crear Nueva Plantilla</Text>
          </Pressable>
        )}

        <Text className="text-[13px] font-semibold uppercase tracking-wider text-[#64748B] mb-4">
          Tus Plantillas
        </Text>

        {isLoading ? (
          <Text className="text-center text-[#64748B] mt-10">Cargando...</Text>
        ) : fixedExpenses.length === 0 ? (
          <Text className="text-center text-[#64748B] mt-10">No hay plantillas creadas.</Text>
        ) : (
          <View className="flex-col gap-3">
            {fixedExpenses.map((expense: FixedExpense) => {
              const meta = getCategoryMeta(expense.category);
              return (
                <View key={expense.id} className="bg-white rounded-xl p-4 border border-[#E2E8F0] flex-row justify-between items-center shadow-sm">
                  <View className="flex-row items-center gap-3">
                    <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: meta.color }}>
                      <FontAwesome6 name={meta.icon} size={18} color="white" />
                    </View>
                    <View>
                      <Text className="font-bold text-[#0F172A] text-base">{expense.description}</Text>
                      <Text className="text-sm font-semibold text-[#006c49]">
                        ${Number(expense.baseAmount).toLocaleString('es-CL')}
                      </Text>
                      <Text className="text-xs text-[#64748B] mt-1">
                        {expense.recurrence === 'OCCASIONAL' ? 'De vez en cuando' : 
                         expense.recurrence === 'DAILY' ? 'Diario' : 
                         expense.recurrence === 'WEEKLY' ? 'Semanal' : 'Mensual'}
                      </Text>
                    </View>
                  </View>
                  
                  <Pressable 
                    onPress={() => setExpenseToDelete(expense.id)}
                    className="p-3 w-10 h-10 rounded-full bg-[#FEF2F2] items-center justify-center"
                  >
                    <FontAwesome6 name="trash-can" size={14} color="#EF4444" />
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <AlertModal
        visible={!!expenseToDelete}
        title="Eliminar plantilla"
        message="¿Estás seguro que deseas eliminar esta plantilla? Esto no afectará los gastos que ya se registraron con ella."
        type="error"
        buttonText={deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
        onClose={() => expenseToDelete && deleteMutation.mutate(expenseToDelete)}
        cancelText="Cancelar"
        onCancel={() => setExpenseToDelete(null)}
      />
    </SafeAreaView>
  );
}
