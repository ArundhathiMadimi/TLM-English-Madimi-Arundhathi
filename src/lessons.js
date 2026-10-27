// Lessons grouped into sections, in learning order. This order drives the start page and the Previous/Next buttons.
// `slug` must match the page file name in src/pages (it becomes <slug>.html). Slugs keep their original numbers so
// published URLs never change; the numbers are not shown anywhere.
export const groups = [
  { title: 'Words', icon: '🧱', blurb: 'What each word does', lessons: [
    { slug: '9-Parts-of-Speech', title: 'Parts of Speech', icon: '🏷️', blurb: 'Every word has a job. Find it!' },
    { slug: '16-Types-of-Nouns', title: 'Types of Nouns', icon: '📛', blurb: 'Naming words: proper, common, collective and more' },
    { slug: '15-Articles', title: 'Articles', icon: '🅰️', blurb: 'A, an or the? Listen to the first sound' },
    { slug: '12-Adjectives', title: 'Adjectives', icon: '🎨', blurb: 'Describing words: big, bigger, biggest' },
    { slug: '11-Prepositions', title: 'Prepositions', icon: '📦', blurb: 'In, on, under: where is the cat?' },
    { slug: '6-Synonyms', title: 'Synonyms', icon: '🔤', blurb: 'Same meaning, different strength' },
    { slug: '14-Antonyms', title: 'Antonyms', icon: '↔️', blurb: 'Opposites: hot and cold, up and down' },
  ] },
  { title: 'Verbs', icon: '🏃', blurb: 'Action words and their forms', lessons: [
    { slug: '10-Types-of-Verbs', title: 'Types of Verbs', icon: '🏃', blurb: 'Action, helping, linking and more' },
    { slug: '8-Tenses', title: 'Tenses', icon: '📅', blurb: 'Past, present and future: when did it happen?' },
    { slug: '5-Correct-Form-of-Verbs', title: 'Correct Form of Verbs', icon: '⏰', blurb: 'Pick the right verb for the right time' },
    { slug: '7-Modal-Verbs', title: 'Modal Verbs', icon: '🙋', blurb: 'can, may, must, should and more' },
    { slug: '13-Phrasal-Verbs', title: 'Phrasal Verbs', icon: '🧲', blurb: 'Give up, look after, run out of' },
  ] },
  { title: 'Sentences', icon: '🧩', blurb: 'Putting words together', lessons: [
    { slug: '4-Clauses', title: 'Clauses', icon: '🧩', blurb: 'Build big sentences from small parts' },
    { slug: '1-Voices', title: 'Voices', icon: '🔄', blurb: 'Active and Passive: flip the sentence around' },
    { slug: '2-Direct-and-Indirect-Speech', title: 'Direct and Indirect Speech', icon: '💬', blurb: 'Say the exact words, or report them' },
  ] },
  { title: 'Poetry', icon: '🎵', blurb: 'How poets play with words', lessons: [
    { slug: '3-Poetic-Devices', title: 'Poetic Devices', icon: '🎵', blurb: 'Sounds, comparisons and word pictures' },
  ] },
];

export const lessons = groups.flatMap((g) => g.lessons);
