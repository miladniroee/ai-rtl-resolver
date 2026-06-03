import {
  detectParagraphDirection,
  type TextDirection,
} from './direction';

export function setElementDirection(
  element: Element,
  direction: TextDirection,
): void {
  element.setAttribute('dir', direction);
}

export function applyDetectedDirection(
  elements: NodeListOf<Element>,
  getText: (element: Element) => string,
): void {
  for (const element of elements) {
    setElementDirection(element, detectParagraphDirection(getText(element)));
  }
}

export function forceLtrDirection(elements: NodeListOf<Element>): void {
  for (const element of elements) {
    setElementDirection(element, 'ltr');
  }
}

export function observeBodyMutations(onMutate: () => void): void {
  const { body } = document;
  if (!body) {
    return;
  }

  const observer = new MutationObserver(onMutate);
  observer.observe(body, { childList: true, subtree: true });
}

export function getElementText(element: Element): string {
  if (element instanceof HTMLTextAreaElement) {
    return element.value;
  }
  return element.textContent ?? '';
}
