import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenHeader } from '@/components/ui/screen-header';
import { router } from 'expo-router';
import { SeoHead } from '@/components/common/seo-head';

export default function PrivacidadScreen() {
  return (
    <View className="flex-1">
      <SeoHead
        title="Política de Privacidad — DuoBalance"
        description="Conoce cómo protegemos y manejamos tus datos en DuoBalance."
      />
      <LinearGradient
        colors={['#E8E4F0', '#F4F2F7', '#F8FAFC']}
        locations={[0, 0.5, 1]}
        className="absolute inset-0"
      />
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScreenHeader
          title="Política de Privacidad"
          subtitle="Última actualización: Septiembre 2026"
          onBack={() => router.back()}
          actionIcon="shield-check"
        />

        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-10 px-5 pt-4"
          showsVerticalScrollIndicator={false}
        >
          <View className="rounded-2xl bg-white p-5 shadow-sm">
            
            <Text className="text-base font-bold text-[#0F172A] mb-2">
              1. Información que recopilamos
            </Text>
            <Text className="text-sm leading-6 text-[#64748B] mb-5">
              Al registrarte en DuoBalance, recopilamos información básica como tu nombre, apellido y dirección de correo electrónico. También recopilamos los datos que ingresas al usar la plataforma: creación de grupos, registro de gastos, montos y liquidaciones.
            </Text>

            <Text className="text-base font-bold text-[#0F172A] mb-2">
              2. Uso de la Información
            </Text>
            <Text className="text-sm leading-6 text-[#64748B] mb-5">
              Los datos recopilados se utilizan <Text className="font-bold text-[#0F172A]">exclusivamente</Text> para proveer la funcionalidad principal de la aplicación: mantener tus balances financieros, generar reportes y facilitar la colaboración con otros miembros de tus grupos.
            </Text>

            <Text className="text-base font-bold text-[#0F172A] mb-2">
              3. Protección de Datos y Terceros
            </Text>
            <Text className="text-sm leading-6 text-[#64748B] mb-5">
              No compartimos, vendemos ni alquilamos tus datos personales ni tus registros financieros a terceros. Toda tu información es procesada y almacenada de manera segura, utilizando cifrado para contraseñas y tokens seguros para el inicio de sesión.
            </Text>

            <Text className="text-base font-bold text-[#0F172A] mb-2">
              4. Eliminación de Datos (Derecho al Olvido)
            </Text>
            <Text className="text-sm leading-6 text-[#64748B] mb-5">
              Tienes el derecho de eliminar tu cuenta en cualquier momento desde los ajustes de tu perfil. Al confirmar la eliminación, tu correo y contraseña serán borrados permanentemente. Para no romper el historial de gastos compartidos en grupos donde participabas, tu usuario pasará a llamarse "Usuario Eliminado" conservando así las métricas financieras sin estar ligado a tu identidad.
            </Text>

            <Text className="text-base font-bold text-[#0F172A] mb-2">
              5. Enlaces Externos
            </Text>
            <Text className="text-sm leading-6 text-[#64748B] mb-5">
              DuoBalance puede contener enlaces a otros sitios (por ejemplo, para invitaciones por WhatsApp). No somos responsables del contenido o las prácticas de privacidad de dichos sitios.
            </Text>

            <Text className="text-base font-bold text-[#0F172A] mb-2">
              6. Contáctanos
            </Text>
            <Text className="text-sm leading-6 text-[#64748B]">
              Si tienes preguntas o inquietudes sobre esta Política de Privacidad o el manejo de tus datos, puedes ponerte en contacto con el administrador del sistema.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
