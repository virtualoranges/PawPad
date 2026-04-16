import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient'; // Your existing config

export default function ClaimPage() {
  const router = useRouter();
  const { id } = router.query; // Grabs the "VP-XXXX" from the URL
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!id) return;

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
    // Logic to update the 'owner_id' in Supabase to the current logged-in user
    // Then redirect to their new pet profile setup page
    router.push(`/setup-pet?tag_id=${id}`);
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