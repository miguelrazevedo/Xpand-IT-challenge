import { useEffect, useState } from 'react';
import './App.css';
import { Movie } from './types/api';

import EyeIcon from './assets/eye_icon.svg';
import InfoPopUp from './components/PopUp/InfoPopUp';
import YearSelector from './components/YearSelector/YearSelector';

const API_URL = 'http://localhost:5000/api';

function App() {
    const [year, setYear] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [orderByRevenue, setOrderByRevenue] = useState<boolean>(false);
    const [orderByYear, setOrderByYear] = useState<boolean>(false);
    const [yearModal, setYearModal] = useState<boolean>(false);
    const [movies, setMovies] = useState<Movie[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [movieInfo, setMovieInfo] = useState<Movie>();
    // Data Fetching Effect
    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            const response = await fetch(
                `${API_URL}/movies?page=${page}&limit=10&orderByRevenue=${orderByRevenue}&year=${
                    year === 0 ? '' : year
                }`
            );

            if (response.ok) {
                const data = await response.json();
                setMovies((prevMovies) => [...prevMovies, ...data]);
            }

            setLoading(false);
        };
        fetchMovies();
    }, [page, orderByRevenue, orderByYear]);

    // Infinite scroll effect
    useEffect(() => {
        const handleScroll = () => {
            const isBottom =
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 50;
            if (isBottom && !loading) {
                setPage((prevPage) => prevPage + 1); // Increment the page number to fetch the next set
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]);

    // Functions
    const handleOrderByRevenue = () => {
        setOrderByRevenue((prev) => !prev);
        setMovies([]);
        setPage(1);
    };

    const toggleYearFilter = () => setYearModal((prev) => !prev);

    const handleSelectByYear = (year: number) => {
        setYearModal(false);
        setOrderByYear(true);
        setOrderByRevenue(true);

        setYear(year);
        setMovies([]);
        setPage(1);
    };

    const showPopUp = (movie: Movie) => {
        setMovieInfo(movie);
        setShowPopup(true);
    };

    const hidePopUp = () => {
        setShowPopup(false);
    };
    return (
        <div>
            {/* Header */}
            <header className='header' />

            {/* Main page */}
            <main className='main'>
                <h1>Movie ranking</h1>

                {/* Filter buttons */}
                <div className='filters'>
                    <button
                        type='button'
                        className={`btn ${orderByRevenue ? 'revenueBtn' : ''}`}
                        onClick={handleOrderByRevenue}
                    >
                        Top 10 Revenue
                    </button>
                    <div className='filter-year'>
                        <button
                            type='button'
                            className={`btn`}
                            onClick={toggleYearFilter}
                        >
                            Top 10 Revenue
                        </button>
                        <YearSelector
                            visible={yearModal}
                            changeYear={handleSelectByYear}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className='tableDiv'>
                    <table className='movieTable'>
                        <thead>
                            <tr>
                                <th className='center-data'>Ranking</th>
                                <th className='title'>Title</th>
                                <th>Year</th>
                                <th>Revenue</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {movies.map((movie, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='center-data'>
                                            {index + 1}
                                        </td>
                                        <td>{movie.title}</td>
                                        <td>{movie.year}</td>
                                        <td>{`$${movie.box_office_revenue.toLocaleString(
                                            'en-US'
                                        )}`}</td>
                                        <td>
                                            <img
                                                src={EyeIcon}
                                                alt='seemore'
                                                onClick={() => showPopUp(movie)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {/* Pop-up */}
                {showPopup && movies.length > 0 && movieInfo && (
                    <InfoPopUp movie={movieInfo} onClose={hidePopUp} />
                )}
            </main>
        </div>
    );
}

export default App;
