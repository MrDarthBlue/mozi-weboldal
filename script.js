//Diavetítés 5 másodpercre
var slideIndex = 0;
  showSlides();

  function showSlides() {
    var slides = document.getElementsByClassName("mySlides");
    for (var i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}    
    slides[slideIndex-1].style.display = "block";  
    setTimeout(showSlides, 5000); 
  }

  // Új közelgő film hozzáadása és mentése localStorage-ba
  function saveUpcomingMovie() {
    const title = document.getElementById("upcomingMovieTitle").value;
    const date = document.getElementById("upcomingMovieDate").value;
    const link = document.getElementById("upcomingMovieLink").value;

    if (title && date) {
      const movie = { title, date, link: link || '#' };
      let upcomingMovies = JSON.parse(localStorage.getItem("upcomingMovies")) || [];
      upcomingMovies.push(movie);
      localStorage.setItem("upcomingMovies", JSON.stringify(upcomingMovies));

      closeUpcomingForm();
      displayUpcomingMovies();
    }
  }

  // Közelgő filmek megjelenítése
  function displayUpcomingMovies() {
    const upcomingMoviesList = document.getElementById("upcomingMoviesList");
    upcomingMoviesList.innerHTML = '';

    const upcomingMovies = JSON.parse(localStorage.getItem("upcomingMovies")) || [];
    
    upcomingMovies.forEach((movie, index) => {
      const movieItem = document.createElement("li");
      movieItem.classList.add("w3-padding");
      movieItem.innerHTML = `
        <div class="upcoming-movie-content">
          <a href="${movie.link || '#'}" target="_blank" class="upcoming-movie-title">
            ${movie.title}
          </a>
          <div class="upcoming-movie-actions">
            <span class="w3-badge">${movie.date}</span>
            <button class="w3-button w3-red" onclick="deleteUpcomingMovie(${index})">Törlés</button>
          </div>
        </div>
      `;
      upcomingMoviesList.appendChild(movieItem);
    });
  }

  // Közelgő film törlése
  function deleteUpcomingMovie(index) {
    let upcomingMovies = JSON.parse(localStorage.getItem("upcomingMovies")) || [];
    upcomingMovies.splice(index, 1);
    localStorage.setItem("upcomingMovies", JSON.stringify(upcomingMovies));
    displayUpcomingMovies();
  }

  // Közelgő filmek hozzáadása lap
  function openUpcomingForm() {
    // Űrlap mezők ürítése
    document.getElementById("upcomingMovieTitle").value = "";
    document.getElementById("upcomingMovieDate").value = "";
    document.getElementById("upcomingMovieLink").value = "";
    
    // Űrlap megjelenítése
    document.getElementById("upcomingForm").style.display = "block";
  }

  // Közelgő film lap bezárása
  function closeUpcomingForm() {
    document.getElementById("upcomingForm").style.display = "none";
  }

  // Új film hozzáadása a listához és elmentése
  function saveMovie() {
      const title = document.getElementById("movieTitle").value;
      const image = document.getElementById("movieImage").value;
      const link = document.getElementById("movieLink").value;
      const genre = document.getElementById("movieGenre").value || "action";

      if (title && image && link) {
          const movie = { 
              title, 
              image, 
              link,
              genre,
              rating: 0 // Alapértelmezett értékelés
          };
          
          // Meglévő filmek betöltése
          let movies = JSON.parse(localStorage.getItem("movies")) || [];
          
          // Új film hozzáadása
          movies.push(movie);
          
          // Filmek mentése
          localStorage.setItem("movies", JSON.stringify(movies));
          
          // Űrlap bezárása
          closeForm();
          
          // Aktív rendezés meghatározása és alkalmazása
          const activeSortBtn = document.querySelector('.sort-btn.active');
          const sortOrder = activeSortBtn ? 
              (activeSortBtn.getAttribute('onclick').includes("'asc'") ? 'asc' : 'desc') : 
              'asc';
          
          // Filmek újramegjelenítése a megfelelő sorrendben
          displayMovies();
          
          // Rendezés alkalmazása
          sortMovies(sortOrder);
      } else {
          alert("Kérlek töltsd ki minden mezőt!");
      }
  }

  // Filmek betűrend szerinti rendezése (növekvő vagy csökkenő)
  function sortMovies(order) {
      let movies = JSON.parse(localStorage.getItem("movies")) || [];
      
      movies.sort((a, b) => {
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();
          return order === 'asc' 
              ? titleA.localeCompare(titleB, 'hu')
              : titleB.localeCompare(titleA, 'hu');
      });

      localStorage.setItem("movies", JSON.stringify(movies));
      displayMovies();
      
      // Rendezési gombok frissítése
      document.querySelectorAll('.sort-btn').forEach(btn => {
          btn.classList.remove('active');
          if (btn.getAttribute('onclick').includes(`'${order}'`)) {
              btn.classList.add('active');
          }
      });
  }

  // Filmek megjelenítése a képernyőn a localStorage alapján
  function displayMovies() {
      const movieContainer = document.getElementById("movieContainer");
      movieContainer.innerHTML = '';

      const movies = JSON.parse(localStorage.getItem("movies")) || [];
      
      movies.forEach((movie, index) => {
          const movieDiv = document.createElement("div");
          movieDiv.classList.add("movie-card");
          movieDiv.innerHTML = `
              <div class="movie-poster-container">
                  <a href="${movie.link}" target="_blank">
                      <img src="${movie.image}" class="movie-poster" alt="${movie.title}">
                  </a>
              </div>
              <div class="movie-title">${movie.title}</div>
              <div class="w3-small w3-center">${getGenreName(movie.genre)}</div>
              <div class="rating" data-movie-index="${index}">
                  <span class="rating-star" data-value="1">★</span>
                  <span class="rating-star" data-value="2">★</span>
                  <span class="rating-star" data-value="3">★</span>
                  <span class="rating-star" data-value="4">★</span>
                  <span class="rating-star" data-value="5">★</span>
              </div>
              <div class="w3-center">
                  <button class="w3-button w3-red" onclick="deleteMovie(${index})">Törlés</button>
              </div>
          `;
          movieContainer.appendChild(movieDiv);
          
          // Értékelés beállítása, ha van
          if (movie.rating) {
              setRating(movieDiv.querySelector('.rating'), movie.rating);
          }
      });
      
      // Eseményfigyelők hozzáadása a csillagokhoz
      document.querySelectorAll('.rating-star').forEach(star => {
          star.addEventListener('click', function() {
              const ratingContainer = this.parentElement;
              const value = parseInt(this.getAttribute('data-value'));
              const movieIndex = parseInt(ratingContainer.getAttribute('data-movie-index'));
              
              setRating(ratingContainer, value);
              saveMovieRating(movieIndex, value);
          });
      });
  }

  // Film szűrése kategória szerint
  function filterMovies(genre) {
    // Aktív gomb beállítása
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.textContent.toLowerCase() === genre.toLowerCase() || 
          btn.getAttribute('onclick').includes("'"+genre+"'") || 
          (genre === 'all' && btn.textContent === 'Összes')) {
        btn.classList.add('active');
      }
    });

    const movies = JSON.parse(localStorage.getItem("movies")) || [];
    const movieContainer = document.getElementById("movieContainer");
    movieContainer.innerHTML = '';

    movies.forEach((movie, index) => {
      if (genre === 'all' || movie.genre === genre) {
        const movieDiv = document.createElement("div");
        movieDiv.classList.add("movie-card");
        movieDiv.innerHTML = `
          <div class="movie-poster-container">
            <a href="${movie.link}" target="_blank">
              <img src="${movie.image}" class="movie-poster" alt="${movie.title}">
            </a>
          </div>
          <div class="movie-title">${movie.title}</div>
          <div class="w3-small w3-center">${getGenreName(movie.genre)}</div>
          <div class="rating" data-movie-index="${index}">
            <span class="rating-star" data-value="1">★</span>
            <span class="rating-star" data-value="2">★</span>
            <span class="rating-star" data-value="3">★</span>
            <span class="rating-star" data-value="4">★</span>
            <span class="rating-star" data-value="5">★</span>
          </div>
          <div class="w3-center">
            <button class="w3-button w3-red" onclick="deleteMovie(${index})">Törlés</button>
          </div>
        `;
        movieContainer.appendChild(movieDiv);
        
        const savedRating = getMovieRating(index);
        if (savedRating) {
          setRating(movieDiv.querySelector('.rating'), savedRating);
        }
      }
    });
  }

  // Kategória nevei
  function getGenreName(genre) {
    const genres = {
      'action': 'Akció',
      'adventure': 'Kaland',
      'animation': 'Animáció',
      'comedy': 'Vígjáték',
      'crime': 'Bűnügyi',
      'documentary': 'Dokumentum',
      'drama': 'Dráma',
      'family': 'Családi',
      'fantasy': 'Fantasy',
      'historical': 'Történelmi',
      'horror': 'Horror',
      'musical': 'Musical',
      'mystery': 'Rejtély',
      'romance': 'Romantikus',
      'sci-fi': 'Sci-Fi',
      'thriller': 'Thriller',
      'war': 'Háborús',
      'western': 'Western'
    };
    return genres[genre] || genre;
  }

  // Film értékelésének mentése az adott filmhez
  function saveMovieRating(movieIndex, rating) {
      let movies = JSON.parse(localStorage.getItem("movies")) || [];
      if (movies[movieIndex]) {
          movies[movieIndex].rating = rating;
          localStorage.setItem("movies", JSON.stringify(movies));
      }
  }

  // Film értékelésének lekérése a tárhelybőlk
  function getMovieRating(movieIndex) {
    const ratings = JSON.parse(localStorage.getItem("movieRatings")) || {};
    return ratings[movieIndex];
  }

  // Csillagok megjelenítése a kiválasztott értékelés szerint
  function setRating(ratingContainer, value) {
    const stars = ratingContainer.querySelectorAll('.rating-star');
    stars.forEach(star => {
      const starValue = parseInt(star.getAttribute('data-value'));
      if (starValue <= value) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }

  // Film törlése
  function deleteMovie(index) {
      let movies = JSON.parse(localStorage.getItem("movies")) || [];
      movies.splice(index, 1);
      localStorage.setItem("movies", JSON.stringify(movies));
      displayMovies();
  }

  // Film hozzáadása Modal űrlap megnyitása
  function openForm() {
    // Űrlap mezők ürítése
    document.getElementById("movieTitle").value = "";
    document.getElementById("movieImage").value = "";
    document.getElementById("movieLink").value = "";
    document.getElementById("movieGenre").value = "action"; // Visszaállítjuk az alapértelmezettre
    
    // Űrlap megjelenítése
    document.getElementById("movieForm").style.display = "block";
  }

  // Modal űrlap bezárása
  function closeForm() {
    document.getElementById("movieForm").style.display = "none";
  }

  window.onload = function() {
      sortMovies('asc');
      displayMovies();
      document.querySelector('.filter-btn').click();
  };
  // Rendezés
  function sortMovies(order) {
    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    
    // Filmek sorrendbe állítása
    movies.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      
      if (order === 'asc') {
        return titleA.localeCompare(titleB);
      } else {
        return titleB.localeCompare(titleA);
      }
    });

    // Rendezett lista mentése
    localStorage.setItem("movies", JSON.stringify(movies));
    
    // Lista frissitése
    displayMovies();
    
    // Aktív rendezés gomb frissítése
    document.querySelectorAll('.sort-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('onclick').includes(`'${order}'`)) {
        btn.classList.add('active');
      }
    });
  }
  // Rendezési gombok kezelése
  function setupSortButtons() {
    document.querySelectorAll('.sort-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const order = this.getAttribute('onclick').includes("'asc'") ? 'asc' : 'desc';
        sortMovies(order);
      });
    });
  }