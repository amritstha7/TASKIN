import { useCallback } from 'react';

import { haptics } from '@/lib/haptics';
import { playChime } from '@/lib/sound';
import { useSettings } from '@/providers/settings-provider';

/** Gated by the user's Sound & Haptic Feedback setting, matching the original app's behavior. */
export function useFeedback() {
  const { profile } = useSettings();
  const enabled = profile?.sound_vibration ?? true;

  const celebrate = useCallback(() => {
    if (!enabled) return;
    playChime();
    void haptics.success();
  }, [enabled]);

  const tap = useCallback(() => {
    if (!enabled) return;
    void haptics.light();
  }, [enabled]);

  return { celebrate, tap, enabled };
}
