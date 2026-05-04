import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { supabase } from "../App.jsx"; 

export default function Dashboard() {
  const [scans, setScans] = useState([]);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // THE TELEGRAM LOGIC (Now inside the component)
  const sendTelegramAlert = async () => {
    const botToken = "8691323697:AAGgw_22PuwmFCLagb-xhXlR75SWu1Jqshg"; 
    const chatId = "385282188"; 

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🚨 VP-777 ALERT: ${pet?.pet_name || 'Your Pet'} is safe. This is a system test! 🛡️`,
        }),
      });

      if (response.ok) {
        alert("Success! Check your Telegram app.");
      } else {
        alert("Telegram Error: Check your Token/ID");
      }
    } catch (err) {
      console.error("Network Error:", err);
    }
  };

  useEffect(() => {
    async function loadDashboardData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setLoading(false);

      const { data: petData } = await supabase
        .from('pet_tags')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (petData) {
        setPet(petData);
        const { data: logData } = await supabase
          .from('scan_logs')
          .select('*')
          .eq('tag_id', petData.id)
          .order('scanned_at', { ascending: false });
        setScans(logData || []);
      }
      setLoading(false);
    }
    loadDashboardData();
  }, []);

  if (loading) return <div className="p-10">Loading your PawPad...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-orange-600">
        Welcome home, {pet?.pet_name || 'Pet Parent'}!
      </h1>
      <p className="text-gray-500 mb-8">
        Status: <span className="text-green-500 font-bold font-mono">ACTIVE PROTECTION</span>
      </p>

      {/* Telegram Control */}
      <div className="mb-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
        <h3 className="font-bold text-orange-800 mb-2">System Security</h3>
        <button 
          onClick={sendTelegramAlert} // UPDATED TO USE THE RIGHT FUNCTION
          className="bg-white border border-orange-600 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-600 hover:text-white transition"
        >
          🛡️ Send Test Alert to Telegram
        </button>
      </div>

      {/* Activity Log */}
      <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
        <h2 className="text-xl font-bold mb-4">Recent Scan Activity</h2>
        {scans.length === 0 ? (
          <p className="text-gray-400 italic">No scans recorded yet. Your pet is safe!</p>
        ) : (
          <ul className="divide-y">
            {scans.map(scan => (
              <li key={scan.id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">Scan Detected</p>
                  <p className="text-xs text-gray-400">{new Date(scan.scanned_at).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}