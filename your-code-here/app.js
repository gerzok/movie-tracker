// NOTE See HELP.md in this folder for some useful info & tips

import "./tests.js";

const { css } = emotion;
const { useEffect, useState } = React;

const style = {
  container: css`
    margin: 0 auto;
    width: 45vw;
  `,

  ul: css`
    margin-top: 20px;;
  `,

  li: css`
    &:hover {
      background-color: #DDD;
      cursor: pointer;
    }
  `,

  liSelected: css`
    background-color: #DDD;
    padding: 10px;
  `,

  cover: css`
    margin-right: 10px;

    & img {
      max-width: 120px;
      height: auto;
    }
  `,

  searchBoxContainer: css`
    margin-top: 10px;
    padding: 15px;
    border: 1px solid #DDD;
    border-bottom: 0;

    & input {
      margin-left: 5px;
      padding: 10px;
      border: 1px solid #CCC;
    }
  `,

  decadeBoxContainer: css`
    padding: 15px;
    border: 1px solid #DDD;

    & select {
      background-color: white;
      border: 1px solid #CCC;
      display: inline-block;
      font: inherit;
      line-height: 1.5em;
      padding: 6px 50px;
      margin-left: 5px;
    }
  `
};

const accordion = {
  active: css`
    background-color: #DDD;
    padding: 10px 20px 3px;
    display: flex;
  `,
  inactive: css`
    display: none;
  `
};

export const App = ({ onLoad }) => {
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [decades, setDecades] = useState([]);
  const [toggleAccordion, setToggleAccordion] = useState(false);
  const [contentReview, setContentReview] = useState("");
  const [selectedDecade, setSelectedDecade] = useState("");

  useEffect(onLoad, []); // to run tests

  useEffect(() => {
    localStorageCache();
  }, []);

  useEffect(() => {
    getDecadesFromMovies();
  }, [movies]);

  const getMoviesReview =  async () => {
    const fetchReviews = await fetch('/api/reviews.json');
    const reviews = await fetchReviews.json();
    setReviews(reviews);
    localStorage.setItem('reviews', JSON.stringify(reviews));
  };

  const getMovies = async () => {
    const fetchMovies = await fetch('/api/movies.json');
    const movies = await fetchMovies.json();
    const sortMoviesAlphabetically = movies.sort((a,b) => a.title.localeCompare(b.title));

    setMovies(sortMoviesAlphabetically);
    localStorage.setItem('movies', JSON.stringify(sortMoviesAlphabetically));
  };

  const localStorageCache = () => {
    const moviesFromLocalStorage = localStorage.getItem('movies');
    const reviewsFromLocalStorage = localStorage.getItem('reviews');

    if (moviesFromLocalStorage !== null && reviewsFromLocalStorage !== null) {
      const parseLocalStorageMovies = JSON.parse(moviesFromLocalStorage);
      const parseLocalStorageReviews = JSON.parse(reviewsFromLocalStorage);

      setMovies(parseLocalStorageMovies);
      setReviews(parseLocalStorageReviews);
    } else {
      getMovies();
      getMoviesReview();
    }
  };

  const getMoviesFromCache = () => {
    const moviesFromLocalStorage = localStorage.getItem('movies');

    if (moviesFromLocalStorage !== null) {
      return JSON.parse(moviesFromLocalStorage);
    } else {
      localStorageCache();
    }
  };

  const getDecadesFromMovies = () => {
    const moviesFromCache = getMoviesFromCache();
    const years = moviesFromCache.map((movie) => movie.year);
    const decades = years.map((year) => (Math.floor(year / 10)) * 10);
    const removeDuplicates = decades.filter((year, index, arr) => arr.indexOf(year) === index);
    const sortedDecades = removeDuplicates.sort();
    setDecades(sortedDecades);
  };

  const handleSearch = (str) => {
    const search = str.toLowerCase();

    if (search.length >= 2) {
      const searchingMovies = selectedDecade ? movies : getMoviesFromCache();
      const filterMovies = searchingMovies.filter((movie) => movie.title.toLowerCase().includes(search));
      setMovies(filterMovies);
    } else if (search.length < 1 && !selectedDecade) {
      localStorageCache();
    } else if(search.length < 1 && selectedDecade) {
      handleFilterByDecade(selectedDecade);
    }
  };

  const handleFilterByDecade = (decade) => {
    if (decade !== "spacer") {
      const moviesFromCache = getMoviesFromCache();
      const filterMovies = moviesFromCache.filter((movie) => Math.floor(movie.year / 10) * 10 === parseInt(decade));
      setMovies(filterMovies);
      setSelectedDecade(decade);
    } else {
      localStorageCache();
      setSelectedDecade("");
    }
  };

  const handleAccordion = (event, movieId) => { 
    if (event.target.localName === "a") {
      return;
    }

    const toggle = toggleAccordion === movieId ? false : movieId;
    const getReviewToShow = reviews.find((review) => review['movie-id'] === movieId);

    setContentReview(getReviewToShow.review);
    setToggleAccordion(toggle);
  };


  return html`
    <div className=${style.container}>
      <h1>Movies Evan Likes!</h1>
      <p>Below is a (not) comprehensive list of movies that Evan really likes.</p>
      <hr />

      <fieldset className=${style.searchBoxContainer}>
        <label htmlFor="search">Title contains:</label>
        <input name="search" id="search" type="text" onChange=${(e) => handleSearch(e.target.value)} placeholder="Search by title" />
      </fieldset>
      <fieldset className=${style.decadeBoxContainer}>
        <label htmlFor="decade">Decade:</label>
        <select name="decade" id="decade" onChange=${(e) => handleFilterByDecade(e.target.value)}>
          <option value="spacer"></option>
          ${decades.map((decade) => html`<option key=${decade} value=${decade}>${decade}</option>`)}
        </select>
      </fieldset>

      <ul className=${style.ul}>
        ${movies.map(movie => html`
          <li key=${movie.id} className=${movie.id !== toggleAccordion ? style.li : style.liSelected}>
            <div onClick=${(e) => handleAccordion(e, movie.id)}>
              <span>${movie.score * 100}%</span> <a href=${movie.url}>${movie.title}</a> <span>(${movie.year})</span>
              <div className=${movie.id === toggleAccordion ? accordion.active : accordion.inactive}>
                <div className=${style.cover}><img src=${movie["cover-url"]} /></div>
                <div className="content-review">${contentReview}</div>
              </div>
            </div>
          </li>
        `)}
      </ul>
    </div>
  `;
};
