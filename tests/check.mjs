// Quick self-check for the practice logic: `npm test`.
// Runs public/practice.js and the question generators from the Voices and Verbs pages in Node.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const store = {};
const window = {};
const localStorage = { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; } };
new Function('window', 'localStorage', 'document', read('public/practice.js'))(window, localStorage, { addEventListener() {} });
const TLM = window.TLM;

// deal: no repeats until every item has been seen, then a new cycle starts
const list = Array.from({ length: 10 }, (_, i) => 'q' + i);
const first = TLM.deal('t', list, 4), second = TLM.deal('t', list, 4);
assert.equal(new Set([...first, ...second]).size, 8, 'second round repeats a question');
const third = TLM.deal('t', list, 4);
assert.ok(['q0','q1','q2','q3','q4','q5','q6','q7','q8','q9'].filter((q) => ![...first, ...second].includes(q)).every((q) => third.includes(q)), 'unseen questions must come first');

// a page's generator code runs between its marker comment and `stop`
function generator(page, stop, cls) {
  const s = read(page);
  const code = s.slice(s.indexOf('/* ---------- sentence generator'), s.indexOf(stop));
  return new Function('TLM', 'shuffle', 'cls', code + ';return generate')(TLM, TLM.shuffle, cls);
}

for (const cls of [6, 7, 8]) {
  for (let r = 0; r < 50; r++) {
    for (const g of generator('src/pages/1-Voices.astro', 'var mode="spot"', cls)(6)) {
      assert.equal(g.ans.join(' ') + '.', g.pas, 'Voices build pieces must spell the passive sentence');
      assert.ok(g.d.length && g.d.every((x) => !g.ans.includes(x)), 'Voices distractors must not be answer pieces: ' + g.act);
    }
    for (const g of generator('src/pages/5-Correct-Form-of-Verbs.astro', '  function resetPractice(){', cls)(8)) {
      assert.equal(new Set(g.o).size, 3, 'Verbs question needs 3 different options: ' + g.pre + ' ' + g.post);
      assert.ok(g.o.includes(g.ans), 'Verbs answer missing from options');
    }
  }
}
console.log('practice checks passed');
