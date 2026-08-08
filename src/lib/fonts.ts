interface InjectFontMessage {
  readonly action: 'injectFont';
}

const INJECT_FONT_MESSAGE: InjectFontMessage = { action: 'injectFont' };

interface FontSettings {
  fontFamily: 'Vazirmatn' | 'Lalezar' | 'Parastoo';
  fontSize: number;
}

const GOOGLE_FONTS_URL = 'https://fonts.googleapis.com/css2?family=Lalezar:wght@400&family=Parastoo:wght@400;700&family=Vazirmatn:wght@400;700&display=swap';

async function getFontSettings(): Promise<FontSettings> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) {
      resolve({ fontFamily: 'Vazirmatn', fontSize: 16 });
      return;
    }
    chrome.storage.local.get('fontSettings').then((result) => {
      const stored = (result.fontSettings ?? {}) as Partial<FontSettings>;
      resolve({
        fontFamily: stored.fontFamily ?? 'Vazirmatn',
        fontSize: stored.fontSize ?? 16,
      });
    });
  });
}

function injectFontStylesheet(settings: FontSettings): void {
  const style = document.createElement('style');
  style.textContent = `
    @import url('${GOOGLE_FONTS_URL}');

    .rtl, [dir="rtl"], .vazir, .user-message-bubble-color {
      font-family: '${settings.fontFamily}', 'Arial', 'Segoe UI', sans-serif !important;
      font-size: ${settings.fontSize}px !important;
    }
  `;
  document.head.appendChild(style);
}

export async function initFontInjection(): Promise<void> {
  void chrome.runtime.sendMessage(INJECT_FONT_MESSAGE);
  const settings = await getFontSettings();
  injectFontStylesheet(settings);
}
