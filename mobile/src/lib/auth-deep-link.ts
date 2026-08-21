import { supabase } from '@/lib/supabase';

/**
 * Supabase recovery emails link to a URL that ultimately redirects back into
 * the app with `access_token`/`refresh_token`/`type=recovery` in either the
 * query string or the `#` fragment, depending on the auth flow. Expo Linking
 * doesn't parse fragments for us, so this does it by hand.
 */
export async function applyRecoverySessionFromUrl(url: string): Promise<boolean> {
  const [, afterHash] = url.split('#');
  const [, afterQuery] = url.split('?');
  const raw = afterHash ?? afterQuery?.split('#')[0] ?? '';
  const params = new URLSearchParams(raw);

  const type = params.get('type');
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  if (type !== 'recovery' || !accessToken || !refreshToken) return false;

  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return !error;
}
