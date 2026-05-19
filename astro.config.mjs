// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: "https://zagare.today",
  output: "static",
  integrations: [
    react(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        if (item.url === "https://zagare.today/") {
          item.priority = 1.0;
        }
        return item;
      },
    }),
  ],

  build: {
    assets: "_assets",
  },

  vite: {
    plugins: [tailwindcss()],
  },
});