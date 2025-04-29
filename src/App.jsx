import React, { useEffect } from "react";
import { useState } from "react";

const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "28ea815c";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoadind, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const query = "home alone";

  useEffect(function () {
    async function fetchMovies() {
      try {
        setIsLoading(true);
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`);
        if (!res.ok) throw new Error("Something went wrong, please try again or check your internet conection");
        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");
        setMovies(data.Search);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovies();
  }, []);

  return (
    <>
      <NavBar>
        <Logo />
        <Input />
        <Results movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoadind ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoadind && <Loader />}
          {!isLoadind && !error && <MovieList movies={movies} />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          <WatchedSummary watched={watched} />
          <WatchedList watched={watched} />
        </Box>
      </Main>
    </>
  );
};

export default App;

function Loader() {
  return (
    <div className="loader">
      <p>Loading...</p>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>🚫</span>
      {message}
    </p>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Results({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Logo() {
  return (
    <div className="logo">
      <h1>Movix</h1>
    </div>
  );
}

function Input() {
  const [query, setQuery] = useState("");
  return <input className="search" type="text" placeholder="Search movies..." value={query} onChange={(e) => setQuery(e.target.value)} />;
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function WatchedList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedListMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function WatchedListMovie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function Movie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
