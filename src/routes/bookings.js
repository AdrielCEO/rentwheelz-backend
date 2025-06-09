import express from 'express';
import { supabase } from '../supabase.js';

const router = express.Router();

// GET /api/bookings → list all bookings
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*');

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// POST /api/bookings → create a new booking
router.post('/', async (req, res) => {
  const { car_id, customer_id, start_date, end_date } = req.body;

  // 1. Get car to get price_per_day
  const { data: car, error: carError } = await supabase
    .from('cars')
    .select('price_per_day')
    .eq('id', car_id)
    .single();

  if (carError) return res.status(500).json({ error: 'Car not found' });

  // 2. Calculate number of days
  const days =
    (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24);

  if (days < 1) return res.status(400).json({ error: 'Minimum 1 day rental' });

  const total_price = days * parseFloat(car.price_per_day);

  // 3. Insert booking
  const { data, error } = await supabase
    .from('bookings')
    .insert([
      {
        car_id,
        customer_id,
        start_date,
        end_date,
        total_price,
      },
    ])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data[0]);
});

export default router;
