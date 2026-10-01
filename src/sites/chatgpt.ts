import {
  applyDetectedDirection,
  forceLtrDirection,
  getElementText,
  observeBodyMutations,
  setElementDirection,
} from "../lib/dom";
import { detectParagraphDirection } from "../lib/direction";
import { initKatexDirectionFix } from "../lib/katex";

const ASSISTANT = 'div[data-message-author-role="assistant"]';

// Paragraphs of to-do list items follow their whole (top-level) list, so the checkbox stays on the
// list's side instead of jumping to the end of an English item.
const TASK_PARAGRAPH = `:is(li:has(> input[type="checkbox"]) > p, li p:has(> input[type="checkbox"]))`;

const APPLY_DIRECTION_SELECTOR = [
  "#prompt-textarea",
  `${ASSISTANT} p:not(${TASK_PARAGRAPH})`,
  `${ASSISTANT} :is(h1, h2, h3, h4, h5, h6)`,
  "table",
].join(", ");

const TASK_PARAGRAPH_SELECTOR = `${ASSISTANT} ${TASK_PARAGRAPH}`;

// Inline code (not CodeMirror blocks) is LTR and isolated, so its trailing brackets don't flip in RTL text.
const LTR_ONLY_SELECTOR = `${ASSISTANT} code:not(pre code)`;

function applyTaskParagraphDirection(): void {
  for (const paragraph of document.querySelectorAll(TASK_PARAGRAPH_SELECTOR)) {
    let list = paragraph.closest("ul, ol");
    for (
      let outer = list?.parentElement?.closest("ul, ol");
      outer;
      outer = outer.parentElement?.closest("ul, ol")
    ) {
      list = outer;
    }
    if (list) {
      setElementDirection(paragraph, detectParagraphDirection(getElementText(list)));
    }
  }
}

function applyDirectionToChatgpt(): void {
  applyDetectedDirection(document.querySelectorAll(APPLY_DIRECTION_SELECTOR), getElementText);
  applyTaskParagraphDirection();
  forceLtrDirection(document.querySelectorAll(LTR_ONLY_SELECTOR));
}

export function initChatgpt(): void {
  applyDirectionToChatgpt();
  observeBodyMutations(applyDirectionToChatgpt);
  initKatexDirectionFix();
}
