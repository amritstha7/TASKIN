import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { CalendarDays, CheckSquare, Plus, X } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { TextField } from '@/components/ui/TextField';
import { useTasks } from '@/hooks/use-tasks';
import { colors } from '@/theme/colors';
import { useToast } from '@/providers/toast-provider';
import type { NotificationTiming, Priority, RepeatCadence } from '@/types/database';

const CATEGORIES = [
  'Protein Bar',
  'RTD Nepal',
  'Gym Reading',
  'AI Shelf Forecast',
  'Excel / POS Audit',
  'Learning New Activity',
  'Inventory',
  'Merchandising',
  'Compliance & Safety',
];

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];
const REPEAT_OPTIONS: { value: RepeatCadence; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];
const TIMING_OPTIONS: { value: NotificationTiming; label: string }[] = [
  { value: '15m', label: '15 mins before' },
  { value: '30m', label: '30 mins before' },
  { value: '1h', label: '1 hour before' },
  { value: '1d', label: '1 day before' },
];

function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function AddTaskModal() {
  const router = useRouter();
  const { showToast } = useToast();
  const { createTask } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [usingCustomCategory, setUsingCustomCategory] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState<Priority>('medium');
  const [repeat, setRepeat] = useState<RepeatCadence>('none');
  const [isUrgent, setIsUrgent] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [timing, setTiming] = useState<NotificationTiming>('15m');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const categoryOptions = [...CATEGORIES.map((c) => ({ value: c, label: c })), { value: '__custom__', label: 'Custom...' }];
  const selectedCategoryValue = usingCustomCategory ? '__custom__' : category;

  const handleSubmit = async () => {
    const finalCategory = usingCustomCategory ? customCategory.trim() : category;
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (usingCustomCategory && !finalCategory) {
      setError('Type a custom category name.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        category: finalCategory,
        due_date: toIso(dueDate),
        priority: isUrgent ? 'urgent' : priority,
        repeat,
        is_urgent: isUrgent,
        notifications_enabled: notificationsEnabled,
        notifications_timing: timing,
      });
      showToast('New task created successfully!');
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-surface dark:bg-surface-dark">
      <View className="flex-row items-center justify-between border-b border-[#e5e5ea] px-4 py-4 dark:border-[#35383c]">
        <View className="flex-1 flex-row items-center gap-2.5">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0EB] dark:bg-[#35383c]">
            <CheckSquare size={22} color={colors.brand} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-black tracking-tight text-ink dark:text-ink-dark">Add Task</Text>
            <Text className="text-xs text-[#8E8E93] dark:text-[#8e9095]">Assign immediate or recurring store operational directive</Text>
          </View>
        </View>
        <Pressable onPress={() => router.back()} hitSlop={8} className="h-9 w-9 items-center justify-center rounded-xl bg-[#F7F7F8] dark:bg-[#26282b]">
          <X size={18} color={colors.neutralTextLight} />
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="gap-4 p-4 pb-10" keyboardShouldPersistTaps="handled">
        <TextField label="Task Title *" value={title} onChangeText={setTitle} placeholder="Enter task title" />
        <TextField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter task details..."
          multiline
          numberOfLines={4}
          className="min-h-24"
          textAlignVertical="top"
        />

        <Select
          label="Category"
          value={selectedCategoryValue}
          options={categoryOptions}
          onChange={(v) => {
            if (v === '__custom__') setUsingCustomCategory(true);
            else {
              setUsingCustomCategory(false);
              setCategory(v);
            }
          }}
        />
        {usingCustomCategory ? (
          <TextInput
            value={customCategory}
            onChangeText={setCustomCategory}
            placeholder="Type custom category name..."
            placeholderTextColor="#9a9a9e"
            className="-mt-2 rounded-xl border border-[#FFD8CC] bg-[#FFF9F6] px-3 py-2 text-xs text-ink dark:border-[#5d3f3c] dark:bg-[#25282c] dark:text-ink-dark"
          />
        ) : null}

        <View className="gap-1.5">
          <Text className="text-xs font-bold text-ink dark:text-ink-dark">Due Date</Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            className="min-h-[44px] flex-row items-center gap-2 rounded-xl border border-[#e5e5ea] bg-white px-4 py-2.5 dark:border-[#5d3f3c] dark:bg-[#25282c]"
          >
            <CalendarDays size={16} color={colors.neutralTextLight} />
            <Text className="text-sm text-ink dark:text-ink-dark">{toIso(dueDate)}</Text>
          </Pressable>
          {showDatePicker ? (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={(_event, selected) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selected) setDueDate(selected);
              }}
            />
          ) : null}
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1">
            <Select label="Priority" value={priority} options={PRIORITY_OPTIONS} onChange={setPriority} />
          </View>
          <View className="flex-1">
            <Select label="Repeat" value={repeat} options={REPEAT_OPTIONS} onChange={setRepeat} />
          </View>
        </View>

        <View className="flex-row items-center gap-3 rounded-xl border border-[#e5e5ea] p-3.5 dark:border-[#35383c]">
          <View className="flex-1">
            <Text className="text-sm font-semibold text-ink dark:text-ink-dark">Flag this task for immediate attention</Text>
          </View>
          <Switch value={isUrgent} onValueChange={setIsUrgent} trackColor={{ true: colors.brand }} />
        </View>

        <View className="gap-3 rounded-xl border border-[#e5e5ea] p-3.5 dark:border-[#35383c]">
          <View className="flex-row items-center gap-3">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-ink dark:text-ink-dark">Notifications</Text>
              <Text className="text-xs text-[#8E8E93] dark:text-[#8e9095]">Get reminded before task is due.</Text>
            </View>
            <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} trackColor={{ true: colors.brand }} />
          </View>
          {notificationsEnabled ? (
            <Select label="Remind me" value={timing} options={TIMING_OPTIONS} onChange={setTiming} />
          ) : null}
        </View>

        {error ? (
          <View className="flex-row items-center gap-2 rounded-xl border border-[#FFD8CC] bg-[#FFF0EB] p-3">
            <Text className="text-xs font-bold text-brand">{error}</Text>
          </View>
        ) : null}

        <View className="flex-row gap-3 pt-2">
          <Button variant="secondary" onPress={() => router.back()} className="flex-1">
            Cancel
          </Button>
          <Button onPress={handleSubmit} loading={saving} icon={Plus} className="flex-1">
            Create Task
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
