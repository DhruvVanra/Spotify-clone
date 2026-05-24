const STORAGE_KEYS = {
    liked: "spotifyCloneLikedSongs",
    recent: "spotifyCloneRecentlyPlayed",
    queue: "spotifyCloneQueue"
};

const fakeApiSongs = [
    {
        id: 1,
        title: "Arjan Vailly",
        artist: "Manan Bhardwaj, Bhupinder Babbal",
        category: "bollywood",
        mood: "Trending near you",
        cover: "image/arjunvally.jpg",
        audio: "audio/arjan-vailly.mp3",
        duration: "3:02",
        section: "trending"
    },
    {
        id: 2,
        title: "Jab Tak",
        artist: "Amaal Mallik",
        category: "bollywood",
        mood: "Sports energy",
        cover: "image/ms dhoni.jpg",
        audio: "audio/Jab Tak.mp3",
        duration: "2:49",
        section: "trending"
    },
    {
        id: 3,
        title: "Zinda",
        artist: "Siddharth Mahadevan",
        category: "bollywood",
        mood: "Workout anthem",
        cover: "image/zinda.jpg",
        audio: "audio/zinda.mp3",
        duration: "3:27",
        section: "trending"
    },
    {
        id: 4,
        title: "Dekha Hazaro Dafaa",
        artist: "Arijit Singh",
        category: "indie",
        mood: "Soulful mix",
        cover: "image/the arjit singh,jpg.jpg",
        audio: "audio/Dekha Hazaro Dafaa.mp3",
        duration: "3:26",
        section: "trending"
    },
    {
        id: 5,
        title: "Tum se",
        artist: "Raghav, Tanishk Bagchi",
        category: "bollywood",
        mood: "Fresh romance",
        cover: "image/teri bato me aisa.jpg",
        audio: "audio/Tum se.mp3",
        duration: "4:21",
        section: "trending"
    },
    {
        id: 6,
        title: "Raabata",
        artist: "Arijit Singh",
        category: "charts",
        mood: "Your daily update of the most played tracks",
        cover: "image/Raabata.jpg",
        audio: "audio/Raabta.mp3",
        duration: "4:02",
        section: "charts"
    },
    {
        id: 7,
        title: "Saudebazi",
        artist: "Anupam Amod",
        category: "charts",
        mood: "The hottest tracks in India right now",
        cover: "image/SaudeBazi.jpg",
        audio: "audio/Saudebazi(Encore).mp3",
        duration: "5:53",
        section: "charts"
    },
    {
        id: 8,
        title: "Tu mera Hero",
        artist: "Mika Singh and Shefali Alvares",
        category: "indie",
        mood: "A smooth blend based on your taste",
        cover: "image/Tu mera Hero.jpg",
        audio: "audio/Tu mera Hero.mp3",
        duration: "4:49",
        section: "charts"
    }
];

const state = {
    songs: [],
    currentIndex: 0,
    isPlaying: false,
    isShuffle: false,
    repeatMode: "off",
    activeCategory: "all",
    searchTerm: "",
    likedSongs: readStorage(STORAGE_KEYS.liked, []),
    recentlyPlayed: readStorage(STORAGE_KEYS.recent, []),
    queue: readStorage(STORAGE_KEYS.queue, [])
};

const audio = new Audio();
audio.preload = "metadata";
audio.volume = 0.8;

const prefetchedAudioUrls = new Set();

