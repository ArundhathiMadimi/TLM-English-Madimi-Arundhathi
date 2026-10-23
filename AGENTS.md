# AGENTS.md

Guide for anyone (human or AI agent) changing this repo.

## What this is

Interactive English grammar teaching-learning material (TLM) for Classes 6 to 8, prepared by **Madimi Arundhathi**. It is a static [Astro](https://astro.build) site deployed on Vercel at https://tlmenglish.vercel.app. Every push to `main` builds and deploys automatically.

```
src/lessons.js            lesson list: order, title, icon, blurb. Drives the start page cards and Previous/Next buttons
src/layouts/Base.astro    shared <head> (fonts, theme.css) and the "All topics" button on lesson pages
src/components/LessonNav.astro   Previous / Next buttons at the bottom of each lesson
src/pages/index.astro     start page
src/pages/N-Topic.astro   one lesson per topic (1-Voices.astro ... 7-Modal-Verbs.astro)
public/theme.css          shared colours, fonts and common components, copied to the site as-is
public/feedback.js        right/wrong sounds (Web Audio, no files), confetti and the Sound on/off button
public/practice.js        TLM helpers for lesson scripts: deal (random, no repeats), result screen, retry round
tests/check.mjs           npm test: checks practice.js and the Voices/Verbs sentence generators
astro.config.mjs          build.format "file" -> pages build to 1-Voices.html, not 1-Voices/
vercel.json               tells Vercel to build with Astro and serve dist/
```

## Commands

```
npm install        once
npm run dev        local server at http://localhost:4321
npm run build      build the site into dist/ (run before pushing)
npm run preview    serve the built dist/
npm test           practice logic checks (run after changing practice.js or a generator)
```

## Hard rules

1. **The output is plain static HTML.** Don't add SSR, a server adapter, API routes or client frameworks (React, Vue and so on) without agreeing it first. Keep the dependency list small; right now it is just `astro`.
2. **URLs never change.** Pages build to `/<slug>.html` (`build.format: 'file'`). Teachers have bookmarked these, so don't rename lesson files.
3. **Relative links only** (`href="theme.css"`, `href="4-Clauses.html"`). Never start a path with `/`. Then `dist/` also works when it's copied to a pen drive and opened offline.
4. **Must work offline.** The only external resource is Google Fonts, and every font stack has a system fallback. Don't add CDNs, trackers or remote images.
5. **File names are case-sensitive on Vercel** (macOS is not). Links and slugs must match the file name exactly, capitals included.
6. **Keep `vercel.json` and `astro.config.mjs` as they are** unless you are deliberately changing the deployment. Run `npm run build` before pushing; a failed build means a failed deploy.

## Astro gotchas in the lesson pages

- **Braces `{ }` in the page markup are Astro expressions.** To show a literal brace in text, write `&#123;` and `&#125;`. Braces inside `<script is:inline>` and `<style is:inline>` are fine.
- **Page styles use `<style is:inline slot="head">`.** Astro's default scoped styles wouldn't reach the elements the lesson scripts create at runtime. `slot="head"` keeps them after `theme.css`, so a page's own rules win.
- **Page scripts use `<script is:inline>`**, so Astro leaves them untouched. They are written in ES5 style (`var`, `function`) inside one `(function(){ "use strict"; ... })();` with the local helpers `$`, `shuffle` and `esc`. Pass any text through `esc()` before putting it into `innerHTML`. Honour `prefers-reduced-motion`.

## Styling

- **Light theme only.** Don't add dark mode or `prefers-color-scheme` rules.
- **`public/theme.css` holds anything shared**: design tokens on `:root`, the base layout, `.btn` (also on `<a>`), `.seg`, `.card`, `.demo`, `.classbar`, `details`, `footer` and the nav. Change the look of the whole site there.
- **Page-only styles go in that page's head style block**, including its own chip colour tokens (for example `--s-bg`, `--s-c`, `--s-t`).
- **Use tokens, not raw hex**: `--bg`, `--surface`, `--ink`, `--muted`, `--line`, `--accent`, `--good`/`--bad`, and the rainbow `--c1` to `--c6`.
- **Section colours are automatic.** The heading colour and card top border of each `main > section` cycle through `--c1` to `--c6` via `--sec`.
- **Keep it friendly for kids**: large rounded shapes, bright colours and big tap targets (`min-height` of 2.9rem or more). Body text uses `--ink`/`--muted`; the rainbow colours are only for large headings, borders and decoration.
- **Check at phone width (375px) and on desktop.** Teachers project these pages in class, and students open them on phones.

## Lesson page structure

Every lesson uses `<Base title="..." lesson>` and keeps the same layout and IDs:

1. `header.hero`: the topic title (`h1`, rainbow gradient), a `.sub` line, and an interactive `.demo` box with a **Listen** button (`#listen`, which uses `speechSynthesis`).
2. `nav.classbar`: the "I am in class" 6/7/8 selector (`#classSeg`). The class chosen filters the content on the page.
3. `main.wrap` with `section`s: topic-specific sections, then `#practice` (`#modeSeg`, `#pbody`), then `#teacher` (teacher notes in `<details>`).
4. `<LessonNav slug="..." />`, then `footer` with "Prepared by Madimi Arundhathi".

**Practice games follow one pattern** (see any lesson's `resetPractice`):
- Pick questions with `TLM.deal("<lesson>-<mode>-"+cls, list, n)`. It returns a random set and shows questions this device hasn't seen before repeats. Never use a fixed order.
- Each game state has `miss:[]`. Push the question on a wrong answer, end the round with `TLM.result(score, n, message, miss.length)`, and handle `data-act="retry"` with `TLM.retry(miss)`.
- Every class should be able to draw at least 16 questions per game. Each question must have exactly one defensible answer, with distractors that are clearly wrong.
- Voices and Correct Form of Verbs also **generate** questions from word tables (the `sentence generator` block) and mix them with the hand-written ones. To add variety there, add verbs or subjects to those tables. Leave out verbs whose V1 and V2 look the same (read, put, cut), then run `npm test`.

**Answer feedback is automatic.** `feedback.js` watches clicks inside `#pbody`. When a click gives a `.fb` element the class `good` or `bad`, it plays the matching sound (plus confetti for a correct answer). When a `.result` box appears, it plays the end-of-round fanfare. A new practice game gets all of this for free as long as it keeps that markup. Never call `feedback.js` directly from a lesson.

## Adding a new topic

1. Copy the closest lesson to `src/pages/8-New-Topic.astro`, then change the `slug` passed to `LessonNav`, the title, the content and the chip tokens.
2. Add `{ slug: '8-New-Topic', title, icon, blurb }` to `src/lessons.js`. The start page card and the Previous/Next buttons update automatically. Write the blurb for kids and use an emoji icon.
3. Run `npm run build` and click through the new page.

## Content and accessibility

- Use simple English suited to Indian school students in Classes 6 to 8, with Indian names and familiar everyday contexts.
- Every control is a real `<button type="button">` or link with a visible label. Keep `aria-pressed` on toggles, `aria-live` on regions that update, and the visible focus outline. Mark decorative emoji `aria-hidden="true"`.
- Don't rely on colour alone. Chips carry a text label (for example "doer" or "action") as well as their colour.

## Before you push

- Run `npm run build` and `npm test`; both must succeed.
- Open the changed pages with `npm run dev` or `npm run preview` at 375px and desktop width. Click through the demo, the class switch, one practice round and the nav buttons, and check that the console shows no errors.
- Commit straight to `main`; pushing deploys to Vercel. Don't add AI or co-author attribution lines to commit messages.
