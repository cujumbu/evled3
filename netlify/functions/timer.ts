import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import GIFEncoder from 'gifencoder';
import { createCanvas } from 'canvas';
import type { PostgrestError } from '@supabase/supabase-js';
import { translations } from '../../src/lib/translations';
import type { NodeCanvasRenderingContext2D } from 'canvas';
import type { Language } from '../../src/lib/translations';

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const handler: Handler = async (event) => {
  if (!supabaseUrl || !supabaseKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Extract ID from path
  const pathParts = event.path.split('/');
  const id = pathParts[pathParts.length - 1];
  
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Timer ID is required' })
    };
  }

  try {
    // Get timer data
    const { data: timer, error } = await supabase
      .from('timers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      const pgError = error as PostgrestError;
      return {
        statusCode: 404,
        body: JSON.stringify({ 
          error: 'Timer not found',
          details: pgError.message,
          id 
        })
      };
    }

    if (!timer) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Timer not found',
          details: 'No timer exists with this ID',
          id
        })
      };
    }

    // Initialize GIF encoder
    const width = 400;
    const height = 120;
    const encoder = new GIFEncoder(width, height);
    
    // Configure GIF settings
    encoder.start();
    encoder.setRepeat(0);     // 0 means loop forever
    encoder.setDelay(1000);   // 1 second between frames
    encoder.setQuality(10);   // Lower quality = smaller file size
    
    // Create canvas for drawing
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d') as NodeCanvasRenderingContext2D;

    // Generate frames (we'll create 60 frames for smooth animation)
    for (let i = 0; i < 60; i++) {
      // Calculate time for this frame
      const now = new Date().getTime() + (i * 1000);
      const distance = new Date(timer.end_date).getTime() - now;

      // Calculate time units
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Clear canvas for new frame
      ctx.fillStyle = timer.style === 'modern' ? '#f3f4f6' : 'white';
      ctx.fillRect(0, 0, width, height);

      // If timer has expired
      if (distance < 0) {
        ctx.fillStyle = timer.color;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Expired', width / 2, height / 2);
        encoder.addFrame(ctx);
        continue;
      }

      // Define time units for display
      const units = [
        { value: days, label: translations[timer.language || 'en'].days },
        { value: hours, label: translations[timer.language || 'en'].hours },
        { value: minutes, label: translations[timer.language || 'en'].minutes },
        { value: seconds, label: translations[timer.language || 'en'].seconds }
      ];

      // Draw each time unit
      units.forEach((unit, index) => {
        const x = (width / 4) * index + (width / 8);
        const y = height / 2;

        // Draw background box for modern style
        if (timer.style === 'modern') {
          ctx.fillStyle = 'rgba(0,0,0,0.1)';
          ctx.beginPath();
          ctx.roundRect(x - 30, y - 40, 60, 70, 8);
          ctx.fill();
        }

        // Draw number
        ctx.fillStyle = timer.color;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(unit.value.toString().padStart(2, '0'), x, y);

        // Draw label
        ctx.font = '12px Arial';
        ctx.fillStyle = '#666';
        ctx.fillText(unit.label, x, y + 20);
      });

      // Add the frame to the GIF
      encoder.addFrame(ctx);
    }

    // Finish GIF generation
    encoder.finish();

    // Return the GIF image
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: encoder.out.getData().toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('Error generating timer:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};