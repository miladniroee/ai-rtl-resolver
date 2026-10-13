import { initFontInjection } from '../lib/fonts';
import { checkEnabled, observeToggle } from '../lib/storage';
import { initLongcat } from '../sites/longcat';

const SITE_ID = 'longcat';

checkEnabled(SITE_ID).then((enabled) => {
  if (enabled) {
    initFontInjection();
    initLongcat();
  }
  observeToggle(SITE_ID, (isEnabled) => {
    if (isEnabled) {
      location.reload();
    }
  });
});
