const songs = [
  // 1980s
  { id: "Zi_XLOBDo_Y", title: "Billie Jean - Michael Jackson – 1980s", genre: "Pop / R&B" },
  { id: "djV11Xbc914", title: "Take On Me - a-ha – 1980s", genre: "Synth-pop / New wave" },
  { id: "OMOGaugKpzs", title: "Every Breath You Take - The Police – 1980s", genre: "New wave / Pop rock" },
  { id: "1w7OgIMMRc4", title: "Sweet Child O' Mine - Guns N' Roses – 1980s", genre: "Hard rock" },
  { id: "lDK9QqIzhwk", title: "Livin' on a Prayer - Bon Jovi – 1980s", genre: "Hard rock / Glam metal" },
  { id: "FTQbiNvZqaY", title: "Africa - Toto – 1980s", genre: "Soft rock / Pop rock" },

  // 1990s
  { id: "bx1Bh8ZvH84", title: "Wonderwall - Oasis – 1990s", genre: "Britpop / Alternative rock" },
  { id: "XFkzRNyygfk", title: "Creep - Radiohead – 1990s", genre: "Alternative rock" },
  { id: "SSbBvKaM6sk", title: "Song 2 - Blur – 1990s", genre: "Alternative rock / Britpop" },
  { id: "luwAMFcc2f8", title: "Angels - Robbie Williams – 1990s", genre: "Pop / Pop rock" },
  { id: "gJLIiF15wjQ", title: "Wannabe - Spice Girls – 1990s", genre: "Pop / Dance-pop" },
  { id: "1lyu1KKwC74", title: "Bitter Sweet Symphony - The Verve – 1990s", genre: "Alternative rock / Britpop" },

  // 2000s
  { id: "gGdGFtwCNBE", title: "Mr. Brightside - The Killers – 2000s", genre: "Indie rock / Post-punk revival" },
  { id: "yKNxeF4KMsY", title: "Yellow - Coldplay – 2000s", genre: "Alternative rock / Post-Britpop" },
  { id: "0J2QdDbelmY", title: "Seven Nation Army - The White Stripes – 2000s", genre: "Garage rock / Alternative rock" },
  { id: "PWgvGjAhvIw", title: "Hey Ya! - OutKast – 2000s", genre: "Hip hop / Funk-pop" },
  { id: "DUT5rEU6pqM", title: "Hips Don't Lie - Shakira ft. Wyclef Jean – 2000s", genre: "Latin pop / Reggaetón / Dance-pop" },
  { id: "ViwtNLUqkMY", title: "Crazy In Love - Beyoncé ft. Jay-Z – 2000s", genre: "R&B / Pop" },

  // 2010s
  { id: "JGwWNGJdvx8", title: "Shape of You - Ed Sheeran – 2010s", genre: "Pop / Dancehall-pop" },
  { id: "OPf0YbXqDm0", title: "Uptown Funk - Mark Ronson ft. Bruno Mars – 2010s", genre: "Funk-pop / Disco-pop" },
  { id: "ZbZSe6N_BXs", title: "Happy - Pharrell Williams – 2010s", genre: "Soul / Funk-pop" },
  { id: "rYEDA3JcQqw", title: "Rolling in the Deep - Adele – 2010s", genre: "Soul / Pop / Blues-pop" },
  { id: "zABLecsR5UE", title: "Someone You Loved - Lewis Capaldi – 2010s", genre: "Pop / Ballad" },
  { id: "4NRXx6U8ABQ", title: "Blinding Lights - The Weeknd – 2010s", genre: "Synth-wave / Synth-pop" },

  // 2020s
  { id: "H5v3kku4y6Q", title: "As It Was - Harry Styles – 2020s", genre: "Synth-pop / Indie pop" },
  { id: "orJSJGHjBLI", title: "Bad Habits - Ed Sheeran – 2020s", genre: "Dance-pop" },
  { id: "TUVcZfQe-Kw", title: "Levitating - Dua Lipa – 2020s", genre: "Disco-pop / Nu-disco" },
  { id: "ZmDBbnmKpqQ", title: "drivers license - Olivia Rodrigo – 2020s", genre: "Pop / Bedroom pop" },
  { id: "G7KNmW9a75Y", title: "Flowers - Miley Cyrus – 2020s", genre: "Pop / Disco-pop" },
  { id: "LIIDh-qI9oI", title: "Save Your Tears (Remix) - The Weeknd & Ariana Grande – 2020s", genre: "Synth-pop" }
];


const songList = document.getElementById("songList");

songs.forEach(song => {
  const li = document.createElement("li");
  li.innerHTML = `
    <img src="https://img.youtube.com/vi/${song.id}/mqdefault.jpg" alt="${song.title}">
    <a href="#" onclick="loadVideo('${song.id}', event)">${song.title}</a>
  `;
  songList.appendChild(li);
});

function loadVideo(videoId, event) {
  event.preventDefault();
  const player = document.getElementById("videoPlayer");
  player.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1";
  document.getElementById("videoModal").classList.add("show");
}

document.getElementById("videoModal").addEventListener("click", () => {
  document.getElementById("videoModal").classList.remove("show");
  document.getElementById("videoPlayer").src = "";
});
