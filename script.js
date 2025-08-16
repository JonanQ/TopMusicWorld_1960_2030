// === Datos (30 temas) con género ===
const ukSongs = [
  // 1960s
  {
    title: "Yesterday",
    artist: "The Beatles",
    decade: "60s",
    year: 1965,
    genre: "Pop rock",
    youtube: "https://www.youtube.com/watch?v=NrgmdOz227I",
    cover: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_yesterday_and_today.jpg"
  },
  {
    title: "(I Can’t Get No) Satisfaction",
    artist: "The Rolling Stones",
    decade: "60s",
    year: 1965,
    genre: "Rock",
    youtube: "https://www.youtube.com/watch?v=nrIPxlFzDi0",
    cover: "https://upload.wikimedia.org/wikipedia/en/b/b2/Satisfaction-us.jpg"
  },
  {
    title: "My Generation",
    artist: "The Who",
    decade: "60s",
    year: 1965,
    genre: "Rock",
    youtube: "https://www.youtube.com/watch?v=qN5zw04WxCc",
    cover: "https://upload.wikimedia.org/wikipedia/en/d/de/TheWhoMyGeneration.jpg"
  },
  {
    title: "Sunshine of Your Love",
    artist: "Cream",
    decade: "60s",
    year: 1967,
    genre: "Blues rock",
    youtube: "https://www.youtube.com/watch?v=zt51rITH3EA",
    cover: "https://upload.wikimedia.org/wikipedia/en/9/94/CreamDisraeliGears.jpg"
  },
  {
    title: "Space Oddity",
    artist: "David Bowie",
    decade: "60s",
    year: 1969,
    genre: "Glam rock",
    youtube: "https://www.youtube.com/watch?v=iYYRH4apXDo",
    cover: "https://upload.wikimedia.org/wikipedia/en/1/12/David_Bowie_-_Space_Oddity.jpg"
  },

  // 1970s
  {
    title: "Imagine",
    artist: "John Lennon",
    decade: "70s",
    year: 1971,
    genre: "Pop rock",
    youtube: "https://www.youtube.com/watch?v=YkgkThdzX-8",
    cover: "https://upload.wikimedia.org/wikipedia/en/3/3b/JohnLennon-albums-imagine.jpg"
  },
  {
    title: "Bohemian Rhapsody",
    artist: "Queen",
    decade: "70s",
    year: 1975,
    genre: "Progressive rock",
    youtube: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    cover: "https://upload.wikimedia.org/wikipedia/en/9/9f/Bohemian_Rhapsody.png"
  },
  {
    title: "Anarchy in the U.K.",
    artist: "Sex Pistols",
    decade: "70s",
    year: 1976,
    genre: "Punk",
    youtube: "https://www.youtube.com/watch?v=qbmWs6Jf5dc",
    cover: "https://upload.wikimedia.org/wikipedia/en/0/03/Anarchy_in_the_UK.jpg"
  },
  {
    title: "Heroes",
    artist: "David Bowie",
    decade: "70s",
    year: 1977,
    genre: "Rock",
    youtube: "https://www.youtube.com/watch?v=lXgkuM2NhYI",
    cover: "https://upload.wikimedia.org/wikipedia/en/6/60/Bowie_Heroes.jpg"
  },
  {
    title: "Wuthering Heights",
    artist: "Kate Bush",
    decade: "70s",
    year: 1978,
    genre: "Art pop",
    youtube: "https://www.youtube.com/watch?v=-1pMMIe4hb4",
    cover: "https://upload.wikimedia.org/wikipedia/en/8/84/Wuthering_Heights_%28Kate_Bush_single_-_cover_art%29.jpg"
  },

  // … continuar con los 80s, 90s, 00s, 10s, 20s …
];

// === Render + Filtro ===
const songList = document.getElementById("songList");
const genreFilter = document.getElementById("genreFilter");

function uniqueGenres(data){
  return [...new Set(data.map(s => s.genre))].sort((a,b)=>a.localeCompare(b));
}
function fillGenreFilter(){
  uniqueGenres(songs).forEach(g=>{
    const opt = document.createElement("option");
    opt.value = g; opt.textContent = g;
    genreFilter.appendChild(opt);
  });
}
function render(list){
  songList.innerHTML = "";
  list.forEach(song=>{
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="https://img.youtube.com/vi/${song.id}/mqdefault.jpg" alt="${song.title}">
      <div class="song-main">
        <a class="song-title" href="#" onclick="loadVideo('${song.id}', event)">${song.title}</a>
        <span class="genre-pill">${song.genre}</span>
      </div>
    `;
    songList.appendChild(li);
  });
}
function applyFilter(){
  const val = genreFilter.value;
  if (val === "__all__") render(songs);
  else render(songs.filter(s => s.genre === val));
}

fillGenreFilter();
render(songs);
genreFilter.addEventListener("change", applyFilter);

// === Modal / Player ===
const modal = document.getElementById("videoModal");
const player = document.getElementById("videoPlayer");
const closeBtn = document.getElementById("closeBtn");
const songCover = document.getElementById("songCover");
const songTitle = document.getElementById("songTitle");
const songGenre = document.getElementById("songGenre");

window.loadVideo = function(videoId, event){
  event.preventDefault();

  // set header info
  const data = songs.find(s=>s.id===videoId);
  if (data){
    songTitle.textContent = data.title.replace(/ – \d{4}s$/, "");
    songGenre.textContent = data.genre;
    songCover.src = `https://img.youtube.com/vi/${data.id}/mqdefault.jpg`;
  }

  // Autoplay con sonido (hay clic del usuario → permitido por el navegador)
  player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  modal.classList.add("show");
};

function closeModal(){
  modal.classList.remove("show");
  player.src = ""; // detiene el vídeo
}
modal.addEventListener("click", (e)=>{
  if (e.target === modal) closeModal();
});
closeBtn.addEventListener("click", closeModal);
document.addEventListener("keydown",(e)=>{ if (e.key === "Escape") closeModal(); });
