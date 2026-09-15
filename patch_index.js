const fs = require('fs');
const file = '/home/SenaFactory/Documentos/MyProjects/Doubalance/DuoBalance-app/src/app/(protected)/index.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Imports
code = code.replace(
  "import { FloatingAddButton } from '@/components/dashboard/FloatingAddButton';",
  `import { DashboardActionMenu } from '@/components/dashboard/dashboard-action-menu';
import { CreateCoupleSheet } from '@/components/couple/create-couple-sheet';
import { JoinGroupSheet } from '@/components/couple/join-group-sheet';
import { DestinationSelector } from '@/components/movements/destination-selector';
import { CreateExpenseSheet } from '@/components/movements/create-expense-sheet';
import { createExpense, uploadExpenseReceipt } from '@/services/api/expenses';
import { joinGroup } from '@/services/api/groups';
import type { GroupResponse } from '@/types/api';`
);

// 2. States and Handlers
const statesToInject = `
  const [showCreateGroupSheet, setShowCreateGroupSheet] = useState(false);
  const [showJoinSheet, setShowJoinSheet] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [destSelectorVisible, setDestSelectorVisible] = useState(false);
  const [creatingExpenseGroup, setCreatingExpenseGroup] = useState<{
    group: GroupResponse;
    members: { id: string; name: string }[];
  } | null>(null);

  const handleCreateExpense = useCallback(() => {
    if (workspace.groupId) {
      const group = groups.find((g) => g.id === workspace.groupId);
      if (!group) {
        setWorkspace({ category: workspace.category, groupId: null });
        setDestSelectorVisible(true);
        return;
      }
      const members = group.members.map((m) => ({
        id: m.user.id,
        name: m.user.id === user?.id ? 'Tú' : m.user.firstName,
      }));
      setCreatingExpenseGroup({ group, members });
    } else {
      setDestSelectorVisible(true);
    }
  }, [workspace, groups, user?.id]);

  const handleDestSelect = useCallback((group: GroupResponse) => {
    setDestSelectorVisible(false);
    const members = group.members.map((m) => ({
      id: m.user.id,
      name: m.user.id === user?.id ? 'Tú' : m.user.firstName,
    }));
    setCreatingExpenseGroup({ group, members });
  }, [user?.id]);

  const handleJoinGroup = useCallback(async (code: string) => {
    setIsJoining(true);
    try {
      await joinGroup({ inviteCode: code });
      setShowJoinSheet(false);
      refetch();
      Toast.show({ type: 'success', text1: '¡Te has unido!', text2: 'Ahora formas parte del grupo.' });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Error al unirse', text2: err.message || 'Intenta de nuevo' });
    } finally {
      setIsJoining(false);
    }
  }, [refetch]);

  const handleCloseCreateSheet = useCallback(() => {
    setCreatingExpenseGroup(null);
  }, []);
`;

code = code.replace(
  "const showGroup =\n    workspace.category === 'all' || workspace.category === 'group';",
  `const showGroup =\n    workspace.category === 'all' || workspace.category === 'group';\n${statesToInject}`
);

// 3. Components
const jsxToInject = `
      <DashboardActionMenu 
        onCreateExpense={handleCreateExpense}
        onCreateGroup={() => setShowCreateGroupSheet(true)}
        onJoinGroup={() => setShowJoinSheet(true)}
      />

      <CreateCoupleSheet
        visible={showCreateGroupSheet}
        onClose={() => setShowCreateGroupSheet(false)}
        heightRatio={0.65}
        headerFinalTranslateY={0.17}
      />

      <JoinGroupSheet
        visible={showJoinSheet}
        onClose={() => {
          if (!isJoining) setShowJoinSheet(false);
        }}
        onJoin={handleJoinGroup}
        isLoading={isJoining}
        heightRatio={0.7}
        headerFinalTranslateY={0.1}
      />

      <DestinationSelector
        visible={destSelectorVisible}
        onClose={() => setDestSelectorVisible(false)}
        filter={workspace}
        personalGroups={personalGroups}
        coupleGroups={coupleGroups}
        sharedGroups={sharedGroups}
        onSelect={handleDestSelect}
        heightRatio={0.35}
        headerFinalTranslateY={0.45}
      />

      {creatingExpenseGroup && (
        <CreateExpenseSheet
          visible={!!creatingExpenseGroup}
          onClose={handleCloseCreateSheet}
          group={creatingExpenseGroup.group}
          members={creatingExpenseGroup.members}
          currentUserId={user?.id}
          heightRatio={0.66}
          headerFinalTranslateY={0.14}
          onCreateExpense={async (payload) => {
            try {
              const { receipt, ...expenseData } = payload;
              const created = await createExpense(expenseData);
              if (receipt) {
                try {
                  await uploadExpenseReceipt(created.id, receipt);
                } catch (receiptError) {
                  Toast.show({
                    type: 'warning',
                    text1: 'Gasto registrado',
                    text2: 'El gasto se guardó, pero no se pudo subir el comprobante.',
                  });
                  handleCloseCreateSheet();
                  refetch();
                  return;
                }
              }
              handleCloseCreateSheet();
              refetch();
              Toast.show({
                type: 'success',
                text1: 'Gasto registrado',
                text2: \`\${payload.description} · $\${payload.amount.toLocaleString('es-CL')}\`,
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'No se pudo registrar el gasto',
                text2: 'Revisa tu conexión e intenta de nuevo.',
              });
            }
          }}
        />
      )}
`;

code = code.replace(
  "<FloatingAddButton />",
  jsxToInject
);

fs.writeFileSync(file, code);
console.log('index.tsx patched successfully');
