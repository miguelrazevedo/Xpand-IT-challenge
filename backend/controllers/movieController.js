import { db } from '../config/db.js';

/**
 * GET all movies (/api/movies)
 * params:
 * - page: number
 * - limit: number
 * - orderByRevenue: boolean
 * - year: number
 */
export const getMovies = async (req, res) => {
    const page = Number.parseInt(req.query.page) || 1;

    // Query 10 movies every request
    const limit = 10;
    const offset = (page - 1) * limit;

    const orderByRevenue = req.query.orderByRevenue === 'true';
    const year = req.query.year;

    let query = 'SELECT * FROM movies';
    let queryParams = [];

    if (year) {
        query += ' WHERE year = ?';
        queryParams.push(year);
    }

    if (orderByRevenue) {
        query += ' ORDER BY box_office_revenue DESC';
    }

    query += ' LIMIT ?, ?';
    queryParams.push(offset, limit);

    db.query(query, queryParams, (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Internal server error' });
        } else if (result.length === 0) {
            res.json({ message: 'No movies found' });
        } else {
            res.json(result);
        }
    });
};

export const getMinMaxYear = async (req, res) => {
    db.query(
        'SELECT MIN(year) as min, MAX(year) as max FROM movies',
        (err, result) => {
            if (err) {
                res.status(500).json({ message: 'Internal server error' });
            } else {
                res.json(result[0]);
            }
        }
    );
};
