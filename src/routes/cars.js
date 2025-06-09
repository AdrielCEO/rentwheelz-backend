import express from 'express';
import { supabase } from '../supabase.js';

const router = express.Router();

// GET /api/cars → list all available cars
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('available', true); // optional filter

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// POST /api/cars → company adds a new car
router.post('/', async (req, res) => {
  const {
    company_id,
    make,
    model,
    year,
    price_per_day,
    location,
    image_url,
  } = req.body;

  const { data, error } = await supabase
    .from('cars')
    .insert([
      {
        company_id,
        make,
        model,
        year,
        price_per_day,
        location,
        available: true,
        image_url,
      },
    ])
    .select(); // return newly added car

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data[0]);
});

export default router;