const elements = {
    recentlyPlayedGrid: document.querySelector("#recentlyPlayedGrid"),
    trendingGrid: document.querySelector("#trendingGrid"),
    chartsGrid: document.querySelector("#chartsGrid"),
    likedSongsGrid: document.querySelector("#likedSongsGrid"),
    queueList: document.querySelector("#queueList"),
    sidebarQueue: document.querySelector("#sidebarQueue"),
    emptyState: document.querySelector("#emptyState"),
    searchInput: document.querySelector("#searchInput"),
    filterBar: document.querySelector("#filterBar"),
    playPauseBtn: document.querySelector("#playPauseBtn"),
    prevBtn: document.querySelector("#prevBtn"),
    nextBtn: document.querySelector("#nextBtn"),
    shuffleBtn: document.querySelector("#shuffleBtn"),
    repeatBtn: document.querySelector("#repeatBtn"),
    progressBar: document.querySelector("#progressBar"),
    volumeSlider: document.querySelector("#volumeSlider"),
    muteBtn: document.querySelector("#muteBtn"),
    playerCover: document.querySelector("#playerCover"),
    playerTitle: document.querySelector("#playerTitle"),
    playerArtist: document.querySelector("#playerArtist"),
    currentTime: document.querySelector("#currentTime"),
    durationTime: document.querySelector("#durationTime"),
    likeCurrentBtn: document.querySelector("#likeCurrentBtn"),
    equalizer: document.querySelector("#equalizer"),
    toast: document.querySelector("#toast"),
    loadingOverlay: document.querySelector("#loadingOverlay"),
    createPlaylistBtn: document.querySelector("#createPlaylistBtn"),
    sidebar: document.querySelector("#sidebar"),
    mobileMenuToggle: document.querySelector("#mobileMenuToggle"),
    musicPlayer: document.querySelector("#musicPlayer")
};

function init() {
    initCustomCursor();
    fetchSongsFromFakeApi().then((songs) => {
        state.songs = songs;
        loadSong(0, false);
        renderAllSections();
        bindEvents();
        updateQueue();
    });
}

function initCustomCursor() {
    const cursor = document.createElement("div");
    cursor.className = "cursor-dot";
    document.body.appendChild(cursor);

    document.addEventListener("pointermove", (event) => {
        cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    });

    document.addEventListener("pointerdown", () => cursor.classList.add("is-clicking"));
    document.addEventListener("pointerup", () => cursor.classList.remove("is-clicking"));
}

function fetchSongsFromFakeApi() {
    showLoading(false);
    return Promise.resolve(fakeApiSongs);
}

function bindEvents() {
    elements.playPauseBtn.addEventListener("click", togglePlay);
    elements.prevBtn.addEventListener("click", playPrevious);
    elements.nextBtn.addEventListener("click", playNext);
    elements.shuffleBtn.addEventListener("click", toggleShuffle);
    elements.repeatBtn.addEventListener("click", toggleRepeat);
    elements.progressBar.addEventListener("input", seekSong);
    elements.volumeSlider.addEventListener("input", updateVolume);
    elements.muteBtn.addEventListener("click", toggleMute);
    elements.likeCurrentBtn.addEventListener("click", () => toggleLike(getCurrentSong().id));
    elements.searchInput.addEventListener("input", handleSearch);
    elements.filterBar.addEventListener("click", handleFilter);
    elements.createPlaylistBtn.addEventListener("click", createDynamicPlaylist);
    elements.mobileMenuToggle.addEventListener("click", toggleMobileMenu);
    document.addEventListener("keydown", handleKeyboardShortcuts);

    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("play", handlePlayingState);
    audio.addEventListener("pause", handlePauseState);
    audio.addEventListener("ended", handleSongEnded);
    audio.addEventListener("waiting", () => showLoading(true));
    audio.addEventListener("canplay", () => showLoading(false));
    audio.addEventListener("error", handleAudioError);
}

function getCurrentSong() {
    return state.songs[state.currentIndex];
}

function loadSong(index, shouldPlay = true) {
    const song = state.songs[index];

    if (!song) return;

    const songUrl = getAssetUrl(song.audio);
    const isSameSong = audio.src === songUrl;
    state.currentIndex = index;
    elements.playerCover.src = song.cover;
    elements.playerTitle.textContent = song.title;
    elements.playerArtist.textContent = song.artist;

    if (!isSameSong) {
        audio.src = song.audio;
        audio.load();
        elements.durationTime.textContent = song.duration;
        elements.currentTime.textContent = "00:00";
        elements.progressBar.value = 0;
    }

    updateLikeButton();
    updateActiveCards();
    updateRecentlyPlayed(song.id);
    updateQueue();
    prefetchNearbySongs(index);

    if (shouldPlay) {
        playSong();
    }
}

