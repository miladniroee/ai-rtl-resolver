import {
  applyDetectedDirection,
  forceLtrDirection,
  getElementText,
  observeBodyMutations,
} from '../lib/dom';

// Notion serves regular pages and AI chat from the same SPA/domain, so every
// selector below is scoped to the AI chat surface. Nothing outside these roots
// (regular pages, databases, sidebar) is ever touched.
//
// - `[data-agent-service-find-row]`: one row per chat turn (user message,
//   assistant reply, "Worked for…" tool group, timestamps).
// - `[data-notion-chat-input-container]`: the "Ask Notion AI" composer.
//
// Notion styles with hashed atomic classes (x78zum5, xdt5ytf…), which change
// between builds, so only data attributes and semantic tags are used here.
const ROW = '[data-agent-service-find-row]';
const INPUT_CONTAINER = '[data-notion-chat-input-container]';

export const NOTION_CHAT_SCOPE = `${ROW}, ${INPUT_CONTAINER}`;

const RESPONSE_BLOCKS = ['p:not(li p)', 'h1', 'h2', 'h3', 'h4', 'blockquote', 'table']
  .map((tag) => `${ROW} ${tag}`)
  .join(',');

// Lists get one direction for the whole (top-level) list; items and nested
// lists inherit it. Per-item detection would push an English item (e.g. a
// to-do) to the opposite side and break the list's alignment and nesting.
const LIST_SELECTOR = `${ROW} :is(ul, ol):not(li *)`;

// Screen-reader-only labels, e.g. the "Completed to-do item" text Notion adds
// to every checkbox. They are invisible but part of textContent, so an English
// label would otherwise make every to-do item look LTR-first.
const HIDDEN_TEXT_SELECTOR = '[id^="agent-service-markdown-todo-"], [style*="clip: rect"]';

interface VisibleTextEntry {
  readonly raw: string;
  readonly visible: string;
}

// Streaming replies edit text nodes in place, which re-runs this on every pass.
// The walker is only needed when an element's text actually changed; comparing
// textContent first keeps every other row on a cheap native read. Weakly keyed,
// so entries die with unmounted rows.
const visibleTextCache = new WeakMap<Element, VisibleTextEntry>();

function collectVisibleText(element: Element): string {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let text = '';
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.parentElement?.closest(HIDDEN_TEXT_SELECTOR)) {
      text += node.nodeValue ?? '';
    }
  }
  return text;
}

function getVisibleText(element: Element): string {
  const raw = element.textContent ?? '';
  const cached = visibleTextCache.get(element);
  if (cached !== undefined && cached.raw === raw) {
    return cached.visible;
  }

  const visible = collectVisibleText(element);
  visibleTextCache.set(element, { raw, visible });
  return visible;
}

// The composer is a contenteditable div, not a textarea.
const INPUT_SELECTOR = `${INPUT_CONTAINER} [contenteditable="true"]`;

// User bubbles render their text in a single `white-space: pre-wrap` span. The
// direction is applied to the bubble (the span's parent) so wrapped lines align
// correctly too.
const USER_MESSAGE_TEXT_SELECTOR = `${ROW} span[style*="pre-wrap"]`;

const LTR_ONLY_SELECTOR = ['pre', 'code', '.katex']
  .map((tag) => `${ROW} ${tag}`)
  .join(',');

function getUserBubbles(): Element[] {
  const bubbles: Element[] = [];
  for (const span of document.querySelectorAll(USER_MESSAGE_TEXT_SELECTOR)) {
    if (span.closest('pre')) continue;
    const bubble = span.parentElement;
    if (bubble) bubbles.push(bubble);
  }
  return bubbles;
}

function fixNotionDirection(): void {
  applyDetectedDirection(document.querySelectorAll(RESPONSE_BLOCKS), getVisibleText);
  applyDetectedDirection(document.querySelectorAll(LIST_SELECTOR), getVisibleText);
  applyDetectedDirection(getUserBubbles(), getElementText);
  applyDetectedDirection(document.querySelectorAll(INPUT_SELECTOR), getElementText);

  forceLtrDirection(document.querySelectorAll(LTR_ONLY_SELECTOR));
}

// Keep the composer's direction in sync while typing.
function observeInputDirection(): void {
  document.addEventListener('input', (event) => {
    const target = event.target;
    if (target instanceof Element && target.matches(INPUT_SELECTOR)) {
      applyDetectedDirection([target], getElementText);
    }
  });
}

export function initNotion(): void {
  fixNotionDirection();
  // Streaming replies often update existing text nodes in place, which a
  // childList-only observer would miss.
  observeBodyMutations(fixNotionDirection, { characterData: true });
  observeInputDirection();
}
