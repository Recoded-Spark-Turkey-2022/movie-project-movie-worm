"use strict";
const query = "";
const searchMul = `https://api.themoviedb.org/3/search/multi`;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");
const API_KEY = "c63e3e406a6a0477c30d877a6acf90b1";
const main = document.getElementById("main");
const filtering = document.getElementsByClassName("filter-menu");
const imgDiv = document.createElement("div");
const apiKey = "00c07d6d1de18f45f48a74210ba62760";

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const credits = await fetchActors(movie.id);
  const trailer = await fetchTrailer(movie.id);
  const similarMovie = await fetchSimilarMovies(movie.id);

  renderMovie(movieRes, credits, trailer.results[0].key, similarMovie);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

const fetchActors = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/credits`);
  const res = await fetch(url);
  return res.json();
};

const fetchTrailer = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/videos`);
  const res = await fetch(url);
  return res.json();
};

const fetchSimilarMovies = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/similar`);
  const res = await fetch(url);
  return res.json();
};
const fetchCompany = async () => {
  const url = `https://api.themoviedb.org/3/search/company?api_key=${API_KEY}`;
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// this function is to fetch multisearch,
function searchMovie(searchValue) {
  return fetch(`${searchMul}?api_key=${apiKey}&query=${searchValue}`)
    .then((response) => response.json())
    .then((jsonData) => jsonData.results);
}

// this function is to render the fetch ,
function renderResult(searchResults) {
  const tag = document.getElementById("resultsList");
  const searchfield = document.getElementById("search");
  if (searchfield.value.length > 0) {
    tag.innerHTML = "";
    const list = searchResults.slice(0, 3).map((results) => {
      if (results.title && results.media_type === "movie") {
        tag.innerHTML += `<li>
          <button 
       
           class="movie-search pl-8 pr-2 py-1 border-b-2 border-gray-100 relative cursor-pointer hover:bg-yellow-50 hover:text-gray-900" 
           id="${results.id}">${results.title}</button>
           </li>`;
      } else if (results.name) {
        tag.innerHTML += `<li> 
          <button 
          class="movie-search pl-8 pr-2 py-1 border-b-2 border-gray-100 relative cursor-pointer hover:bg-yellow-50 hover:text-gray-900" 
          id="${results.id}">
    
          ${results.name}
          </button>
          </li>`;
      }
    });
  } else {
    tag.innerHTML = "";
  }
  const xx = searchMovie(searchResults);
  console.log({ xx });
  let elementsArray = document.querySelectorAll(".movie-search");
  elementsArray.forEach(function (elem) {
    elem.addEventListener("click", function () {
      movieDetails({ id: parseInt(elem.id) });
    });
  });
}

window.onload = async () => {
  const searchfield = document.getElementById("search");
  searchfield.onkeyup = async (event) => {
    const searchResults = await searchMovie(searchfield.value);
    renderResult(searchResults);
  };
};

