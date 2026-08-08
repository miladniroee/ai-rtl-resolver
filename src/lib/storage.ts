export function checkEnabled(siteId: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) {
      resolve(true);
      return;
    }
    chrome.storage.local.get('disabledSites').then((result) => {
      const disabledSites = (result.disabledSites ?? []) as string[];
      resolve(!disabledSites.includes(siteId));
    });
  });
}

export function observeToggle(
  siteId: string,
  onToggle: (enabled: boolean) => void,
): void {
  if (typeof chrome === 'undefined' || !chrome.runtime?.onMessage) {
    return;
  }
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'toggle-rtl' && msg.enabled !== undefined) {
      onToggle(msg.enabled);
    }
  });
}

// Font settings
export interface FontSettings {
  fontFamily: 'Vazirmatn' | 'Lalezar' | 'Parastoo';
  fontSize: number;
}

const DEFAULT_FONT_SETTINGS: FontSettings = {
  fontFamily: 'Vazirmatn',
  fontSize: 16,
};

const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 72;

export async function getFontSettings(): Promise<FontSettings> {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) {
    return DEFAULT_FONT_SETTINGS;
  }
  const result = await chrome.storage.local.get('fontSettings');
  const stored = (result.fontSettings ?? {}) as Partial<FontSettings>;
  return {
    fontFamily: stored.fontFamily ?? DEFAULT_FONT_SETTINGS.fontFamily,
    fontSize: validateFontSize(stored.fontSize ?? DEFAULT_FONT_SETTINGS.fontSize),
  };
}

export async function setFontSettings(settings: FontSettings): Promise<void> {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) {
    return;
  }
  const validated: FontSettings = {
    fontFamily: settings.fontFamily,
    fontSize: validateFontSize(settings.fontSize),
  };
  await chrome.storage.local.set({ fontSettings: validated });
}

function validateFontSize(size: number): number {
  const num = Number(size);
  if (isNaN(num)) return DEFAULT_FONT_SETTINGS.fontSize;
  return Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, num));
}
