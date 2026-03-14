/**
 * Bluetooth Device Whitelist Service
 * Manages trusted device IDs to distinguish close contacts from public spaces.
 * Persists in-memory (resets on app restart for simplicity).
 */

let whitelist: Set<string> = new Set();

export function addToWhitelist(deviceId: string): void {
  whitelist.add(deviceId);
  console.log(`[DeviceWhitelist] Added: ${deviceId}`);
}

export function removeFromWhitelist(deviceId: string): void {
  whitelist.delete(deviceId);
  console.log(`[DeviceWhitelist] Removed: ${deviceId}`);
}

export function getWhitelist(): string[] {
  return Array.from(whitelist);
}

export function isWhitelisted(deviceId: string): boolean {
  return whitelist.has(deviceId);
}

export function clearWhitelist(): void {
  whitelist.clear();
  console.log('[DeviceWhitelist] Cleared all devices');
}

/**
 * Check if any devices in a list are whitelisted.
 * Returns true if at least one whitelisted device is found.
 */
export function hasWhitelistedDeviceIn(deviceIds: string[]): boolean {
  return deviceIds.some((id) => whitelist.has(id));
}
