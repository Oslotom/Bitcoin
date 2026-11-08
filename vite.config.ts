import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import {getPageDates} from './scripts/page-dates.mjs';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), {
      name: 'search-verification',
      transformIndexHtml() {
        return [
          ['google-site-verification', env.VITE_GOOGLE_SITE_VERIFICATION],
          ['msvalidate.01', env.VITE_BING_SITE_VERIFICATION],
        ].filter(([, value]) => value && /^[a-zA-Z0-9_-]+$/.test(value)).map(([name, content]) => ({ tag: 'meta', attrs: { name, content }, injectTo: 'head' as const }));
      },
    }],
    base: '/',
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      // Sist endret per side (fra git). Vises som «Sist oppdatert», samme dato som i sitemap og JSON-LD
      __PAGE_DATES__: JSON.stringify(getPageDates()),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
