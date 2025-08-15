const fs = require("fs");
const path = require("path");

const apiKey = process.env.YT_API_KEY;
if (!apiKey) {
    console.error("ERROR: No API key found. Set YT_API_KEY in GitHub Secrets.");
    process.exit(1);
}

const htmlPath = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(htmlPath, "utf8");

// Extraer IDs de YouTube del HTML
const videoIdRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/g;
let ids = [];
let match;
while ((match = videoIdRegex.exec(html)) !== null) {
    ids.push(match[1]);
}
ids = [...new Set(ids)];
console.log(`[filter] Found ${ids.length} video IDs.`);

async function checkVideo(id) {
    try {
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=status,contentDetails&id=${id}&key=${apiKey}`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data.items.length) return false;

        const status = data.items[0].status;
        const content = data.items[0].contentDetails;

        // API checks
        if (!status.embeddable) return false;
        if (status.privacyStatus !== "public") return false;
        if (status.uploadStatus !== "processed") return false;
        if (content.regionRestriction) return false;

        // Extra check con oEmbed
        const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
        const oembedRes = await fetch(oembedUrl);
        if (!oembedRes.ok) return false;

        return true;
    } catch (e) {
        console.error(`[filter] Error checking ${id}:`, e);
        return false;
    }
}

(async () => {
    const results = {};
    for (let i = 0; i < ids.length; i++) {
        const ok = await checkVideo(ids[i]);
        results[ids[i]] = ok;
        console.log(`[filter] ${ids[i]}: ${ok ? "OK" : "REMOVE"}`);
    }

    let removedCount = 0;
    html = html.replace(/<li\b[^>]*>[\s\S]*?<\/li>/g, (li) => {
        const m = li.match(videoIdRegex);
        if (m && m[1] && results[m[1]] === false) {
            removedCount++;
            return "";
        }
        return li;
    });

    fs.writeFileSync(htmlPath, html, "utf8");
    console.log(`[filter] Removed ${removedCount} non-embeddable videos.`);
})();
