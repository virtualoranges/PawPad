import React, { useState, useEffect } from 'react';
import { 
  Dog, Cat, Calendar, Bell, ShoppingCart, Heart, Search, Plus, 
  CheckCircle2, Circle, Settings, LogOut, User, Mail, Lock,
  Droplet, Activity, Stethoscope, Scale, Scissors, Syringe,
  Camera, MapPin, Phone, AlertCircle, TrendingUp, Award,
  Clock, Utensils, Dumbbell, Brain, ThermometerSun, Moon,
  Sun, Apple, Pill, FileText, Star, ChevronRight, X,
  Home, BarChart3, ClipboardList, Users
} from 'lucide-react';
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
    { name: 'Labrador', care: 'America's sweetheart. Watch their weight—they love food!' },
    { name: 'Boxer', care: 'Stay puppies forever. Great with kids but very bouncy.' },
    { name: 'Chihuahua', care: 'Tiny but mighty. Bonds intensely with one person.' },
    { name: 'Great Dane', care: 'Gentle giants. Needs more couch space than exercise.' },
    { name: 'Shiba Inu', care: 'Independent and "cat-like." Gaining trust is a reward.' },
    // NEW BREEDS
    { name: 'Australian Shepherd', care: 'High-energy herders. Need mental stimulation daily.' },
    { name: 'Corgi', care: 'Short legs, big personality. Surprisingly athletic!' },
    { name: 'Border Collie', care: 'Smartest breed. Needs challenging tasks and space.' },
    { name: 'Rottweiler', care: 'Loyal protectors. Early socialization is crucial.' },
    { name: 'Pomeranian', care: 'Fluffy little lions. Daily brushing prevents matting.' },
    { name: 'Bulldog', care: 'Couch potato champions. Watch for breathing issues.' },
    { name: 'Yorkshire Terrier', care: 'Tiny but brave. Hypoallergenic coat needs care.' },
    { name: 'Doberman', care: 'Athletic and alert. Thrives with firm, kind training.' },
    { name: 'Maltese', care: 'Gentle lap dogs. White coat needs regular grooming.' },
    { name: 'Bernese Mountain Dog', care: 'Gentle giants. Love cold weather and families.' }
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
    { name: 'Devon Rex', care: 'Mischievous and love perching on shoulders.' },
    // NEW BREEDS
    { name: 'Norwegian Forest Cat', care: 'Majestic and independent. Weatherproof double coat.' },
    { name: 'Birman', care: 'Blue-eyed beauties. Gentle and social companions.' },
    { name: 'Oriental Shorthair', care: 'Elegant athletes. Very vocal and demanding.' },
    { name: 'Exotic Shorthair', care: 'Persian personality, short coat. Less grooming!' },
    { name: 'Tonkinese', care: 'Playful hybrids. Love interactive games.' },
    { name: 'Savannah', care: 'Wild-looking adventurers. Need lots of space.' },
    { name: 'American Shorthair', care: 'All-American classic. Easy-going and healthy.' },
    { name: 'Chartreux', care: 'Quiet observers. Smile-like expression.' },
    { name: 'Turkish Angora', care: 'Graceful and energetic. Love being center stage.' },
    { name: 'Manx', care: 'Tailless wonders. Excellent hunters and jumpers.' }
  ]
};

const REMINDERS = [
  { icon: Utensils, text: "Time for breakfast! 🍽️", color: "text-orange-500" },
  { icon: Droplet, text: "Refresh water bowl 💧", color: "text-blue-500" },
  { icon: Dumbbell, text: "Walk time! Get moving 🐾", color: "text-green-500" },
  { icon: Pill, text: "Medication reminder 💊", color: "text-purple-500" },
  { icon: Scissors, text: "Grooming appointment coming up ✂️", color: "text-pink-500" },
  { icon: Stethoscope, text: "Vet checkup this week 🏥", color: "text-red-500" },
  { icon: Apple, text: "Treat time! 🦴", color: "text-yellow-500" },
  { icon: Brain, text: "Training session scheduled 🎓", color: "text-indigo-500" },
  { icon: Moon, text: "Bedtime routine 🌙", color: "text-slate-500" },
  { icon: Camera, text: "Capture today's memories 📸", color: "text-teal-500" },
];

