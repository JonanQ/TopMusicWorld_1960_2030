const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');

const htmlPath = 'index.html';
const apiKey = process.env.YT_API_KEY;

if (!apiKey) {
  console.error('ERROR: No API key provided. Set YT_API_KEY in GitHub Secrets.');
  process.exit(1);
}

(async () => {
  try {
    let html = fs.readFileSync(htmlPath, 'utf8');
    const $ = cheerio.load(html);

    const ids = [];
    $('#songList li a').each((_, el) => {
      const onclick = $(el).attr('onclick') || '';
      const match = onclick.match(/loadVideo\('([^']+)'/);
      if (match) ids.push(match[1]);
    });

    console.log(`Encontrados ${ids.length} IDs de vídeo.`);

    const chunkSize = 50;
    const invalidIds = [];

    for (let i = 0; i < ids.length; i += chunkSize) {
      const chunk = ids.slice(i, i + chunkSize);
      const url = `https://www.googleapis.com/youtube/v3/videos?part=status&id=${chunk.join(',')}&key=${apiKey}`;

      const { data } = await axios.get(url);
      for (const item of data.items) {
        const st = item.status;
        if (!(st.embeddable && st.privacyStatus === 'public' && st.uploadStatus === 'processed')) {
          invalidIds.push(item.id);
        }
      }
    }

    console.log(`Videos inválidos: ${invalidIds.length}`);
    if (invalidIds.length) console.log('Eliminados:', invalidIds.join(', '));

    $('#songList li').each((_, el) => {
      const link = $(el).find('a');
      const onclick = link.attr('onclick') || '';
      const match = onclick.match(/loadVideo\('([^']+)'/);
      if (match && invalidIds.includes(match[1])) {
        $(el).remove();
      }
    });

    fs.writeFileSync(htmlPath, $.html(), 'utf8');
    console.log('index.html filtrado y listo para publicar.');
  } catch (err) {
    console.error('Error filtrando vídeos:', err);
    process.exit(1);
  }
})();
