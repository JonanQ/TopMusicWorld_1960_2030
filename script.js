window.addEventListener('DOMContentLoaded', () => {
  // 1) Fuente de datos
  const songs = (window.ukSongs && Array.isArray(window.ukSongs)) ? window.ukSongs : [];

  // 2) Elementos base
  const list = document.getElementById('songList');
  const genreFilter = document.getElementById('genreFilter');

  // 3) Guardas y diagnósticos
  if (!list) {
    document.body.insertAdjacentHTML('beforeend',
      '<p style="color:#b00020">Error: No se encontró #songList en el HTML.</p>');
    return;
  }
  if (!songs.length) {
    list.innerHTML = '<li style="padding:10px;color:#b00020">No hay canciones cargadas. Revisa que <code>uk-songs.js</code> exista y se cargue antes que <code>script.js</code>.</li>';
    return;
  }

  // ===== Render y filtros (ajusta a tu implementación) =====
  const uniqueGenres = [...new Set(songs.map(s => s.genre))].sort((a,b)=>a.localeCompare(b));
  genreFilter.innerHTML = '<option value="__all__">Todos</option>' + uniqueGenres.map(g=>`<option value="${g}">${g}</option>`).join('');

  function render(listData){
    list.innerHTML = listData.map(s => `
      <li>
        <img src="https://img.youtube.com/vi/${s.id || (s.youtube?.split('v=')[1] || '').split('&')[0]}/mqdefault.jpg" alt="${s.title}">
        <div class="song-main">
          <a class="song-title" href="#" onclick="loadVideo('${(s.id || (s.youtube?.split('v=')[1] || '').split('&')[0])}', event)">${s.title} – ${s.artist} – ${s.decade} – ${s.year}</a>
          <span class="genre-pill">${s.genre}</span>
        </div>
      </li>
    `).join('');
  }

  function applyFilter(){
    const g = genreFilter.value;
    const filtered = g === '__all__' ? songs : songs.filter(s => s.genre === g);
    render(filtered);
  }

  render(songs);
  genreFilter.addEventListener('change', applyFilter);

  // Player básico
  window.loadVideo = (videoId, e) => {
    e.preventDefault();
    const player = document.getElementById("videoPlayer");
    document.getElementById("videoModal").classList.add("show");
    player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  };
  document.getElementById("videoModal").addEventListener("click", (e)=>{
    if (e.target.id === "videoModal") {
      document.getElementById("videoModal").classList.remove("show");
      document.getElementById("videoPlayer").src = "";
    }
  });
});