const PawPad = () => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });
  
  // App state
  const [currentTab, setCurrentTab] = useState('home');
  const [petType, setPetType] = useState('dogs');
  const [selectedBreed, setSelectedBreed] = useState('');
  const [activities, setActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [newAct, setNewAct] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  
  // Pet profile state
  const [petProfile, setPetProfile] = useState({
    name: '',
    breed: '',
    age: '',
    weight: '',
    birthday: '',
    photo: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Pet'
  });

  // Health tracking
  const [weightHistory, setWeightHistory] = useState([]);
  const [vaccinations, setVaccinations] = useState([
    { id: 1, name: 'Rabies', date: '2024-01-15', nextDue: '2025-01-15', done: true },
    { id: 2, name: 'DHPP', date: '', nextDue: '2024-12-01', done: false },
  ]);
  const [medications, setMedications] = useState([
    { id: 1, name: 'Heartworm Prevention', frequency: 'Monthly', lastGiven: '2024-03-01' }
  ]);
  
  const [supplies, setSupplies] = useState([
    { id: 1, text: "Premium Kibble Stock", checked: false },
    { id: 2, text: "Heartworm Prevention", checked: true },
    { id: 3, text: "Grooming Tools", checked: false },
    { id: 4, text: "Treats & Chews", checked: false },
    { id: 5, text: "Waste Bags", checked: false },
  ]);

  // Notification rotation
  const [currentReminderIndex, setCurrentReminderIndex] = useState(0);

  // Load user data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('pawpad_user');
    const savedPet = localStorage.getItem('pawpad_pet_profile');
    const savedActivities = localStorage.getItem('pawpad_activities');
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    if (savedPet) {
      setPetProfile(JSON.parse(savedPet));
    }
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  // Save activities to localStorage
  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem('pawpad_activities', JSON.stringify(activities));
    }
  }, [activities]);

  // Rotate reminders
  useEffect(() => {
    if (showNotifs) {
      const interval = setInterval(() => {
        setCurrentReminderIndex((prev) => (prev + 1) % REMINDERS.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [showNotifs]);

  const handleAuth = (e) => {
    e.preventDefault();
    if (authMode === 'register') {
      const newUser = {
        name: authForm.name,
        email: authForm.email,
        joinedDate: new Date().toISOString()
      };
      localStorage.setItem('pawpad_user', JSON.stringify(newUser));
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      setAuthForm({ email: '', password: '', name: '' });
    } else {
      // Simple login - in production, you'd validate credentials
      const user = {
        name: authForm.email.split('@')[0],
        email: authForm.email,
        joinedDate: new Date().toISOString()
      };
      localStorage.setItem('pawpad_user', JSON.stringify(user));
      setCurrentUser(user);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      setAuthForm({ email: '', password: '', name: '' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pawpad_user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setShowProfile(false);
  };

  const toggleSupply = (id) => {
    setSupplies(supplies.map(s => s.id === id ? { ...s, checked: !s.checked } : s));
  };

  const quickLog = (task) => {
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const newActivity = { text: task, time, date: new Date().toLocaleDateString() };
    setActivities([newActivity, ...activities]);
  };

  const handleAddActivity = () => {
    if (newAct) {
      quickLog(newAct);
      setNewAct("");
      setShowModal(false);
    }
  };

  const savePetProfile = () => {
    localStorage.setItem('pawpad_pet_profile', JSON.stringify(petProfile));
    alert('Pet profile saved! 🐾');
  };

  // If not authenticated, show auth screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] via-[#EDE0CE] to-[#E8621A]/10 flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-6 rounded-[2rem] shadow-xl">
                <Heart size={48} className="text-[#E8621A]" fill="#E8621A" />
              </div>
            </div>
            <h1 className="text-4xl font-black text-[#5C544E] mb-2">PAWPAD</h1>
            <p className="text-[#8A7560] font-medium">Your Pet's Digital Companion</p>
          </div>

          <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-[#EDE0CE]">
            <div className="flex gap-2 mb-8">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${
                  authMode === 'login' 
                    ? 'bg-[#E8621A] text-white shadow-lg' 
                    : 'bg-stone-100 text-stone-400'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${
                  authMode === 'register' 
                    ? 'bg-[#E8621A] text-white shadow-lg' 
                    : 'bg-stone-100 text-stone-400'
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'register' && (
                <div className="relative">
                  <User className="absolute left-4 top-4 text-stone-400" size={20} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-stone-50 rounded-2xl border-2 border-transparent focus:border-[#EDE0CE] outline-none font-medium"
                  />
                </div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-stone-400" size={20} />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-stone-50 rounded-2xl border-2 border-transparent focus:border-[#EDE0CE] outline-none font-medium"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-4 text-stone-400" size={20} />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-stone-50 rounded-2xl border-2 border-transparent focus:border-[#EDE0CE] outline-none font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#E8621A] hover:bg-[#D55614] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-[#E8621A]/30 transition-all active:scale-95"
              >
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-xs text-stone-400 mt-6">
              {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-[#E8621A] font-bold"
              >
                {authMode === 'login' ? 'Register' : 'Sign In'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentReminder = REMINDERS[currentReminderIndex];
  const ReminderIcon = currentReminder.icon;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#423D38] font-sans pb-24">
      {/* Navbar */}
      <nav className="p-5 flex justify-between items-center bg-white/70 backdrop-blur-lg sticky top-0 z-50 border-b border-stone-100 shadow-sm">
        <h1 className="text-xl font-black tracking-tighter flex items-center gap-2 text-[#E8621A]">
          <Heart size={20} fill="#E8621A" /> PAWPAD
        </h1>
        <div className="flex gap-3 relative">
          <button 
            onClick={() => {setShowNotifs(!showNotifs); setShowProfile(false);}}
            className={`p-2 rounded-full shadow-sm border transition-all ${
              showNotifs ? 'bg-[#E8621A] border-[#E8621A] text-white' : 'bg-white border-stone-100'
            }`}
          >
            <Bell size={18} />
          </button>
          
          <button 
            onClick={() => {setShowProfile(!showProfile); setShowNotifs(false);}}
            className="w-9 h-9 rounded-full border-2 border-white shadow-md overflow-hidden bg-[#EDE0CE] hover:scale-105 transition-transform"
          >
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=PetLover" alt="Avatar" />
          </button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifs && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 10 }} 
                className="absolute right-0 top-14 w-80 bg-white rounded-3xl shadow-2xl border border-[#EDE0CE] p-6 z-[60]"
              >
                <h3 className="text-xs font-black text-[#8A7560] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Bell size={14} /> Pet Care Reminders
                </h3>
                <div className="space-y-3">
                  {REMINDERS.map((reminder, idx) => {
                    const Icon = reminder.icon;
                    const isActive = idx === currentReminderIndex;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0.5, scale: 0.95 }}
                        animate={{ 
                          opacity: isActive ? 1 : 0.5, 
                          scale: isActive ? 1 : 0.95,
                          backgroundColor: isActive ? '#FEF7EE' : 'transparent'
                        }}
                        className={`p-4 rounded-2xl flex items-center gap-3 transition-all ${
                          isActive ? 'border-2 border-[#E8621A]' : 'border border-transparent'
                        }`}
                      >
                        <Icon size={20} className={reminder.color} />
                        <span className="text-sm font-bold text-[#423D38] flex-1">
                          {reminder.text}
                        </span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-[#E8621A] rounded-full"
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {showProfile && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 10 }} 
                className="absolute right-0 top-14 w-56 bg-white rounded-2xl shadow-xl border border-stone-100 p-3 z-[60]"
              >
                <div className="p-3 border-b border-stone-100 mb-2">
                  <p className="font-black text-sm text-[#5C544E]">{currentUser?.name}</p>
                  <p className="text-xs text-stone-400">{currentUser?.email}</p>
                </div>
                <button 
                  onClick={() => setCurrentTab('profile')}
                  className="w-full text-left p-3 hover:bg-stone-50 rounded-xl flex items-center gap-3 text-sm font-bold text-[#5C544E]"
                >
                  <Settings size={16}/> Profile Settings
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left p-3 hover:bg-red-50 rounded-xl flex items-center gap-3 text-sm font-bold text-red-500"
                >
                  <LogOut size={16}/> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <main className="max-w-xl mx-auto p-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'health', label: 'Health', icon: Stethoscope },
            { id: 'stats', label: 'Stats', icon: BarChart3 },
            { id: 'profile', label: 'Profile', icon: User },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  currentTab === tab.id
                    ? 'bg-[#E8621A] text-white shadow-lg shadow-[#E8621A]/30'
                    : 'bg-white text-stone-400 border border-stone-100'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* HOME TAB */}
        {currentTab === 'home' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Welcome Banner */}
            <section className="bg-gradient-to-br from-[#EDE0CE] to-[#E2D0B8] border border-[#E2D0B8] rounded-[2.5rem] p-10 mb-10 relative overflow-hidden shadow-lg">
              <div className="relative z-10">
                <h2 className="text-3xl font-black mb-1 text-[#5C544E] tracking-tight">
                  Hey, {currentUser?.name}! 👋
                </h2>
                <p className="text-[#8A7560] text-sm mb-8 font-medium italic">
                  Ready to make today pawsome?
                </p>
                <button 
                  onClick={() => setShowModal(true)}
                  className="bg-[#E8621A] hover:bg-[#D55614] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#E8621A]/30 flex items-center gap-2 transition-all active:scale-95"
                >
                  <Plus size={18} /> New Activity
                </button>
              </div>
              <Dog className="absolute -right-6 -bottom-6 w-48 h-48 opacity-10 text-[#8A7560] rotate-12" />
            </section>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-10">
              <StatCard icon={Activity} value={activities.length} label="Activities" color="bg-blue-50" iconColor="text-blue-500" />
              <StatCard icon={CheckCircle2} value={supplies.filter(s => s.checked).length} label="Completed" color="bg-green-50" iconColor="text-green-500" />
              <StatCard icon={Award} value="92%" label="Care Score" color="bg-orange-50" iconColor="text-orange-500" />
            </div>

            {/* Breed Explorer */}
            <section className="mb-12">
              <h3 className="text-xs font-black text-[#8A7560] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Search size={14} /> Breed Explorer
              </h3>
              <div className="flex gap-3 mb-6">
                <button 
                  onClick={() => {setPetType('dogs'); setSelectedBreed('');}} 
                  className={`flex-1 py-4 rounded-2xl text-xs font-black tracking-widest transition-all ${
                    petType === 'dogs' 
                      ? 'bg-[#00E5DC] text-white shadow-md' 
                      : 'bg-white text-stone-300 border border-stone-100'
                  }`}
                >
                  <Dog size={20} className="mx-auto mb-1" />
                  DOGS
                </button>
                <button 
                  onClick={() => {setPetType('cats'); setSelectedBreed('');}} 
                  className={`flex-1 py-4 rounded-2xl text-xs font-black tracking-widest transition-all ${
                    petType === 'cats' 
                      ? 'bg-[#FF7A35] text-white shadow-md' 
                      : 'bg-white text-stone-300 border border-stone-100'
                  }`}
                >
                  <Cat size={20} className="mx-auto mb-1" />
                  CATS
                </button>
              </div>
              
              <div className="relative">
                <select 
                  className="w-full p-5 rounded-3xl bg-white border-2 border-stone-200 shadow-sm text-sm font-bold outline-none appearance-none cursor-pointer focus:border-[#E8621A] transition-all"
                  value={selectedBreed}
                  onChange={(e) => setSelectedBreed(e.target.value)}
                >
                  <option value="">Search {BREEDS[petType].length} breeds...</option>
                  {BREEDS[petType].map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                </select>
                <Search className="absolute right-5 top-5 text-stone-300 pointer-events-none" size={18} />
              </div>

              <AnimatePresence>
                {selectedBreed && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="mt-4 p-6 bg-gradient-to-br from-white to-[#FDFBF7] rounded-3xl border-2 border-[#EDE0CE] shadow-lg"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {petType === 'dogs' ? (
                        <Dog size={24} className="text-[#00E5DC]" />
                      ) : (
                        <Cat size={24} className="text-[#FF7A35]" />
                      )}
                      <div>
                        <h4 className="font-black text-[#5C544E] mb-1">{selectedBreed}</h4>
                        <p className="text-sm text-[#8A7560] leading-relaxed italic">
                          "{BREEDS[petType].find(b => b.name === selectedBreed)?.care}"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Quick Actions */}
            <section className="mb-10">
              <h3 className="text-xs font-black text-[#8A7560] uppercase tracking-wider mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <ActionCard 
                  icon={Utensils} 
                  label="Fed Pet" 
                  sub="Tap to log"
                  onClick={() => quickLog("🍽️ Fed breakfast")}
                  bg="bg-orange-50/50"
                  iconColor="text-orange-500"
                />
                <ActionCard 
                  icon={Dumbbell} 
                  label="Exercise" 
                  sub="Tap to log"
                  onClick={() => quickLog("🏃 30 min walk")}
                  bg="bg-green-50/50"
                  iconColor="text-green-500"
                />
                <ActionCard 
                  icon={Droplet} 
                  label="Water Bowl" 
                  sub="Tap to log"
                  onClick={() => quickLog("💧 Refilled water")}
                  bg="bg-blue-50/50"
                  iconColor="text-blue-500"
                />
                <ActionCard 
                  icon={Brain} 
                  label="Training" 
                  sub="Tap to log"
                  onClick={() => quickLog("🎓 Training session")}
                  bg="bg-purple-50/50"
                  iconColor="text-purple-500"
                />
              </div>
            </section>

            {/* Supply Inventory */}
            <section className="bg-white p-8 rounded-[2.5rem] shadow-md border-2 border-[#EDE0CE] mb-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black text-[#8A7560] uppercase tracking-wider flex items-center gap-2">
                  <ShoppingCart size={14} /> Supply Checklist
                </h3>
                <span className="text-xs font-bold text-[#E8621A]">
                  {supplies.filter(s => s.checked).length}/{supplies.length}
                </span>
              </div>
              <div className="space-y-3">
                {supplies.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => toggleSupply(item.id)} 
                    className="flex items-center justify-between p-3 cursor-pointer group hover:bg-stone-50 rounded-2xl transition-all"
                  >
                    <span className={`text-sm font-bold tracking-tight ${
                      item.checked ? 'text-stone-300 line-through' : 'text-[#423D38]'
                    }`}>
                      {item.text}
                    </span>
                    {item.checked ? (
                      <CheckCircle2 size={22} className="text-green-500" />
                    ) : (
                      <Circle size={22} className="text-stone-200 group-hover:text-stone-300" />
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Activity Feed */}
            <section>
              <h3 className="text-xs font-black text-[#8A7560] uppercase tracking-wider mb-4 flex items-center gap-2">
                <ClipboardList size={14} /> Activity Timeline
              </h3>
              {activities.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-stone-200">
                  <Calendar className="mx-auto mb-3 text-stone-300" size={40} />
                  <p className="text-sm text-stone-400 font-bold">No activities yet</p>
                  <p className="text-xs text-stone-300">Start logging your pet's day!</p>
                </div>
              )}
              <div className="space-y-3">
                {activities.slice(0, 10).map((a, i) => (
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    key={i} 
                    className="flex justify-between items-center p-5 bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex-1">
                      <span className="text-sm font-bold text-[#423D38] block">{a.text}</span>
                      <span className="text-xs text-stone-400 font-medium">{a.date}</span>
                    </div>
                    <span className="text-xs font-black text-[#E8621A] bg-orange-50 px-3 py-1.5 rounded-xl">
                      {a.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {/* HEALTH TAB */}
        {currentTab === 'health' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-black text-[#5C544E] mb-6">Health Tracker</h2>
            
            {/* Vaccinations */}
            <section className="bg-white p-8 rounded-[2.5rem] shadow-md border-2 border-[#EDE0CE] mb-6">
              <h3 className="text-xs font-black text-[#8A7560] uppercase tracking-wider mb-6 flex items-center gap-2">
                <Syringe size={14} /> Vaccination Schedule
              </h3>
              <div className="space-y-4">
                {vaccinations.map(vax => (
                  <div key={vax.id} className="p-4 bg-stone-50 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-[#423D38]">{vax.name}</span>
                      {vax.done ? (
                        <CheckCircle2 size={20} className="text-green-500" />
                      ) : (
                        <AlertCircle size={20} className="text-orange-500" />
                      )}
                    </div>
                    <div className="text-xs text-stone-500 font-medium">
                      {vax.done ? (
                        <>Last: {vax.date} • Next: {vax.nextDue}</>
                      ) : (
                        <>Due: {vax.nextDue}</>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Medications */}
            <section className="bg-white p-8 rounded-[2.5rem] shadow-md border-2 border-[#EDE0CE] mb-6">
              <h3 className="text-xs font-black text-[#8A7560] uppercase tracking-wider mb-6 flex items-center gap-2">
                <Pill size={14} /> Active Medications
              </h3>
              <div className="space-y-4">
                {medications.map(med => (
                  <div key={med.id} className="p-4 bg-purple-50/30 rounded-2xl border border-purple-100">
                    <div className="font-black text-[#423D38] mb-1">{med.name}</div>
                    <div className="text-xs text-stone-500 font-medium">
                      {med.frequency} • Last given: {med.lastGiven}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Weight Tracking */}
            <section className="bg-white p-8 rounded-[2.5rem] shadow-md border-2 border-[#EDE0CE]">
              <h3 className="text-xs font-black text-[#8A7560] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Scale size={14} /> Weight History
              </h3>
              <div className="text-center py-8">
                <Scale size={48} className="mx-auto text-stone-300 mb-3" />
                <p className="text-sm font-bold text-stone-400">No weight records yet</p>
                <button className="mt-4 px-6 py-2 bg-[#E8621A] text-white rounded-xl text-xs font-black">
                  Add Entry
                </button>
              </div>
            </section>
          </motion.div>
        )}

        {/* STATS TAB */}
        {currentTab === 'stats' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-black text-[#5C544E] mb-6">Care Statistics</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-3xl border-2 border-blue-200">
                <TrendingUp size={32} className="text-blue-500 mb-2" />
                <div className="text-3xl font-black text-blue-600 mb-1">{activities.length}</div>
                <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">Total Logs</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-6 rounded-3xl border-2 border-green-200">
                <Award size={32} className="text-green-500 mb-2" />
                <div className="text-3xl font-black text-green-600 mb-1">92%</div>
                <div className="text-xs font-bold text-green-700 uppercase tracking-wider">Care Score</div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-md border-2 border-[#EDE0CE] mb-6">
              <h3 className="text-xs font-black text-[#8A7560] uppercase tracking-wider mb-6">This Week's Summary</h3>
              <div className="space-y-4">
                <ProgressBar label="Feeding" value={85} color="bg-orange-500" />
                <ProgressBar label="Exercise" value={70} color="bg-green-500" />
                <ProgressBar label="Health Care" value={90} color="bg-blue-500" />
                <ProgressBar label="Grooming" value={60} color="bg-purple-500" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#E8621A]/10 to-[#FF7A35]/5 p-8 rounded-[2.5rem] border-2 border-[#E8621A]/20 text-center">
              <Star size={48} className="mx-auto text-[#E8621A] mb-3" fill="#E8621A" />
              <h3 className="text-xl font-black text-[#5C544E] mb-2">Awesome Pet Parent! 🎉</h3>
              <p className="text-sm text-[#8A7560] font-medium">
                You're doing an amazing job caring for your furry friend!
              </p>
            </div>
          </motion.div>
        )}

        {/* PROFILE TAB */}
        {currentTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-black text-[#5C544E] mb-6">Pet Profile</h2>
            
            <div className="bg-white p-8 rounded-[2.5rem] shadow-md border-2 border-[#EDE0CE] mb-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-[#EDE0CE] mb-4 border-4 border-white shadow-lg">
                  <img src={petProfile.photo} alt="Pet" className="w-full h-full object-cover" />
                </div>
                <button className="text-xs font-bold text-[#E8621A] flex items-center gap-1">
                  <Camera size={14} /> Change Photo
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-[#8A7560] uppercase tracking-wider mb-2 block">
                    Pet Name
                  </label>
                  <input
                    type="text"
                    value={petProfile.name}
                    onChange={(e) => setPetProfile({ ...petProfile, name: e.target.value })}
                    placeholder="e.g., Max, Bella"
                    className="w-full p-4 bg-stone-50 rounded-2xl border-2 border-transparent focus:border-[#E8621A] outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-[#8A7560] uppercase tracking-wider mb-2 block">
                    Breed
                  </label>
                  <input
                    type="text"
                    value={petProfile.breed}
                    onChange={(e) => setPetProfile({ ...petProfile, breed: e.target.value })}
                    placeholder="e.g., Golden Retriever"
                    className="w-full p-4 bg-stone-50 rounded-2xl border-2 border-transparent focus:border-[#E8621A] outline-none font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-[#8A7560] uppercase tracking-wider mb-2 block">
                      Age
                    </label>
                    <input
                      type="text"
                      value={petProfile.age}
                      onChange={(e) => setPetProfile({ ...petProfile, age: e.target.value })}
                      placeholder="e.g., 3 years"
                      className="w-full p-4 bg-stone-50 rounded-2xl border-2 border-transparent focus:border-[#E8621A] outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-[#8A7560] uppercase tracking-wider mb-2 block">
                      Weight
                    </label>
                    <input
                      type="text"
                      value={petProfile.weight}
                      onChange={(e) => setPetProfile({ ...petProfile, weight: e.target.value })}
                      placeholder="e.g., 25 kg"
                      className="w-full p-4 bg-stone-50 rounded-2xl border-2 border-transparent focus:border-[#E8621A] outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-[#8A7560] uppercase tracking-wider mb-2 block">
                    Birthday
                  </label>
                  <input
                    type="date"
                    value={petProfile.birthday}
                    onChange={(e) => setPetProfile({ ...petProfile, birthday: e.target.value })}
                    className="w-full p-4 bg-stone-50 rounded-2xl border-2 border-transparent focus:border-[#E8621A] outline-none font-bold"
                  />
                </div>

                <button
                  onClick={savePetProfile}
                  className="w-full bg-[#E8621A] hover:bg-[#D55614] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-[#E8621A]/30 transition-all active:scale-95"
                >
                  Save Profile
                </button>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-md border-2 border-[#EDE0CE]">
              <h3 className="text-xs font-black text-[#8A7560] uppercase tracking-wider mb-6 flex items-center gap-2">
                <Phone size={14} /> Emergency Contacts
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Stethoscope size={16} className="text-red-500" />
                    <span className="font-black text-sm text-[#423D38]">Primary Vet</span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium">Not set</p>
                </div>
                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone size={16} className="text-blue-500" />
                    <span className="font-black text-sm text-[#423D38]">Emergency Clinic</span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium">Not set</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Add Activity Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowModal(false)} 
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className="relative bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl border-2 border-[#EDE0CE]"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X size={20} className="text-stone-400" />
              </button>
              <h3 className="text-2xl font-black mb-2 text-[#423D38] tracking-tight">Log Activity</h3>
              <p className="text-[#8A7560] text-xs font-bold mb-8 uppercase tracking-wider">
                What did your pet do?
              </p>
              <input 
                autoFocus
                className="w-full p-5 bg-stone-50 rounded-2xl border-2 border-transparent focus:border-[#E8621A] outline-none mb-8 font-bold text-[#423D38]" 
                placeholder="e.g., Played fetch in the park"
                value={newAct}
                onChange={(e) => setNewAct(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddActivity()}
              />
              <button 
                onClick={handleAddActivity} 
                className="w-full bg-[#E8621A] hover:bg-[#D55614] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-[#E8621A]/30 active:scale-95 transition-all"
              >
                Save Activity
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ icon: Icon, value, label, color, iconColor }) => (
  <div className={`${color} p-4 rounded-2xl border border-white/50 shadow-sm`}>
    <Icon size={24} className={`${iconColor} mb-2`} />
    <div className="text-2xl font-black text-[#423D38] mb-0.5">{value}</div>
    <div className="text-[9px] font-black text-stone-500 uppercase tracking-wider">{label}</div>
  </div>
);

const ActionCard = ({ icon: Icon, label, sub, onClick, bg, iconColor }) => (
  <div 
    onClick={onClick}
    className={`${bg} p-6 rounded-[2rem] border-2 border-white shadow-sm text-center hover:shadow-lg transition-all cursor-pointer active:scale-95`}
  >
    <Icon size={28} className={`${iconColor} mx-auto mb-3`} />
    <div className="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">{sub}</div>
    <div className="text-sm font-bold text-[#5C544E]">{label}</div>
  </div>
);

const ProgressBar = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-xs font-bold text-[#423D38] mb-2">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} rounded-full transition-all duration-500`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default PawPad;
