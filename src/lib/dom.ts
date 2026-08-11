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
  elements: Iterable<Element>,
  getText: (element: Element) => string,
): void {
  for (const element of elements) {
    setElementDirection(element, detectParagraphDirection(getText(element)));
  }
}

export function applyTableDirection(tables: NodeListOf<HTMLTableElement>): void {

  tables.forEach(table => {
    let text: string = '';

    for (const element of table.querySelectorAll<HTMLTableCellElement>('th, td')) {
      text += getElementText(element);
    }

    const TableDirection = detectParagraphDirection(text);

    if (TableDirection === 'rtl')
      table.querySelectorAll<HTMLTableCellElement>('th, td').forEach((element) => {
        setElementDirection(element, TableDirection);
        element.style.textAlign = TableDirection === 'rtl' ? 'right !important' : 'left';
      });
  });

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
