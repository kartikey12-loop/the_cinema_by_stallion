// TMDb setup
const API_KEY = ".       ";//API KEY TO BE INSERTED 
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// CHANGE THIS WEEKLY
const WEEKLY_MOVIE_ID = 114410; // Chainsaw Man
const TYPE = "tv"; // "tv" or "movie"

async function loadWeeklyFeature() {
    try {
        const res = await fetch(`${BASE_URL}/${TYPE}/${WEEKLY_MOVIE_ID}?api_key=${API_KEY}&language=en-US`);
        const data = await res.json();

        let title = data.name || data.title;
        
        // Release Year
        let year = "";
        if (TYPE === "movie" && data.release_date) {
            year = data.release_date.substring(0, 4);
        }
        if (TYPE === "tv" && data.first_air_date) {
            year = data.first_air_date.substring(0, 4);
        }

        let finalTitle = year ? `${title} (${year})` : title;

        // Insert Title + Overview
        document.getElementById("movieTitle").textContent = finalTitle;
        document.getElementById("weekTitle").textContent = `This Week’s Spotlight: ${finalTitle}`;
        document.getElementById("movieOverview").textContent = data.overview;

        // Poster
        document.getElementById("featurePoster").src =
            data.poster_path ? IMG_URL + data.poster_path : "placeholder.jpg";

        // GENRES
        let genres = data.genres?.map(g => g.name).join(" • ") || "Unknown";
        document.getElementById("movieGenres").textContent = genres;



    } catch (err) {
        console.error("Error loading weekly film:", err);
    }
}

loadWeeklyFeature();
