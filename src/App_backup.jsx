import React, { useState } from 'react';
import { Dog, Cat, Calendar, Bell, ShoppingCart, Heart, Search, Plus, CheckCircle2, Circle, X, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BREEDS = {
  dogs: [
    { name: 'Golden Retriever', care: 'Needs lots of "fetch" and human affection. Brush twice a week.' },
    { name: 'French Bulldog', care: 'Low energy, high personality. Keep facial wrinkles clean.' },
    { name: 'Poodle', care: 'Genius-level smart. Professional grooming every 6 weeks.' },
    { name: 'German Shepherd', care: 'Needs a "job" to do. Excellent for active owners.' },
    { name: 'Beagle', care: 'Follows their nose everywhere! Needs a fenced yard.' },
    { name: 'Dachshund', care: 'Small body, big heart. Watch their backs—no jumping!' },
    { name: 'Siberian Husky', care: 'Talkative escape artists. Needs heavy exercise.' },
    { name: 'Labrador', care: 'America’s sweetheart. Watch their weight—they love food!' },
    { name: 'Boxer', care: 'Stay puppies forever. Great with kids but very bouncy.' },
    { name: 'Chihuahua', care: 'Tiny but mighty. Bonds intensely with one person.' },
    { name: 'Great Dane', care: 'Gentle giants. Needs more couch space than exercise.' },
    { name: 'Shiba Inu', care: 'Independent and "cat-like." Gaining trust is a reward.' }
  ],
  cats: [
    { name: 'Maine Coon', care: 'Gentle Giant. Loves water and follows you around.' },
    { name: 'Siamese', care: 'Extremely talkative. Hates being left alone.' },
    { name: 'Persian', care: 'Royalty. Daily grooming required for luxury coat.' },
    { name: 'Ragdoll', care: 'Goes limp with joy when held. Perfect for indoor living.' },
    { name: 'Bengal', care: 'Active athlete. Needs high climbing spots.' },
    { name: 'Sphynx', care: 'Hairless but warm! Needs weekly baths for skin oils.' },
    { name: 'British Shorthair', care: 'Teddy Bear cat. Calm, easy-going, and independent.' },
    { name: 'Scottish Fold', care: 'Famous folded ears. Very sweet-tempered.' },
    { name: 'Abyssinian', care: 'The "busy-body" of cats. Very curious.' },
    { name: 'Russian Blue', care: 'Loyal and stunning silvery coat. Quiet voice.' },
    { name: 'Burmese', care: 'Affectionate and people-oriented.' },
    { name: 'Devon Rex', care: 'Mischievous and love perching on shoulders.' }
  ]
};

const PawPad = () => {
  const [petType, setPetType] = useState('dogs');
  const [selectedBreed, setSelectedBreed] = useState('');
  const [activities, setActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [newAct, setNewAct] = useState("");
  
  const [supplies, setSupplies] = useState([
    { id: 1, text: "Premium Kibble Stock", checked: false },
    { id: 2, text: "Heartworm Prevention", checked: true },
    { id: 3, text: "Grooming Tools", checked: false }
  ]);

  const toggleSupply = (id) => {
    setSupplies(supplies.map(s => s.id === id ? { ...s, checked: !s.checked } : s));
  };

  const quickLog = (task) => {
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    setActivities([{ text: task, time }, ...activities]);
  };

  const handleAddActivity = () => {
    if (newAct) {
      quickLog(newAct);
      setNewAct("");
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#423D38] font-sans pb-20 overflow-x-hidden">
      {/* Navbar */}
      <nav className="p-5 flex justify-between items-center bg-white/70 backdrop-blur-lg sticky top-0 z-50 border-b border-stone-100">
        <h1 className="text-xl font-black tracking-tighter flex items-center gap-2 text-[#E8621A]">
          <Heart size={20} fill="#f5a050" /> PAWPAD
        </h1>
        <div className="flex gap-3 relative">
          <button 
            onClick={() => {setShowNotifs(!showNotifs); setShowProfile(false);}}
            className={`p-2 rounded-full shadow-sm border transition-colors ${showNotifs ? 'bg-[#EDE0CE] border-[#E2D0B8] text-[#8A7560]' : 'bg-white border-stone-100'}`}
          >
            <Bell size={18} />
          </button>
          
          <button 
            onClick={() => {setShowProfile(!showProfile); setShowNotifs(false);}}
            className="w-9 h-9 rounded-full border-2 border-white shadow-md overflow-hidden bg-[#EDE0CE] hover:scale-105 transition-transform"
          >
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=PetLover" alt="Avatar" />
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {showProfile && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-stone-100 p-2 z-[60]">
                <button className="w-full text-left p-3 hover:bg-stone-50 rounded-xl flex items-center gap-3 text-sm font-bold text-[#5C544E]"><Settings size={16}/> Account</button>
                <button className="w-full text-left p-3 hover:bg-stone-50 rounded-xl flex items-center gap-3 text-sm font-bold text-red-400"><LogOut size={16}/> Logout</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <main className="max-w-xl mx-auto p-6">
        {/* Lighter Beige Banner */}
        <section className="bg-[#EDE0CE] border border-[#E2D0B8] rounded-[2.5rem] p-10 mb-10 relative overflow-hidden shadow-sm">
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-1 text-[#5C544E] tracking-tight">Hi, Pet Lover.</h2>
            <p className="text-[#8A7560] text-sm mb-8 font-medium italic">What's on the schedule today?</p>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-[#8A7560] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#8A7560]/20 flex items-center gap-2 hover:bg-[#6D5B4B] transition-all active:scale-95"
            >
              <Plus size={18} /> New Activity
            </button>
          </div>
          <Dog className="absolute -right-6 -bottom-6 w-48 h-48 opacity-10 text-[#8A7560] rotate-12" />
        </section>

        {/* Breed Selector with New Colors */}
        <section className="mb-12">
          <div className="flex gap-3 mb-6">
            <button onClick={() => {setPetType('dogs'); setSelectedBreed('');}} className={`flex-1 py-4 rounded-2xl text-[10px] font-black tracking-widest transition-all ${petType === 'dogs' ? 'bg-[#00E5DC] text-white shadow-md' : 'bg-white text-stone-300 border border-stone-100'}`}>DOGS</button>
            <button onClick={() => {setPetType('cats'); setSelectedBreed('');}} className={`flex-1 py-4 rounded-2xl text-[10px] font-black tracking-widest transition-all ${petType === 'cats' ? 'bg-[#FF7A35] text-white shadow-md' : 'bg-white text-stone-300 border border-stone-100'}`}>CATS</button>
          </div>
          
          <div className="relative">
            <select 
              className="w-full p-5 rounded-3xl bg-white border border-stone-200 shadow-sm text-sm font-bold outline-none appearance-none cursor-pointer focus:ring-2 ring-[#EDE0CE] transition-all"
              value={selectedBreed}
              onChange={(e) => setSelectedBreed(e.target.value)}
            >
              <option value="">Search a breed...</option>
              {BREEDS[petType].map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
            </select>
            <Search className="absolute right-5 top-5 text-stone-300 pointer-events-none" size={18} />
          </div>

          <AnimatePresence>
            {selectedBreed && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-6 bg-white rounded-3xl border border-[#EDE0CE] shadow-inner">
                <p className="text-sm text-[#5C544E] leading-relaxed font-bold italic">"{BREEDS[petType].find(b => b.name === selectedBreed).care}"</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Active Schedule Cards */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div onClick={() => quickLog("Pet had Breakfast 🥣")} className="cursor-pointer active:scale-95 transition-all">
            <SmallCard icon={<Calendar className="text-blue-400"/>} label="Breakfast" sub="Tap to log" bg="bg-blue-50/30" />
          </div>
          <div onClick={() => quickLog("Went for a Long Walk 🌳")} className="cursor-pointer active:scale-95 transition-all">
            <SmallCard icon={<Dog className="text-emerald-400"/>} label="Long Walk" sub="Tap to log" bg="bg-emerald-50/30" />
          </div>
        </div>

        {/* Inventory - Readable Text */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#EDE0CE] mb-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <ShoppingCart size={14} className="text-[#8A7560]" />
            <h3 className="text-[10px] font-black text-[#8A7560] uppercase tracking-[0.3em]">Supply Inventory</h3>
          </div>
          <div className="space-y-4">
            {supplies.map(item => (
              <div key={item.id} onClick={() => toggleSupply(item.id)} className="flex items-center justify-between p-2 cursor-pointer group">
                <span className={`text-sm font-bold tracking-tight ${item.checked ? 'text-stone-300 line-through' : 'text-[#423D38]'}`}>{item.text}</span>
                {item.checked ? <CheckCircle2 size={22} className="text-emerald-400" /> : <Circle size={22} className="text-stone-100 group-hover:text-stone-200" />}
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed - Readable Text */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-[#8A7560] uppercase tracking-[0.3em] text-center">Daily Activity Feed</h3>
          {activities.length === 0 && <p className="text-center text-xs text-stone-300 italic font-bold">Waiting for your first update...</p>}
          {activities.map((a, i) => (
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} key={i} className="flex justify-between items-center p-5 bg-white rounded-3xl border border-stone-100 shadow-xs">
              <span className="text-sm font-bold text-[#423D38]">{a.text}</span>
              <span className="text-[9px] font-black text-stone-400 bg-stone-50 px-2 py-1 rounded-lg">{a.time}</span>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Add Activity Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl">
              <h3 className="text-2xl font-black mb-1 text-[#423D38] tracking-tight text-center">Log Moment</h3>
              <p className="text-[#8A7560] text-[10px] font-black mb-8 text-center uppercase tracking-widest">Update your pet's day</p>
              <input 
                autoFocus
                className="w-full p-5 bg-stone-50 rounded-2xl border-none outline-none ring-2 ring-transparent focus:ring-[#EDE0CE] mb-8 font-bold text-[#423D38]" 
                placeholder="Ex: Refilled water bowl"
                value={newAct}
                onChange={(e) => setNewAct(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddActivity()}
              />
              <button onClick={handleAddActivity} className="w-full bg-[#8A7560] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#8A7560]/20 active:scale-95 transition-all">Save Entry</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SmallCard = ({ icon, label, sub, bg }) => (
  <div className={`${bg} p-6 rounded-[2rem] border border-white shadow-sm text-center hover:shadow-md transition-all`}>
    <div className="flex justify-center mb-3">{icon}</div>
    <div className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-1">{sub}</div>
    <div className="text-sm font-bold text-[#5C544E]">{label}</div>
  </div>
);

export default PawPad;