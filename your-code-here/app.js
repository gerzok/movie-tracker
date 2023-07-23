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
      // const sortMoviesAlphabetically = movies.sort((a,b) => {
      //   const titleA = a.title.toUpperCase();
      //   const titleB = b.title.toUpperCase();
      //   if (titleA < titleB) {
      //     return -1;
      //   }
      //   if (titleA > titleB) {
      //     return 1;
      //   }
      //   return 0;
      // });
      const sortMoviesAlphabetically = movies.sort((a,b) => a.title.localeCompare(b.title));
      setMovies(sortMoviesAlphabetically);
    };
    
    getMovies();
  }, []);

  console.log('movies', movies);

  return html`
    <p className=${style}>
      (this file can be found at ./your-code-here/app.js)
    </p>
  `;
};
