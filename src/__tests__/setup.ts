/**
 * Test setup file for Vitest
 * Configures global test environment and mocks
 */

import { afterEach, beforeEach, vi } from 'vitest';

// Mock crypto.randomUUID if not available in test environment
if (!globalThis.crypto?.randomUUID) {
  globalThis.crypto = {
    ...globalThis.crypto,
    randomUUID: vi.fn(() => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }),
  } as Crypto;
}

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  // Reset modules to ensure clean state
  vi.resetModules();
});

// Cleanup after each test
afterEach(() => {
  vi.restoreAllMocks();
});
