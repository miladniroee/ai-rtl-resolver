import {
  applyDetectedDirection,
  forceLtrDirection,
  getElementText,
  observeBodyMutations,
  setElementDirection,
} from "../lib/dom";
import { getFontFaceSources, type FontSettings } from "../lib/fonts";

// Grok marks every block `dir="auto"`, so the browser picks the direction from
// the first strong character: "Node.js یک محیط…" turns LTR, and an inline code
// span like `Promise.allSettled()` inside a Persian paragraph has its trailing
// "()" pulled to the wrong side. Replace that with our own per-block detection
// and isolate inline code as LTR.
const MARKDOWN = ".response-content-markdown";

// The composer is a ProseMirror contenteditable inside a `dir="ltr"` wrapper.
const INPUT = ".query-bar-editor";
const INPUT_SELECTOR = `${INPUT}[contenteditable="true"]`;

// Inline code is a `span.!font-mono` (no <code> tag); code blocks are wrapped in
// `[data-testid="code-block"]` inside a `dir="auto"` div.
const CODE = 'span[class*="font-mono"], [data-testid="code-block"], pre, code';

const RESPONSE_BLOCK_SELECTOR = [
  // List-item paragraphs are left out and follow their list instead, so an
  // English item in a Persian list stays on the bullet's side rather than
  // jumping to the opposite edge.
  "p:not(li p)",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "blockquote",
  "table",
]
  .map((tag) => `${MARKDOWN} ${tag}`)
  .join(",");

const LIST_PARAGRAPH_SELECTOR = `${MARKDOWN} li p`;

const LTR_ONLY_SELECTOR = `${MARKDOWN} :is(${CODE}), .katex-html`;

function applyListParagraphDirection(): void {
  for (const paragraph of document.querySelectorAll(LIST_PARAGRAPH_SELECTOR)) {
    // The nearest list: nested `ul`/`ol` are detected on their own, and the
    // closest one owns the marker this paragraph sits next to.
    const listDirection = paragraph.closest("ul, ol")?.getAttribute("dir");
    if (listDirection === "rtl" || listDirection === "ltr") {
      setElementDirection(paragraph, listDirection);
    }
  }
}

function fixGrokDirection(): void {
  applyDetectedDirection(document.querySelectorAll(RESPONSE_BLOCK_SELECTOR), getElementText);
  // After the detection above, so `ul`/`ol` already carry their `dir`.
  applyListParagraphDirection();
  applyDetectedDirection(document.querySelectorAll(INPUT_SELECTOR), getElementText);
  forceLtrDirection(document.querySelectorAll(LTR_ONLY_SELECTOR));
}

// Keep the composer's direction in sync while typing.
function observeInputDirection(): void {
  document.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof Element && target.matches(INPUT_SELECTOR)) {
      applyDetectedDirection([target], getElementText);
    }
  });
}

export function initGrok(): void {
  fixGrokDirection();
  observeBodyMutations(fixGrokDirection);
  observeInputDirection();
}

// ---------------------------------------------------------------------------
// Fonts
//
// Grok sets font-family on most elements (list items, inline code, code
// blocks…) instead of inheriting it, and its brand and monospace fonts have no
// Arabic glyphs, so Persian would otherwise fall back to a system font.
//
// Forcing a font-family would replace Grok's own font for Latin text too.
// Instead, register the selected Persian font as an extra face under Grok's own
// family names, restricted to the Persian Unicode range: Latin finds no face of
// ours and keeps Grok's font, while Persian resolves to ours. The family names
// are read at runtime, so this keeps working when Grok changes its fonts.
// ---------------------------------------------------------------------------

const GENERIC_FAMILIES = new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "math",
  "emoji",
  "fangsong",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
  "ui-rounded",
]);

const PERSIAN_UNICODE_RANGE =
  "U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF";

// One sample per tag, so families used only by headings or code are covered
// too. Grok's inline code is a `span.!font-mono`, hence the class match.
const FAMILY_PROBE_SELECTOR = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "li",
  "blockquote",
  "td",
  "pre",
  "code",
  '[class*="font-mono"]',
]
  .map((tag) => `${MARKDOWN} ${tag}`)
  .join(",");

function splitFamilies(stack: string): string[] {
  return stack
    .split(/,(?=(?:[^"']*["'][^"']*["'])*[^"']*$)/)
    .map((family) => family.trim())
    .filter(Boolean);
}

function unquote(family: string): string {
  return family.replace(/^["']|["']$/g, "").toLowerCase();
}

function isGeneric(family: string): boolean {
  return GENERIC_FAMILIES.has(unquote(family));
}

// The families Grok is actually using right now, sampled from the body and one
// element per tag so per-element fonts (headings, code) are included.
function collectFamilies(): Set<string> {
  const families = new Set<string>();

  const addStack = (stack: string): void => {
    for (const family of splitFamilies(stack)) {
      if (!isGeneric(family)) {
        families.add(unquote(family));
      }
    }
  };

  addStack(getComputedStyle(document.body).fontFamily);

  const probedTags = new Set<string>();
  for (const element of document.querySelectorAll(FAMILY_PROBE_SELECTOR)) {
    if (probedTags.has(element.tagName)) {
      continue;
    }
    probedTags.add(element.tagName);
    addStack(getComputedStyle(element).fontFamily);
  }

  return families;
}

function faceRules(family: string, settings: FontSettings): string {
  const sources = getFontFaceSources(settings.fontFamily);

  const weights: Array<[number, string]> = [[400, sources.regular]];
  if (sources.bold !== undefined) {
    weights.push([700, sources.bold]);
  }

  return weights
    .map(
      ([weight, url]) => `
    @font-face {
      font-family: '${family}';
      src: url('${url}') format('woff2');
      font-weight: ${weight};
      font-style: normal;
      font-display: swap;
      unicode-range: ${PERSIAN_UNICODE_RANGE};
    }`,
    )
    .join("\n");
}

const coveredFamilies = new Set<string>();

function injectFamilyFaces(settings: FontSettings): void {
  const fresh = [...collectFamilies()].filter(
    (family) =>
      !coveredFamilies.has(family) &&
      family !== settings.fontFamily.toLowerCase(),
  );
  if (fresh.length === 0) {
    return;
  }

  for (const family of fresh) {
    coveredFamilies.add(family);
  }

  const style = document.createElement("style");
  style.textContent = fresh.map((family) => faceRules(family, settings)).join("\n");
  document.head.appendChild(style);
}

export function initGrokFonts(settings: FontSettings): void {
  injectFamilyFaces(settings);
  // Families used by content that renders later (opening an existing chat, a
  // new reply) are picked up on the next mutation pass.
  observeBodyMutations(() => injectFamilyFaces(settings));
}
