import { useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../App.jsx";

export default function SetupPet() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
const tag_id = searchParams.get('tag_id'); // ✅ This safely grabs "VP-777"
  const [petName, setPetName] = useState('');

  const saveProfile = async () => {
  // 1. FIX: Supabase returns user inside a 'data' object
  const { data: { user } } = await supabase.auth.getUser(); 
  
  if (!user) {
    alert("Please log in first!");
    return;
  }

  const { error } = await supabase
    .from('pet_tags')
    .update({ 
      pet_name: petName, 
      owner_id: user.id, 
      status: 'active' 
    })
    .eq('id', tag_id);

  // 2. FIX: Change 'router.push' to 'navigate'
  if (!error) {
    navigate('/dashboard');
  } else {
    console.error("Update failed:", error.message);
  }
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