function getAssetUrl(path) {
    return new URL(path, window.location.href).href;
}

function prefetchNearbySongs(index) {
    const nextIndex = index === state.songs.length - 1 ? 0 : index + 1;
    const previousIndex = index === 0 ? state.songs.length - 1 : index - 1;

    prefetchSongAudio(nextIndex);
    prefetchSongAudio(previousIndex);
}

function prefetchSongAudio(index) {
    const song = state.songs[index];
    if (!song) return;

    const songUrl = getAssetUrl(song.audio);
    if (prefetchedAudioUrls.has(songUrl)) return;

    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "audio";
    link.href = song.audio;
    document.head.appendChild(link);
    prefetchedAudioUrls.add(songUrl);
}

function playSong() {
    audio.play().catch(() => {
        showToast("Add audio files inside the audio folder to play this track");
    });
}

function pauseSong() {
    audio.pause();
}

function togglePlay() {
    state.isPlaying ? pauseSong() : playSong();
}

function playNext() {
    const nextIndex = getNextIndex();
    loadSong(nextIndex);
}

function playPrevious() {
    if (audio.currentTime > 4) {
        audio.currentTime = 0;
        return;
    }

    const previousIndex = state.currentIndex === 0 ? state.songs.length - 1 : state.currentIndex - 1;
    loadSong(previousIndex);
}

function getNextIndex() {
    if (state.queue.length) {
        const nextId = state.queue.shift();
        writeStorage(STORAGE_KEYS.queue, state.queue);
        const queuedIndex = state.songs.findIndex((song) => song.id === nextId);
        if (queuedIndex !== -1) return queuedIndex;
    }

    if (state.isShuffle) {
        let randomIndex = state.currentIndex;
        while (randomIndex === state.currentIndex && state.songs.length > 1) {
            randomIndex = Math.floor(Math.random() * state.songs.length);
        }
        return randomIndex;
    }

    return state.currentIndex === state.songs.length - 1 ? 0 : state.currentIndex + 1;
}

function handleSongEnded() {
    if (state.repeatMode === "one") {
        audio.currentTime = 0;
        playSong();
        return;
    }

    if (state.repeatMode === "off" && state.currentIndex === state.songs.length - 1 && !state.queue.length) {
        pauseSong();
        return;
    }

    playNext();
}

function seekSong() {
    if (!audio.duration) return;
    audio.currentTime = (Number(elements.progressBar.value) / 100) * audio.duration;
}

function updateProgress() {
    if (!audio.duration) return;
    elements.progressBar.value = (audio.currentTime / audio.duration) * 100;
    elements.currentTime.textContent = formatTime(audio.currentTime);
}

function updateDuration() {
    elements.durationTime.textContent = formatTime(audio.duration);
}

function updateVolume() {
    audio.volume = Number(elements.volumeSlider.value) / 100;
    audio.muted = audio.volume === 0;
    updateVolumeIcon();
}

function toggleMute() {
    audio.muted = !audio.muted;
    updateVolumeIcon();
}

function updateVolumeIcon() {
    const icon = elements.muteBtn.querySelector("i");
    icon.className = audio.muted || audio.volume === 0 ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high";
}

function handlePlayingState() {
    state.isPlaying = true;
    elements.playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    elements.playPauseBtn.setAttribute("aria-label", "Pause");
    elements.equalizer.classList.add("is-playing");
    elements.musicPlayer.classList.add("is-playing");
    updateActiveCards();
}

function handlePauseState() {
    state.isPlaying = false;
    elements.playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    elements.playPauseBtn.setAttribute("aria-label", "Play");
    elements.equalizer.classList.remove("is-playing");
    elements.musicPlayer.classList.remove("is-playing");
    updateActiveCards();
}

function toggleShuffle() {
    state.isShuffle = !state.isShuffle;
    elements.shuffleBtn.classList.toggle("active-control", state.isShuffle);
    showToast(state.isShuffle ? "Shuffle on" : "Shuffle off");
}

