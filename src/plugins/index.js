/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify';
import { createPinia } from 'pinia';

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(createPinia())
}
