import { initFontInjection } from '../lib/fonts';
import { checkEnabled, observeToggle } from '../lib/storage';
import { initLumo } from '../sites/lumo';

const SITE_ID = 'lumo';

checkEnabled(SITE_ID).then((enabled) => {
  if (enabled) {
    initFontInjection();
    initLumo();
  }
  observeToggle(SITE_ID, (isEnabled) => {
    if (isEnabled) {
      location.reload();
    }
  });
});
