import React, { useContext } from 'react';
import { TimerGenerator } from './components/TimerGenerator';
import { Dashboard } from './components/Dashboard';
import { Auth } from './components/Auth';
import { AuthContext } from './components/AuthProvider';
import { Clock, Sparkles, Shield, Zap, LayoutDashboard } from 'lucide-react';

type View = 'create' | 'dashboard';

function App() {
  const { user, loading } = useContext(AuthContext);
  const [view, setView] = React.useState<View>('create');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                EVLED Timer
              </h1>
            </div>
            {user && (
              <div className="flex gap-4">
                <button
                  onClick={() => setView('create')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    view === 'create'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Create Timer
                </button>
                <button
                  onClick={() => setView('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    view === 'dashboard'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
              </div>
            )}
          </div>
          <p className="mt-2 text-gray-600">
            Create beautiful countdown timers for your email campaigns and promotions
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Drive Urgency in Your Email Campaigns
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create dynamic countdown timers that work in any email client. Perfect for
            flash sales, event reminders, and limited-time offers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <Sparkles className="w-6 h-6 text-indigo-600" />,
              title: 'Beautiful Designs',
              description: 'Choose from modern, minimal, or classic styles to match your brand.',
            },
            {
              icon: <Shield className="w-6 h-6 text-indigo-600" />,
              title: 'Always Reliable',
              description: 'Built for maximum email client compatibility and uptime.',
            },
            {
              icon: <Zap className="w-6 h-6 text-indigo-600" />,
              title: 'Lightning Fast',
              description: 'Generate and embed timers in seconds, not minutes.',
            },
          ].map((feature) => (
            <div key={feature.title} className="text-center p-6 rounded-xl bg-white shadow-sm border border-gray-100">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {user ? (
          view === 'create' ? <TimerGenerator /> : <Dashboard />
        ) : (
          <Auth />
        )}
      </main>

      <footer className="border-t mt-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold text-gray-900">EVLED Timer</span>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} EVLED.com - Events Led by Time. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
