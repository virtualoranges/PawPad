import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function FinderView() {
  const router = useRouter();
  const { id } = router.query;
  const [pet, setPet] = useState(null);

  useEffect(() => {
    if (!id) return;
    async function fetchPet() {
      const { data } = await supabase
        .from('pet_tags')
        .select('*, profiles(full_name, telegram_chat_id)')
        .eq('id', id)
        .single();
      setPet(data);
      
      // TRIGGER THE NOTIFICATION API HERE
      fetch('/api/notify', {
        method: 'POST',
        body: JSON.stringify({ tag_id: id }),
        headers: { 'Content-Type': 'application/json' }
      });
    }
    fetchPet();
  }, [id]);

  if (!pet) return <div className="p-10 text-center">Locating records...</div>;

  return (
    <div className="mobile-landing-container">
      <div className="emergency-header">🚨 I am lost! Please help.</div>
      
      <div className="p-6 text-center">
        <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
             {/* Imagine a nice pet photo here */}
             <img src="/pet-placeholder.png" alt="Pet" />
        </div>
        <h1 className="text-3xl font-black text-orange-600">{pet.pet_name}</h1>
        <p className="text-gray-600 mb-8">My owner has been notified of this scan.</p>

        <div className="space-y-4">
          <a href={`tel:${pet.emergency_contact_phone}`} className="action-button block text-center">
             📞 CALL MY OWNER
          </a>
          
        {showPopup && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
    <div className="bg-white rounded-3xl p-8 text-center max-w-sm shadow-2xl border-t-8 border-orange-500">
      <div className="text-5xl mb-4">📍</div>
      <h2 className="text-2xl font-extrabold mb-2 text-gray-800">Help {pet?.pet_name} get home?</h2>
      <p className="text-gray-500 mb-6 text-base leading-relaxed">
        Sharing your location sends a **one-time private map pin** to the owner so they can find their pet immediately.
      </p>
      
      <button onClick={handleShareLocation} className="action-button w-full mb-4 py-4 text-lg">
        YES, SHARE LOCATION
      </button>
      
      <button onClick={() => setShowPopup(false)} className="text-gray-400 font-bold hover:text-gray-600 transition">
        No thanks, just view profile
      </button>
    </div>
  </div>
)}


          <div className="bg-white p-4 rounded-xl shadow-sm text-left border-l-4 border-orange-500">
             <h3 className="font-bold text-sm text-gray-500 uppercase">Medical Notes:</h3>
             <p className="text-lg font-medium">{pet.medical_notes || "No known allergies."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}