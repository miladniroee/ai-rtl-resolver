import { forceLtrDirection, observeBodyMutations } from './dom';

const KATEX_HTML_SELECTOR = '.katex-html';

function fixKatexDirection(): void {
  forceLtrDirection(document.querySelectorAll(KATEX_HTML_SELECTOR));
}

export function initKatexDirectionFix(): void {
  fixKatexDirection();
  observeBodyMutations(fixKatexDirection);
}
