import { getTrendingMovies, updateSearchCount } from "./backend/appwrite.js";
import Search from "./components/Search.jsx";
import { useCallback, useEffect, useState } from "react";
import Spinners from "./components/Spinners.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { debounce } from "lodash";

export default function App () {
    const [searchTerm, setSearchTerm] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [ trendingMovies, setTrendingMovies ] = useState([]);
    
    /*
    const BASE_API_URL = "https://api.themoviedb.org/3";
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    const API_OPTIONS = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${API_KEY}`
        }
    }
    
     */



    /*
    * Debounce to prevent rapid API calls
    * useCallback to prevent unnecessary re-renders and empty dependency array to render only once
    */
    const fetchMovies = useCallback(
        debounce(
            async (query = '') =>
            {
                setIsLoading(true);
                setErrorMsg("");

                try {
                    const endpoint =
                        query ?
                            `/api/movies?query=${encodeURI(query)}`
                            : `/api/movies`;
                    const response = await fetch(endpoint);

                    if(!response.ok) {
                        throw new Error();
                    }

                    const data = await response.json();

                    //console.log(data);

                    if (data.success === 'false') {
                        setErrorMsg(data.statusMessage || 'Failed to fetch movies');
                        setMovieList([]);
                        return;
                    }

                    setMovieList(data.results || []);
                    //console.log(data.results);
                    //* Update search count in Db or create new document
                    if ( query && data.results.length > 0 ) {
                        await updateSearchCount(query, data.results[0]);
                    }

                } catch (e) {
                    console.error(`Error fetching movies: ${e}`);
                    setErrorMsg("Error fetching movies, please try again later!");
                } finally {
                    setIsLoading(false);
                }
    }, 800), []);
    
    const fetchTrendingMovies = useCallback (
        async () => {
            try {
                const movies = await getTrendingMovies();
                setTrendingMovies(movies);
            } catch (error) {
                console.error('Error:', error);
                setErrorMsg("Error fetching movies, please try again later!");
            }
        }
    );
    
    
    useEffect( () => {
        fetchTrendingMovies();
    }, [] );


    useEffect(() => {
        
        fetchMovies(searchTerm);
    }, [searchTerm, fetchMovies]);

    return (
        <main>
            <div
                className="pattern"
            >

            </div>

            <div
                className="wrapper"
            >
                <header>
                    <img
                        src="/hero.png"
                        alt="Hero Banner"
                    />
                    <h1>
                        Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
                    </h1>
                    <Search
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                </header>
                
                { trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2>
                            Trending Movies
                        </h2>
                        <ul>
                            {trendingMovies.map((movie, index) => (
                                <li key={movie.movie_id}>
                                    <p>
                                        {index + 1}
                                    </p>
                                    <img
                                        src={movie.poster_url}
                                        alt={`Poster for ${movie.movie_id}`}
                                    />
                                </li>
                            ))}
                        </ul>
                    </section>
                ) }

                <section
                    className="all-movies"
                >
                    <h2>
                        All Movies
                    </h2>
                    {isLoading ? (
                        <Spinners />
                    ) : errorMsg ? (
                        <p
                            className="text-red-500"
                        >
                            {errorMsg}
                        </p>
                    ) : (
                        <ul>
                            {movieList.map((movie) => {
                                return (
                                    <MovieCard
                                        key={movie.id}
                                        movie={movie}
                                    />
                                )
                            })}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    )
}