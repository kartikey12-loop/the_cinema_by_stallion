/* ---------- TMDB CONFIG ---------- */
const API_KEY = ".     ";//API KEY TO BE INSERTED 
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER = "assets/img/poster-placeholder.jpg";

/* ---------- FETCH HELP ---------- */
async function fetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}

/* ---------- TRENDING MOVIES ---------- */
async function loadTrendingMovies() {
  const container = document.getElementById("trendingGrid");
  if (!container) return;

  const data = await fetchJson(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
  if (!data || !data.results) {
    console.warn("No trending data");
    container.innerHTML = "<p class='muted'>No trending movies available.</p>";
    return;
  }

  const results = data.results.slice(0, 6);
  container.innerHTML = results.map(m => {
    const poster = m.poster_path ? `${IMG_URL}${m.poster_path}` : PLACEHOLDER;
    return `
      <div class="movie-card">
        <a href="movie.html?id=${m.id}">
          <img src="${poster}" alt="${escapeHtml(m.title)}">
        </a>
        <h3>${escapeHtml(m.title)}</h3>
      </div>
    `;
  }).join("");
}

/* ---------- UPCOMING MOVIES ---------- */
async function loadUpcomingMovies() {
  const container = document.getElementById("upcomingGrid");
  if (!container) return;

  const data = await fetchJson(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US`);
  if (!data || !data.results) {
    container.innerHTML = "<p class='muted'>No upcoming movies.</p>";
    return;
  }

  container.innerHTML = data.results.slice(0, 6).map(m => {
    const poster = m.poster_path ? `${IMG_URL}${m.poster_path}` : PLACEHOLDER;
    return `
      <div class="movie-card">
        <a href="movie.html?id=${m.id}">
          <img src="${poster}" alt="${escapeHtml(m.title)}">
        </a>
        <div class="card-body"><h3>${escapeHtml(m.title)}</h3></div>
      </div>
    `;
  }).join("");
}

/* ---------- SAFE ESCAPE FOR TEXT ---------- */
function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/[&<>"']/g, function (m) {
    return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[m];
  });
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  loadTrendingMovies();
  loadUpcomingMovies();

  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      mainNav.classList.toggle("active");
      navToggle.classList.toggle("active");
    });
  }
});
