import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { supabase } from "../App.jsx"; 

export default function ClaimPage() {
  // These are your "Hooks" - they must be at the top
  const navigate = useNavigate();
  const { id } = useParams(); // This replaces 'router.query'
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    // This is where the magic happens
    console.log("Detecting Smart Tag ID:", id);
    if (!id) return;

    // ... The rest of your existing logic (fetching from Supabase) goes here ...

    async function checkTag() {
      const { data, error } = await supabase
        .from('pet_tags')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setStatus('not_found');
      } else if (data.owner_id) {
        setStatus('already_claimed');
      } else {
        setStatus('available');
      }
    }
    checkTag();
  }, [id]);

  const handleClaim = async () => {
  // Logic to update the 'owner_id' in Supabase goes here...
  
  // FIX: Change 'router.push' to 'navigate'
  navigate(`/setup-pet?tag_id=${id}`);
};

  return (
    <div className="p-10 text-center">
      {status === 'loading' && <p>Searching for tag...</p>}
      {status === 'available' && (
        <button onClick={handleClaim} className="bg-orange-500 text-white p-4 rounded">
          Claim Tag {id}
        </button>
      )}
      {status === 'not_found' && <p>Invalid Tag ID. Please contact support.</p>}
    </div>
  );
}