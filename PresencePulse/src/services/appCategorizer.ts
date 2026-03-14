/**
 * App Categorization Engine
 * Classifies Android package names into 'distraction', 'utility', or 'unknown'.
 * Only 'distraction' micro-checks affect the Presence Score.
 */

export type AppCategory = 'distraction' | 'utility' | 'unknown';

// Known distraction apps (social media, entertainment, games)
const DISTRACTION_PACKAGES: Set<string> = new Set([
  'com.instagram.android',
  'com.facebook.katana',
  'com.facebook.lite',
  'com.facebook.orca',       // Messenger
  'com.twitter.android',
  'com.twitter.android.lite',
  'com.zhiliaoapp.musically', // TikTok
  'com.ss.android.ugc.trill', // TikTok (alt)
  'com.snapchat.android',
  'com.reddit.frontpage',
  'com.pinterest',
  'com.tumblr',
  'com.linkedin.android',
  'com.google.android.youtube',
  'com.netflix.mediaclient',
  'com.amazon.avod.thirdpartyclient', // Prime Video
  'com.disney.disneyplus',
  'com.spotify.music',
  'tv.twitch.android.app',
  'com.discord',
  'com.whatsapp',
  'com.whatsapp.w4b',
  'org.telegram.messenger',
  'com.Slack',
]);

// Known distraction package prefixes (games, social, entertainment)
const DISTRACTION_PREFIXES: string[] = [
  'com.king.',       // Candy Crush etc
  'com.supercell.',  // Clash of Clans etc
  'com.ea.game.',
  'com.gameloft.',
  'com.zynga.',
  'com.rovio.',
  'com.epicgames.',
  'com.tencent.ig',  // PUBG Mobile
  'com.activision.',
];

// Known utility apps (productivity, tools, system)
const UTILITY_PACKAGES: Set<string> = new Set([
  'com.google.android.apps.maps',
  'com.google.android.apps.nbu.files',
  'com.google.android.calendar',
  'com.google.android.calculator',
  'com.google.android.deskclock',
  'com.google.android.contacts',
  'com.google.android.dialer',
  'com.google.android.apps.docs',
  'com.google.android.apps.photos',
  'com.google.android.gm',        // Gmail
  'com.google.android.apps.messaging',
  'com.android.settings',
  'com.android.camera',
  'com.android.calculator2',
  'com.android.chrome',
  'com.android.vending',           // Play Store
  'com.google.android.apps.walletnfcrel', // Google Pay
  'com.phonepe.app',
  'net.one97.paytm',
  'com.google.android.keep',
  'com.todoist',
  'com.microsoft.office.outlook',
  'com.microsoft.teams',
  'com.google.android.apps.meetings', // Google Meet
]);

// Known utility package prefixes
const UTILITY_PREFIXES: string[] = [
  'com.android.',
  'com.google.android.inputmethod',
  'com.samsung.',     // Samsung system apps
  'com.sec.android.', // Samsung system
  'com.miui.',        // Xiaomi system
  'com.oneplus.',     // OnePlus system
];

export function categorizeApp(packageName: string): AppCategory {
  if (!packageName) return 'unknown';

  // Check exact matches first
  if (DISTRACTION_PACKAGES.has(packageName)) return 'distraction';
  if (UTILITY_PACKAGES.has(packageName)) return 'utility';

  // Check prefix matches
  for (const prefix of DISTRACTION_PREFIXES) {
    if (packageName.startsWith(prefix)) return 'distraction';
  }

  for (const prefix of UTILITY_PREFIXES) {
    if (packageName.startsWith(prefix)) return 'utility';
  }

  // Default: unknown (treated neutrally — no score deduction)
  return 'unknown';
}
