import { File, Paths } from 'expo-file-system';
import * as Print from 'expo-print';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { Download, FileJson, FileSpreadsheet, FileText, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { useCommunications } from '@/hooks/use-communications';
import { useTasks } from '@/hooks/use-tasks';
import { useTopPerformers } from '@/hooks/use-top-performers';
import { colors } from '@/theme/colors';

type Format = 'csv' | 'pdf' | 'json';

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export default function ExportReportModal() {
  const router = useRouter();
  const { tasks } = useTasks();
  const { communications } = useCommunications();
  const { topPerformers } = useTopPerformers();
  const [format, setFormat] = useState<Format>('csv');
  const [exporting, setExporting] = useState(false);

  const completedCount = tasks.filter((t) => t.completed).length;
  const efficiencyRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 1000) / 10 : 0;
  const topPerformer = topPerformers[0];

  const handleExport = async () => {
    setExporting(true);
    try {
      const exportedAt = new Date().toISOString();

      if (format === 'json') {
        const json = JSON.stringify({ tasks, communications, topPerformers, exportedAt }, null, 2);
        const file = new File(Paths.cache, `TASKN_Operations_Report_${exportedAt.slice(0, 10)}.json`);
        file.create();
        file.write(json);
        if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(file.uri, { mimeType: 'application/json' });
      } else if (format === 'csv') {
        const rows = [
          ['ID', 'Title', 'Category', 'DueDate', 'Priority', 'IsUrgent', 'Completed', 'CompletedBy'],
          ...tasks.map((task) => [task.id, task.title, task.category, task.due_date, task.priority, String(task.is_urgent), String(task.completed), task.completedByName ?? '']),
        ];
        const csv = rows.map((row) => row.map((cell) => escapeCsv(String(cell))).join(',')).join('\n');
        const file = new File(Paths.cache, `TASKN_Operations_Report_${exportedAt.slice(0, 10)}.csv`);
        file.create();
        file.write(csv);
        if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(file.uri, { mimeType: 'text/csv' });
      } else {
        const html = `
          <html><body style="font-family: -apple-system, sans-serif; padding: 24px;">
            <h1 style="color:#FF5500;">TASKN Operations Report</h1>
            <p>Exported ${new Date(exportedAt).toLocaleString()}</p>
            <h2>Tasks (${tasks.length})</h2>
            <table width="100%" cellpadding="6" style="border-collapse:collapse;">
              <tr style="background:#f2f2f2;"><th align="left">Title</th><th align="left">Category</th><th align="left">Priority</th><th align="left">Status</th><th align="left">Due</th></tr>
              ${tasks.map((task) => `<tr><td>${task.title}</td><td>${task.category}</td><td>${task.priority}</td><td>${task.completed ? 'Completed' : 'Pending'}</td><td>${task.due_date}</td></tr>`).join('')}
            </table>
            <h2>Communications (${communications.length})</h2>
            <table width="100%" cellpadding="6" style="border-collapse:collapse;">
              <tr style="background:#f2f2f2;"><th align="left">Title</th><th align="left">Status</th><th align="left">Due</th></tr>
              ${communications.map((comm) => `<tr><td>${comm.title}</td><td>${comm.is_completed ? 'Completed' : 'Pending'}</td><td>${comm.due_date}</td></tr>`).join('')}
            </table>
          </body></html>
        `;
        const { uri } = await Print.printToFileAsync({ html });
        if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
      }
      router.back();
    } finally {
      setExporting(false);
    }
  };

  const options: { key: Format; icon: typeof FileSpreadsheet; label: string }[] = [
    { key: 'csv', icon: FileSpreadsheet, label: 'CSV Sheet' },
    { key: 'pdf', icon: FileText, label: 'Print / PDF' },
    { key: 'json', icon: FileJson, label: 'JSON Data' },
  ];

  return (
    <View className="flex-1 justify-center bg-black/60 p-4">
      <View className="overflow-hidden rounded-2xl border border-[#FFD8CC] bg-white dark:border-[#5d3f3c] dark:bg-surface-dark">
        <View className="flex-row items-center justify-between border-b border-[#e5e5ea] bg-[#F7F7F8] p-4 dark:border-[#35383c] dark:bg-[#26282b]">
          <View className="flex-row items-center gap-2">
            <Download size={20} color={colors.brand} />
            <Text className="text-base font-black text-ink dark:text-ink-dark">Export Report</Text>
          </View>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <X size={20} color={colors.neutralTextLight} />
          </Pressable>
        </View>

        <View className="gap-4 p-5">
          <Text className="text-xs leading-relaxed text-[#8E8E93] dark:text-[#d8dade]">
            Generate an operational summary containing task completion rates, urgent compliance logs, and team rankings for your branch.
          </Text>

          <View className="gap-2">
            <Text className="text-xs font-bold text-ink dark:text-ink-dark">Choose Export Format:</Text>
            <View className="flex-row gap-2">
              {options.map((option) => {
                const active = format === option.key;
                return (
                  <Pressable
                    key={option.key}
                    onPress={() => setFormat(option.key)}
                    className={`flex-1 items-center rounded-xl border p-3 ${
                      active ? 'border-brand bg-[#FFF0EB]' : 'border-[#e5e5ea] dark:border-[#35383c]'
                    }`}
                  >
                    <option.icon size={22} color={active ? colors.brand : colors.neutralTextLight} />
                    <Text className={`mt-1 text-center text-[11px] font-bold ${active ? 'text-brand' : 'text-ink dark:text-ink-dark'}`}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="gap-1.5 rounded-xl border border-[#e5e5ea] bg-[#F7F7F8] p-3.5 dark:border-[#35383c] dark:bg-[#25282c]">
            <View className="flex-row justify-between">
              <Text className="text-xs text-[#8E8E93]">Total Tasks in Scope:</Text>
              <Text className="text-xs font-bold text-ink dark:text-ink-dark">{tasks.length}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-[#8E8E93]">Completion Rate:</Text>
              <Text className="text-xs font-bold" style={{ color: colors.success }}>
                {efficiencyRate}%
              </Text>
            </View>
            {topPerformer ? (
              <View className="flex-row justify-between">
                <Text className="text-xs text-[#8E8E93]">Team Top Performer:</Text>
                <Text className="text-xs font-bold text-ink dark:text-ink-dark">
                  {topPerformer.name} ({topPerformer.task_count} Tasks)
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <View className="flex-row justify-end gap-2 border-t border-[#e5e5ea] bg-[#F7F7F8] p-4 dark:border-[#35383c] dark:bg-[#26282b]">
          <Pressable onPress={() => router.back()} className="rounded-xl border border-[#e5e5ea] px-4 py-2 dark:border-[#5d3f3c]">
            <Text className="text-xs font-bold text-ink dark:text-ink-dark">Cancel</Text>
          </Pressable>
          <Button onPress={handleExport} loading={exporting} icon={Download} className="px-5 py-2">
            Export Now
          </Button>
        </View>
      </View>
    </View>
  );
}
