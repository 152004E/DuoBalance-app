import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenHeader } from '@/components/ui/screen-header';
import { router } from 'expo-router';
import { SeoHead } from '@/components/common/seo-head';

export default function TerminosScreen() {
  return (
    <View className="flex-1">
      <SeoHead
        title="Términos y Condiciones — DuoBalance"
        description="Lee nuestros términos y condiciones de uso."
      />
      <LinearGradient
        colors={['#E8E4F0', '#F4F2F7', '#F8FAFC']}
        locations={[0, 0.5, 1]}
        className="absolute inset-0"
      />
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScreenHeader
          title="Términos y Condiciones"
          subtitle="Última actualización: Septiembre 2026"
          onBack={() => router.back()}
          actionIcon="file-contract"
        />

        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-10 px-5 pt-4"
          showsVerticalScrollIndicator={false}
        >
          <View className="rounded-2xl bg-white p-5 shadow-sm">
            
            <Text className="text-base font-bold text-[#0F172A] mb-2">
              1. Aceptación de los Términos
            </Text>
            <Text className="text-sm leading-6 text-[#64748B] mb-5">
              Al crear una cuenta y utilizar DuoBalance, aceptas estos Términos y Condiciones en su totalidad. Si no estás de acuerdo con alguna de las partes, te pedimos que no utilices la plataforma.
            </Text>

            <Text className="text-base font-bold text-[#0F172A] mb-2">
              2. Naturaleza del Servicio
            </Text>
            <Text className="text-sm leading-6 text-[#64748B] mb-5">
              DuoBalance es una herramienta organizativa y de carácter informativo diseñada para ayudar a individuos, parejas y grupos a registrar y dividir gastos. {'\n\n'}
              <Text className="font-bold text-[#0F172A]">No somos un banco ni una entidad financiera.</Text> DuoBalance no procesa pagos con dinero real, transferencias bancarias ni funciona como intermediario de pagos.
            </Text>

            <Text className="text-base font-bold text-[#0F172A] mb-2">
              3. Responsabilidad del Usuario
            </Text>
            <Text className="text-sm leading-6 text-[#64748B] mb-5">
              Toda la información financiera (gastos, montos, deudas) es registrada manualmente por los usuarios. Eres responsable de la veracidad y exactitud de los datos que ingreses. DuoBalance no se hace responsable por disputas, desacuerdos financieros o deudas impagas entre los miembros de un grupo o pareja.
            </Text>

            <Text className="text-base font-bold text-[#0F172A] mb-2">
              4. Propiedad de la Cuenta
            </Text>
            <Text className="text-sm leading-6 text-[#64748B] mb-5">
              Tu cuenta es personal. Por razones de seguridad, nuestra plataforma aplica una regla de "Sesión Única Estricta", lo que significa que solo podrás mantener iniciada tu cuenta en un dispositivo a la vez. Eres responsable de mantener la confidencialidad de tu contraseña.
            </Text>

            <Text className="text-base font-bold text-[#0F172A] mb-2">
              5. Suspensión y Eliminación
            </Text>
            <Text className="text-sm leading-6 text-[#64748B] mb-5">
              Nos reservamos el derecho de suspender o eliminar tu cuenta si detectamos un uso indebido de la plataforma, ataques cibernéticos, intentos de fraude, o violaciones a estos términos. {'\n\n'}
              Puedes eliminar tu cuenta en cualquier momento. Al hacerlo, tus datos de acceso serán borrados permanentemente y tu nombre será anonimizado ("Usuario Eliminado") para mantener la integridad de los gastos en los grupos en los que participaste.
            </Text>

            <Text className="text-base font-bold text-[#0F172A] mb-2">
              6. Modificaciones a los Términos
            </Text>
            <Text className="text-sm leading-6 text-[#64748B]">
              DuoBalance se reserva el derecho de actualizar estos términos en cualquier momento. Los cambios entrarán en vigencia desde el momento de su publicación en la aplicación.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
