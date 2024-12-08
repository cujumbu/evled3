import { createCanvas } from 'canvas';
import { supabase } from '../../src/lib/supabase.js';
import { translations } from '../../src/lib/translations.js';
export default async function handler(req, res) {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: 'Timer ID is required' });
    }
    try {
        const { data: timer, error } = await supabase
            .from('timers')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !timer) {
            return res.status(404).json({ error: 'Timer not found' });
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
        // Set headers
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        // Send image
        return res.send(buffer);
    }
    catch (error) {
        console.error('Error generating timer:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
