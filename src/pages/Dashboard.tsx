import React from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { getUserTimers } from '../lib/supabase';
import type { TimerConfig } from '../lib/supabase';

export function Dashboard() {
  const [timers, setTimers] = React.useState<TimerConfig[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadTimers();
  }, []);

  async function loadTimers() {
    try {
      const data = await getUserTimers();
      setTimers(data);
    } catch (error) {
      console.error('Error loading timers:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Timers</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {timers.map((timer) => (
          <div key={timer.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-500">
                Created {new Date(timer.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <div className="space-y-2">
              <p>
                <strong>End Date:</strong>{' '}
                {new Date(timer.end_date).toLocaleString()}
              </p>
              <p>
                <strong>Style:</strong> {timer.style}
              </p>
              <p>
                <strong>Views:</strong> {timer.views}
              </p>
              {timer.max_views && (
                <p>
                  <strong>Max Views:</strong> {timer.maxViews}
                </p>
              )}
              <p>
                <strong>Status:</strong>{' '}
                <span className={timer.active ? 'text-green-600' : 'text-red-600'}>
                  {timer.active ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>

            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <button
                onClick={() => {/* TODO: Implement delete */}}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {/* TODO: Show embed codes */}}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Get Code
              </button>
            </div>
          </div>
        ))}
      </div>

      {timers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          You haven't created any timers yet.
        </div>
      )}
    </div>
  );
}