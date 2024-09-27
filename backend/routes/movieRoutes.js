import { Router } from 'express';
import { getMovies, getMinMaxYear } from '../controllers/movieController.js';

/**
 * /api/movies
 */
const router = Router();

router.get('/', getMovies);

router.get('/min-max', getMinMaxYear);

export default router;
