interface InjectFontMessage {
  readonly action: 'injectFont';
}

const INJECT_FONT_MESSAGE: InjectFontMessage = { action: 'injectFont' };

export interface FontSettings {
  fontFamily: 'Vazirmatn' | 'Lalezar' | 'Parastoo';
  fontSize: number;
}

export interface FontFaceSources {
  readonly regular: string;
  readonly bold?: string;
}

const FONT_FAMILIES = {
  Vazirmatn: "'Vazirmatn', 'Arial', 'Segoe UI', sans-serif",
  Lalezar: "'Lalezar', 'Arial', 'Segoe UI', sans-serif",
  Parastoo: "'Parastoo', 'Arial', 'Segoe UI', sans-serif",
} as const;

export async function getFontSettings(): Promise<FontSettings> {
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

// The woff2 URLs live here only; sites that register the selected font under
// their own family names (see sites/grok.ts) reuse this instead of duplicating
// the table.
export function getFontFaceSources(fontFamily: FontSettings['fontFamily']): FontFaceSources {
  const fontUrls: Record<FontSettings['fontFamily'], FontFaceSources> = {
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

  return fontUrls[fontFamily];
}

export function buildFontFaceRules(settings: FontSettings): string {
  const selectedFont = getFontFaceSources(settings.fontFamily);

  let fontFaceRules = `
    @font-face {
      font-family: '${settings.fontFamily}';
      src: url('${selectedFont.regular}') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
  `;

  if (selectedFont.bold !== undefined) {
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

  return fontFaceRules;
}

function injectFontStylesheet(settings: FontSettings, scopeSelector?: string): void {
  const style = document.createElement('style');

  style.textContent = `
    ${buildFontFaceRules(settings)}

    ${buildFontTargetSelector(scopeSelector)} {
      font-family: ${FONT_FAMILIES[settings.fontFamily]} !important;
    }

  `;

  document.head.appendChild(style);
}

const FONT_TARGETS = '.rtl, [dir="rtl"], .vazir, .user-message-bubble-color';

// With a scope, only matching elements inside (or equal to) the scope roots get
// the font, e.g. just the AI chat on a site that also hosts other content.
function buildFontTargetSelector(scopeSelector?: string): string {
  if (!scopeSelector) {
    return FONT_TARGETS;
  }
  return `:is(${scopeSelector}) :is(${FONT_TARGETS}), :is(${scopeSelector}):is(${FONT_TARGETS})`;
}

export async function initFontInjection(scopeSelector?: string): Promise<void> {
  void chrome.runtime.sendMessage(INJECT_FONT_MESSAGE);
  const settings = await getFontSettings();
  injectFontStylesheet(settings, scopeSelector);
}

/**
 * Injects only the @font-face declarations — no forced `[dir="rtl"]` rule — and
 * returns the settings. Used by sites that add the selected font as a face under
 * the page's own family names instead (see sites/grok.ts).
 */
export async function initFontFaces(): Promise<FontSettings> {
  void chrome.runtime.sendMessage(INJECT_FONT_MESSAGE);
  const settings = await getFontSettings();

  const style = document.createElement('style');
  style.textContent = buildFontFaceRules(settings);
  document.head.appendChild(style);

  return settings;
}
