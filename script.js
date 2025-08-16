// --- script.js robusto ---
window.addEventListener('DOMContentLoaded', () => {
  // Zona de diagnóstico visible
  const statusBar = document.createElement('div');
  statusBar.id = 'app-status';
  statusBar.style.cssText = 'margin:10px 0;color:#b00020;font-size:14px;';
  document.body.prepend(statusBar);

  // Fallback mínimo para que SIEMPRE se vea algo si falla uk-songs.js
  const fallback = [
    { id:"fJ9rUzIMcZQ", title:"Bohemian Rhapsody", artist:"Queen", decade:"70s", year:1975, genre:"Progressive rock", youtube:"https://www.youtube.com/watch?v=fJ9rUzIMcZQ" },
    { id:"YkgkThdzX-8", title:"Imagine", artist:"John Lennon", decade:"70s", year:1971, genre:"Pop rock", youtube:"https://www.youtube.com/watch?v=YkgkThdzX-8" }
  ];

  // Datos: usa ukSongs si existe, si no, fallback
  const songs = (Array.isArray(window.ukSongs) && window.ukSongs.length) ? window.ukSongs : fallback;

  // Elementos base
  const list = document.getElementById('songList');
  const genreFilter = document.getElementById('genreFilter'); // opcional

  if (!list) {
    statusBar.textContent = 'Error: falta <ul id="songList"> en el HTML.';
    return;
  }

  // Helper: obtener ID de YouTube
  const getYouTubeId = (s) => {
    if (s.id) return s.id;
    if (s.youtube) {
      const m = s.youtube.match(/[?&]v=([^&]+)/);
      if (m && m[1]) return m[1];
      // urls tipo youtu.be/XXXX
      const m2 = s.youtube.match(/youtu\.be\/([^?&/]+)/);
      if (m2 && m2[1]) return m2[1];
    }
    return '';
  };

  // Render listado
  function render(data){
    list.innerHTML = data.map((s) => {
      const vid = getYouTubeId(s);
      const thumb = vid ? `https://img.youtube.com/vi/${vid}/mqdefault.jpg` : '';
      const titleLine = `${s.title} – ${s.artist} – ${s.decade} – ${s.year}`;
      return `
        <li style="display:flex;align-items:center;gap:12px;background:#fff;padding:10px 12px;border-radius:12px;margin-bottom:10px;box-shadow:0 2px 10px rgba(0,0,0,.05);">
          ${thumb ? `<img src="${thumb}" alt="${s.title}" style="width:64px;height:64px;object-fit:cover;border-radius:8px;">` : ''}
          <div class="song-main" style="display:flex;flex-direction:column;gap:4px;min-width:0;">
            <a class="song-title" href="#" onclick="loadVideo('${vid}', event)" style="text-decoration:none;color:#0b5bd3;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${titleLine}</a>
            <span class="genre-pill" style="display:inline-block;font-size:12px;line-height:1;padding:6px 8px;border-radius:999px;background:#eef2ff;border:1px solid #c7d2fe;color:#273c75;">${s.genre || ''}</span>
          </div>
        </li>
      `;
    }).join('');
  }

  // Filtro de género si existe el select
  if (genreFilter) {
    const genres = [...new Set(songs.map(s => s.genre).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    genreFilter.innerHTML = `<option value="__all__">Todos</option>` + genres.map(g=>`<option value="${g}">${g}</option>`).join('');
    genreFilter.addEventListener('change', () => {
      const val = genreFilter.value;
      const data = val === '__all__' ? songs : songs.filter(s => s.genre === val);
      render(data);
      statusBar.textContent = '';
    });
  }

  // Player básico con autoplay
  window.loadVideo = (videoId, e) => {
    e.preventDefault();
    if (!videoId) {
      statusBar.textContent = 'No se pudo obtener el ID de YouTube para esta canción.';
      return;
    }
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoPlayer');
    if (!modal || !player) {
      statusBar.textContent = 'Faltan elementos del modal (#videoModal o #videoPlayer).';
      return;
    }
    player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    modal.classList.add('show');
  };
  const modal = document.getElementById('videoModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
        const player = document.getElementById('videoPlayer');
        if (player) player.src = '';
      }
    });
  }

  // Render inicial
  render(songs);

  // Mensaje de estado
  statusBar.textContent = (songs === fallback)
    ? 'Aviso: No se cargó uk-songs.js. Mostrando 2 canciones de prueba (fallback). Revisa nombre/ruta y orden de scripts.'
    : '';
});