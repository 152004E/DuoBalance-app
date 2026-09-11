import { useState } from 'react';
import { View, Text, ScrollView, Switch, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertModal } from '@/components/ui/alert-modal';
import { useAuth } from '@/hooks/use-auth';
import { changePassword, deleteAccount } from '@/services/api/auth';
import { extractErrorMessage } from '@/utils/errors';

interface NotificationOption {
  icon: string;
  label: string;
  description: string;
  key: string;
}

const notificationOptions: NotificationOption[] = [
  {
    icon: 'bell',
    label: 'Gastos compartidos',
    description: 'Cuando alguien agregue un gasto en un grupo',
    key: 'expenses',
  },
  {
    icon: 'money-bill-transfer',
    label: 'Pagos',
    description: 'Cuando recibas o realices un pago',
    key: 'payments',
  },
  {
    icon: 'user-plus',
    label: 'Invitaciones',
    description: 'Cuando te inviten a un grupo',
    key: 'invitations',
  },
  {
    icon: 'chart-line',
    label: 'Resumen semanal',
    description: 'Resumen de gastos cada semana',
    key: 'weekly',
  },
  {
    icon: 'bell',
    label: 'Recordatorios',
    description: 'Recordatorio de gastos pendientes',
    key: 'reminders',
  },
];

