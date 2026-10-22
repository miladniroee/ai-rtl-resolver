import {
  applyDetectedDirection,
  forceLtrDirection,
  getElementText,
  observeBodyMutations,
  setElementDirection,
} from '../lib/dom';
import { initKatexDirectionFix } from '../lib/katex';

const TEXTAREA_SELECTOR = [
  'ms-prompt-input-wrapper textarea',
  'ms-autocomplete-textarea textarea',
  'ms-applet-generator-form textarea',
  'ms-chat-turn textarea',
  'ms-system-instructions textarea',
  'ms-prompt-box textarea',
  '.prompt-box-container textarea',
  '.prompt-input-wrapper textarea',
  'textarea.prompt-textarea',
  'textarea:not(.monaco-editor *)',
].join(', ');

const LTR_ONLY_SELECTOR = [
  'pre',
  'code',
  '.katex-html',
  'ms-code-block',
  '.monaco-editor',
].join(', ');

const TURN_HOST = ':is(ms-chat-turn, ms-console-turn, ms-code-assistant-chat, ms-cmark-node, .bubble)';

const CONTENT_SELECTOR = [
  'table',
  'ms-chat-turn .chat-turn-container',
  'ms-chat-turn .turn-content',
  'ms-console-turn .bubble',
  '.bubble',
  'ms-cmark-node.cmark-node',
  'ms-cmark-node',
  ...['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'blockquote', 'blockquote > p'].map(
    (tag) => `${TURN_HOST} ${tag}`,
  ),
].join(', ');

function syncTextareaWrappers(): void {
  for (const textarea of document.querySelectorAll<HTMLTextAreaElement>(TEXTAREA_SELECTOR)) {
    const wrapper = textarea.closest('ms-autocomplete-textarea, ms-prompt-input-wrapper');
    if (wrapper) {
      const dir = textarea.getAttribute('dir');
      if (dir === 'rtl' || dir === 'ltr') {
        setElementDirection(wrapper, dir);
      }
    }
  }
}

function fixAistudioDirection(): void {
  applyDetectedDirection(
    document.querySelectorAll(TEXTAREA_SELECTOR),
    getElementText,
  );
  syncTextareaWrappers();
  applyDetectedDirection(
    document.querySelectorAll(CONTENT_SELECTOR),
    getElementText,
  );
  forceLtrDirection(document.querySelectorAll(LTR_ONLY_SELECTOR));
}

// Keep prompt inputs and their autocomplete mirrors in sync while typing.
function observeInputDirection(): void {
  document.addEventListener('input', (event) => {
    const target = event.target;
    if (target instanceof HTMLTextAreaElement && target.matches(TEXTAREA_SELECTOR)) {
      applyDetectedDirection([target], getElementText);
      const wrapper = target.closest('ms-autocomplete-textarea, ms-prompt-input-wrapper');
      if (wrapper) {
        const dir = target.getAttribute('dir');
        if (dir === 'rtl' || dir === 'ltr') {
          setElementDirection(wrapper, dir);
        }
      }
    }
  });
}

export function initAistudio(): void {
  fixAistudioDirection();
  observeBodyMutations(fixAistudioDirection, { characterData: true });
  initKatexDirectionFix();
  observeInputDirection();
}

