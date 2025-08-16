const songs = [
  // 1980s
  { id: "Zi_XLOBDo_Y", title: "Billie Jean - Michael Jackson – 1980s" },
  { id: "djV11Xbc914", title: "Take On Me - a-ha – 1980s" },
  { id: "OMOGaugKpzs", title: "Every Breath You Take - The Police – 1980s" },
  { id: "1w7OgIMMRc4", title: "Sweet Child O' Mine - Guns N' Roses – 1980s" },
  { id: "lDK9QqIzhwk", title: "Livin' on a Prayer - Bon Jovi – 1980s" },
  { id: "FTQbiNvZqaY", title: "Africa - Toto – 1980s" },

  // 1990s
  { id: "bx1Bh8ZvH84", title: "Wonderwall - Oasis – 1990s" },
  { id: "XFkzRNyygfk", title: "Creep - Radiohead – 1990s" },
  { id: "SSbBvKaM6sk", title: "Song 2 - Blur – 1990s" },
  { id: "luwAMFcc2f8", title: "Angels - Robbie Williams – 1990s" },
  { id: "gJLIiF15wjQ", title: "Wannabe - Spice Girls – 1990s" },
  { id: "1lyu1KKwC74", title: "Bitter Sweet Symphony - The Verve – 1990s" },

  // 2000s
  { id: "gGdGFtwCNBE", title: "Mr. Brightside - The Killers – 2000s" },
  { id: "yKNxeF4KMsY", title: "Yellow - Coldplay – 2000s" },
  { id: "0J2QdDbelmY", title: "Seven Nation Army - The White Stripes – 2000s" },
  { id: "PWgvGjAhvIw", title: "Hey Ya! - OutKast – 2000s" },
  { id: "DUT5rEU6pqM", title: "Hips Don't Lie - Shakira ft. Wyclef Jean – 2000s" },
  { id: "ViwtNLUqkMY", title: "Crazy In Love - Beyoncé ft. Jay-Z – 2000s" },

  // 2010s
  { id: "JGwWNGJdvx8", title: "Shape of You - Ed Sheeran – 2010s" },
  { id: "OPf0YbXqDm0", title: "Uptown Funk - Mark Ronson ft. Bruno Mars – 2010s" },
  { id: "ZbZSe6N_BXs", title: "Happy - Pharrell Williams – 2010s" },
  { id: "rYEDA3JcQqw", title: "Rolling in the Deep - Adele – 2010s" },
  { id: "zABLecsR5UE", title: "Someone You Loved - Lewis Capaldi – 2010s" },
  { id: "4NRXx6U8ABQ", title: "Blinding Lights - The Weeknd – 2010s" },

  // 2020s
  { id: "H5v3kku4y6Q", title: "As It Was - Harry Styles – 2020s" },
  { id: "orJSJGHjBLI", title: "Bad Habits - Ed Sheeran – 2020s" },
  { id: "TUVcZfQe-Kw", title: "Levitating - Dua Lipa – 2020s" },
  { id: "ZmDBbnmKpqQ", title: "drivers license - Olivia Rodrigo – 2020s" },
  { id: "G7KNmW9a75Y", title: "Flowers - Miley Cyrus – 2020s" },
  { id: "LIIDh-qI9oI", title: "Save Your Tears (Remix) - The Weeknd & Ariana Grande – 2020s" }
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
  player.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&mute=1";
  document.getElementById("videoModal").classList.add("show");
}

document.getElementById("videoModal").addEventListener("click", () => {
  document.getElementById("videoModal").classList.remove("show");
  document.getElementById("videoPlayer").src = "";
});