// function createAuto(list) {
//   const listEl = document.createElement("resultsList");
//   listEl = "movie-search";
// }

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.id = "movie";
    movieDiv.className += "h-1/5";
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster" class='h-3/6'>
       <div class='info'>
        <h3>${movie.title}</h3>
        
        
        <span class="${coloring(movie.vote_average)}">${
      movie.vote_average
    }/10</span> 
        </div>
        <div class='small-info'>
        <p>${movie.overview} </p>
        </div>`;

    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
      imgDiv.remove(imgDiv);
      document.querySelector("main").style.display = "none";
      document.querySelector(".filter-button").style.display = "none";
    });
    CONTAINER.appendChild(movieDiv);
  });

  homepageContent();
};
//Homepage ImageDiv-----------------------------------------
const homepageContent = function () {
  const main = document.getElementById("main");
  imgDiv.className +=
    "imgDiv pt-6 w-full flex flex-wrap flex-col items-center justify-center";
  imgDiv.innerHTML = `<img  class="rounded-md w-3/4  "  src="./LS-Video-PremiumChannels_TMC_Hero-Mobile.jpg" alt="">`;
  //const smallmoviecard = document.createElement('div');
  //smallmoviecard.className += 'small-movie col';

  main.appendChild(imgDiv);
};
//<h1 class='css text-7xl font-extrabold tracking-widest'>MOVIE WORM</h1> <br> <p class='csss text-3xl'>Do not Miss the Newest!</p>
//Coloring Vote-----------------------------------------
function coloring(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 6) {
    return "orange";
  } else {
    return "red";
  }
}
/*function filterPopular(){
const popularOption = document.getElementById('popular');
popularOption.addEventListener('click', () =>{
  const popular = fetchingPopular();
  
  CONTAINER.innerHTML='';
  renderMovies(popular);
})
}*/

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie, credits, trailer, similarMovies) => {
  CONTAINER.innerHTML = `
    <div class="row">
    
        <div class="col-md-4 ">
        <img class='bg-blend-multiply' id="movie-backdrop" src=${
          BACKDROP_BASE_URL + movie.backdrop_path
        } height = 'auto'> <br>
        <div class= 'movie-trailer'>
        <iframe width="426" height="240" id="trailer" type="text/html" src="https://www.youtube.com/embed/${trailer}?autoplay=1" ></iframe>
          </div> 
          
        </div>
        <div class="col-md-8 ">
            <h2 id="movie-title" class='text-5xl text-white'>${movie.title}</h2>
            
            <p id="movie-release-date" class='text-slate-50'> ${
              movie.release_date
            }</p>
            <p id="movie-runtime" class='text-slate-50'>${
              movie.runtime
            } Minutes</p>
            <h3 class='text-slate-50 text-xl'>Overview:</h3>
            <p id="movie-overview" class='text-slate-50 w-3/5'>${
              movie.overview
            }</p>
            <div class='info-movie'>
            <span class='text-red-400'>Vote Average: ${
              movie.vote_average
            }/10</span>
            <span class='text-red-400'>Vote Count: ${
              movie.vote_count
            }</span></div>
            <div id='director'></div>
            <p id="original-language" class='text-orange-300'>Original Language: <span style="text-transform: uppercase;">${
              movie.original_language
            }</span></p>
            <h3 class='text-white text-2xl'>Actors:</h3>
            <div id="actors"  class="actors-slide row flex flex-wrap w-3/4" >
            </div>
            </div>
            
            </div>
            
            <br>
            <div class='mt-6 mb-6  w-2/3'>
            <h3 class='text-white text-2xl'>Production Companies:</h3>
            <div class = ' h-1/5 row flex flex-wrap gap-3 ' id= "companies" width='3rem'></div>
            </div>
            <div>
            <h3 class='text-white text-2xl mt-6'>Similar Movies:</h3>
            <div id = 'similar-movies' class='row '>
            </div>
            </div>`;

  renderingActors(credits);
  renderingSimilarMovies(similarMovies);
  renderingCompanies(movie);
};

//Rendering-----------------------------------------------------------------------------

const renderingActors = (credits) => {
  const actorSection = document.getElementById("actors");

  credits.cast.slice(0, 4).map((credit) => {
    const actorDiv = document.createElement("div");
    actorDiv.setAttribute("class", "actordiv col h-1/5");
    const actorList = document.createElement("li");
    actorList.setAttribute("class", "actor card ");

    actorList.innerHTML = `<img class='actor-pic' value='${credit.id}' src="${
      BACKDROP_BASE_URL + credit.profile_path
    }">
     <div class = "card-body info-actor" '>
          <p >${credit.name}</p>
     </div>`;
    //------------------EventListener----------------------------------------------------
    actorList.addEventListener("click", () => {
      fetchSingleActor(`${credit.id}}`);
    });
    actorDiv.appendChild(actorList);

    actorSection.appendChild(actorDiv);
  });
};

const renderingSimilarMovies = (similarMovies) => {
  const similarMovieSection = document.querySelector("#similar-movies");
  similarMovies.results.slice(0, 7).map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.className += "similar col h-2/5";
    const similarmovieList = document.createElement("li");
    similarmovieList.className += "similar card";
    similarmovieList.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.poster_path}" alt="${
      movie.title
    }"  >
        <div class = "card-body info-movie">
          <p class = "movie-name">${movie.original_title}</p>
        </div>`;

    movieDiv.appendChild(similarmovieList);
    similarMovieSection.appendChild(movieDiv);

    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
  });
};

