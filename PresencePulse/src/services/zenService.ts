/**
 * Zen Mode Service
 * Privacy-first tracking pause. When active, no behavioral data is written.
 */

let zenActive: boolean = false;

export function enableZenMode(): void {
  zenActive = true;
  console.log('[ZenMode] Tracking paused — Zen Mode active');
}

export function disableZenMode(): void {
  zenActive = false;
  console.log('[ZenMode] Tracking resumed — Zen Mode inactive');
}

export function isZenMode(): boolean {
  return zenActive;
}

export function toggleZenMode(): boolean {
  zenActive = !zenActive;
  console.log(`[ZenMode] ${zenActive ? 'Activated' : 'Deactivated'}`);
  return zenActive;
}
