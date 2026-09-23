const fs = require('fs');
const file = '/home/SenaFactory/Documentos/MyProjects/Doubalance/DuoBalance-app/src/app/(protected)/grupos/[id].tsx';
let content = fs.readFileSync(file, 'utf8');

// Add import
const importStatement = `import { ContributionCard } from '@/components/dashboard/ContributionCard';\n`;
if (!content.includes('ContributionCard')) {
  content = content.replace(/(import .* from '@\/components\/dashboard\/PartnerBalance';\n)/, `$1${importStatement}`);
}

// Remove PartnerBalance import if we don't need it
// Actually I won't remove it just in case

const regex = /\{\/\* Distribución de Gastos - Progress Bar Card \(solo COUPLE y GROUP\) \*\/\}.*?(?=\{\/\* Gastos Recientes - List Card \*\/\})/s;

const replacement = `{/* Distribución de Gastos y Aportes Combinados */}
        {groupType !== 'PERSONAL' && (
          <View className="mt-4 px-5">
            <ContributionCard
              groupId={id}
              userName={memberSplit.userName}
              partnerName={memberSplit.partnerName}
              userAmount={memberSplit.userAmount}
              partnerAmount={memberSplit.partnerAmount}
              expectedUserPercent={userPercent}
              expectedPartnerPercent={partnerPercent}
            />
          </View>
        )}

        `;

content = content.replace(regex, replacement);

fs.writeFileSync(file, content);
