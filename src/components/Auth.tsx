import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';
import { Clock } from 'lucide-react';

export function Auth() {
  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Clock className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-center">Sign in to create timers</h2>
      </div>
      <SupabaseAuth
        supabaseClient={supabase}
        providers={[]}
        view="sign_in"
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#4f46e5',
                brandAccent: '#4338ca',
              },
            },
          },
        }}
        redirectTo={`${window.location.origin}`}
      />
    </div>
  );
}