const renderingCompanies = (movie) => {
  const companySection = document.getElementById("companies");
  movie.production_companies.map((company) => {
    const companyDiv = document.createElement("div");
    companyDiv.className = "col card flex flex-wrap ";
    companyDiv.innerHTML = `
    <img src="${BACKDROP_BASE_URL + company.logo_path}">
    <div class = "card-body">
        <p class = "card-text">${company.name}</p>
    </div>`;
    companySection.appendChild(companyDiv);
  });
};

//we need person ID to use function below
function fetchSingleActor(actorID) {
  fetch(
    `https://api.themoviedb.org/3/person/${actorID}?api_key=${apiKey}&language=en-US`
  )
    .then((resp) => resp.json())
    .then((json) => {
      console.log(json);

      // CONTAINER.innerHTML = ""
      CONTAINER.innerHTML = ` 
<div class="row">
<div class="col-md-12 ">
<img class='bg-blend-multiply' id="movie-backdrop" src=${
        PROFILE_BASE_URL + json.profile_path
      } height = 'auto'> <br>
</div>
  
</div>
<div class="col-md-8 ">
    <h2 id="actor-name" class='text-5xl text-white'>${json.name}</h2>
    
    <p id="actor-birth" class='text-slate-50'> ${json.birthday}</p>
    <p id="place-birth" class='text-slate-50'>${json.place_of_birth} Minutes</p>
    <h3 class='text-slate-50 text-xl'>Overview:</h3>
    <p id="biography" class='text-slate-50 w-3/5'><span class='line-clamp-4'>${
      json.biography
    }<span></p>
    <button id="truncate" class="my-4 underline text-slate-400">Read more...</button>
    
    </div>
    
    <br>
    <div class='mt-6 mb-6  w-2/3'>
    
    </div>
    <div>
    <h3 class='text-white text-2xl mt-6'>Other movies of the actor:</h3>
    <div id = 'similar-movies' class='row '>
    </div>
</div>
</div>`;

      fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=primary_release_date.desc&include_adult=false&include_video=false&page=1&with_people=${json.id}&with_watch_monetization_types=flatrate`
      )
        .then((resp) => resp.json())
        .then((data) => {
          renderingSimilarMovies(data);
        });
    });
}

//Fetching for Filter------------------------------------------------------------------------

function fetchingTopRated() {
  fetch(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
  )
    .then((response) => response.json())
    .then((data) => console.log(data.results));
}
console.log(fetchingTopRated());

/*function fetchingReleaseDate(){
      fetch(`https://api.themoviedb.org/3/movie/{movie_id}/release_dates?api_key=c63e3e406a6a0477c30d877a6acf90b1`)
      .then(response => response.json())
      .then(data => console.log(data.results));
      }
      console.log(fetchingReleaseDate());*/

// Getting movie genres
let isGenreSelected = false;

fetch(
  `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
)
  .then((resp) => resp.json())
  .then((json) => {
    const dropDownMovies = document.getElementById("drop-down");
    const genresListJson = json.genres;

    for (let i = 0; i < genresListJson.length; i++) {
      const option = document.createElement("option");
      option.value = genresListJson[i].id;
      option.textContent = genresListJson[i].name;

      dropDownMovies.appendChild(option);
    }

    dropDownMovies.addEventListener("change", (e) => {
      isGenreSelected = true;

      fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${e.target.value}&with_watch_monetization_types=flatrate`
      )
        .then((resp) => resp.json())
        .then((json) => {
          CONTAINER.innerHTML = "";
          renderMovies(json.results);
        });
    });
  });

// Home Button function
const homeBtn = document.getElementById("homeBtn");
homeBtn.addEventListener("click", () => {
  window.location.href = "./index.html";
});

// Actors List Page
const ActorListBtn = document.getElementById("Actor_list");

