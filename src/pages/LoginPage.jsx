// src/LoginPage.jsx
import { supabase } from "../App";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50">
      <h1 className="text-2xl font-bold text-orange-600 mb-4">Virtual Orange Login</h1>
      <button 
        onClick={handleGoogleLogin}
        className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
      >
        Sign in with Google
      </button>
    </div>
  );
}