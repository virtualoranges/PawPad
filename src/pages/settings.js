import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Settings() {
  const [telegramId, setTelegramId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 1. Fetch existing ID on page load
  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('telegram_chat_id')
          .eq('id', user.id)
          .single();
        if (data) setTelegramId(data.telegram_chat_id || '');
      }
    }
    getProfile();
  }, []);

  // 2. Save the new ID to the 'profiles' table
  const saveSettings = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id, 
        telegram_chat_id: telegramId, 
        updated_at: new Date() 
      });

    setLoading(false);
    setMessage(error ? 'Error saving ID' : 'Settings updated! Your alerts are now active.');
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Notification Settings</h1>
      <p className="text-sm text-gray-600 mb-4">
        Enter your Telegram Chat ID to receive instant alerts when your tag is scanned. 
        Get your ID by messaging <strong>@userinfobot</strong> on Telegram.
      </p>
      <input 
        type="text" 
        value={telegramId}
        onChange={(e) => setTelegramId(e.target.value)}
        placeholder="e.g. 123456789" 
        className="w-full border p-3 rounded-lg mb-4"
      />
      <button 
        onClick={saveSettings} 
        disabled={loading}
        className="w-full bg-orange-600 text-white p-3 rounded-lg font-bold"
      >
        {loading ? 'Saving...' : 'SAVE SETTINGS'}
      </button>
      {message && <p className="mt-4 text-green-600 font-medium">{message}</p>}
    </div>
  );
}