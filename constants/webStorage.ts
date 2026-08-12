const memoryStorage = new Map<string, string>();

function getBrowserStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage ?? window.sessionStorage ?? null;
  } catch {
    return null;
  }
}

export function safeSetWebStorageItem(key: string, value: string) {
  const storage = getBrowserStorage();

  if (storage) {
    try {
      storage.setItem(key, value);
      return;
    } catch {
      // Fall back to memory storage below.
    }
  }

  memoryStorage.set(key, value);
}

export function safeGetWebStorageItem(key: string) {
  const storage = getBrowserStorage();

  if (storage) {
    try {
      const value = storage.getItem(key);
      if (value !== null) {
        return value;
      }
    } catch {
      // Fall back to memory storage below.
    }
  }

  return memoryStorage.get(key) ?? null;
}
