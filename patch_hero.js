const fs = require('fs');
const file = '/home/SenaFactory/Documentos/MyProjects/Doubalance/DuoBalance-app/src/components/layout/HeroSection.tsx';
let code = fs.readFileSync(file, 'utf8');

// Add import
code = code.replace(
  "import { AnimatedWave } from './AnimatedWave';",
  `import { AnimatedWave } from './AnimatedWave';\nimport { NotificationBell } from '../notifications/NotificationBell';`
);

// Replace variant === 'dashboard' header
const dashboardOld = `
            <Animated.View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                opacity: dashAnim.greetingOpacity,
                transform: [{ translateY: dashAnim.greetingTranslateY }],
              }}
            >
              <Image
                source={require('@/assets/images/logo-white-green-bg-without.png')}
                style={{ width: 25, height: 25 }}
                resizeMode="contain"
              />
              <Text className="text-base text-white">
                Bienvenido,{' '}
                <Text className="font-semibold">
                  {userName
                    .split(' ')
                    .map(
                      (w) =>
                        w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
                    )
                    .join(' ')}
                </Text>
              </Text>
            </Animated.View>`;

const dashboardNew = `
            <Animated.View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                opacity: dashAnim.greetingOpacity,
                transform: [{ translateY: dashAnim.greetingTranslateY }],
              }}
            >
              <View className="flex-row items-center gap-2">
                <Image
                  source={require('@/assets/images/logo-white-green-bg-without.png')}
                  style={{ width: 25, height: 25 }}
                  resizeMode="contain"
                />
                <Text className="text-base text-white">
                  Bienvenido,{' '}
                  <Text className="font-semibold">
                    {userName
                      .split(' ')
                      .map(
                        (w) =>
                          w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
                      )
                      .join(' ')}
                  </Text>
                </Text>
              </View>
              <NotificationBell />
            </Animated.View>`;

// Replace variant === 'page' header
const pageOld = `
            <View className="flex-row items-center gap-2">
              <Image
                source={require('@/assets/images/logo-white-green-bg-without.png')}
                style={{ width: 25, height: 25 }}
                resizeMode="contain"
              />
              <Text className="text-base text-white">
                Bienvenido,{' '}
                <Text className="font-semibold">
                  {userName
                    .split(' ')
                    .map(
                      (w) =>
                        w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
                    )
                    .join(' ')}
                </Text>
              </Text>
            </View>`;

const pageNew = `
            <View className="flex-row items-center justify-between w-full">
              <View className="flex-row items-center gap-2">
                <Image
                  source={require('@/assets/images/logo-white-green-bg-without.png')}
                  style={{ width: 25, height: 25 }}
                  resizeMode="contain"
                />
                <Text className="text-base text-white">
                  Bienvenido,{' '}
                  <Text className="font-semibold">
                    {userName
                      .split(' ')
                      .map(
                        (w) =>
                          w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
                      )
                      .join(' ')}
                  </Text>
                </Text>
              </View>
              <NotificationBell />
            </View>`;

code = code.replace(dashboardOld, dashboardNew);
code = code.replace(pageOld, pageNew);

fs.writeFileSync(file, code);
console.log('HeroSection.tsx patched successfully');
