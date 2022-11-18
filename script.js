"use strict";
const query = "";
const searchMul = `https://api.themoviedb.org/3/search/multi`;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

// This my api key
const apiKey = "87b7a72219e91c516dfe252a080dfc25";

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

// You may need to add to this function, definitely don't dele0te it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// this function is to fetch multisearch,
function searchMovie(searchValue) {
  return fetch(`${searchMul}?api_key=${apiKey}&query=${searchValue}`)
    .then((response) => response.json())
    .then((jsonData) => {
      const go = jsonData.results;
      return go;
    });
}

// this function is to render the fetch ,
function renderResult(searchResults) {
  const tag = document.getElementById("resultsList");
  const searchfield = document.getElementById("search");
  if (searchfield.value.length > 0) {
    tag.innerHTML = "";
    const list = searchResults.slice(0, 3).map((results) => {
      if (results.title) {
        tag.innerHTML +=
          `<li class="movie-search" id="${results.id}">` +
          results.title +
          "</li>";
      } else if (results.name) {
        tag.innerHTML += `<li id="${results.name}">` + results.name + "</li>";
      }
    });
  } else {
    tag.innerHTML = "";
  }
  createAuto(renderResult);

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

function createAuto(list) {
  const ListEl = document.createElement("resultsList");
  listEl = "movie-search";
}

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
    </div>`;
};

// Home Button function
const homeBtn = document.getElementById('homeBtn')
homeBtn.addEventListener('click', () => {
  window.location.reload()
})


// Filter > relaese year slider function
let slider1 = document.getElementById('yearRange')
let output1 = document.getElementById('demo1')
  output1.innerHTML = slider1.value

  slider1.oninput = function(){
    output1.innerHTML = this.value
  }

// Filter > rating slider function
let slider2 = document.getElementById('ratingRange')
let output2 = document.getElementById('demo2')
  output2.innerHTML = slider2.value

  slider2.oninput = function(){
    output2.innerHTML = this.value
  }

// Filter Button function
const filterBtn = document.getElementById('filterBtn')

let selectedGenreId = ''

filterBtn.addEventListener('click', () => {
  const filterDiv = document.getElementById('filterDiv')

  if(filterDiv.style.display == 'block'){
    filterDiv.style.display = 'none'
  }else{
    filterDiv.style.display = 'block'

    if(isGenreSelected == false){
    document.getElementById('genre-filter').style.display = 'block'  

    //Also fetch genres to show in filter box
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`)
    .then(resp => resp.json())
    .then(json => {
      const genreListFilter = document.getElementById('genre-filter')
      const genresListJson = json.genres

    
      for(let i = 0; i < genresListJson.length; i++){
    
        const option = document.createElement('option')
        option.value = genresListJson[i].id
        option.textContent = genresListJson[i].name
    
        genreListFilter.appendChild(option)
      }
    
      genreListFilter.addEventListener('change', (e) => {
        selectedGenreId = e.target.value
      })
    })
    }else{
    document.getElementById('genre-filter').style.display = 'none'  
    }

   
  }
})

// Find movies button function
const findMoviesBtn = document.getElementById('giveMeMoviesBtn')
  findMoviesBtn.addEventListener('click', () => {
    const selectedYear = slider1.value
    const selectedRate = slider2.value


// If we want to see the movies AFTER a certain relase year we can use this fetch
//https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=${selectedYear}&vote_average.gte=${selectedRate}&with_genres=${selectedGenreId}&with_watch_monetization_types=flatrate


//this is filtering only the selecter year's movies
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_year=${selectedYear}&vote_average.gte=${selectedRate}&with_genres=${selectedGenreId}&with_watch_monetization_types=flatrate`)
    .then(resp => resp.json())
    .then(json => {

      CONTAINER.innerHTML =''
      renderMovies(json.results)
    })

  })


// Getting movie genres 
let isGenreSelected = false

fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`)
.then(resp => resp.json())
.then(json => {

  const dropDownMovies = document.getElementById('drop-down')
  const genresListJson = json.genres
  

  for(let i = 0; i < genresListJson.length; i++){

    const option = document.createElement('option')
    option.value = genresListJson[i].id
    option.textContent = genresListJson[i].name


    dropDownMovies.appendChild(option)
  }

  dropDownMovies.addEventListener('change', (e) => {
    isGenreSelected = true

    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${e.target.value}&with_watch_monetization_types=flatrate`)
    .then(resp => resp.json())
    .then(json => {

      CONTAINER.innerHTML =''
      renderMovies(json.results)
    })
    
  })

document.addEventListener("DOMContentLoaded", autorun);
