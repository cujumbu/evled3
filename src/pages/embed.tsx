import React from 'react';
import { TimerPreview } from '../components/TimerPreview';

function EmbedPage() {
  const params = new URLSearchParams(window.location.search);
  const endDate = new Date(params.get('end') || Date.now() + 24 * 60 * 60 * 1000);
  const style = (params.get('style') || 'modern') as 'modern' | 'minimal' | 'classic';
  const color = params.get('color') || '#3B82F6';
  const language = (params.get('lang') || 'en') as Language;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <TimerPreview endDate={endDate} style={style} color={color} language={language} />
    </div>
  );
}

export default EmbedPage;