ActorListBtn.addEventListener("click", () => {
  fetch(
    `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&language=en-US&page=1`
  )
    .then((res) => res.json())
    .then((json) => {
      const Allactors = json.results;

      CONTAINER.innerHTML = "";

      for (let i = 0; i < Allactors.length; i++) {
        const cardContainer = document.createElement("div");
        const img = document.createElement("img");
        const actrorName = document.createElement("h5");
        actrorName.innerText = Allactors[i].name;

        cardContainer.appendChild(img);
        cardContainer.appendChild(actrorName);
        CONTAINER.appendChild(cardContainer);

        //fetching actors photos for actor list page
        fetch(
          `https://api.themoviedb.org/3/person/${Allactors[i].id}/images?api_key=${apiKey}`
        )
          .then((res) => res.json())
          .then((json) => {
            img.setAttribute(
              "src",
              BACKDROP_BASE_URL + json.profiles[0].file_path
            );
          });
        cardContainer.addEventListener("click", () => {
          window.location.href = "./index.html";
        });
      }
    });
});

// Filter > relaese year slider function
let slider1 = document.getElementById("yearRange");
let output1 = document.getElementById("demo1");
output1.innerHTML = slider1.value;

slider1.oninput = function () {
  output1.innerHTML = this.value;
};

// Filter > rating slider function
let slider2 = document.getElementById("ratingRange");
let output2 = document.getElementById("demo2");
output2.innerHTML = slider2.value;

slider2.oninput = function () {
  output2.innerHTML = this.value;
};

// Filter Button function
const filterBtn = document.getElementById("filterBtn");

let selectedGenreId = "";

filterBtn.addEventListener("click", () => {
  const filterDiv = document.getElementById("filterDiv");

  if (filterDiv.style.display == "block") {
    filterDiv.style.display = "none";
  } else {
    filterDiv.style.display = "block";

    if (isGenreSelected == false) {
      document.getElementById("genre-filter").style.display = "block";

      //Also fetch genres to show in filter box
      fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
      )
        .then((resp) => resp.json())
        .then((json) => {
          const genreListFilter = document.getElementById("genre-filter");
          const genresListJson = json.genres;

          for (let i = 0; i < genresListJson.length; i++) {
            const option = document.createElement("option");
            option.value = genresListJson[i].id;
            option.textContent = genresListJson[i].name;

            genreListFilter.appendChild(option);
          }

          genreListFilter.addEventListener("change", (e) => {
            selectedGenreId = e.target.value;
          });
        });
    } else {
      document.getElementById("genre-filter").style.display = "none";
    }
  }
});

// Find movies button function
const findMoviesBtn = document.getElementById("giveMeMoviesBtn");
findMoviesBtn.addEventListener("click", () => {
  const selectedYear = slider1.value;
  const selectedRate = slider2.value;

  // If we want to see the movies AFTER a certain relase year we can use this fetch
  //https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=${selectedYear}&vote_average.gte=${selectedRate}&with_genres=${selectedGenreId}&with_watch_monetization_types=flatrate

  //this is filtering only the selecter year's movies
  fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_year=${selectedYear}&vote_average.gte=${selectedRate}&with_genres=${selectedGenreId}&with_watch_monetization_types=flatrate`
  )
    .then((resp) => resp.json())
    .then((json) => {
      CONTAINER.innerHTML = "";
      renderMovies(json.results);
    });
});

//Fetching for Sorting--------------------------------------

function fetchingReleaseDate() {
  fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=primary_release_date.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`
  )
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      CONTAINER.innerHTML = "";
      renderMovies(json.results);
    });
}

function fetchingPopular() {
  fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`
  )
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      CONTAINER.innerHTML = "";
      renderMovies(json.results);
    });
}

function sortByRate() {
  fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      CONTAINER.innerHTML = "";
      renderMovies(data.results);
    });
}

document.querySelector("#dropdown-filter").addEventListener("change", (e) => {
  if (e.target.value == "top-rated") {
    sortByRate();
  } else if (e.target.value == "popular") {
    fetchingPopular();
  } else if (e.target.value == "release-date") {
    fetchingReleaseDate();
  }
});

document.addEventListener("DOMContentLoaded", autorun);
