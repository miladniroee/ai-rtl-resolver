import {
  applyDetectedDirection,
  forceLtrDirection,
  getElementText,
  observeBodyMutations,
} from '../lib/dom';

const LTR_ONLY_SELECTOR = '.katex-html, .not-prose, pre, code';
const APPLY_DIRECTION_SELECTOR = '.ql-editor.textarea p, table';

// Gemini sets one `dir` on the whole response (`.markdown`), so an English
// paragraph inside a Persian reply is rendered RTL. Detect per top-level block
// instead (blockquote paragraphs too, since a quote can mix languages). Headings also need their own `dir` for the font rule to apply, since
// Gemini gives them a font-family that overrides the inherited one.
const RESPONSE_BLOCK_SELECTOR = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'blockquote', 'blockquote > p']
  .map((tag) => `message-content .markdown > ${tag}`)
  .join(',');

function fixGemeniDirection(): void {
  applyDetectedDirection(
    document.querySelectorAll(APPLY_DIRECTION_SELECTOR),
    getElementText,
  );
  applyDetectedDirection(
    document.querySelectorAll(RESPONSE_BLOCK_SELECTOR),
    getElementText,
  );
  forceLtrDirection(document.querySelectorAll(LTR_ONLY_SELECTOR));
}

export function initGemeni(): void {
  fixGemeniDirection();
  observeBodyMutations(fixGemeniDirection);
}
