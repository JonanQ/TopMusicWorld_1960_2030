// Node 20+, sin dependencias externas
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.YT_API_KEY || "";
const HTML_PATH = path.join(process.cwd(), "index.html");

// --- Utilidades ---
function uniq(arr) { return [...new Set(arr)]; }
function log(...a) { console.log("[filter]", ...a); }
function warn(...a) { console.warn("[filter][WARN]", ...a); }
function err(...a) { console.error("[filter][ERROR]", ...a); }

// Extrae IDs desde onclick="loadVideo('ID', ...)" y también desde URLs watch?v= / youtu.be
function extractIds(html) {
  const ids = [];

  // onclick="loadVideo('ID', ...)"
  for (const m of html.matchAll(/loadVideo\('([a-zA-Z0-9_-]{11})'/g)) {
    ids.push(m[1]);
  }
  // https://www.youtube.com/watch?v=ID
  for (const m of html.matchAll(/watch\?v=([a-zA-Z0-9_-]{11})/g)) {
    ids.push(m[1]);
  }
  // https:\/\/youtu.be\/ID
  for (const m of html.matchAll(/youtu\.be\/([a-zA-Z0-9_-]{11})/g)) {
    ids.push(m[1]);
  }
  return uniq(ids);
}

async function ytVideosStatus(ids) {
  if (!API_KEY) return new Map(); // sin API devolvemos vacío
  const url =
    "https://www.googleapis.com/youtube/v3/videos"
    + `?part=status,contentDetails&id=${ids.join(",")}&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`YouTube API ${res.status}`);
  const data = await res.json();
  const map = new Map();
  for (const it of (data.items || [])) {
    const st = it.status || {};
    const cd = it.contentDetails || {};
    const rr = cd.regionRestriction || {};
    const hasRR = (rr.blocked && rr.blocked.length) || (rr.allowed && rr.allowed.length);
    const emb = !!st.embeddable && st.privacyStatus === "public" && st.uploadStatus === "processed" && !hasRR;
    map.set(it.id, { emb, st, cd, hasRR: !!hasRR });
  }
  return map;
}

async function oembedOk(id) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
  try {
    const r = await fetch(url);
    return r.ok;
  } catch {
    return false;
  }
}

// --- Proceso principal ---
(async () => {
  if (!fs.existsSync(HTML_PATH)) {
    err(`index.html no encontrado en ${HTML_PATH}`);
    process.exit(0); // no rompemos el build
  }

  let html = fs.readFileSync(HTML_PATH, "utf8");
  const ids = extractIds(html);
  log(`IDs detectados: ${ids.length}`);
  if (!ids.length) {
    warn("No se detectaron IDs. No se aplica filtrado.");
    process.exit(0);
  }

  if (!API_KEY) {
    warn("YT_API_KEY no configurada. Se publica sin filtrar.");
    process.exit(0);
  }

  const keep = new Set();
  const removed = [];

  // Procesa por lotes de 50
  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50);
    const info = await ytVideosStatus(batch);

    for (const id of batch) {
      const meta = info.get(id);
      let ok = false;
      const reasons = [];

      if (!meta) {
        reasons.push("not_found");
      } else {
        if (!meta.st?.embeddable) reasons.push("embeddable=false");
        if (meta.st?.privacyStatus !== "public") reasons.push(`privacy=${meta.st?.privacyStatus}`);
        if (meta.st?.uploadStatus !== "processed") reasons.push(`upload=${meta.st?.uploadStatus}`);
        if (meta.hasRR) reasons.push("regionRestriction");
        ok = reasons.length === 0;
      }

      // Doble chequeo con oEmbed (atrapa casos raros)
      if (ok) {
        const oe = await oembedOk(id);
        if (!oe) {
          ok = false;
          reasons.push("oembed_fail");
        }
      }

      if (ok) keep.add(id);
      else removed.push({ id, reasons: reasons.join(",") || "unknown" });
    }
  }

  log(`Conservamos ${keep.size}/${ids.length} vídeos.`);
  if (removed.length) {
    log("Eliminados:");
    for (const r of removed) log(` - ${r.id}: ${r.reasons}`);
  }

  // Reescribe el <ul id="songList"> con solo los <li> válidos
  const ulRe = /(<ul\s+id="songList"[^>]*>)([\s\S]*?)(<\/ul>)/m;
  const m = html.match(ulRe);
  if (!m) {
    warn("<ul id=\"songList\"> no encontrado. No se modifica el HTML.");
    process.exit(0);
  }
  const open = m[1], inner = m[2], close = m[3];
  const lis = inner.match(/<li[\s\S]*?<\/li>/g) || [];

  const keptLis = lis.filter(li => {
    const idMatch =
      li.match(/loadVideo\('([a-zA-Z0-9_-]{11})'/) ||
      li.match(/watch\?v=([a-zA-Z0-9_-]{11})/) ||
      li.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (!idMatch) return true; // si no encontramos ID, lo conservamos
    return keep.has(idMatch[1]);
  });

  const newInner = keptLis.join("\n");
  html = html.replace(ulRe, `${open}\n${newInner}\n${close}`);
  fs.writeFileSync(HTML_PATH, html, "utf8");
  log(`HTML filtrado escrito en ${HTML_PATH}`);
})().catch(e => {
  // No tumbamos el deploy por fallos externos de red/API
  warn(`Fallo no crítico en filtrado: ${e && e.message ? e.message : e}`);
  process.exit(0);
});
