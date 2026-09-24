/*
 * POSTS LIVE HERE.
 * Copy one object, give it a unique id, write a date, then write the post in body.
 * Dates use: YYYY-MM-DDTHH:MM:SS+03:00
 * category: 'dev' makes a post appear in Dev Log as well as Timeline.
 */
window.POSTS = [
  {
    id: 'first-note',
    date: '2026-09-24T21:30:00+03:00',
    body: 'A small corner for passing thoughts, links, and things worth remembering.',
    category: 'note'
  },
  {
    id: 'building-in-public',
    date: '2026-09-24T20:10:00+03:00',
    body: 'The first version is deliberately simple: write the thought, commit it, and let the timeline grow.',
    category: 'dev'
  }
];
