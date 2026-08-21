// Exact hex values pulled from the original web app (src/*.tsx, src/index.css).
// Kept as literal constants (not Tailwind theme tokens) so gradient stops can
// be passed straight into <LinearGradient> and one-off arbitrary-value
// className strings (`bg-[#FF5500]`) can match the web source byte-for-byte.

export const colors = {
  brand: '#FF5500',
  brandDark: '#E04800',
  brandAlt: '#FF6A00',
  brandAlt2: '#FF4500',

  brandDarkMode: '#fe6b00',
  brandDarkModeEnd: '#a04100',

  urgentFrom: '#d81b1b',
  urgentVia: '#ea3822',
  urgentTo: '#ef4444',

  settingsHeroFrom: '#FF5500',
  settingsHeroVia: '#FF4500',
  settingsHeroTo: '#E04800',
  settingsHeroDarkFrom: '#b60013',
  settingsHeroDarkTo: '#e01a22',

  danger: '#FF3300',
  dangerAlt: '#b51414',

  success: '#008259',
  successBg: '#e1ffec',
  successBorder: '#a3e6be',
  successBorder2: '#a3f3bf',

  tintBg: '#FFF0EB',
  tintBorder: '#FFD8CC',
  tintBgSoft: '#FFF9F6',

  neutralTextLight: '#8E8E93',
  neutralTextDark: '#8e9095',
  ink: '#2C2C2E',
  inkDark: '#eff1f5',
  border: '#e5e5ea',
  borderDark: '#35383c',

  surface: '#F7F7F8',
  surfaceDark: '#191c1f',

  notesCardBg: '#242830',
  notesCardBgDark: '#1f2228',
  notesCardBorder: '#353942',
  notesIcon: '#8E9299',

  dangerBg: '#ffebee',
  dangerBgDark: '#4a2424',
} as const;

export const activityTypeStyle = {
  completed: { icon: 'success', bg: colors.success, badgeBg: colors.successBg, badgeText: colors.success, badgeBorder: 'rgba(0,130,89,0.2)' },
  updated: { bg: colors.brand, badgeBg: colors.tintBg, badgeText: colors.brand, badgeBorder: colors.tintBorder },
  created: { bg: colors.brand, badgeBg: colors.tintBg, badgeText: colors.brand, badgeBorder: colors.tintBorder },
  snoozed: { bg: colors.neutralTextLight, badgeBg: colors.surface, badgeText: colors.ink, badgeBorder: colors.border },
  note_added: { bg: colors.brand, badgeBg: colors.tintBg, badgeText: colors.brand, badgeBorder: colors.tintBorder },
} as const;
