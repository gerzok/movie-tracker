// NOTE See HELP.md in this folder for some useful info & tips

import "./tests.js";

const { css } = emotion;
const { useEffect, useState } = React;

const style = css`
  text-align: center;
`;

export const App = ({ onLoad }) => {
  const [movies, setMovies] = useState([]);
  const [decades, setDecades] = useState([]);
  const [selectedDecade, setSelectedDecade] = useState("");

  useEffect(onLoad, []); // to run tests

  useEffect(() => {
    localStorageCache();
  }, []);

  useEffect(() => {
    getDecadesFromMovies();
  }, [movies]);

  const getMovies = async () => {
    const fetchMovies = await fetch('/api/movies.json');
    const movies = await fetchMovies.json();
    const sortMoviesAlphabetically = movies.sort((a,b) => a.title.localeCompare(b.title));

    setMovies(sortMoviesAlphabetically);
    localStorage.setItem('movies', JSON.stringify(sortMoviesAlphabetically));
  };

  const localStorageCache = () => {
    const moviesFromLocalStorage = localStorage.getItem('movies');

    if (moviesFromLocalStorage !== null) {
      const parseLocalStorageMovies = JSON.parse(moviesFromLocalStorage);
      setMovies(parseLocalStorageMovies);
    } else {
      getMovies();
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

  console.log('movies', movies);
  console.log('selectedDecade', selectedDecade);

  return html`
  <div>
    <h1>Movies Evan Likes!</h1>
    <p>Below is a (not) comprehensive list of movies that Evan really likes.</p>
    <hr />

    <fieldset>
      <label>Title contains:</label>
      <input name="search" type="text" onChange=${(e) => handleSearch(e.target.value)} placeholder="Search by title" />
    </fieldset>
    <fieldset>
      <label>Decade:</label>
      <select onChange=${(e) => handleFilterByDecade(e.target.value)}>
        <option value="spacer"></option>
        ${decades.map((decade) => html`<option key=${decade} value=${decade}>${decade}</option>`)}
      </select>
    </fieldset>

    <ul>
      ${movies.map(movie => html`
        <li key=${movie.id}><span>${movie.score * 100}%</span> <a href=${movie.url}>${movie.title}</a> <span>(${movie.year})</span></li>
      `)}
    </ul>
  </div>
  `;
};
