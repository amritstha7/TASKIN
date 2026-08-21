import { Redirect } from 'expo-router';

// The tab bar intercepts presses on this tab (see (tabs)/_layout.tsx) and
// pushes /modals/add-task instead, so this screen is never actually shown —
// it only exists as a fallback for direct deep links to this route.
export default function AddTaskTabFallback() {
  return <Redirect href="/modals/add-task" />;
}
