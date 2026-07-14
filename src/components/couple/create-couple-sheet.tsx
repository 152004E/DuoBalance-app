import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { BottomSheetHeader } from '@/components/ui/bottom-sheet-header';
import { Button } from '@/components/ui/button';

type GroupType = 'personal' | 'pareja' | 'grupo';
type SplitOption = '50_50' | 'equal' | 'percentage';

interface CreateCoupleSheetProps {
  visible: boolean;
  onClose: () => void;
  heightRatio?: number;
  headerFinalTranslateY?: number;
}

const TYPE_CARDS: {
  type: GroupType;
  icon: string;
  label: string;
  subtitle: string;
}[] = [
  { type: 'personal', icon: 'user', label: 'Personal', subtitle: 'Solo yo' },
  { type: 'pareja', icon: 'heart', label: 'Pareja', subtitle: '2 personas' },
  { type: 'grupo', icon: 'users', label: 'Grupo', subtitle: '3-5 pers.' },
];

function SplitToggle({
  labels,
  values,
  selected,
  onChange,
}: {
  labels: [string, string];
  values: [SplitOption, SplitOption];
  selected: SplitOption;
  onChange: (value: SplitOption) => void;
}) {
  return (
    <View className="flex-row gap-2">
      {labels.map((label, i) => {
        const isActive = selected === values[i];
        return (
          <Pressable
            key={values[i]}
            onPress={() => onChange(values[i])}
            className={`flex-1 items-center rounded-xl py-2.5 ${
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
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function CreateCoupleSheet({
  visible,
  onClose,
  heightRatio = 0.85,
  headerFinalTranslateY,
}: CreateCoupleSheetProps) {
  const router = useRouter();
  const [groupType, setGroupType] = useState<GroupType>('personal');
  const [coupleName, setCoupleName] = useState('');
  const [splitOption, setSplitOption] = useState<SplitOption>('50_50');
  const [yourPercentage, setYourPercentage] = useState(50);

  const partnerPercentage = 100 - yourPercentage;

  const isDisabled = coupleName.trim().length === 0;

  // Reset form state when sheet opens
  useEffect(() => {
    if (visible) {
      setGroupType('personal');
      setCoupleName('');
      setYourPercentage(50);
      setSplitOption('50_50');
    }
  }, [visible]);

  const handleTypeChange = (type: GroupType) => {
    setGroupType(type);
    setCoupleName('');
    setYourPercentage(50);
    if (type === 'pareja') {
      setSplitOption('50_50');
    } else if (type === 'grupo') {
      setSplitOption('equal');
    }
  };

  const getSplitLabels = (): [string, string] => {
    if (groupType === 'pareja') return ['50/50', 'Porcentaje'];
    return ['Equitativa', 'Porcentaje'];
  };

  const getSplitValues = (): [SplitOption, SplitOption] => {
    if (groupType === 'pareja') return ['50_50', 'percentage'];
    return ['equal', 'percentage'];
  };

  const handleCreate = () => {
    const mockId = Date.now().toString();
    const groupName = coupleName;

    const splitType =
      groupType === 'personal'
        ? null
        : groupType === 'pareja'
          ? splitOption === '50_50'
            ? '50/50'
            : 'porcentaje'
          : splitOption === 'equal'
            ? 'equitativa'
            : 'porcentaje';

    const percentageToLog =
      groupType === 'pareja' && splitOption === 'percentage'
        ? yourPercentage
        : groupType === 'pareja'
          ? 50
          : undefined;

    console.log({
      type: groupType,
      name: groupName,
      splitType,
      yourPercentage: percentageToLog,
    });

    onClose();
    router.push(`/grupos/${mockId}`);
  };

  const header = (
    <BottomSheetHeader
      visible={visible}
      title="Opciones del grupo"
      subtitle="Administra tu grupo de gastos compartidos"
      onClose={onClose}
      gradientPaddingBottom={500}
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
          contentContainerClassName="pb-6"
        >
          {/* Step 1: Type selector */}
          <Text className="mb-3 mt-2 text-sm font-semibold text-[#0F172A]">
            Tipo de grupo
          </Text>
          <View className="flex-row gap-2">
            {TYPE_CARDS.map((card) => {
              const isSelected = groupType === card.type;
              return (
                <Pressable
                  key={card.type}
                  onPress={() => handleTypeChange(card.type)}
                  className={`flex-1 items-center rounded-2xl border py-4 ${
                    isSelected
                      ? 'border-[#10B981] bg-[#F0FDF4]'
                      : 'border-[#E2E8F0] bg-white'
                  }`}
                >
                  <View
                    className={`mb-2 h-10 w-10 items-center justify-center rounded-full ${
                      isSelected ? 'bg-[#10B981]/10' : 'bg-[#F1F5F9]'
                    }`}
                  >
                    <FontAwesome6
                      name={card.icon}
                      size={18}
                      color={isSelected ? '#10B981' : '#64748B'}
                    />
                  </View>
                  <Text
                    className={`text-sm font-semibold ${
                      isSelected ? 'text-[#10B981]' : 'text-[#0F172A]'
                    }`}
                  >
                    {card.label}
                  </Text>
                  <Text
                    className={`mt-0.5 text-xs ${
                      isSelected ? 'text-[#10B981]/70' : 'text-[#64748B]'
                    }`}
                  >
                    {card.subtitle}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Step 2: Dynamic form per type */}
          {groupType === 'personal' && (
            <>
              <Text className="mb-2 mt-6 text-sm font-semibold text-[#0F172A]">
                Nombre del espacio
              </Text>
              <TextInput
                className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3.5 text-base text-[#0F172A] shadow-sm"
                placeholder="Ej: Mis gastos, Viaje personal"
                placeholderTextColor="#94A3B8"
                value={coupleName}
                onChangeText={setCoupleName}
              />
              <View className="mt-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                <Text className="text-sm leading-5 text-[#64748B]">
                  Los gastos de este espacio no se dividen. Son 100% tuyos.
                </Text>
              </View>
            </>
          )}

          {groupType === 'pareja' && (
            <>
              <Text className="mb-2 mt-6 text-sm font-semibold text-[#0F172A]">
                Nombre de la pareja
              </Text>
              <TextInput
                className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3.5 text-base text-[#0F172A] shadow-sm"
                placeholder="Ej: Hogar, Viaje a Italia"
                placeholderTextColor="#94A3B8"
                value={coupleName}
                onChangeText={setCoupleName}
              />

              <Text className="mb-2 mt-6 text-sm font-semibold text-[#0F172A]">
                Distribución de gastos
              </Text>
              <SplitToggle
                labels={getSplitLabels()}
                values={getSplitValues()}
                selected={splitOption}
                onChange={setSplitOption}
              />

              {/* Percentage cards */}
              <View className="mt-4 flex-row gap-3">
                <View className="flex-1 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
                  <View className="mb-3 flex-row items-center gap-2">
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-[#10B981]/10">
                      <FontAwesome6 name="user" size={14} color="#10B981" />
                    </View>
                    <Text className="text-sm font-medium text-[#0F172A]">
                      Tú
                    </Text>
                  </View>
                  <Text className="text-2xl font-extrabold text-[#10B981]">
                    {splitOption === '50_50' ? 50 : yourPercentage}%
                  </Text>
                </View>
                <View className="flex-1 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
                  <View className="mb-3 flex-row items-center gap-2">
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-[#0F766E]/10">
                      <FontAwesome6
                        name="user-group"
                        size={14}
                        color="#0F766E"
                      />
                    </View>
                    <Text className="text-sm font-medium text-[#0F172A]">
                      Tu pareja
                    </Text>
                  </View>
                  <Text className="text-2xl font-extrabold text-[#0F766E]">
                    {splitOption === '50_50' ? 50 : partnerPercentage}%
                  </Text>
                </View>
              </View>

              {/* +/- controls (only for percentage mode) */}
              {splitOption === 'percentage' && (
                <View className="mt-4">
                  <View className="flex-row items-center justify-center gap-4">
                    <Pressable
                      onPress={() =>
                        setYourPercentage(Math.max(0, yourPercentage - 5))
                      }
                      className="h-12 w-12 items-center justify-center rounded-full bg-[#10B981]"
                      style={{
                        shadowColor: '#10B981',
                        shadowOpacity: 0.25,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                    >
                      <Text className="text-xl font-bold text-white">
                        −
                      </Text>
                    </Pressable>

                    <Text className="text-3xl font-extrabold text-[#10B981]">
                      {yourPercentage}%
                    </Text>

                    <Pressable
                      onPress={() =>
                        setYourPercentage(Math.min(100, yourPercentage + 5))
                      }
                      className="h-12 w-12 items-center justify-center rounded-full bg-[#10B981]"
                      style={{
                        shadowColor: '#10B981',
                        shadowOpacity: 0.25,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                    >
                      <Text className="text-xl font-bold text-white">
                        +
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </>
          )}

          {groupType === 'grupo' && (
            <>
              <Text className="mb-2 mt-6 text-sm font-semibold text-[#0F172A]">
                Nombre del grupo
              </Text>
              <TextInput
                className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3.5 text-base text-[#0F172A] shadow-sm"
                placeholder="Ej: Compañeros de piso"
                placeholderTextColor="#94A3B8"
                value={coupleName}
                onChangeText={setCoupleName}
              />

              <Text className="mb-2 mt-6 text-sm font-semibold text-[#0F172A]">
                Distribución de gastos
              </Text>
              <SplitToggle
                labels={getSplitLabels()}
                values={getSplitValues()}
                selected={splitOption}
                onChange={setSplitOption}
              />

              {splitOption === 'equal' ? (
                <View className="mt-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                  <Text className="text-sm text-[#64748B]">
                    Todos pagan lo mismo
                  </Text>
                </View>
              ) : (
                <View className="mt-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                  <Text className="text-sm text-[#64748B]">
                    Podrás configurar los porcentajes después de crear el
                    grupo.
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>

        <View className="border-t border-[#E2E8F0] px-5 pb-2 pt-4">
          <Button
            text={
              groupType === 'personal'
                ? 'Crear espacio personal'
                : groupType === 'pareja'
                  ? 'Crear pareja'
                  : 'Crear grupo'
            }
            iconRight="arrow-right"
            onPress={handleCreate}
            disabled={isDisabled}
            className="rounded-full py-4"
          />
        </View>
      </View>
    </BottomSheet>
  );
}
