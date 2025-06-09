import express from 'express';
import cors from 'cors';
import carsRouter from './routes/cars.js';
import bookingsRouter from './routes/bookings.js'; // must come AFTER express

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/cars', carsRouter);
app.use('/api/bookings', bookingsRouter); // use app *after* it's created

export default app;
