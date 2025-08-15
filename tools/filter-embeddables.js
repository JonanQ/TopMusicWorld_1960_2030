#!/usr/bin/env node
/**
 * Filter non-embeddable YouTube videos from index.html at build time.
 * Requires env var YT_API_KEY (repo secret).
 */
const fs = require('fs');

const API_KEY = process.env.YT_API_KEY;
if (!API_KEY) {
  console.log('[filter] No YT_API_KEY provided; skipping filtering.');
  process.exit(0);
}

const FILE = 'index.html';
let html = fs.readFileSync(FILE, 'utf8');

// Extract all unique video IDs from loadVideo('ID', ...)
const idMatches = [...html.matchAll(/loadVideo\('([^']+)'/g)];
const ids = Array.from(new Set(idMatches.map(m => m[1])));

if (ids.length === 0) {
  console.log('[filter] No video IDs found, nothing to filter.');
  process.exit(0);
}

console.log(`[filter] Found ${ids.length} candidate IDs.`);

async function fetchBatch(batch) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=status&id=${batch.join(',')}&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(()=>''); 
    throw new Error(`[filter] API ${res.status}: ${text}`);
  }
  const data = await res.json();
  const allowed = new Set();
  for (const item of data.items || []) {
    const st = item.status || {};
    if (st.embeddable && st.privacyStatus === 'public' && st.uploadStatus === 'processed') {
      allowed.add(item.id);
    }
  }
  return allowed;
}

(async () => {
  // Node 18+ has global fetch; ensure it's available
  if (typeof fetch !== 'function') {
    console.error('[filter] This script requires Node 18+ with global fetch.');
    process.exit(1);
  }
  const batches = [];
  for (let i = 0; i < ids.length; i += 50) batches.push(ids.slice(i, i + 50));

  const allowed = new Set();
  for (const b of batches) {
    const ok = await fetchBatch(b);
    ok.forEach(id => allowed.add(id));
  }
  console.log(`[filter] Embeddable: ${allowed.size}/${ids.length}`);

  // Replace <ul id="songList"> ... </ul> with only embeddable <li>
  const ulRe = /(<ul\s+id="songList"[^>]*>)([\s\S]*?)(<\/ul>)/m;
  const m = html.match(ulRe);
  if (!m) {
    console.error('[filter] <ul id="songList"> not found.');
    process.exit(2);
  }
  const open = m[1], inner = m[2], close = m[3];
  const lis = inner.match(/<li[\s\S]*?<\/li>/g) || [];
  const kept = lis.filter(li => {
    const m2 = li.match(/loadVideo\('([^']+)'/);
    if (!m2) return true; // keep lines without IDs (unlikely)
    return allowed.has(m2[1]);
  });
  const newInner = kept.join('\n');
  html = html.replace(ulRe, `${open}\n${newInner}\n${close}`);
  fs.writeFileSync(FILE, html, 'utf8');
  console.log(`[filter] Kept ${kept.length} of ${lis.length} list items.`);
})().catch(err => {
  console.error(err);
  process.exit(3);
});
