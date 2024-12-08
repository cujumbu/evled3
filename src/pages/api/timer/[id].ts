import { supabase } from '../../../lib/supabase';
import { createCanvas, registerFont } from 'canvas';
import { translations } from '../../../lib/translations';

export async function GET(request: Request) {
  const id = request.url.split('/').pop();
  
  if (!id) {
    return new Response('Timer ID is required', { status: 400 });
  }

  try {
    const { data: timer, error } = await supabase
      .from('timers')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !timer) {
      return new Response('Timer not found', { status: 404 });
    }

    // Create canvas
    const canvas = createCanvas(400, 120);
    const ctx = canvas.getContext('2d');

    // Calculate time remaining
    const now = new Date().getTime();
    const distance = new Date(timer.end_date).getTime() - now;
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Set up styles based on timer.style
    ctx.fillStyle = timer.style === 'modern' ? '#f3f4f6' : 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw time units
    const units = [
      { value: days, label: translations[timer.language || 'en'].days },
      { value: hours, label: translations[timer.language || 'en'].hours },
      { value: minutes, label: translations[timer.language || 'en'].minutes },
      { value: seconds, label: translations[timer.language || 'en'].seconds }
    ];

    units.forEach((unit, i) => {
      const x = 100 * i + 50;
      const y = 60;

      // Draw background for modern style
      if (timer.style === 'modern') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.roundRect(x - 30, y - 40, 60, 70, 8);
        ctx.fill();
      }

      // Draw numbers
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = timer.color;
      ctx.textAlign = 'center';
      ctx.fillText(unit.value.toString().padStart(2, '0'), x, y);

      // Draw labels
      ctx.font = '12px Arial';
      ctx.fillStyle = '#666';
      ctx.fillText(unit.label, x, y + 20);
    });

    // Convert canvas to buffer
    const buffer = canvas.toBuffer('image/png');

    // Return image
    return new Response(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error fetching timer:', error);
    return new Response('Internal server error', { status: 500 });
  }
}