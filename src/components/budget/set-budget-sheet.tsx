import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { BottomSheetHeader } from '@/components/ui/bottom-sheet-header';
import { useBudget } from '@/hooks/use-budget';

interface SetBudgetSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function SetBudgetSheet({ visible, onClose }: SetBudgetSheetProps) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const { budget, setBudget, isSaving } = useBudget(currentMonth, currentYear, visible);

  const [incomeStr, setIncomeStr] = useState('');
  const [budgetLimitStr, setBudgetLimitStr] = useState('');

  useEffect(() => {
    if (budget && visible) {
      setIncomeStr(budget.income ? String(budget.income) : '');
      // Mostrar límite solo si es distinto al salario (o si se configuró explícitamente, pero por ahora lo mostramos)
      setBudgetLimitStr(budget.budget ? String(budget.budget) : '');
    } else if (visible) {
      setIncomeStr('');
      setBudgetLimitStr('');
    }
  }, [budget, visible]);

  const handleSave = async () => {
    const incomeNum = Number(incomeStr.replace(/[^0-9]/g, ''));
    const limitNum = budgetLimitStr ? Number(budgetLimitStr.replace(/[^0-9]/g, '')) : undefined;

    if (!incomeNum || incomeNum <= 0) {
      Alert.alert('Error', 'Debes ingresar un salario válido.');
      return;
    }

    try {
      await setBudget({
        month: currentMonth,
        year: currentYear,
        income: incomeNum,
        budget: limitNum,
      });
      onClose();
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar el presupuesto.');
    }
  };

  const header = (
    <BottomSheetHeader
      visible={visible}
      title="Configurar Presupuesto"
      subtitle="Define tu flujo de caja"
      onClose={onClose}
    />
  );

  return (
    <BottomSheet visible={visible} onClose={onClose} header={header}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="px-5 pb-8 pt-4"
      >
        <Text className="mb-2 text-sm font-semibold text-[#64748B] uppercase tracking-wider">
          ¿Cuál es tu ingreso este mes?
        </Text>
        <TextInput
          className="mb-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-4 text-xl font-bold text-[#0F172A]"
          placeholder="$0"
          keyboardType="numeric"
          value={incomeStr}
          onChangeText={setIncomeStr}
        />

        <Text className="mb-2 text-sm font-semibold text-[#64748B] uppercase tracking-wider">
          Límite de gasto (Opcional)
        </Text>
        <TextInput
          className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-4 text-xl font-bold text-[#0F172A]"
          placeholder="Usa tu salario como límite"
          keyboardType="numeric"
          value={budgetLimitStr}
          onChangeText={setBudgetLimitStr}
        />
        <Text className="mb-6 mt-2 text-xs text-[#64748B]">
          Si lo dejas en blanco, tu límite de gasto será igual a tu ingreso.
        </Text>

        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          className={`rounded-2xl py-4 ${isSaving ? 'bg-[#059669]/50' : 'bg-[#059669]'}`}
        >
          <Text className="text-center text-lg font-bold text-white">
            {isSaving ? 'Guardando...' : 'Guardar configuración'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
}
