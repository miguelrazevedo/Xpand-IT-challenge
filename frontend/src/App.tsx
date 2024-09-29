import { useEffect, useState } from 'react';
import './App.css';
import { Movie } from './types/api';

import EyeIcon from './assets/eye_icon.svg';
import InfoPopUp from './components/PopUp/InfoPopUp';
import YearSelector from './components/YearModal/YearModal';
import RewindIcon from './assets/rewind_icon.svg';

const API_URL =
    (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

function App() {
    /**
     * States
     */

    // Movies List
    const [movies, setMovies] = useState<Movie[]>([]);
    const [movieInfo, setMovieInfo] = useState<Movie>();
    const [showPopup, setShowPopup] = useState<boolean>(false);

    // Page number
    const [page, setPage] = useState<number>(1);

    // Revenue filter
    const [orderByRevenue, setOrderByRevenue] = useState<boolean>(false);

    // Year filter
    const [year, setYear] = useState<number>(0);

    const [yearModal, setYearModal] = useState<boolean>(false);
    const [orderByYear, setOrderByYear] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Use Effects
     */

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
                const data: Movie[] = await response.json();

                if (data.length > 0) {
                    setMovies((prevMovies) => [...prevMovies, ...data]);
                }
                console.log(data);
            }

            setLoading(false);
        };
        fetchMovies();
    }, [page, orderByRevenue, year]);

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

    /**
     * Functions
     *
     */

    // Top 10 Revenue
    const handleOrderByRevenue = () => {
        setOrderByRevenue((prev) => !prev);
        setMovies([]);
        setPage(1);

        // Reset the year to 0 when changing the filter
        // This makes sure that the year filter is not applied when changing
        // to the revenue filter
        setYear(0);
        setOrderByYear(false);
    };

    // Year filter
    const toggleYearModal = () => setYearModal((prev) => !prev);

    const handleSelectByYear = (year: number) => {
        setYear(year);
        setOrderByYear(true);
        setYearModal(false);
        setMovies([]);
        setPage(1);

        // Reset the other filter when changing between them to make sure the other isn't activated at the same time
        setOrderByRevenue(false);
    };

    const resetSelectByYear = () => {
        setYear(0);
        setOrderByYear(false);
        setYearModal(false);
        setPage(1);
        setMovies([]);
    };

    // Movie Info Pop-up
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
                        className={`btn ${orderByRevenue ? 'activeBtn' : ''}`}
                        onClick={handleOrderByRevenue}
                    >
                        Top 10 Revenue
                    </button>
                    <div className='filter-year'>
                        <button
                            type='button'
                            className={`btn ${orderByYear ? 'activeBtn' : ''}`}
                            onClick={toggleYearModal}
                        >
                            Top 10 Revenue
                            {year === 0 ? ' per Year' : ` ${year}`}
                        </button>
                        <YearSelector
                            visible={yearModal}
                            setVisible={toggleYearModal}
                            changeYear={handleSelectByYear}
                        />
                        {orderByYear && (
                            <img
                                src={RewindIcon}
                                alt='rewind'
                                onClick={resetSelectByYear}
                            />
                        )}
                        {/* Background div */}
                        {yearModal && <div className='bg-overlay' />}
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
