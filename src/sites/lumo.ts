import {
  applyDetectedDirection,
  forceLtrDirection,
  getElementText,
  observeBodyMutations,
  setElementDirection,
} from '../lib/dom';
import { initKatexDirectionFix } from '../lib/katex';

// Lumo renders each turn as a `.lumo-chat-item` tagged with the role that
// produced it, and streams the reply into `.progressive-markdown-content`.
// Unlike the utility classes around them (`flex-column`, `gap-2`…), these two
// names describe content, so they are the stable hooks to target.
const ASSISTANT =
  '.lumo-chat-item[data-message-role="assistant"] .progressive-markdown-content';

// User turns render their text in a plain wrapper; the direction goes on the
// wrapper rather than the `white-space: pre-line` span inside it, so wrapped
// lines align with the bubble too.
const USER_BUBBLE = '.lumo-chat-item[data-message-role="user"] .lumo-markdown';

// The composer is a plain <textarea>. It carries a generic `composer` class, so
// the input container is used as the anchor instead.
const INPUT_SELECTOR = '.lumo-input textarea';

const RESPONSE_BLOCK_SELECTOR = [
  // List-item paragraphs are left out and follow their list instead, so an
  // English item in a Persian list stays on the bullet's side rather than
  // jumping to the opposite edge.
  'p:not(li p)',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'blockquote',
  'table',
]
  .map((tag) => `${ASSISTANT} ${tag}`)
  .join(',');

const LIST_PARAGRAPH_SELECTOR = `${ASSISTANT} li p`;

const LTR_ONLY_SELECTOR = `${ASSISTANT} :is(pre, code)`;

function applyListParagraphDirection(): void {
  for (const paragraph of document.querySelectorAll(LIST_PARAGRAPH_SELECTOR)) {
    // The nearest list: nested `ul`/`ol` are detected on their own, and the
    // closest one owns the marker this paragraph sits next to.
    const listDirection = paragraph.closest('ul, ol')?.getAttribute('dir');
    if (listDirection === 'rtl' || listDirection === 'ltr') {
      setElementDirection(paragraph, listDirection);
    }
  }
}

function fixLumoDirection(): void {
  applyDetectedDirection(document.querySelectorAll(RESPONSE_BLOCK_SELECTOR), getElementText);
  // After the detection above, so `ul`/`ol` already carry their `dir`.
  applyListParagraphDirection();
  applyDetectedDirection(document.querySelectorAll(USER_BUBBLE), getElementText);
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

export function initLumo(): void {
  fixLumoDirection();
  // Replies stream in by editing existing text nodes in place, which a
  // childList-only observer would miss.
  observeBodyMutations(fixLumoDirection, { characterData: true });
  initKatexDirectionFix();
  observeInputDirection();
}
