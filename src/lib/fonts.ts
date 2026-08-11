interface InjectFontMessage {
  readonly action: 'injectFont';
}

const INJECT_FONT_MESSAGE: InjectFontMessage = { action: 'injectFont' };

interface FontSettings {
  fontFamily: 'Vazirmatn' | 'Lalezar' | 'Parastoo';
  fontSize: number;
}

const FONT_FAMILIES = {
  Vazirmatn: "'Vazirmatn', 'Arial', 'Segoe UI', sans-serif",
  Lalezar: "'Lalezar', 'Arial', 'Segoe UI', sans-serif",
  Parastoo: "'Parastoo', 'Arial', 'Segoe UI', sans-serif",
} as const;

async function getFontSettings(): Promise<FontSettings> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) {
      resolve({
        fontFamily: 'Vazirmatn',
        fontSize: 16,
      });
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
  const fontUrls = {
    Vazirmatn: {
      regular: chrome.runtime.getURL('fonts/Vazirmatn-Regular.woff2'),
      bold: chrome.runtime.getURL('fonts/Vazirmatn-Bold.woff2'),
    },
    Lalezar: {
      regular: chrome.runtime.getURL('fonts/Lalezar-Regular.woff2'),
    },
    Parastoo: {
      regular: chrome.runtime.getURL('fonts/Parastoo-Regular.woff2'),
      bold: chrome.runtime.getURL('fonts/Parastoo-Bold.woff2'),
    },
  };

  const selectedFont = fontUrls[settings.fontFamily];

  let fontFaceRules = '';

  fontFaceRules += `
    @font-face {
      font-family: '${settings.fontFamily}';
      src: url('${selectedFont.regular}') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
  `;

  if ('bold' in selectedFont) {
    fontFaceRules += `
      @font-face {
        font-family: '${settings.fontFamily}';
        src: url('${selectedFont.bold}') format('woff2');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }
    `;
  }

  const style = document.createElement('style');

  style.textContent = `
    ${fontFaceRules}

    .rtl, [dir="rtl"], .vazir, .user-message-bubble-color {
      font-family: ${FONT_FAMILIES[settings.fontFamily]} !important;
    }

  `;

  document.head.appendChild(style);
}

export async function initFontInjection(): Promise<void> {
  void chrome.runtime.sendMessage(INJECT_FONT_MESSAGE);
  const settings = await getFontSettings();
  injectFontStylesheet(settings);
}