function toggleRepeat() {
    const modes = ["off", "all", "one"];
    const nextMode = modes[(modes.indexOf(state.repeatMode) + 1) % modes.length];
    state.repeatMode = nextMode;
    elements.repeatBtn.classList.toggle("active-control", nextMode !== "off");
    elements.repeatBtn.dataset.mode = nextMode;
    showToast(nextMode === "one" ? "Repeat one" : nextMode === "all" ? "Repeat all" : "Repeat off");
}

function handleKeyboardShortcuts(event) {
    const isTyping = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName);
    if (isTyping) return;

    if (event.code === "Space") {
        event.preventDefault();
        togglePlay();
    }

    if (event.code === "ArrowRight") {
        audio.currentTime = Math.min((audio.currentTime || 0) + 5, audio.duration || 0);
    }

    if (event.code === "ArrowLeft") {
        audio.currentTime = Math.max((audio.currentTime || 0) - 5, 0);
    }
}

function handleSearch(event) {
    state.searchTerm = event.target.value.trim().toLowerCase();
    renderAllSections();
}

function handleFilter(event) {
    const button = event.target.closest(".filter-chip");
    if (!button) return;

    state.activeCategory = button.dataset.category;
    document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.remove("active"));
    button.classList.add("active");
    renderAllSections();
}

function renderAllSections() {
    const filteredSongs = getFilteredSongs();
    const recentSongs = state.recentlyPlayed
        .map((id) => state.songs.find((song) => song.id === id))
        .filter(Boolean);

    renderCards(elements.recentlyPlayedGrid, recentSongs.length ? recentSongs : filteredSongs.slice(0, 3));
    renderCards(elements.trendingGrid, filteredSongs.filter((song) => song.section === "trending"));
    renderCards(elements.chartsGrid, filteredSongs.filter((song) => song.section === "charts"));
    renderCards(elements.likedSongsGrid, state.likedSongs.map((id) => state.songs.find((song) => song.id === id)).filter(Boolean));
    updateQueue();

    const hasVisibleSongs = filteredSongs.length || state.likedSongs.length;
    elements.emptyState.classList.toggle("show", !hasVisibleSongs);
}

function getFilteredSongs() {
    return state.songs.filter((song) => {
        const matchesCategory = state.activeCategory === "all" || song.category === state.activeCategory;
        const searchableText = `${song.title} ${song.artist} ${song.mood}`.toLowerCase();
        return matchesCategory && searchableText.includes(state.searchTerm);
    });
}

function renderCards(container, songs) {
    container.innerHTML = songs.map(createSongCard).join("");
    container.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("click", () => playSongFromId(Number(card.dataset.songId)));
    });
    container.querySelectorAll(".card-action").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            playSongFromId(Number(button.dataset.songId));
        });
    });
    container.querySelectorAll(".like-button").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            toggleLike(Number(button.dataset.songId));
        });
    });
    container.querySelectorAll(".queue-button").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            addToQueue(Number(button.dataset.songId));
        });
    });
    updateActiveCards();
}

function createSongCard(song) {
    const isLiked = state.likedSongs.includes(song.id);
    return `
        <article class="card" data-song-id="${song.id}">
            <div class="card-art">
                <img src="${song.cover}" class="card-img" alt="${song.title}" loading="lazy" decoding="async">
                <button class="card-action" data-song-id="${song.id}" aria-label="Play ${song.title}">
                    <i class="fa-solid fa-play"></i>
                </button>
            </div>
            <p class="card-title">${song.title}</p>
            <p class="card-information">${song.artist}</p>
            <div class="card-meta">
                <span>${song.duration}</span>
                <button class="like-button ${isLiked ? "liked" : ""}" data-song-id="${song.id}" aria-label="Like ${song.title}">
                    <i class="${isLiked ? "fa-solid" : "fa-regular"} fa-heart"></i>
                </button>
                <button class="queue-button" data-song-id="${song.id}" aria-label="Add ${song.title} to queue">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
        </article>
    `;
}

