import { applyDetectedDirection, getElementText, observeBodyMutations } from '../lib/dom';
import { initKatexDirectionFix } from '../lib/katex';

const DIRECTION_TARGET_SELECTOR =
  '#mat-input-1,.query-box-input,.message-text-content,.paragraph';

function fixNotebooklmDirection(): void {
  applyDetectedDirection(
    document.querySelectorAll(DIRECTION_TARGET_SELECTOR),
    getElementText,
  );
}

export function initNotebooklm(): void {
  fixNotebooklmDirection();
  observeBodyMutations(fixNotebooklmDirection);
  initKatexDirectionFix();
}
