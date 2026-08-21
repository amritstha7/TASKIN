import { ArrowDownUp, Mail } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CommunicationCard } from '@/components/CommunicationCard';
import { GradientBanner } from '@/components/GradientBanner';
import { BreadcrumbHeader } from '@/components/ui/BreadcrumbHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { useCommunications } from '@/hooks/use-communications';
import { colors } from '@/theme/colors';
import { useToast } from '@/providers/toast-provider';

type Filter = 'all' | 'pending' | 'completed';

export default function CommunicationsScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { communications, isRefetching, refetch, toggleComplete, addNote, deleteCommunication } = useCommunications();
  const [filter, setFilter] = useState<Filter>('all');
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    let list = communications;
    if (filter === 'pending') list = list.filter((c) => !c.is_completed);
    if (filter === 'completed') list = list.filter((c) => c.is_completed);
    return [...list].sort((a, b) => (sortAsc ? a.due_date.localeCompare(b.due_date) : b.due_date.localeCompare(a.due_date)));
  }, [communications, filter, sortAsc]);

  return (
    <Screen>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CommunicationCard
            communication={item}
            onToggleComplete={async (comm) => {
              const willComplete = !comm.is_completed;
              await toggleComplete(comm);
              showToast(willComplete ? 'Communication acknowledged!' : 'Marked as pending', willComplete ? 'success' : 'info');
            }}
            onAddNote={async (comm, body) => {
              await addNote({ communicationId: comm.id, body });
              showToast('Note added to communication');
            }}
            onDelete={async (comm) => {
              await deleteCommunication(comm.id);
              showToast('Communication removed', 'info');
            }}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-3" />}
        contentContainerClassName="p-4"
        ListHeaderComponent={
          <View style={{ paddingTop: insets.top + 8 }} className="gap-4 pb-4">
            <BreadcrumbHeader
              right={
                <Pressable
                  onPress={() => setSortAsc((v) => !v)}
                  className="flex-row items-center gap-1 rounded-xl border border-[#e5e5ea] bg-white px-3 py-1.5 shadow-sm dark:border-[#35383c] dark:bg-surface-dark"
                >
                  <ArrowDownUp size={16} color={colors.ink} />
                  <Text className="text-xs font-bold text-ink dark:text-ink-dark">{sortAsc ? 'Asc' : 'Desc'}</Text>
                </Pressable>
              }
            />
            <GradientBanner
              icon={Mail}
              title="Communications"
              count={communications.length}
              description="Headquarters directives, compliance briefs, and store operation memos"
              gradientColors={[colors.brand, colors.brandDark]}
              countTextColor={colors.brand}
              shadowColor={colors.brand}
            />
            <SegmentedTabs
              options={[
                { key: 'all', label: `All (${communications.length})` },
                { key: 'pending', label: `Pending (${communications.filter((c) => !c.is_completed).length})` },
                { key: 'completed', label: `Completed (${communications.filter((c) => c.is_completed).length})` },
              ]}
              value={filter}
              onChange={setFilter}
            />
          </View>
        }
        ListEmptyComponent={<EmptyState icon={Mail} title="No communications found" description="All memos and official briefings have been acknowledged." />}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#FF5500" />}
      />
    </Screen>
  );
}
