const MovieCard = ({ movie: { title,vote_average, poster_path, release_date, original_language } }) => {
    const releaseDate = new Date(release_date);

    return (
        <div
            className="movie-card"
        >
            <img
                src=
                    {
                poster_path ?
                    `https://image.tmdb.org/t/p/w500/${poster_path}` :
                    '/no-movie.png'
            }
                alt="Movie Poster"
            />

            <div
                className="mt-4"
            >
                <h3>
                    {title}
                </h3>

                <div
                    className="content"
                >
                    <div className="rating">
                        <img src='/star.svg' alt="Rating star" />
                        <p>
                            {
                                vote_average ?
                                    (Math.round(vote_average * 100) / 100).toFixed(1) :
                                    'N/A'
                            }
                        </p>
                        <span>
                            &#x2022;
                        </span>
                        <p className="lang">
                            {original_language}
                        </p>
                        <span>
                            &#x2022;
                        </span>
                        <p className="year">
                            {
                                releaseDate ?
                                    releaseDate.toLocaleDateString("en-US", { month: "long", year: "numeric" }) :
                                    'N/A'
                            }
                        </p>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default MovieCard
