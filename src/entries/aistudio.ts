import { initFontInjection } from '../lib/fonts';
import { checkEnabled, observeToggle } from '../lib/storage';
import { initAistudio } from '../sites/aistudio';

const SITE_ID = 'aistudio';

checkEnabled(SITE_ID).then((enabled) => {
  if (enabled) {
    initFontInjection();
    initAistudio();
  }
  observeToggle(SITE_ID, (isEnabled) => {
    if (isEnabled) {
      location.reload();
    }
  });
});
