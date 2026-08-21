import { useFeedback } from '@/hooks/use-feedback';
import { useTasks } from '@/hooks/use-tasks';
import { useSettings } from '@/providers/settings-provider';
import { useToast } from '@/providers/toast-provider';
import type { PhotoUI, TaskUI } from '@/types/app';

/** Shared toggle/delete/snooze/note/photo handlers + toast + chime feedback, reused by every task-list screen. */
export function useTaskCardActions() {
  const { toggleComplete, deleteTask, snoozeTask, addNote, removePhoto } = useTasks();
  const { showToast } = useToast();
  const { celebrate } = useFeedback();
  const { t } = useSettings();

  const onToggleComplete = async (task: TaskUI) => {
    const willComplete = !task.completed;
    await toggleComplete(task);
    if (willComplete) {
      celebrate();
      showToast(t.toastTaskCompleted);
    } else {
      showToast(t.toastTaskReopened, 'info');
    }
  };

  const onDelete = async (task: TaskUI) => {
    await deleteTask(task.id);
    showToast('Task removed', 'info');
  };

  const onSnooze = async (task: TaskUI) => {
    await snoozeTask({ taskId: task.id, hours: 2 });
    showToast(t.snoozedFor2Hours, 'info');
  };

  const onAddNote = async (task: TaskUI, body: string) => {
    await addNote({ taskId: task.id, body });
    showToast('Note added to task!');
  };

  const onRemovePhoto = async (task: TaskUI, photo: PhotoUI) => {
    await removePhoto(photo);
    showToast('Photo removed', 'info');
  };

  return { onToggleComplete, onDelete, onSnooze, onAddNote, onRemovePhoto };
}
