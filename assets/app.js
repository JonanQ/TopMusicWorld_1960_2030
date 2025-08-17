const YT_API_KEY = "PON_AQUI_TU_API_KEY";

async function searchYouTubeFallback(query) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=5&q=${encodeURIComponent(query)}&key=${YT_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const result = data.items?.[0];
    return result ? result.id.videoId : null;
  } catch (e) {
    console.error("Error buscando en YouTube", e);
    return null;
  }
}

window.loadVideo = async (videoId, title = "", artist = "") => {
  const modal = document.getElementById("videoModal");
  modal.classList.add("show");

  try {
    if (window._ytPlayer) window._ytPlayer.destroy();
    window._ytPlayer = new YT.Player("videoPlayer", {
      videoId,
      playerVars: { autoplay: 1, rel: 0, modestbranding: 1 },
      events: {
        onError: async () => {
          const fallbackId = await searchYouTubeFallback(`${artist} ${title} official video`);
          if (fallbackId) {
            loadVideo(fallbackId);
          } else {
            closeModalHard();
            window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(artist + " " + title)}`, "_blank");
          }
        }
      }
    });
  } catch (e) {
    closeModalHard();
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  }
};

function closeModalHard() {
  const modal = document.getElementById("videoModal");
  modal.classList.remove("show");
  if (window._ytPlayer && window._ytPlayer.destroy) {
    try { window._ytPlayer.stopVideo(); } catch(e){}
    window._ytPlayer.destroy();
  }
  window._ytPlayer = null;
}

function renderSongs() {
  const list = document.getElementById("songList");
  list.innerHTML = "";
  const search = document.getElementById("searchInput").value.toLowerCase();
  const decade = document.getElementById("decadeFilter").value;

  ukSongs
    .filter(song =>
      (!decade || song.decade === decade) &&
      (song.title.toLowerCase().includes(search) || song.artist.toLowerCase().includes(search))
    )
    .forEach(song => {
      const card = document.createElement("div");
      card.className = "song-card";
      card.innerHTML = `
        <img src="https://img.youtube.com/vi/${song.videoId}/hqdefault.jpg" alt="cover">
        <div>
          <strong>${song.title}</strong><br>
          ${song.artist} – ${song.year} (${song.decade})<br>
          <small>${song.genre}</small>
        </div>`;
      card.onclick = () => loadVideo(song.videoId, song.title, song.artist);
      list.appendChild(card);
    });
}

window.onload = () => {
  document.getElementById("searchInput").addEventListener("input", renderSongs);
  document.getElementById("decadeFilter").addEventListener("change", renderSongs);
  renderSongs();
};

document.getElementById("videoModal").addEventListener("click", (e) => {
  if (e.target.id === "videoModal") closeModalHard();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModalHard();
});