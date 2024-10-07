import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import movieRoutes from './routes/movieRoutes.js';

dotenv.config();

const PORT = process.env.NODE_ENV === 'production' ? 4000 : 5000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use('/api/movies', movieRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
