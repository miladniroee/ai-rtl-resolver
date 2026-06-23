export type TextDirection = 'ltr' | 'rtl';

const PERSIAN_WEIGHT_PERCENTAGE = 50;

const PERSIAN_SCRIPT_REGEX =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

const EMOJI_REGEX = /[\p{Emoji}\p{Emoji_Presentation}]/u;

const IGNORABLE_CHAR_REGEX =
  /[\d\s\u200E\u200F\u200B#@$%^&*()\-+=_{}[\]\\|:;"'<>,.?/~`!\u00AB\u00BB]/;

function isEmojiLike(char: string): boolean {
  return EMOJI_REGEX.test(char);
}

function isIgnorableChar(char: string): boolean {
  return IGNORABLE_CHAR_REGEX.test(char);
}

function isRtlScriptChar(char: string): boolean {
  return PERSIAN_SCRIPT_REGEX.test(char);
}

function segmentGraphemes(text: string): readonly Intl.SegmentData[] {
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  return [...segmenter.segment(text)];
}

function directionFromFirstMeaningfulChar(
  segments: readonly Intl.SegmentData[],
): TextDirection {
  for (const { segment: char } of segments) {
    if (isEmojiLike(char) || isIgnorableChar(char)) {
      continue;
    }
    return isRtlScriptChar(char) ? 'rtl' : 'ltr';
  }
  return 'ltr';
}

export function detectParagraphDirection(text: string): TextDirection {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return 'ltr';
  }

  const segments = segmentGraphemes(trimmed);
  let rtlCount = 0;
  let ltrCount = 0;
  let firstMeaningfulIsRtl: boolean | null = null; // add this

  for (const { segment: char } of segments) {
    if (isEmojiLike(char) || isIgnorableChar(char)) {
      continue;
    }
    
    console.log(char, isRtlScriptChar(char))
    if (firstMeaningfulIsRtl === null) {
      firstMeaningfulIsRtl = isRtlScriptChar(char);
    }

    if (isRtlScriptChar(char)) {
      rtlCount += 1;
    } else {
      ltrCount += 1;
    }
  }


  if (firstMeaningfulIsRtl === true) {
    return 'rtl';
  }

  const totalRelevant = rtlCount + ltrCount;
  if (totalRelevant > 0) {
    const rtlPercentage = (rtlCount / totalRelevant) * 100;
    if (rtlPercentage > PERSIAN_WEIGHT_PERCENTAGE) {
      return 'rtl';
    }
  }

  return directionFromFirstMeaningfulChar(segments);
}
