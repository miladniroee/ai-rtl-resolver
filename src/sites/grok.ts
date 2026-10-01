import {
  applyDetectedDirection,
  forceLtrDirection,
  getElementText,
  observeBodyMutations,
} from "../lib/dom";
import { getFontSettings } from "../lib/storage";

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
const MATH = ".katex, .katex *";

const RESPONSE_BLOCK_SELECTOR = [
  "p",
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

const LTR_ONLY_SELECTOR = `${MARKDOWN} :is(${CODE}), .katex-html`;

function fixGrokDirection(): void {
  applyDetectedDirection(document.querySelectorAll(RESPONSE_BLOCK_SELECTOR), getElementText);
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
// blocks…) instead of inheriting it, so the shared `[dir="rtl"]` font rule only
// reaches the blocks that carry `dir` themselves. Persian inside code also falls
// back to a system font, because monospace fonts have no Arabic glyphs.
//
// Like an editor font list ('Jetbrains Mono', …, 'Vazirmatn', monospace), keep
// Grok's own font stack and add the selected Persian font as a fallback. The
// browser then picks per character: Latin stays in Grok's font, Persian uses
// the selected one.
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

const FALLBACK_TEXT_STACK = "ui-sans-serif, system-ui, sans-serif";
const FALLBACK_MONO_STACK =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

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

function withoutFont(families: string[], font: string): string[] {
  return families.filter((family) => unquote(family) !== font.toLowerCase());
}

// Text: right after Grok's brand font, so Latin keeps it and Persian (which the
// brand font lacks) falls through to ours before any system font with Arabic.
function buildTextStack(stack: string, font: string): string {
  const [first, ...rest] = withoutFont(splitFamilies(stack), font);
  if (first === undefined || isGeneric(first)) {
    return [`'${font}'`, first, ...rest].filter(Boolean).join(", ");
  }
  return [first, `'${font}'`, ...rest].join(", ");
}

// Code: just before the trailing generic family, so every monospace font is
// tried first and only glyphs they lack (Persian) use ours.
function buildMonoStack(stack: string, font: string): string {
  const families = withoutFont(splitFamilies(stack), font);
  const last = families[families.length - 1];
  if (last !== undefined && isGeneric(last)) {
    families.splice(families.length - 1, 0, `'${font}'`);
  } else {
    families.push(`'${font}'`);
  }
  return families.join(", ");
}

// Read Grok's real stacks at runtime so this keeps working when Grok changes
// its fonts.
function readGrokStacks(): { text: string; mono: string } {
  const text = getComputedStyle(document.body).fontFamily || FALLBACK_TEXT_STACK;

  const probe = document.createElement("span");
  probe.className = "!font-mono";
  probe.hidden = true;
  document.body.appendChild(probe);
  const probed = getComputedStyle(probe).fontFamily;
  probe.remove();

  const mono = probed && probed !== text ? probed : FALLBACK_MONO_STACK;
  return { text, mono };
}

function scoped(selector: string): string {
  return `:is(${MARKDOWN}, ${INPUT}) :is(${selector}), :is(${INPUT}):is(${selector})`;
}

export async function initGrokFonts(): Promise<void> {
  const { fontFamily } = await getFontSettings();
  const { text, mono } = readGrokStacks();

  const style = document.createElement("style");
  style.textContent = `
    ${scoped(`:is([dir="rtl"], [dir="rtl"] *):not(${CODE}, :is(${CODE}) *, ${MATH})`)} {
      font-family: ${buildTextStack(text, fontFamily)} !important;
    }

    ${scoped(`${CODE}, :is(${CODE}) *`)} {
      font-family: ${buildMonoStack(mono, fontFamily)} !important;
    }
  `;
  document.head.appendChild(style);
}
