import GIFEncoder from 'gifencoder';
import { createCanvas } from 'canvas';
import { translations, type Language } from './translations.js';
import type { TimerConfig } from './types.js';
import type { NodeCanvasRenderingContext2D } from 'canvas';

export async function generateTimerGif(timer: TimerConfig): Promise<Buffer> {
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
    // Calculate time for this frame in the specified timezone
    const now = new Date();
    const targetNow = new Date(now.toLocaleString('en-US', { timeZone: timer.timezone }));
    const targetOffset = targetNow.getTimezoneOffset();
    const utcNow = new Date(targetNow.getTime() - targetOffset * 60000);
    const distance = new Date(timer.end_date).getTime() - (utcNow.getTime() + (i * 1000));

    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Clear canvas for new frame
    ctx.fillStyle = getBackgroundColor(timer.style);
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
      { value: days, label: translations[(timer.language || 'en') as Language].days },
      { value: hours, label: translations[(timer.language || 'en') as Language].hours },
      { value: minutes, label: translations[(timer.language || 'en') as Language].minutes },
      { value: seconds, label: translations[(timer.language || 'en') as Language].seconds }
    ];

    // Draw each time unit
    units.forEach((unit, index) => {
      const x = (width / 4) * index + (width / 8);
      const y = height / 2;

      drawTimeUnit(ctx, unit.value, unit.label, x, y, timer);
    });

    // Add the frame to the GIF
    encoder.addFrame(ctx);
  }

  // Finish GIF generation
  encoder.finish();
  return encoder.out.getData();
}

function drawTimeUnit(
  ctx: NodeCanvasRenderingContext2D,
  value: number,
  label: string,
  x: number,
  y: number,
  timer: TimerConfig
) {
  // Draw background based on style
  if (timer.style === 'modern') {
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.roundRect(x - 30, y - 40, 60, 70, 8);
    ctx.fill();
  } else if (timer.style === 'classic') {
    ctx.save();
    ctx.strokeStyle = timer.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x - 30, y - 40, 60, 70, 8);
    ctx.stroke();
    ctx.restore();
  } else if (timer.style === 'neon') {
    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(x - 30, y - 40, 60, 70, 8);
    ctx.fill();
    ctx.shadowBlur = 15;
    ctx.shadowColor = timer.color;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  } else if (timer.style === 'elegant') {
    ctx.save();
    // Draw semi-transparent background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.roundRect(x - 35, y - 45, 70, 80, 12);
    ctx.fill();

    // Add subtle border
    ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  } else if (timer.style === 'gradient') {
    ctx.save();
    // Create gradient background
    const bgGradient = ctx.createLinearGradient(x - 30, y - 40, x + 30, y + 30);
    bgGradient.addColorStop(0, '#ffffff');
    bgGradient.addColorStop(1, '#f8f9fa');
    ctx.fillStyle = bgGradient;
    ctx.beginPath();
    ctx.roundRect(x - 30, y - 40, 60, 70, 8);
    ctx.fill();
    
    // Add subtle shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.stroke();
    ctx.restore();
    
    // Create gradient effect
    const gradient = ctx.createLinearGradient(x - 30, y - 40, x + 30, y + 30);
    gradient.addColorStop(0, timer.color);
    gradient.addColorStop(1, adjustColor(timer.color, 30));
    ctx.fillStyle = gradient;
  }

  // Draw number with style-specific effects
  if (timer.style === 'neon') {
    // Enhanced neon text effect
    ctx.fillStyle = timer.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = timer.color;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  } else if (timer.style === 'gradient') {
    // Keep gradient fill
    ctx.fillStyle = ctx.fillStyle;
  } else if (timer.style === 'elegant') {
    ctx.fillStyle = timer.color;
  } else {
    ctx.fillStyle = timer.color;
  }

  ctx.font = getFontStyle(timer.style);
  ctx.textAlign = 'center';
  ctx.fillText(value.toString().padStart(2, '0'), x, y);

  if (timer.style === 'neon') {
    ctx.restore();
  }

  // Draw label
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = timer.style === 'elegant' ? 'rgba(255, 255, 255, 0.7)' : '#666';
  ctx.fillText(label, x, y + 20);
}

function getFontStyle(style: TimerConfig['style']): string {
  switch (style) {
    case 'neon': return 'bold 24px Arial';
    case 'classic': return 'bold 24px Arial';
    case 'elegant': return 'bold 24px Arial';
    default: return 'bold 24px Arial';
  }
}

function getBackgroundColor(style: TimerConfig['style']): string {
  switch (style) {
    case 'modern': return '#f3f4f6';
    case 'neon': return '#000000';
    case 'classic': return '#ffffff';
    case 'elegant': return '#1f1f1f';
    case 'gradient': return '#f8fafc';
    default: return '#ffffff';
  }
}

function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 +
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1);
}
