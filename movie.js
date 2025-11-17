// movie.js

const API_KEY = "7c469a64868a6a2348835f03d4900d49";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const BANNER_URL = "https://image.tmdb.org/t/p/original";
const movieId = new URLSearchParams(window.location.search).get("id");

// ===== Admin password (client-side). Edit to change. =====
const ADMIN_PASSWORD = "admin123"; // change before publishing if needed

// localStorage key for overrides
const STORAGE_KEY = "cinemeter_overrides_v1";

// quick safety: ensure we have an id
if (!movieId) {
  alert("Movie ID not found!");
}

// ---------- UTILS ----------
function getOverrides() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch (e) {
    return {};
  }
}
function saveOverrides(obj) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

// ---------- FETCH MOVIE DATA ----------
fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`)
  .then(res => res.json())
  .then(data => {
    showMovieDetails(data);
    fetchSimilarMovies();
  })
  .catch(err => console.error("Movie Fetch Error:", err));

// ---------- SHOW MAIN MOVIE INFO ----------
function showMovieDetails(movie) {
  // apply banner (fallback if no backdrop)
  const bannerEl = document.getElementById("movieBanner");
  if (movie.backdrop_path) {
    bannerEl.style.backgroundImage = `url(${BANNER_URL + movie.backdrop_path})`;
    bannerEl.style.backgroundSize = "cover";
    bannerEl.style.backgroundPosition = "center";
    bannerEl.style.minHeight = "260px";
  } else {
    bannerEl.style.background = "#111";
    bannerEl.style.minHeight = "140px";
  }

  // Poster only in details section (NOT in banner)
  document.getElementById("poster").src = movie.poster_path ? (IMG_URL + movie.poster_path) : "";

  // default cinemeter values (you had these set to 10/10)
  const defaultCinemeter = {
    story: 10,
    acting: 10,
    cinematography: 10,
    music: 10,
    verdict: "A Must Watch"
  };

  // read overrides (per movie)
  const overrides = getOverrides();
  const movieOverrides = overrides[movieId] || {};

  // merged values
  const cinemeter = {
    story: movieOverrides.story ?? defaultCinemeter.story,
    acting: movieOverrides.acting ?? defaultCinemeter.acting,
    cinematography: movieOverrides.cinematography ?? defaultCinemeter.cinematography,
    music: movieOverrides.music ?? defaultCinemeter.music,
    verdict: movieOverrides.verdict ?? defaultCinemeter.verdict
  };

  // build info html (note we create elements as strings for simplicity)
  const movieInfo = document.getElementById("movieInfo");
  movieInfo.innerHTML = `
    <h1>${movie.title}</h1>
    <p><strong>Release Date:</strong> ${movie.release_date || "N/A"}</p>
    <p><strong>Runtime:</strong> ${movie.runtime ? movie.runtime + " mins" : "N/A"}</p>
    <p><strong>Rating:</strong> ⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</p>
    <p><strong>Genres:</strong> ${movie.genres ? movie.genres.map(g => g.name).join(", ") : "N/A"}</p>
    <p><strong>Overview:</strong> ${movie.overview || "N/A"}</p>

    <h3>Top Cast</h3>
    <ul>
      ${movie.credits && movie.credits.cast ? movie.credits.cast.slice(0, 5).map(actor => `<li>${actor.name} as ${actor.character}</li>`).join("") : "<li>N/A</li>"}
    </ul>

    <h3 class="cinemeter-title">🎬 CINEMETER</h3>
    <div class="cinemeter-box">
      <p><strong>Story & Screenplay:</strong> <span id="storyScore" class="score">${cinemeter.story}/10</span></p>
      <p><strong>Acting & Performances:</strong> <span id="actingScore" class="score">${cinemeter.acting}/10</span></p>
      <p><strong>Cinematography & Visuals:</strong> <span id="cinemaScore" class="score">${cinemeter.cinematography}/10</span></p>
      <p><strong>Music & Sound Design:</strong> <span id="musicScore" class="score">${cinemeter.music}/10</span></p>
      <p><strong>Final Verdict:</strong> <span id="finalVerdict" class="score">${cinemeter.verdict}</span></p>
    </div>
  `;
}

// ---------- FETCH SIMILAR MOVIES ----------
function fetchSimilarMovies() {
  fetch(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(data => showSimilarMovies((data.results || []).slice(0, 6))) // EXACTLY 6 here
    .catch(err => console.error("Similar Error:", err));
}

// ---------- SHOW SIMILAR MOVIES ----------
function showSimilarMovies(movies) {
  const grid = document.getElementById("similarGrid");
  grid.innerHTML = movies
    .map(m => `<a href="movie.html?id=${m.id}"><img src="${m.poster_path ? IMG_URL + m.poster_path : ''}" alt="${m.title}"></a>`)
    .join("");
}

// ---------- ADMIN PANEL LOGIC (NO FIREBASE) ----------
const adminBtn = document.getElementById("adminBtn");
const adminPanel = document.getElementById("adminPanel");
const closeAdminBtn = document.getElementById("closeAdminBtn");
const saveReviewBtn = document.getElementById("saveReviewBtn");
const resetReviewBtn = document.getElementById("resetReviewBtn");

// inputs
const storyInput = document.getElementById("storyScoreInput");
const actingInput = document.getElementById("actingScoreInput");
const cinemaInput = document.getElementById("cinemaScoreInput");
const musicInput = document.getElementById("musicScoreInput");
const verdictInput = document.getElementById("finalVerdictInput");

// helper: apply current overrides to inputs (for the open panel)
function populateAdminInputs() {
  const overrides = getOverrides();
  const mo = overrides[movieId] || {};
  storyInput.value = mo.story ?? 10;
  actingInput.value = mo.acting ?? 10;
  cinemaInput.value = mo.cinematography ?? 10;
  musicInput.value = mo.music ?? 10;
  verdictInput.value = mo.verdict ?? "A Must Watch";
}

// apply the override values into the displayed cinemeter spans
function applyOverridesToPage() {
  const overrides = getOverrides();
  const mo = overrides[movieId] || {};
  const story = mo.story ?? null;
  const acting = mo.acting ?? null;
  const cinema = mo.cinematography ?? null;
  const music = mo.music ?? null;
  const verdict = mo.verdict ?? null;

  if (story !== null && document.getElementById("storyScore")) {
    document.getElementById("storyScore").textContent = `${story}/10`;
  }
  if (acting !== null && document.getElementById("actingScore")) {
    document.getElementById("actingScore").textContent = `${acting}/10`;
  }
  if (cinema !== null && document.getElementById("cinemaScore")) {
    document.getElementById("cinemaScore").textContent = `${cinema}/10`;
  }
  if (music !== null && document.getElementById("musicScore")) {
    document.getElementById("musicScore").textContent = `${music}/10`;
  }
  if (verdict !== null && document.getElementById("finalVerdict")) {
    document.getElementById("finalVerdict").textContent = `${verdict}`;
  }
}

// Admin auth: prompt for password (stored only in session)
function requireAdminAuth() {
  // If already authenticated in this session, allow immediately
  if (sessionStorage.getItem("isAdmin") === "true") return true;

  const p = prompt("Enter admin password:");
  if (p === ADMIN_PASSWORD) {
    sessionStorage.setItem("isAdmin", "true");
    return true;
  } else {
    alert("Incorrect password.");
    return false;
  }
}

// open admin panel (auth gate)
adminBtn.addEventListener("click", () => {
  if (!requireAdminAuth()) return;
  adminPanel.setAttribute("aria-hidden", "false");
  populateAdminInputs();
  // ensure fields are visible immediately
});

// close admin panel
closeAdminBtn?.addEventListener("click", () => {
  adminPanel.setAttribute("aria-hidden", "true");
});

// Save override for this movie
saveReviewBtn.addEventListener("click", () => {
  // read and sanitize inputs
  const story = Number(storyInput.value) || 0;
  const acting = Number(actingInput.value) || 0;
  const cinematography = Number(cinemaInput.value) || 0;
  const music = Number(musicInput.value) || 0;
  const verdict = (verdictInput.value || "").trim() || "A Must Watch";

  // clamp values 0-10
  const clamp = v => Math.max(0, Math.min(10, Number(v)));

  const overrides = getOverrides();
  overrides[movieId] = {
    story: clamp(story),
    acting: clamp(acting),
    cinematography: clamp(cinematography),
    music: clamp(music),
    verdict: verdict
  };
  saveOverrides(overrides);
  applyOverridesToPage();

  // close panel
  adminPanel.setAttribute("aria-hidden", "true");
  alert("Review saved locally for this browser.");
});

// Reset overrides for this movie (remove key)
resetReviewBtn.addEventListener("click", () => {
  if (!confirm("Reset custom review for this movie to defaults?")) return;
  const overrides = getOverrides();
  if (overrides[movieId]) {
    delete overrides[movieId];
    saveOverrides(overrides);
  }
  // refresh displayed page values by reloading or re-applying (we'll reapply defaults)
  // easiest: reload the page to fetch and re-render original defaults
  location.reload();
});

// On page load, ensure any saved overrides are applied (after initial content rendered by fetch).
// We periodically attempt to apply overrides in case the fetch finishes after DOM load:
const overrideInterval = setInterval(() => {
  if (document.getElementById("storyScore")) {
    applyOverridesToPage();
    clearInterval(overrideInterval);
  }
}, 150);

// Optional: pressing "Ctrl+M" toggles admin (for power users)
document.addEventListener("keydown", (ev) => {
  if (ev.ctrlKey && ev.key.toLowerCase() === "m") {
    adminBtn.click();
  }
});
