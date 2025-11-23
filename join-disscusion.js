const API_KEY = ".      ";//API KEY TO BE INSERTED 
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// Change weekly
const WEEKLY_ID = 114410; // Chainsaw Man
const TYPE = "tv";

async function fetchFilm() {
    const res = await fetch(`${BASE_URL}/${TYPE}/${WEEKLY_ID}?api_key=${API_KEY}&language=en-US`);
    const film = await res.json();

    document.getElementById("filmPoster").src = IMG_URL + film.poster_path;
    document.getElementById("filmTitle").textContent = film.name || film.title;
    document.getElementById("filmOverview").textContent = film.overview;
    document.getElementById("filmGenres").textContent =
        film.genres.map(g => g.name).join(" • ");
}

fetchFilm();
