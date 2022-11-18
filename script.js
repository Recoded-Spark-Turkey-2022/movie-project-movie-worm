'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");
const API_KEY= 'c63e3e406a6a0477c30d877a6acf90b1';
const main = document.getElementById('main');
const imgDiv = document.createElement('div');


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
  return res.json()
  
};


// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  movies.map((movie) => {
    
    const movieDiv = document.createElement("div"); 
    movieDiv.id = 'movie'
    movieDiv.className += 'h-1/5'
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title} poster" class='h-3/6'>
       <div class='info'>
        <h3>${movie.title}</h3>
        
        
        <span class="${coloring(movie.vote_average)}">${movie.vote_average}/10</span> 
        </div>
        <div class='small-info'>
        <p>${movie.overview} </p>
        </div>`;
        

    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
      imgDiv.remove(imgDiv);
      
    });
    CONTAINER.appendChild(movieDiv);
   

  });
  
  
  
  homepageContent();

};


//Homepage ImageDiv-----------------------------------------
const homepageContent = function (){
 const main = document.getElementById('main');
  imgDiv.className += "imgDiv pt-6 w-full flex flex-wrap flex-col items-center justify-center";
  imgDiv.innerHTML = `<img  class="rounded-md w-3/4  "  src="./images/LS-Video-PremiumChannels_TMC_Hero-Mobile.jpg" alt="">`;
 const smallmoviecard = document.createElement('div');
 smallmoviecard.className += 'small-movie col';
 
main.appendChild(imgDiv);

}
//<h1 class='css text-7xl font-extrabold tracking-widest'>MOVIE WORM</h1> <br> <p class='csss text-3xl'>Do not Miss the Newest!</p>
//Coloring Vote-----------------------------------------
function coloring(vote) {
  if(vote>= 8){
      return "green"
  }
  else if(vote >= 6){
      return "orange"
  }
  else{
      return "red"
  }
}


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
            
            <p id="movie-release-date" class='text-slate-50'> ${movie.release_date}</p>
            <p id="movie-runtime" class='text-slate-50'>${movie.runtime} Minutes</p>
            <h3 class='text-slate-50 text-xl'>Overview:</h3>
            <p id="movie-overview" class='text-slate-50 w-3/5'>${movie.overview}</p>
            <div class='info-movie'>
            <span class='text-red-400'>Vote Average: ${movie.vote_average}/10</span>
            <span class='text-red-400'>Vote Count: ${movie.vote_count}</span></div>
            <div id='director'></div>
            <p id="original-language" class='text-orange-300'>Original Language: <span style="text-transform: uppercase;">${movie.original_language}</span></p>
            <h3 class='text-white text-2xl'>Actors:</h3>
            <div id="actors" class="actors-slide row flex flex-wrap w-3/4" >
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
    $('.actors-slide').slick({
      dots: true,
      infinite: false,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 4,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
        
      ]
    });
    
};





//Rendering-----------------------------------------------------------------------------

const renderingActors = (credits) => {
  const actorSection = document.getElementById("actors");
  
    credits.cast.slice(0, 7).map((credit) => {
    const actorDiv = document.createElement('div');
    actorDiv.setAttribute('class','actor col h-1/5');
    const actorList = document.createElement('li');
    actorList.setAttribute('class', 'actor card ');
    
    actorList.innerHTML = `<img src="${BACKDROP_BASE_URL + credit.profile_path}">
     <div class = "card-body info-actor">
          <p >${credit.name}</p>
     </div>`;
    actorList.addEventListener("click", () => {
     //showSingleActor(credit);-------------------------Hadi is working on it
    });
    actorDiv.appendChild(actorList);

    actorSection.appendChild(actorDiv);
  });
}


const renderingSimilarMovies = (similarMovies) => {
    const similarMovieSection = document.querySelector("#similar-movies");
    similarMovies.results.slice(0, 7).map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.className += "similar col h-2/5";
    const similarmovieList = document.createElement("li");
    similarmovieList.className += "similar card";
    similarmovieList.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.poster_path}" alt="${movie.title}"  >
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
  const companySection = document.getElementById('companies');
  movie.production_companies.map((company) => {
    const companyDiv = document.createElement("div");
    companyDiv.className = "col card flex flex-wrap ";
    companyDiv.innerHTML = `
    <img src="${BACKDROP_BASE_URL + company.logo_path}">
    <div class = "card-body">
        <p class = "card-text">${company.name}</p>
    </div>`;
    companySection.appendChild(companyDiv)
  })
}


const showSingleActor = (credit) => {

}


//Fetching for Sorting--------------------------------------


function fetchingTopRated(){

    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`)
    .then(response => response.json())
    .then(data => {
      CONTAINER.innerHTML='';
      renderMovies(data.results);
    })
    
    
    
    }


function fetchingPopular(){


  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`)
  .then(response => response.json())
  .then(json => {
    CONTAINER.innerHTML='';
    renderMovies(json.results);
  })
}

function fetchingReleaseDate(){
  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=primary_release_date.asc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`)
  .then(response => response.json())
  .then(json => {

    CONTAINER.innerHTML='';
    renderMovies(json.results);
  })
}




document.querySelector('#dropdown-filter').addEventListener('change', e => {
  if(e.target.value == 'top-rated'){
    fetchingTopRated()
  }else if(e.target.value == "popular"){
    fetchingPopular()
  }else if(e.target.value == 'release-date'){
    fetchingReleaseDate()
  }
})



document.addEventListener("DOMContentLoaded", autorun);
