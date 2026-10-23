import { defineConfig } from 'astro/config';

// Emit 1-Voices.html (not 1-Voices/index.html) so existing URLs, bookmarks and relative links keep working.
export default defineConfig({
  build: { format: 'file' },
});
