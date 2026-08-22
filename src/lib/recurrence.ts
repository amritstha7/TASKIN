import { Task } from '../types';

/**
 * Whether `task` is due (should render/count) on `dateStr` (YYYY-MM-DD).
 * A one-off task (repeat = 'none') is due only on its exact dueDate. A
 * recurring task is due on every matching date from dueDate onward:
 * daily = every day, weekly = same weekday, monthly = same day-of-month
 * (months that don't have that day number simply have no occurrence that
 * month, e.g. a due date of the 31st skips February/April/etc.).
 */
export function isTaskDueOnDate(task: Task, dateStr: string): boolean {
  if (task.dueDate > dateStr) return false;
  if (!task.repeat || task.repeat === 'none') return task.dueDate === dateStr;

  const due = new Date(`${task.dueDate}T00:00:00`);
  const target = new Date(`${dateStr}T00:00:00`);

  switch (task.repeat) {
    case 'daily':
      return true;
    case 'weekly':
      return due.getDay() === target.getDay();
    case 'monthly':
      return due.getDate() === target.getDate();
    default:
      return false;
  }
}

/** Whether `task` is completed specifically for the occurrence on `dateStr`. */
export function isTaskCompletedOnDate(task: Task, dateStr: string): boolean {
  if (!task.repeat || task.repeat === 'none') return task.completed;
  return (task.completedDates ?? []).includes(dateStr);
}

/** All tasks (one-off or recurring) due on `dateStr`, for a given date's task list. */
export function tasksDueOnDate(tasks: Task[], dateStr: string): Task[] {
  return tasks.filter((task) => isTaskDueOnDate(task, dateStr));
}
