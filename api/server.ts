import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { generateTimerGif } from './utils/timerGenerator.js';
import type { Request, Response } from 'express';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files from the dist directory
app.use(express.static('dist'));

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy' });
});

app.get('/api/timer/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Timer ID is required' });
  }

  try {
    // Get timer data
    const { data: timer, error } = await supabase
      .from('timers')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !timer) {
      return res.status(404).json({
        error: 'Timer not found',
        details: error?.message || 'No timer exists with this ID',
        id
      });
    }

    const gifBuffer = await generateTimerGif(timer);

    // Set response headers
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Send the GIF
    res.send(gifBuffer);
  } catch (error) {
    console.error('Error generating timer:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});