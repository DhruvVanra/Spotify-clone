<div align="center">

# Spotify Clone

### A responsive Spotify-style web music player built with HTML, CSS, and JavaScript.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

</div>

---

## Overview

This project is a Spotify-inspired music player made with vanilla frontend technologies. It includes a desktop web-player layout and a mobile layout with a fixed search bar, bottom navigation, compact mini-player, and horizontally scrolling song cards.

The app plays local audio files from the `audio/` folder and displays album artwork from the `image/` folder.

## Features

- Spotify-style dark UI
- Responsive desktop and mobile layouts
- Fixed search bar on mobile
- Mobile bottom navigation
- Horizontal song card scrolling on mobile
- Play, pause, next, and previous controls
- Shuffle and repeat modes
- Progress bar with current time and duration
- Volume slider and mute control
- Search by song title, artist, or mood
- Category filters: All, Bollywood, Indie, and Charts
- Recently played songs
- Liked songs saved in `localStorage`
- Queue and mini queue
- Toast messages and loading overlay
- Custom cursor effect on desktop

## Tech Stack

| Technology | Use |
| --- | --- |
| HTML5 | Page structure |
| CSS3 | Layout, responsive design, animations, and styling |
| JavaScript | Player logic, search, filters, queue, and localStorage |
| Font Awesome | Icons |
| Google Fonts | Typography |

## Project Structure

```text
spotify clone copy/
├── index.html
├── style.css
├── script.js
├── README.md
├── image/
│   ├── logo.png
│   ├── arjunvally.jpg
│   ├── ms dhoni.jpg
│   ├── zinda.jpg
│   └── album and player images
└── audio/
    ├── arjan-vailly.mp3
    ├── Jab Tak.mp3
    ├── zinda.mp3
    └── song audio files
```

## How to Run

1. Download or open the project folder.
2. Open `index.html` in your browser.
3. Click any song card to start playing music.

No installation is required. This is a static frontend project.

## Main Files

| File | Description |
| --- | --- |
| `index.html` | Main HTML layout for sidebar, content, player, and mobile nav |
| `style.css` | Desktop and mobile Spotify-style design |
| `script.js` | Music player logic, search, filters, likes, queue, and storage |
| `image/` | Album covers, logo, and player icons |
| `audio/` | Local MP3 files used by the player |

## How to Add a New Song

1. Add the MP3 file inside the `audio/` folder.
2. Add the cover image inside the `image/` folder.
3. Open `script.js`.
4. Add a new object inside the `fakeApiSongs` array.

```js
{
    id: 9,
    title: "Song Name",
    artist: "Artist Name",
    category: "bollywood",
    mood: "Song mood",
    cover: "image/cover-name.jpg",
    audio: "audio/song-name.mp3",
    duration: "3:30",
    section: "trending"
}
```

## Notes

- File names in `script.js` must match the real file names exactly.
- Keep audio files inside `audio/`.
- Keep album images inside `image/`.
- Browser autoplay rules may require the user to click before audio starts.
- Liked songs, queue, and recently played data are stored in the browser using `localStorage`.

## Author

Created as a Spotify clone project using HTML, CSS, and JavaScript.