const currencies = [
  { code: 'COP', symbol: '$', name: 'Peso colombiano' },
  { code: 'USD', symbol: '$', name: 'Dólar estadounidense' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
] as const;

export default function ConfiguracionScreen() {
  const { user, signOut } = useAuth();

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // Notifications state
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    expenses: true,
    payments: true,
    invitations: true,
    weekly: false,
    reminders: true,
  });

  // Currency preference state
  const [selectedCurrency, setSelectedCurrency] = useState('COP');

  // Delete account modal state
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Global alert modal
  const [alertModal, setAlertModal] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  } | null>(null);

  const isGoogleAccount = user?.hasPassword === false;

  const toggleNotification = (key: string) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const validatePasswordChange = () => {
    const errors: typeof passwordErrors = {};

    if (!currentPassword.trim()) {
      errors.currentPassword = 'La contraseña actual es requerida';
    }
    if (!newPassword.trim()) {
      errors.newPassword = 'La nueva contraseña es requerida';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'Mínimo 6 caracteres';
    }
    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'Confirma tu nueva contraseña';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordChange()) return;

    setIsChangingPassword(true);
    setPasswordErrors({});

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setAlertModal({
        type: 'success',
        title: '¡Contraseña actualizada!',
        message: 'Tu contraseña se ha cambiado correctamente.',
      });
    } catch (err: unknown) {
      setAlertModal({
        type: 'error',
        title: 'Error al cambiar contraseña',
        message: extractErrorMessage(err, 'No se pudo cambiar la contraseña.'),
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError(null);

    if (isGoogleAccount) {
      if (deleteConfirmation.trim().toUpperCase() !== 'ELIMINAR') {
        setDeleteError('Escribe exactamente "ELIMINAR" para confirmar');
        return;
      }
    } else {
      if (!deletePassword.trim()) {
        setDeleteError('Ingresa tu contraseña actual');
        return;
      }
    }

    setIsDeletingAccount(true);

    try {
      await deleteAccount(
        isGoogleAccount
          ? { confirmation: deleteConfirmation.trim() }
          : { password: deletePassword },
      );
      setIsDeleteModalVisible(false);
      await signOut();
    } catch (err: unknown) {
      const msg = extractErrorMessage(
        err,
        'No se pudo eliminar la cuenta. Inténtalo más tarde.',
      );
      setDeleteError(msg);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#E8E4F0', '#F4F2F7', '#F8FAFC']}
        locations={[0, 0.5, 1]}
        className="absolute inset-0"
      />
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-10"
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader
            title="Configuración"
            subtitle="Seguridad, notificaciones y preferencias"
            onBack={() => router.back()}
            actionIcon="gear"
          />

          {/* ─── SECCIÓN: SEGURIDAD ─── */}
          <View className="mx-5 mt-4">
            <View className="mb-2 flex-row items-center gap-2 px-1">
              <FontAwesome6 name="shield-halved" size={14} color="#64748B" />
              <Text className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Seguridad y Acceso
              </Text>
            </View>

            <View className="rounded-2xl bg-white p-4 shadow-sm">
              {isGoogleAccount ? (
                <View className="flex-row items-center gap-3 py-1">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-[#EA4335]/10">
                    <FontAwesome6 name="google" size={18} color="#EA4335" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-[#0F172A]">
                      Cuenta de Google
                    </Text>
                    <Text className="mt-0.5 text-xs text-[#64748B]">
                      Inicias sesión con Google SSO. Tu cuenta está protegida
                      por tu proveedor.
                    </Text>
                  </View>
                </View>
              ) : (
                <View className="gap-4">
                  <View className="flex-row items-center gap-3">
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-[#10B98126]">
                      <FontAwesome6 name="lock" size={16} color="#10B981" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-[#0F172A]">
                        Cambiar contraseña
                      </Text>
                      <Text className="text-xs text-[#64748B]">
                        Actualiza la clave con la que inicias sesión
                      </Text>
                    </View>
                  </View>

                  <View className="gap-3 pt-2">
                    <Input
                      label="Contraseña actual"
                      value={currentPassword}
                      onChangeText={(t) => {
                        setCurrentPassword(t);
                        if (passwordErrors.currentPassword) {
                          setPasswordErrors((p) => ({
                            ...p,
                            currentPassword: undefined,
                          }));
                        }
                      }}
                      placeholder="Ingresa tu contraseña actual"
                      iconLeft="lock"
                      secureTextEntry
                      error={passwordErrors.currentPassword}
                    />
                    <Input
                      label="Nueva contraseña"
                      value={newPassword}
                      onChangeText={(t) => {
                        setNewPassword(t);
                        if (passwordErrors.newPassword) {
                          setPasswordErrors((p) => ({
                            ...p,
                            newPassword: undefined,
                          }));
                        }
                      }}
                      placeholder="Mínimo 6 caracteres"
                      iconLeft="lock"
                      secureTextEntry
                      error={passwordErrors.newPassword}
                    />
                    <Input
                      label="Confirmar nueva contraseña"
                      value={confirmPassword}
                      onChangeText={(t) => {
                        setConfirmPassword(t);
                        if (passwordErrors.confirmPassword) {
                          setPasswordErrors((p) => ({
                            ...p,
                            confirmPassword: undefined,
                          }));
                        }
                      }}
                      placeholder="Repite la nueva contraseña"
                      iconLeft="lock"
                      secureTextEntry
                      error={passwordErrors.confirmPassword}
                    />

                    <Button
                      text="Actualizar contraseña"
                      iconLeft="lock"
                      variant="primary"
                      onPress={handleChangePassword}
                      isLoading={isChangingPassword}
                      loadingText="Guardando..."
                      className="mt-2"
                    />
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* ─── SECCIÓN: NOTIFICACIONES ─── */}
          <View className="mx-5 mt-6">
            <View className="mb-2 flex-row items-center gap-2 px-1">
              <FontAwesome6 name="bell" size={14} color="#64748B" />
              <Text className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Notificaciones
              </Text>
            </View>

            <View className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {notificationOptions.map((option, index) => (
                <View
                  key={option.key}
                  className={`flex-row items-center justify-between px-4 py-3.5 ${
                    index < notificationOptions.length - 1
                      ? 'border-b border-[#F1F5F9]'
                      : ''
                  }`}
                >
                  <View className="flex-1 flex-row items-center gap-3.5 pr-2">
                    <View className="h-9 w-9 items-center justify-center rounded-full bg-[#10B98126]">
                      <FontAwesome6
                        name={option.icon as any}
                        size={15}
                        color="#10B981"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-[#0F172A]">
                        {option.label}
                      </Text>
                      <Text className="text-xs text-[#64748B]">
                        {option.description}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={notifications[option.key]}
                    onValueChange={() => toggleNotification(option.key)}
                    trackColor={{ false: '#E2E8F0', true: '#10B98180' }}
                    thumbColor={
                      notifications[option.key] ? '#10B981' : '#CBD5E1'
                    }
                  />
                </View>
              ))}
            </View>
          </View>

          {/* ─── SECCIÓN: PREFERENCIAS ─── */}
          <View className="mx-5 mt-6">
            <View className="mb-2 flex-row items-center gap-2 px-1">
              <FontAwesome6 name="sliders" size={14} color="#64748B" />
              <Text className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Preferencias de la aplicación
              </Text>
            </View>

            <View className="rounded-2xl bg-white p-4 shadow-sm">
              <Text className="mb-1 text-sm font-semibold text-[#0F172A]">
                Moneda preferida
              </Text>
              <Text className="mb-3 text-xs text-[#64748B]">
                Selecciona la divisa para visualizar tus balances y
                transacciones
              </Text>
              <View className="flex-row gap-2">
                {currencies.map((curr) => {
                  const isSelected = selectedCurrency === curr.code;
                  return (
                    <Pressable
                      key={curr.code}
                      onPress={() => setSelectedCurrency(curr.code)}
                      className={`flex-1 items-center justify-center rounded-xl border px-2 py-2.5 ${
                        isSelected
                          ? 'border-[#10B981] bg-[#10B981]/10'
                          : 'border-[#E2E8F0] bg-[#F8FAFC]'
                      }`}
                    >
                      <Text
                        className={`text-sm font-bold ${
                          isSelected ? 'text-[#10B981]' : 'text-[#334155]'
                        }`}
                      >
                        {curr.code} ({curr.symbol})
                      </Text>
                      <Text
                        className="mt-0.5 text-center text-[10px] text-[#64748B]"
                        numberOfLines={1}
                      >
                        {curr.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          {/* ─── SECCIÓN: ZONA DE PELIGRO ─── */}
          <View className="mx-5 mt-6">
            <View className="mb-2 flex-row items-center gap-2 px-1">
              <FontAwesome6
                name="triangle-exclamation"
                size={14}
                color="#EF4444"
              />
              <Text className="text-xs font-bold uppercase tracking-wider text-[#EF4444]">
                Zona de Peligro
              </Text>
            </View>

            <View className="rounded-2xl border border-[#FCA5A5]/40 bg-[#FEF2F2]/60 p-4 shadow-sm">
              <Text className="text-base font-semibold text-[#991B1B]">
                Eliminar mi cuenta
              </Text>
              <Text className="mt-1 text-xs leading-4 text-[#7F1D1D]">
                Esta acción es definitiva. Tus datos de acceso serán eliminados
                y tu perfil será anonimizado manteniendo el historial financiero
                en tus grupos.
              </Text>

              <Pressable
                onPress={() => {
                  setDeleteConfirmation('');
                  setDeletePassword('');
                  setDeleteError(null);
                  setIsDeleteModalVisible(true);
                }}
                className="mt-3 flex-row items-center justify-center gap-2 rounded-xl bg-[#EF4444] px-4 py-3 active:bg-[#DC2626]"
              >
                <FontAwesome6 name="trash-can" size={15} color="#FFFFFF" />
                <Text className="text-sm font-semibold text-white">
                  Eliminar mi cuenta
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        {/* ─── MODAL DE CONFIRMACIÓN DE ELIMINACIÓN ─── */}
        <Modal
          visible={isDeleteModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => {
            if (!isDeletingAccount) setIsDeleteModalVisible(false);
          }}
        >
          <View className="flex-1 items-center justify-center bg-black/60 px-5">
            <View className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <View className="mb-4 h-12 w-12 items-center justify-center self-center rounded-full bg-[#FEE2E2]">
                <FontAwesome6
                  name="triangle-exclamation"
                  size={22}
                  color="#EF4444"
                />
              </View>

              <Text className="text-center text-lg font-bold text-[#0F172A]">
                ¿Estás completamente seguro?
              </Text>

              <Text className="mt-2 text-center text-xs leading-4 text-[#64748B]">
                Al confirmar, se cerrará tu sesión de inmediato y se anonimizará
                tu cuenta. Tu historial de gastos y pagos en los grupos
                permanecerá registrado bajo el nombre{' '}
                <Text className="font-bold text-[#0F172A]">
                  &quot;Usuario Eliminado&quot;
                </Text>
                .
              </Text>

              <View className="mt-5">
                {isGoogleAccount ? (
                  <View>
                    <Text className="mb-1 text-xs font-semibold text-[#334155]">
                      Para continuar, escribe{' '}
                      <Text className="font-bold text-[#EF4444]">ELIMINAR</Text>
                      :
                    </Text>
                    <Input
                      value={deleteConfirmation}
                      onChangeText={(t) => {
                        setDeleteConfirmation(t);
                        if (deleteError) setDeleteError(null);
                      }}
                      placeholder="ELIMINAR"
                      autoCapitalize="characters"
                      iconLeft="triangle-exclamation"
                    />
                  </View>
                ) : (
                  <View>
                    <Text className="mb-1 text-xs font-semibold text-[#334155]">
                      Ingresa tu contraseña actual para confirmar:
                    </Text>
                    <Input
                      value={deletePassword}
                      onChangeText={(t) => {
                        setDeletePassword(t);
                        if (deleteError) setDeleteError(null);
                      }}
                      placeholder="Tu contraseña"
                      secureTextEntry
                      iconLeft="lock"
                    />
                  </View>
                )}

                {deleteError && (
                  <View className="mt-2 rounded-lg bg-[#FEF2F2] p-2.5">
                    <Text className="text-center text-xs font-medium text-[#EF4444]">
                      {deleteError}
                    </Text>
                  </View>
                )}
              </View>

              <View className="mt-6 flex-row gap-3">
                <Pressable
                  onPress={() => setIsDeleteModalVisible(false)}
                  disabled={isDeletingAccount}
                  className="flex-1 items-center justify-center rounded-xl border border-[#CBD5E1] bg-white py-3 active:bg-[#F8FAFC]"
                >
                  <Text className="text-sm font-semibold text-[#64748B]">
                    Cancelar
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleDeleteAccount}
                  disabled={isDeletingAccount}
                  className={`flex-1 items-center justify-center rounded-xl py-3 ${
                    isDeletingAccount
                      ? 'bg-[#EF4444]/60'
                      : 'bg-[#EF4444] active:bg-[#DC2626]'
                  }`}
                >
                  <Text className="text-sm font-semibold text-white">
                    {isDeletingAccount ? 'Eliminando...' : 'Sí, eliminar'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* ─── MODAL GLOBAL DE ALERTAS ─── */}
        {alertModal && (
          <AlertModal
            visible
            type={alertModal.type}
            title={alertModal.title}
            message={alertModal.message}
            onClose={() => setAlertModal(null)}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
