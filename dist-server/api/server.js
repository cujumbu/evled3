import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import GIFEncoder from 'gifencoder';
import { createCanvas } from 'canvas';
import { translations } from '../src/lib/translations.js';
// Load environment variables
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
// Enable CORS
app.use(cors());
// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}
const supabase = createClient(supabaseUrl, supabaseKey);
app.get('/api/health', (_req, res) => {
    res.json({ status: 'healthy' });
});
app.get('/api/timer/:id', async (req, res) => {
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
        // Initialize GIF encoder
        const width = 400;
        const height = 120;
        const encoder = new GIFEncoder(width, height);
        // Configure GIF settings
        encoder.start();
        encoder.setRepeat(0); // 0 means loop forever
        encoder.setDelay(1000); // 1 second between frames
        encoder.setQuality(10); // Lower quality = smaller file size
        // Create canvas for drawing
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
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
        // Set response headers
        res.setHeader('Content-Type', 'image/gif');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        // Send the GIF
        res.send(encoder.out.getData());
    }
    catch (error) {
        console.error('Error generating timer:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
