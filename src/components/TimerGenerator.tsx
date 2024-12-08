import React from 'react';
import { Calendar, Clock, Code } from 'lucide-react';
import { TimerPreview } from './TimerPreview';
import { EmbedCodeGenerator } from './EmbedCodeGenerator';
import { createTimer } from '../lib/supabase';
import type { Language } from '../lib/translations';

export function TimerGenerator() {
  const [endDate, setEndDate] = React.useState<Date>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [style, setStyle] = React.useState<'modern' | 'minimal' | 'classic' | 'neon' | 'gradient' | 'elegant'>('modern');
  const [color, setColor] = React.useState('#3B82F6');
  const [language, setLanguage] = React.useState<Language>('en');
  const [timerId, setTimerId] = React.useState<string>('');
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const timer = await createTimer({
        end_date: endDate.toISOString(),
        style,
        color,
        language,
      });
      setTimerId(timer.id);
    } catch (error) {
      console.error('Failed to create timer:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
          <Clock className="w-6 h-6" />
          Timer Preview
        </h2>
        <div className="flex justify-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
          <TimerPreview endDate={endDate} style={style} color={color} language={language} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Timer Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">End Date & Time</label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border rounded-lg"
                value={endDate.toISOString().slice(0, 16)}
                onChange={(e) => setEndDate(new Date(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Style</label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={style}
                onChange={(e) => setStyle(e.target.value as any)}
              >
                <option value="modern">Modern</option>
                <option value="minimal">Minimal</option>
                <option value="classic">Classic</option>
                <option value="neon">Neon</option>
                <option value="gradient">Gradient</option>
                <option value="elegant">Elegant</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <input
                type="color"
                className="w-full h-10 p-1 border rounded-lg"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
                <option value="pt">Português</option>
                <option value="ru">Русский</option>
                <option value="zh">中文</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
                <option value="nl">Nederlands</option>
                <option value="pl">Polski</option>
                <option value="cs">Čeština</option>
                <option value="sv">Svenska</option>
                <option value="da">Dansk</option>
                <option value="fi">Suomi</option>
                <option value="no">Norsk</option>
                <option value="hu">Magyar</option>
                <option value="el">Ελληνικά</option>
                <option value="ro">Română</option>
                <option value="bg">Български</option>
                <option value="hr">Hrvatski</option>
                <option value="sk">Slovenčina</option>
                <option value="sl">Slovenščina</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 font-medium shadow-sm"
          >
            {isGenerating ? 'Generating...' : 'Generate Timer'}
          </button>
        </div>

        {timerId ? (<div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
            <Code className="w-5 h-5" />
            Embed Code
          </h3>
          <EmbedCodeGenerator timerId={timerId} />
        </div>) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 bg-gray-50 px-6 py-12 rounded-lg w-full text-center border border-gray-100">
              Generate a timer to get the embed code
            </p>
          </div>
        )}
      </div>
    </div>
  );
}