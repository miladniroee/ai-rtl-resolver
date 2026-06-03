import {
  applyDetectedDirection,
  forceLtrDirection,
  getElementText,
  observeBodyMutations,
} from '../lib/dom';

const LTR_ONLY_SELECTOR = '.katex-html, .not-prose, pre, code';
const APPLY_DIRECTION_SELECTOR = '.prose:not(.not-prose):not(.katext-html), button>div>div';

function fixPerplexityDirection(): void {
  applyDetectedDirection(
    document.querySelectorAll(APPLY_DIRECTION_SELECTOR),
    getElementText,
  );
  forceLtrDirection(document.querySelectorAll(LTR_ONLY_SELECTOR));
}

export function initPerplexity(): void {
  fixPerplexityDirection();
  observeBodyMutations(fixPerplexityDirection);
}
