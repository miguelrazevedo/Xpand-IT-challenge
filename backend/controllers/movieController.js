import { db } from '../config/db.js';
import { client } from '../config/redisCache.js';

const REDIS_EXPIRATION = 3600;

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

    let orderByRevenue = req.query.orderByRevenue === 'true';
    const year = req.query.year;

    let query = 'SELECT * FROM movies';
    let queryParams = [];

    if (year) {
        query += ' WHERE year = ?';
        queryParams.push(year);

        // If it is ordered by year, it MUST be ordered by revenue as well
        orderByRevenue = true;
    }

    if (orderByRevenue) {
        query += ' ORDER BY box_office_revenue DESC';
    }

    query += ' LIMIT ?, ?;';
    queryParams.push(offset, limit);

    const redisCacheKey = `movies_${page}_${limit}_${
        orderByRevenue ? 'ordered' : 'unordered'
    }${year ? `_${year}` : ''}`;

    const cachedMovies = await client.get(redisCacheKey);

    if (cachedMovies) {
        console.log('Cache Hit');

        return res.json(JSON.parse(cachedMovies));
    }

    db.query(query, queryParams, async (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Internal server error' });
        } else {
            console.log('Cache Miss');
            await client.set(redisCacheKey, JSON.stringify(result), {
                EX: REDIS_EXPIRATION,
            });
            res.json(result);
        }
    });
};

/**
 *  GET min and max year (/api/movies/min-max)
 *
 */
export const getMinMaxYear = async (req, res) => {
    const min_max_key = `movies_min_max`;

    const cachedMinMax = await client.get(min_max_key);

    if (cachedMinMax) {
        console.log('Cache Hit');

        return res.json(JSON.parse(cachedMinMax));
    }

    db.query(
        'SELECT MIN(year) as min, MAX(year) as max FROM movies;',
        async (err, result) => {
            if (err) {
                res.status(500).json({ message: 'Internal server error' });
            } else {
                console.log('Cache Miss');
                await client.set(min_max_key, JSON.stringify(result[0]), {
                    EX: REDIS_EXPIRATION,
                });
                res.json(result[0]);
            }
        }
    );
};
