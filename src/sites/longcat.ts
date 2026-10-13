import {
  applyDetectedDirection,
  forceLtrDirection,
  getElementText,
  observeBodyMutations,
  setElementDirection,
} from '../lib/dom';
import { initKatexDirectionFix } from '../lib/katex';

// LongCat is a Vue app: every element it renders carries a build-scoped
// `data-v-…` attribute that changes on each deploy, so the authored class names
// below are the only stable hooks to target.
const MESSAGE_LIST = '.message-list';

// User turns render into a single `.user-text` block. (`.user-message` is not
// usable on its own — LongCat nests two elements with that class inside each
// other.)
const USER_MESSAGE = `${MESSAGE_LIST} .user-text`;

// Assistant replies render through a shared markdown component named
// `.mt-markdown-body`, wrapped by `.md-show-container`. The web-search banner
// and source list sit outside it, so they are left alone.
const MARKDOWN = `${MESSAGE_LIST} .md-show-container .mt-markdown-body`;

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
  .map((tag) => `${MARKDOWN} ${tag}`)
  .join(',');

const LIST_PARAGRAPH_SELECTOR = `${MARKDOWN} li p`;

const LTR_ONLY_SELECTOR = `${MARKDOWN} :is(pre, code)`;

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

function fixLongcatDirection(): void {
  applyDetectedDirection(document.querySelectorAll(RESPONSE_BLOCK_SELECTOR), getElementText);
  // After the detection above, so `ul`/`ol` already carry their `dir`.
  applyListParagraphDirection();
  applyDetectedDirection(document.querySelectorAll(USER_MESSAGE), getElementText);
  forceLtrDirection(document.querySelectorAll(LTR_ONLY_SELECTOR));
}

export function initLongcat(): void {
  fixLongcatDirection();
  // Replies stream in by editing existing text nodes in place, which a
  // childList-only observer would miss.
  observeBodyMutations(fixLongcatDirection, { characterData: true });
  initKatexDirectionFix();
}