function playSongFromId(songId) {
    const index = state.songs.findIndex((song) => song.id === songId);
    if (index === -1) return;

    if (index === state.currentIndex && audio.src) {
        togglePlay();
        elements.sidebar.classList.remove("show");
        return;
    }

    loadSong(index);
    elements.sidebar.classList.remove("show");
}

function toggleLike(songId) {
    const isLiked = state.likedSongs.includes(songId);
    state.likedSongs = isLiked
        ? state.likedSongs.filter((id) => id !== songId)
        : [...state.likedSongs, songId];

    writeStorage(STORAGE_KEYS.liked, state.likedSongs);
    updateLikeButton();
    renderAllSections();
    showToast(isLiked ? "Removed from Liked Songs" : "Added to Liked Songs");
}

function updateLikeButton() {
    const song = getCurrentSong();
    if (!song) return;

    const isLiked = state.likedSongs.includes(song.id);
    elements.likeCurrentBtn.innerHTML = `<i class="${isLiked ? "fa-solid" : "fa-regular"} fa-heart"></i>`;
    elements.likeCurrentBtn.classList.toggle("liked", isLiked);
}

function updateRecentlyPlayed(songId) {
    state.recentlyPlayed = [songId, ...state.recentlyPlayed.filter((id) => id !== songId)].slice(0, 6);
    writeStorage(STORAGE_KEYS.recent, state.recentlyPlayed);
}

function addToQueue(songId) {
    if (songId === getCurrentSong().id) {
        showToast("This song is already playing");
        return;
    }

    state.queue = [...state.queue, songId].slice(0, 8);
    writeStorage(STORAGE_KEYS.queue, state.queue);
    updateQueue();
    showToast("Added to queue");
}

function updateQueue() {
    const queuedSongs = state.queue.map((id) => state.songs.find((song) => song.id === id)).filter(Boolean);
    const markup = queuedSongs.length
        ? queuedSongs.map((song, index) => `
            <button class="queue-item" data-index="${index}">
                <img src="${song.cover}" alt="">
                <span>${song.title}</span>
                <small>${song.artist}</small>
            </button>
        `).join("")
        : '<p class="queue-empty">Queue is empty</p>';

    elements.queueList.innerHTML = markup;
    elements.sidebarQueue.innerHTML = markup;

    document.querySelectorAll(".queue-item").forEach((item) => {
        item.addEventListener("click", () => {
            const songId = state.queue.splice(Number(item.dataset.index), 1)[0];
            writeStorage(STORAGE_KEYS.queue, state.queue);
            playSongFromId(songId);
        });
    });
}

function createDynamicPlaylist() {
    const source = state.likedSongs.length
        ? state.likedSongs.map((id) => state.songs.find((song) => song.id === id)).filter(Boolean)
        : state.songs.filter((song) => song.category === state.activeCategory || state.activeCategory === "all");

    state.queue = source.map((song) => song.id).filter((id) => id !== getCurrentSong().id).slice(0, 8);
    writeStorage(STORAGE_KEYS.queue, state.queue);
    updateQueue();
    showToast("Playlist added to queue");
}

function updateActiveCards() {
    const song = getCurrentSong();
    if (!song) return;

    document.querySelectorAll(".card").forEach((card) => {
        const isActive = Number(card.dataset.songId) === song.id;
        card.classList.toggle("active-playing", isActive);
        card.classList.toggle("is-playing", isActive && state.isPlaying);
    });
}

function handleAudioError() {
    showLoading(false);
    showToast("Audio file missing. Put MP3 files in the audio folder and update script.js paths.");
    handlePauseState();
}

function toggleMobileMenu() {
    elements.sidebar.classList.toggle("show");
}

function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => elements.toast.classList.remove("show"), 2200);
}

function showLoading(isLoading) {
    elements.loadingOverlay.classList.toggle("show", isLoading);
}

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function readStorage(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
        return fallback;
    }
}

function writeStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

init();
