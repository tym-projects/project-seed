import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const manifestPath = new URL('../../docs/sprint37-candidate-manifest.json', import.meta.url);

test('Sprint 37 manifest reserves exactly 355 candidates across the eight active banks', () => {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  assert.equal(manifest.sprint, 37);
  assert.equal(manifest.status, 'Implementation Complete / Awaiting Human Acceptance');
  assert.equal(manifest.targetActivePracticePerBank, 60);
  assert.equal(manifest.entries.length, 355);
  assert.deepEqual(manifest.entries.reduce((counts, entry) => {
    const key = `${entry.student}/${entry.subject}`;
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {}), {
    'jiejie/chinese': 48,
    'jiejie/mathematics': 42,
    'jiejie/natural_science': 43,
    'jiejie/social_studies': 46,
    'meimei/chinese': 44,
    'meimei/mathematics': 43,
    'meimei/natural_science': 43,
    'meimei/social_studies': 46,
  });
});
