import {
  applyDetectedDirection,
  forceLtrDirection,
  getElementText,
  observeBodyMutations,
} from '../lib/dom';

const LTR_ONLY_SELECTOR =
  '.katex-html,.md-code-block,code,pre,table';

const DIRECTION_TARGET_SELECTOR =
  '.chat-user-message,.response-message-content,.message-input-container-area';

function fixQwenDirection(): void {
  applyDetectedDirection(
    document.querySelectorAll(DIRECTION_TARGET_SELECTOR),
    getElementText,
  );

  forceLtrDirection(document.querySelectorAll(LTR_ONLY_SELECTOR));
}

export function initQwen(): void {
  fixQwenDirection();
  observeBodyMutations(fixQwenDirection);
}
