import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function SetupPet() {
  const router = useRouter();
  const { tag_id } = router.query; // Grabs the ID from the URL
  const [petName, setPetName] = useState('');

  const saveProfile = async () => {
    const { user } = await supabase.auth.getUser(); // Get the logged-in user
    
    const { error } = await supabase
      .from('pet_tags')
      .update({ 
        pet_name: petName, 
        owner_id: user.id, 
        status: 'active' 
      })
      .eq('id', tag_id); // Only update the tag they just scanned!

    if (!error) router.push('/dashboard');
  };

  return (
    <div className="flex flex-col items-center p-10">
      <h1 className="text-2xl font-bold">Registering Tag: {tag_id}</h1>
      <input 
        type="text" 
        placeholder="Pet's Name" 
        className="border p-2 my-4"
        onChange={(e) => setPetName(e.target.value)} 
      />
      <button onClick={saveProfile} className="bg-orange-500 text-white p-2 rounded">
        Save Profile
      </button>
    </div>
  );
}