// NOTE See HELP.md in this folder for some useful info & tips

import "./tests.js";

const { css } = emotion;
const { useEffect, useState } = React;

const style = css`
  text-align: center;
`;

export const App = ({ onLoad }) => {
  const [movies, setMovies] = useState([]);

  useEffect(onLoad, []); // to run tests

  useEffect(() => {
    const getMovies = async () => {
      const fetchMovies = await fetch('/api/movies.json');
      const movies = await fetchMovies.json();
      const sortMoviesAlphabetically = movies.sort((a,b) => a.title.localeCompare(b.title));

      setMovies(sortMoviesAlphabetically);
      localStorage.setItem('movies', JSON.stringify(sortMoviesAlphabetically));
    };

    const moviesFromLocalStorage = localStorage.getItem('movies');

    if (moviesFromLocalStorage !== null) {
      const parseLocalStorageMovies = JSON.parse(moviesFromLocalStorage);
      setMovies(parseLocalStorageMovies);
    } else {
      getMovies();
    }
  }, []);

  console.log('movies', movies);

  return html`
  <div>
    <h1>Movies Evan Likes!</h1>
    <p>Below is a (not) comprehensive list of movies that Evan really likes.</p>
    <hr />
    <ul>
      ${movies.map(movie => html`
        <li key=${movie.id}><span>${movie.score * 100}%</span> <a href=${movie.url}>${movie.title}</a> <span>(${movie.year})</span></li>
      `)}
    </ul>
  </div>
  `;
};
