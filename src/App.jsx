import React, { useState } from 'react';
import { Dog, Cat, Calendar, Bell, ShoppingCart, Heart, Search, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const BREEDS = {
  dogs: [
    { name: 'Golden Retriever', care: 'High energy! Needs 2 hours of exercise and regular brushing.' },
    { name: 'French Bulldog', care: 'Keep cool in summer; prone to breathing issues. Low exercise.' },
    { name: 'Poodle', care: 'Highly intelligent; requires professional grooming every 6 weeks.' },
  ],
  cats: [
    { name: 'Maine Coon', care: 'Frequent grooming needed for that thick coat. Very social!' },
    { name: 'Siamese', care: 'Very vocal and active; needs plenty of interactive play.' },
    { name: 'Persian', care: 'Daily eye cleaning and coat brushing are essential.' },
  ]
};

const PawPad = () => {
  const [petType, setPetType] = useState('dogs');
  const [selectedBreed, setSelectedBreed] = useState('');

  return (
    <div className="min-h-screen bg-[#FFFBF0] text-[#4A3728] font-sans pb-10">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center bg-white/60 backdrop-blur-md sticky top-0 z-50 border-b border-orange-100">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-orange-600 tracking-tight">
          <div className="bg-orange-600 p-1.5 rounded-xl text-white">
            <Heart size={24} fill="currentColor" />
          </div>
          PawPad
        </h1>
        <div className="flex gap-4 items-center">
          <button className="p-2.5 bg-white border border-orange-100 text-orange-600 rounded-2xl hover:bg-orange-50 transition-colors shadow-sm">
            <Bell size={20} />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-orange-200 border-2 border-white overflow-hidden shadow-sm">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User" />
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        {/* Hero Card */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2.5rem] p-8 text-white mb-10 shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Welcome Home, Alex! ☀️</h2>
            <p className="opacity-90 text-lg">Your furry friends are waiting for their midday check-in.</p>
            <button className="mt-6 bg-white text-orange-600 px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-orange-50 transition-all flex items-center gap-2">
              <Plus size={18} /> Add New Activity
            </button>
          </div>
          <Dog className="absolute -right-6 -bottom-6 w-48 h-48 opacity-10 rotate-12" />
        </motion.section>

        {/* Breed Care Selector */}
        <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-orange-100 mb-10">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Search size={22} className="text-orange-500" /> Breed Care Guide
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase ml-2 tracking-wider">Pet Type</label>
              <select 
                className="w-full p-4 rounded-2xl bg-orange-50/50 border-2 border-transparent focus:border-orange-200 focus:bg-white transition-all outline-none appearance-none"
                onChange={(e) => { setPetType(e.target.value); setSelectedBreed(''); }}
              >
                <option value="dogs">🐶 Dog Friends</option>
                <option value="cats">🐱 Cat Friends</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase ml-2 tracking-wider">Specific Breed</label>
              <select 
                className="w-full p-4 rounded-2xl bg-orange-50/50 border-2 border-transparent focus:border-orange-200 focus:bg-white transition-all outline-none appearance-none"
                value={selectedBreed}
                onChange={(e) => setSelectedBreed(e.target.value)}
              >
                <option value="">Choose a breed...</option>
                {BREEDS[petType].map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
              </select>
            </div>
          </div>
          
          {selectedBreed && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-6 bg-green-50 rounded-[1.5rem] border border-green-100 text-green-900"
            >
              <div className="flex gap-4">
                <div className="bg-green-200 p-3 rounded-xl h-fit">
                  <Heart className="text-green-700" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{selectedBreed} Care</h4>
                  <p className="leading-relaxed opacity-80">{BREEDS[petType].find(b => b.name === selectedBreed)?.care}</p>
                </div>
              </div>
            </motion.div>
          )}
        </section>

        {/* Daily Schedule */}
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-6">Today's Schedule</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TaskCard icon={<Calendar />} label="Breakfast" time="08:00 AM" color="bg-blue-100 text-blue-600" />
            <TaskCard icon={<Dog />} label="Park Walk" time="10:30 AM" color="bg-green-100 text-green-600" />
            <TaskCard icon={<ShoppingCart />} label="Buy Kibble" time="Tomorrow" color="bg-purple-100 text-purple-600" />
            <TaskCard icon={<Heart />} label="Vitamins" time="09:00 PM" color="bg-red-100 text-red-600" />
          </div>
        </div>
      </main>
    </div>
  );
};

const TaskCard = ({ icon, label, time, color }) => (
  <motion.div 
    whileHover={{ y: -5 }} 
    className="p-5 rounded-[2rem] shadow-sm bg-white flex flex-col items-center text-center gap-3 border border-stone-100 cursor-pointer hover:shadow-md transition-all"
  >
    <div className={`p-4 rounded-2xl ${color} scale-110`}>{icon}</div>
    <div>
      <div className="font-bold text-stone-800">{label}</div>
      <div className="text-xs text-stone-400 font-medium">{time}</div>
    </div>
  </motion.div>
);

export default PawPad;