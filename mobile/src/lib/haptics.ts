import * as Haptics from 'expo-haptics';

export const haptics = {
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
};
