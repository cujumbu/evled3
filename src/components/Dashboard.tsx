import React from 'react';
import { Clock, Trash2, Eye, Calendar, Globe2, Code2, AlertTriangle } from 'lucide-react';
import { getUserTimers, deleteTimer } from '../lib/supabase';
import { EmbedCodeGenerator } from './EmbedCodeGenerator';
import type { TimerConfig } from '../lib/supabase';

export function Dashboard() {
  const [timers, setTimers] = React.useState<TimerConfig[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedTimer, setSelectedTimer] = React.useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this timer?')) return;
    
    try {
      await deleteTimer(id);
      setTimers(timers.filter(timer => timer.id !== id));
    } catch (error) {
      console.error('Error deleting timer:', error);
    }
  };

  const getExpiryStatus = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff < 0) return { status: 'Expired', color: 'text-red-600' };
    if (diff < 24 * 60 * 60 * 1000) return { status: 'Ending Soon', color: 'text-yellow-600' };
    return { status: 'Active', color: 'text-green-600' };
  };

  const formatTimeLeft = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff < 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h remaining`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Your Timers</h1>
        <div className="text-sm text-gray-500">
          Total Timers: {timers.length}
        </div>
      </div>
      
      {timers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No timers yet</h3>
          <p className="text-gray-500">
            Create your first countdown timer to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {timers.map((timer) => {
            const { status, color } = getExpiryStatus(timer.end_date);
            
            return (
              <div key={timer.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${color} bg-opacity-10`}>
                      {status}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(timer.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatTimeLeft(timer.end_date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Globe2 className="w-4 h-4" />
                      <span>{timer.timezone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Eye className="w-4 h-4" />
                      <span>{timer.views} views</span>
                    </div>

                    {timer.max_views && (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{timer.views}/{timer.max_views} views limit</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t bg-gray-50 p-4 flex justify-between items-center">
                  <button
                    onClick={() => handleDelete(timer.id)}
                    className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete timer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setSelectedTimer(selectedTimer === timer.id ? null : timer.id)}
                    className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    <Code2 className="w-4 h-4" />
                    {selectedTimer === timer.id ? 'Hide Code' : 'Show Code'}
                  </button>
                </div>

                {selectedTimer === timer.id && (
                  <div className="p-4 border-t">
                    <EmbedCodeGenerator timerId={timer.id} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
