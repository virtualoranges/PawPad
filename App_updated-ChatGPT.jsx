import React, { useState, useEffect } from 'react';
import { 
  Dog, Cat, Calendar, Bell, ShoppingCart, Heart, Search, Plus, 
  CheckCircle2, Circle, Settings, LogOut, User, Mail, Lock,
  Droplet, Activity, Stethoscope, Scale, Scissors, Syringe,
  Camera, MapPin, Phone, AlertCircle, TrendingUp, Award,
  Clock, Utensils, Dumbbell, Brain, ThermometerSun, Moon,
  Sun, Apple, Pill, FileText, Star, ChevronRight, X,
  Home, BarChart3, ClipboardList, Users, Image, Upload, Trash2,
  Edit, Check, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BREEDS = {
  dogs: [
    { name: 'Golden Retriever', care: 'Needs lots of "fetch" and human affection. Brush twice a week.', wiki: 'https://en.wikipedia.org/wiki/Golden_Retriever' },
    { name: 'French Bulldog', care: 'Low energy, high personality. Keep facial wrinkles clean.', wiki: 'https://en.wikipedia.org/wiki/French_Bulldog' },
    { name: 'Poodle', care: 'Genius-level smart. Professional grooming every 6 weeks.', wiki: 'https://en.wikipedia.org/wiki/Poodle' },
    { name: 'German Shepherd', care: 'Needs a "job" to do. Excellent for active owners.', wiki: 'https://en.wikipedia.org/wiki/German_Shepherd' },
    { name: 'Beagle', care: 'Follows their nose everywhere! Needs a fenced yard.', wiki: 'https://en.wikipedia.org/wiki/Beagle' },
    { name: 'Dachshund', care: 'Small body, big heart. Watch their backs - no jumping!', wiki: 'https://en.wikipedia.org/wiki/Dachshund' },
    { name: 'Siberian Husky', care: 'Talkative escape artists. Needs heavy exercise.', wiki: 'https://en.wikipedia.org/wiki/Siberian_Husky' },
    { name: 'Labrador', care: "America's sweetheart. Watch their weight - they love food!", wiki: 'https://en.wikipedia.org/wiki/Labrador_Retriever' },
    { name: 'Boxer', care: 'Stay puppies forever. Great with kids but very bouncy.', wiki: 'https://en.wikipedia.org/wiki/Boxer_(dog)' },
    { name: 'Chihuahua', care: 'Tiny but mighty. Bonds intensely with one person.', wiki: 'https://en.wikipedia.org/wiki/Chihuahua_(dog)' },
    { name: 'Great Dane', care: 'Gentle giants. Needs more couch space than exercise.', wiki: 'https://en.wikipedia.org/wiki/Great_Dane' },
    { name: 'Shiba Inu', care: 'Independent and "cat-like." Gaining trust is a reward.', wiki: 'https://en.wikipedia.org/wiki/Shiba_Inu' },
    { name: 'Australian Shepherd', care: 'High-energy herders. Need mental stimulation daily.', wiki: 'https://en.wikipedia.org/wiki/Australian_Shepherd' },
    { name: 'Corgi', care: 'Short legs, big personality. Surprisingly athletic!', wiki: 'https://en.wikipedia.org/wiki/Welsh_Corgi' },
    { name: 'Border Collie', care: 'Smartest breed. Needs challenging tasks and space.', wiki: 'https://en.wikipedia.org/wiki/Border_Collie' },
    { name: 'Rottweiler', care: 'Loyal protectors. Early socialization is crucial.', wiki: 'https://en.wikipedia.org/wiki/Rottweiler' },
    { name: 'Pomeranian', care: 'Fluffy little lions. Daily brushing prevents matting.', wiki: 'https://en.wikipedia.org/wiki/Pomeranian_dog' },
    { name: 'Bulldog', care: 'Couch potato champions. Watch for breathing issues.', wiki: 'https://en.wikipedia.org/wiki/Bulldog' },
    { name: 'Yorkshire Terrier', care: 'Tiny but brave. Hypoallergenic coat needs care.', wiki: 'https://en.wikipedia.org/wiki/Yorkshire_Terrier' },
    { name: 'Doberman', care: 'Athletic and alert. Thrives with firm, kind training.', wiki: 'https://en.wikipedia.org/wiki/Dobermann' },
    { name: 'Maltese', care: 'Gentle lap dogs. White coat needs regular grooming.', wiki: 'https://en.wikipedia.org/wiki/Maltese_dog' },
    { name: 'Bernese Mountain Dog', care: 'Gentle giants. Love cold weather and families.', wiki: 'https://en.wikipedia.org/wiki/Bernese_Mountain_Dog' }
  ],
  cats: [
    { name: 'Maine Coon', care: 'Gentle Giant. Loves water and follows you around.', wiki: 'https://en.wikipedia.org/wiki/Maine_Coon' },
    { name: 'Siamese', care: 'Extremely talkative. Hates being left alone.', wiki: 'https://en.wikipedia.org/wiki/Siamese_cat' },
    { name: 'Persian', care: 'Royalty. Daily grooming required for luxury coat.', wiki: 'https://en.wikipedia.org/wiki/Persian_cat' },
    { name: 'Ragdoll', care: 'Goes limp with joy when held. Perfect for indoor living.', wiki: 'https://en.wikipedia.org/wiki/Ragdoll' },
    { name: 'Bengal', care: 'Active athlete. Needs high climbing spots.', wiki: 'https://en.wikipedia.org/wiki/Bengal_cat' },
    { name: 'Sphynx', care: 'Hairless but warm! Needs weekly baths for skin oils.', wiki: 'https://en.wikipedia.org/wiki/Sphynx_cat' },
    { name: 'British Shorthair', care: 'Teddy Bear cat. Calm, easy-going, and independent.', wiki: 'https://en.wikipedia.org/wiki/British_Shorthair' },
    { name: 'Scottish Fold', care: 'Famous folded ears. Very sweet-tempered.', wiki: 'https://en.wikipedia.org/wiki/Scottish_Fold' },
    { name: 'Abyssinian', care: 'The "busy-body" of cats. Very curious.', wiki: 'https://en.wikipedia.org/wiki/Abyssinian_cat' },
    { name: 'Russian Blue', care: 'Loyal and stunning silvery coat. Quiet voice.', wiki: 'https://en.wikipedia.org/wiki/Russian_Blue' },
    { name: 'Burmese', care: 'Affectionate and people-oriented.', wiki: 'https://en.wikipedia.org/wiki/Burmese_cat' },
    { name: 'Devon Rex', care: 'Mischievous and love perching on shoulders.', wiki: 'https://en.wikipedia.org/wiki/Devon_Rex' },
    { name: 'Norwegian Forest Cat', care: 'Majestic and independent. Weatherproof double coat.', wiki: 'https://en.wikipedia.org/wiki/Norwegian_Forest_cat' },
    { name: 'Birman', care: 'Blue-eyed beauties. Gentle and social companions.', wiki: 'https://en.wikipedia.org/wiki/Birman' },
    { name: 'Oriental Shorthair', care: 'Elegant athletes. Very vocal and demanding.', wiki: 'https://en.wikipedia.org/wiki/Oriental_Shorthair' },
    { name: 'Exotic Shorthair', care: 'Persian personality, short coat. Less grooming!', wiki: 'https://en.wikipedia.org/wiki/Exotic_Shorthair' },
    { name: 'Tonkinese', care: 'Playful hybrids. Love interactive games.', wiki: 'https://en.wikipedia.org/wiki/Tonkinese_cat' },
    { name: 'Savannah', care: 'Wild-looking adventurers. Need lots of space.', wiki: 'https://en.wikipedia.org/wiki/Savannah_cat' },
    { name: 'American Shorthair', care: 'All-American classic. Easy-going and healthy.', wiki: 'https://en.wikipedia.org/wiki/American_Shorthair' },
    { name: 'Chartreux', care: 'Quiet observers. Smile-like expression.', wiki: 'https://en.wikipedia.org/wiki/Chartreux' },
    { name: 'Turkish Angora', care: 'Graceful and energetic. Love being center stage.', wiki: 'https://en.wikipedia.org/wiki/Turkish_Angora' },
    { name: 'Manx', care: 'Tailless wonders. Excellent hunters and jumpers.', wiki: 'https://en.wikipedia.org/wiki/Manx_cat' }
  ]
};

const REMINDERS = [
  { icon: Utensils, text: "Time for breakfast!", color: "text-orange-500" },
  { icon: Droplet, text: "Refresh water bowl", color: "text-blue-500" },
  { icon: Dumbbell, text: "Walk time! Get moving", color: "text-green-500" },
  { icon: Pill, text: "Medication reminder", color: "text-purple-500" },
  { icon: Scissors, text: "Grooming appointment coming up", color: "text-pink-500" },
  { icon: Stethoscope, text: "Vet checkup this week", color: "text-red-500" },
  { icon: Apple, text: "Treat time!", color: "text-yellow-500" },
  { icon: Brain, text: "Training session scheduled", color: "text-indigo-500" },
  { icon: Moon, text: "Bedtime routine", color: "text-slate-500" },
  { icon: Camera, text: "Capture today's memories", color: "text-teal-500" },
];

const PawPad = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });
  
  const [currentTab, setCurrentTab] = useState('home');
  const [petType, setPetType] = useState('dogs');
  const [selectedBreed, setSelectedBreed] = useState('');
  const [activities, setActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [newAct, setNewAct] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  
  // Photo Gallery State
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  
  // Pet Profile State
  const [petProfile, setPetProfile] = useState({
    name: '',
    breed: '',
    age: '',
    weight: '',
    birthday: '',
    photo: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Pet'
  });

  // Health Tracking State
  const [weightHistory, setWeightHistory] = useState([]);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState({ weight: '', date: new Date().toISOString().split('T')[0] });
  
  const [vaccinations, setVaccinations] = useState([
    { id: 1, name: 'Rabies', date: '2024-01-15', nextDue: '2025-01-15', done: true },
    { id: 2, name: 'DHPP', date: '', nextDue: '2024-12-01', done: false },
  ]);
  
  const [medications, setMedications] = useState([
    { id: 1, name: 'Heartworm Prevention', frequency: 'Monthly', lastGiven: '2024-03-01' }
  ]);
  
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [newMedication, setNewMedication] = useState({ name: '', frequency: 'Daily', lastGiven: new Date().toISOString().split('T')[0] });
  
  // Emergency Contacts State
  const [emergencyContacts, setEmergencyContacts] = useState({
    primaryVet: { name: '', phone: '', address: '' },
    emergencyClinic: { name: '', phone: '', address: '' }
  });
  const [editingContact, setEditingContact] = useState(null);
  
  const [supplies, setSupplies] = useState([
    { id: 1, text: "Premium Kibble Stock", checked: false },
    { id: 2, text: "Heartworm Prevention", checked: true },
    { id: 3, text: "Grooming Tools", checked: false },
    { id: 4, text: "Treats & Chews", checked: false },
    { id: 5, text: "Waste Bags", checked: false },
  ]);

  const [currentReminderIndex, setCurrentReminderIndex] = useState(0);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [photosLoaded, setPhotosLoaded] = useState(false);

// PetTalk Chat State
const [messages, setMessages] = useState([]);
const [newMessage, setNewMessage] = useState('');
const [chatImage, setChatImage] = useState(null);

  useEffect(() => {
    console.log('🔵 Loading data from localStorage...');
    const savedUser = localStorage.getItem('pawpad_user');
    const savedPet = localStorage.getItem('pawpad_pet_profile');
    const savedActivities = localStorage.getItem('pawpad_activities');
    const savedPhotos = localStorage.getItem('pawpad_photos');
    const savedWeight = localStorage.getItem('pawpad_weight');
    const savedVaccinations = localStorage.getItem('pawpad_vaccinations');
    const savedMedications = localStorage.getItem('pawpad_medications');
    const savedContacts = localStorage.getItem('pawpad_emergency_contacts');
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    if (savedPet) setPetProfile(JSON.parse(savedPet));
    if (savedActivities) setActivities(JSON.parse(savedActivities));
    if (savedPhotos) {
      const parsedPhotos = JSON.parse(savedPhotos);
      setPhotos(parsedPhotos);
      console.log('🟢 Loaded', parsedPhotos.length, 'photos from localStorage');
    }
    if (savedWeight) setWeightHistory(JSON.parse(savedWeight));
    if (savedVaccinations) setVaccinations(JSON.parse(savedVaccinations));
    if (savedMedications) setMedications(JSON.parse(savedMedications));
    if (savedContacts) setEmergencyContacts(JSON.parse(savedContacts));
    
    // Mark photos as loaded so we don't overwrite them
    setPhotosLoaded(true);
    console.log('🟢 Initial data load complete');

    const savedMessages = localStorage.getItem('pawpad_messages');
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem('pawpad_activities', JSON.stringify(activities));
    }
  }, [activities]);

  useEffect(() => {
    // Only save photos after initial load is complete
    // This prevents overwriting saved photos with empty array on mount
    if (photosLoaded) {
      const jsonData = JSON.stringify(photos);
      localStorage.setItem('pawpad_photos', jsonData);
      console.log('🔵 Auto-saved', photos.length, 'photos to localStorage');
    }
  }, [photos, photosLoaded]);

  useEffect(() => {
    if (weightHistory.length > 0) {
      localStorage.setItem('pawpad_weight', JSON.stringify(weightHistory));
    }
  }, [weightHistory]);

  useEffect(() => {
    localStorage.setItem('pawpad_vaccinations', JSON.stringify(vaccinations));
  }, [vaccinations]);

  useEffect(() => {
    localStorage.setItem('pawpad_medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem('pawpad_emergency_contacts', JSON.stringify(emergencyContacts));
  }, [emergencyContacts]);

  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  useEffect(() => {
    if (showNotifs) {
      const interval = setInterval(() => {
        setCurrentReminderIndex((prev) => (prev + 1) % REMINDERS.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [showNotifs]);

useEffect(() => {
  localStorage.setItem('pawpad_messages', JSON.stringify(messages));
}, [messages]);

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
      setAuthForm({ email: '', password: '', name: '' });
    } else {
      const user = {
        name: authForm.email.split('@')[0],
        email: authForm.email,
        joinedDate: new Date().toISOString()
      };
      localStorage.setItem('pawpad_user', JSON.stringify(user));
      setCurrentUser(user);
      setIsAuthenticated(true);
      setAuthForm({ email: '', password: '', name: '' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pawpad_user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setShowProfile(false);
  };

  // Photo Gallery Functions - WITH WORKING COMPRESSION
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;
    
    console.log('🔵 Upload started -', files.length, 'files');
    setToastMessage('Processing...');
    setShowSuccessToast(true);
    
    const newPhotos = [];
    let completed = 0;
    
    files.forEach((file, index) => {
      // Check file size - reject if > 10MB to prevent crashes
      if (file.size > 10 * 1024 * 1024) {
        console.log('🔴 File too large:', file.name, (file.size / 1024 / 1024).toFixed(1), 'MB');
        completed++;
        if (completed === files.length && newPhotos.length > 0) {
          saveNewPhotos(newPhotos);
        } else if (completed === files.length) {
          setToastMessage('Photos too large! Use smaller images.');
          setShowSuccessToast(true);
        }
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new window.Image();
        
        img.onload = () => {
          console.log('🔵 Compressing image', index + 1);
          
          // Create canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate size (max 800px to prevent crashes)
          let width = img.width;
          let height = img.height;
          const maxSize = 800;
          
          if (width > height && width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          
          try {
            // Compress to 60% quality (smaller = more reliable)
            const compressed = canvas.toDataURL('image/jpeg', 0.6);
            const sizeKB = (compressed.length / 1024).toFixed(0);
            console.log('🟢 Compressed to', sizeKB, 'KB');
            
            newPhotos.push({
              id: Date.now() + Math.random() + index,
              url: compressed,
              date: new Date().toISOString(),
              caption: ''
            });
          } catch (err) {
            console.log('🔴 Compression failed:', err.message);
          }
          
          completed++;
          if (completed === files.length) {
            saveNewPhotos(newPhotos);
          }
        };
        
        img.onerror = () => {
          console.log('🔴 Image load failed');
          completed++;
          if (completed === files.length && newPhotos.length > 0) {
            saveNewPhotos(newPhotos);
          }
        };
        
        img.src = e.target.result;
      };
      
      reader.onerror = () => {
        console.log('🔴 File read failed');
        completed++;
        if (completed === files.length && newPhotos.length > 0) {
          saveNewPhotos(newPhotos);
        }
      };
      
      reader.readAsDataURL(file);
    });
  };
  
  const saveNewPhotos = (newPhotos) => {
    if (newPhotos.length === 0) {
      setToastMessage('No photos processed');
      setShowSuccessToast(true);
      return;
    }
    
    console.log('🔵 Saving', newPhotos.length, 'photos');
    
    setPhotos(prevPhotos => {
      const updated = [...newPhotos, ...prevPhotos];
      console.log('🔵 Total photos now:', updated.length);
      
      // Save to localStorage
      try {
        const jsonData = JSON.stringify(updated);
        localStorage.setItem('pawpad_photos', jsonData);
        console.log('🟢 SAVED to localStorage -', updated.length, 'photos,', (jsonData.length / 1024).toFixed(0), 'KB');
      } catch (err) {
        console.log('🔴 localStorage save failed:', err.message);
        if (err.name === 'QuotaExceededError') {
          setToastMessage('Storage full! Delete old photos.');
          setShowSuccessToast(true);
        }
      }
      
      return updated;
    });
    
    setToastMessage(`${newPhotos.length} photo${newPhotos.length > 1 ? 's' : ''} uploaded!`);
    setShowSuccessToast(true);
  };

  const deletePhoto = (id) => {
    console.log('🔵 Deleting photo:', id);
    setPhotos(prev => {
      const updated = prev.filter(p => p.id !== id);
      console.log('🔵 Photos after delete:', updated.length);
      try {
        localStorage.setItem('pawpad_photos', JSON.stringify(updated));
        console.log('🟢 Delete saved to localStorage');
      } catch (err) {
        console.log('🔴 Delete save failed:', err);
      }
      return updated;
    });
    setSelectedPhoto(null);
  };

  // Pet Profile Photo Change - WITH COMPRESSION
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size
    if (file.size > 10 * 1024 * 1024) {
      setToastMessage('Photo too large! Use smaller image.');
      setShowSuccessToast(true);
      return;
    }
    
    console.log('🔵 Profile photo upload started');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      
      img.onload = () => {
        console.log('🔵 Compressing profile photo');
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Max 600px for profile
        let width = img.width;
        let height = img.height;
        const maxSize = 600;
        
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        try {
          const compressed = canvas.toDataURL('image/jpeg', 0.7);
          console.log('🟢 Profile photo compressed:', (compressed.length / 1024).toFixed(0), 'KB');
          
          setPetProfile(prev => {
            const updated = { ...prev, photo: compressed };
            try {
              localStorage.setItem('pawpad_pet_profile', JSON.stringify(updated));
              console.log('🟢 Profile saved');
            } catch (err) {
              console.log('🔴 Profile save failed:', err);
            }
            return updated;
          });
          
          setToastMessage('Profile photo updated!');
          setShowSuccessToast(true);
        } catch (err) {
          console.log('🔴 Compression failed:', err);
          setToastMessage('Failed to process photo');
          setShowSuccessToast(true);
        }
      };
      
      img.onerror = () => {
        console.log('🔴 Image load failed');
        setToastMessage('Invalid image file');
        setShowSuccessToast(true);
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      console.log('🔴 File read failed');
      setToastMessage('Failed to read file');
      setShowSuccessToast(true);
    };
    
    reader.readAsDataURL(file);
  };

  // Weight History Functions
  const addWeightEntry = () => {
    if (newWeight.weight && newWeight.date) {
      setWeightHistory([
        { id: Date.now(), weight: parseFloat(newWeight.weight), date: newWeight.date },
        ...weightHistory
      ]);
      setNewWeight({ weight: '', date: new Date().toISOString().split('T')[0] });
      setShowWeightModal(false);
    }
  };

  // Vaccination Functions
  const toggleVaccination = (id) => {
  setVaccinations(vaccinations.map(vax => {
    if (vax.id !== id) return vax;

    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);

    return {
      ...vax,
      done: !vax.done,
      date: !vax.done ? today.toISOString().split('T')[0] : '',
      nextDue: nextYear.toISOString().split('T')[0]
    };
  }));
};

  // Medication Functions
  const addMedication = () => {
    if (newMedication.name) {
      setMedications([
        ...medications,
        { id: Date.now(), ...newMedication }
      ]);
      setNewMedication({ name: '', frequency: 'Daily', lastGiven: new Date().toISOString().split('T')[0] });
      setShowMedicationModal(false);
    }
  };

  const deleteMedication = (id) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  // Emergency Contacts Functions
  const saveEmergencyContact = (type) => {
    setEditingContact(null);
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

  const deleteActivity = (index) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const savePetProfile = () => {
    localStorage.setItem('pawpad_pet_profile', JSON.stringify(petProfile));
    setToastMessage('Pet profile saved! 🐾');
    setShowSuccessToast(true);
  };

  const navigatePhoto = (direction) => {
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    if (direction === 'next' && currentIndex < photos.length - 1) {
      setSelectedPhoto(photos[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      setSelectedPhoto(photos[currentIndex - 1]);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] via-[#EDE0CE] to-[#f9a57a]/10 flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-6 rounded-[2rem] shadow-xl">
                <Heart size={48} className="text-[#f9a57a]" fill="#f9a57a" />
              </div>
            </div>
            <h1 className="text-4xl font-black text-[#5C544E] mb-2">PAWPAD</h1>
            <p className="text-[#8A7560] font-medium">Your Pet's Digital Companion</p>
          </div>

          <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-[#EDE0CE]">
            <div className="flex gap-2 mb-8">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                  authMode === 'login' 
                    ? 'bg-[#f9a57a] text-white shadow-lg' 
                    : 'bg-stone-100 text-stone-400'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                  authMode === 'register' 
                    ? 'bg-[#f9a57a] text-white shadow-lg' 
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
                className="w-full bg-[#f9a57a] hover:bg-[#e88b5f] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-[#f9a57a]/30 transition-all active:scale-95"
              >
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-xs text-stone-400 mt-6">
              {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-[#f9a57a] font-bold"
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

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#423D38] font-sans pb-24">
      <nav className="p-5 flex justify-between items-center bg-white/70 backdrop-blur-lg sticky top-0 z-50 border-b border-stone-100 shadow-sm">
        <h1 className="text-xl font-black tracking-tighter flex items-center gap-2 text-[#f9a57a]">
          <Heart size={20} fill="#f9a57a" /> PAWPAD
        </h1>
        <div className="flex gap-3 relative">
          <button 
            onClick={() => {setShowNotifs(!showNotifs); setShowProfile(false);}}
            className={`p-2 rounded-full shadow-sm border transition-all ${
              showNotifs ? 'bg-[#f9a57a] border-[#f9a57a] text-white' : 'bg-white border-stone-100'
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
                        animate={{ 
                          opacity: isActive ? 1 : 0.5, 
                          scale: isActive ? 1 : 0.95,
                          backgroundColor: isActive ? '#FEF7EE' : 'transparent'
                        }}
                        className={`p-4 rounded-2xl flex items-center gap-3 transition-all ${
                          isActive ? 'border-2 border-[#f9a57a]' : 'border border-transparent'
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
                            className="w-2 h-2 bg-[#f9a57a] rounded-full"
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                  onClick={() => {setCurrentTab('profile'); setShowProfile(false);}}
                  className="w-full text-left p-3 hover:bg-stone-50 rounded-xl flex items-center gap-3 text-sm font-bold text-[#5C544E] cursor-pointer"
                >
                  <Settings size={16}/> Profile Settings
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left p-3 hover:bg-red-50 rounded-xl flex items-center gap-3 text-sm font-bold text-red-500 cursor-pointer"
                >
                  <LogOut size={16}/> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <main className="max-w-xl mx-auto p-6">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'mypics', label: 'My Pics', icon: Camera },
            { id: 'pettalk', label: 'PetTalk', icon: Users },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'health', label: 'Health', icon: Stethoscope },
            { id: 'stats', label: 'Stats', icon: BarChart3 },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  currentTab === tab.id
                    ? 'bg-[#f9a57a] text-white shadow-lg shadow-[#f9a57a]/30'
                    : 'bg-white text-stone-400 border border-stone-100'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {currentTab === 'home' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <section className="bg-gradient-to-br from-[#EDE0CE] to-[#E2D0B8] border border-[#E2D0B8] rounded-[2.5rem] p-10 mb-10 relative overflow-hidden shadow-lg">
              <div className="relative z-10">
                <h2 className="text-3xl font-black mb-1 text-[#5C544E] tracking-tight">
                  Hey, {currentUser?.name}!
                </h2>
                <p className="text-[#8A7560] text-sm mb-8 font-medium italic">
                  Ready to make today pawsome?
                </p>
                <button 
                  onClick={() => setShowModal(true)}
                  className="bg-[#fadfa5] hover:bg-[#f8d78f] text-[#5C544E] px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#fadfa5]/30 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <Plus size={18} /> New Activity
                </button>
              </div>
              <Dog className="absolute -right-6 -bottom-6 w-48 h-48 opacity-10 text-[#8A7560] rotate-12" />
            </section>

            <div className="grid grid-cols-3 gap-3 mb-10">
              <StatCard icon={Activity} value={activities.length} label="Activities" color="bg-blue-50" iconColor="text-blue-500" />
              <StatCard icon={CheckCircle2} value={supplies.filter(s => s.checked).length} label="Completed" color="bg-green-50" iconColor="text-green-500" />
              <StatCard icon={Award} value="92%" label="Care Score" color="bg-orange-50" iconColor="text-orange-500" />
            </div>

            <section className="mb-12">
              <h3 className="text-xs font-black text-[#8A7560] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Search size={14} /> Breed Explorer
              </h3>
              <div className="flex gap-3 mb-6">
                <button 
                  onClick={() => {setPetType('dogs'); setSelectedBreed('');}} 
                  className={`flex-1 py-4 rounded-2xl text-xs font-black tracking-widest transition-all cursor-pointer text-white ${
                    petType === 'dogs' 
                      ? 'bg-[#00E5DC] shadow-lg scale-105' 
                      : 'bg-[#00E5DC]/60 shadow-md hover:bg-[#00E5DC]/75'
                  }`}
                >
                  <Dog size={20} className="mx-auto mb-1" />
                  DOGS
                </button>
                <button 
                  onClick={() => {setPetType('cats'); setSelectedBreed('');}} 
                  className={`flex-1 py-4 rounded-2xl text-xs font-black tracking-widest transition-all cursor-pointer text-white ${
                    petType === 'cats' 
                      ? 'bg-[#FF7A35] shadow-lg scale-105' 
                      : 'bg-[#FF7A35]/60 shadow-md hover:bg-[#FF7A35]/75'
                  }`}
                >
                  <Cat size={20} className="mx-auto mb-1" />
                  CATS
                </button>
              </div>
              
              <div className="relative">
                <select 
                  className="w-full p-5 rounded-3xl bg-white border-2 border-stone-200 shadow-sm text-sm font-bold outline-none appearance-none cursor-pointer focus:border-[#f9a57a] transition-all"
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
                      <div className="flex-1">
                        <h4 className="font-black text-[#5C544E] mb-1">{selectedBreed}</h4>
                        <p className="text-sm text-[#8A7560] leading-relaxed italic mb-3">
                          "{BREEDS[petType].find(b => b.name === selectedBreed)?.care}"
                        </p>
                        <a 
                          href={BREEDS[petType].find(b => b.name === selectedBreed)?.wiki}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#f9a57a] hover:text-[#e88b5f] transition-colors cursor-pointer"
                        >
                          Learn more <ChevronRight size={14} />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            <section className="mb-10">
              <h3 className="text-xs font-black text-[#8A7560] uppercase tracking-wider mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <ActionCard 
                  icon={Utensils} 
                  label="Fed Pet" 
                  sub="Tap to log"
                  onClick={() => quickLog("Fed breakfast")}
                  bg="bg-orange-50/50"
                  iconColor="text-orange-500"
                />
                <ActionCard 
                  icon={Dumbbell} 
                  label="Exercise" 
                  sub="Tap to log"
                  onClick={() => quickLog("30 min walk")}
                  bg="bg-green-50/50"
                  iconColor="text-green-500"
                />
                <ActionCard 
                  icon={Droplet} 
                  label="Water Bowl" 
                  sub="Tap to log"
                  onClick={() => quickLog("Refilled water")}
                  bg="bg-blue-50/50"
                  iconColor="text-blue-500"
                />
                <ActionCard 
                  icon={Brain} 
                  label="Training" 
                  sub="Tap to log"
                  onClick={() => quickLog("Training session")}
                  bg="bg-purple-50/50"
                  iconColor="text-purple-500"
                />
              </div>
            </section>

            <section className="mb-10">
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
                    className="flex justify-between items-center p-5 bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex-1">
                      <span className="text-sm font-bold text-[#423D38] block">{a.text}</span>
                      <span className="text-xs text-stone-400 font-medium">{a.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-[#f9a57a] bg-orange-50 px-3 py-1.5 rounded-xl">
                        {a.time}
                      </span>
                      <button
                        onClick={() => deleteActivity(i)}
                        className="p-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-red-50 rounded-xl text-red-400 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="bg-white p-8 rounded-[2.5rem] shadow-md border-2 border-[#EDE0CE]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black text-[#8A7560] uppercase tracking-wider flex items-center gap-2">
                  <ShoppingCart size={14} /> Supply Checklist
                </h3>
                <span className="text-xs font-bold text-[#f9a57a]">
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
          </motion.div>
        )}

        {currentTab === 'mypics' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-[#5C544E]">My Pet Photos</h2>
              <label className="px-6 py-3 bg-[#f9a57a] text-white rounded-2xl text-sm font-black cursor-pointer hover:bg-[#e88b5f] transition-all shadow-lg shadow-[#f9a57a]/30 flex items-center gap-2">
                <Upload size={16} />
                Upload
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                />
              </label>
            </div>

            {photos.length === 0 ? (
              <div className="text-center py-20 bg-gradient-to-br from-stone-50 to-stone-100 rounded-[3rem] border-2 border-dashed border-stone-200">
                <Camera size={64} className="mx-auto text-stone-300 mb-4" />
                <h3 className="text-xl font-black text-stone-400 mb-2">No Photos Yet</h3>
                <p className="text-sm text-stone-400 mb-6">Start capturing precious moments!</p>
                <label className="inline-flex items-center gap-2 px-8 py-4 bg-[#f9a57a] text-white rounded-2xl text-sm font-black cursor-pointer hover:bg-[#e88b5f] transition-all">
                  <Camera size={18} />
                  Add First Photo
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handlePhotoUpload} 
                    className="hidden" 
                  />
                </label>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {photos.map(photo => (
                  <motion.div
                    key={photo.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="aspect-square rounded-2xl overflow-hidden cursor-pointer relative group shadow-md hover:shadow-xl transition-all"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <img src={photo.url} alt="Pet" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-white text-xs font-bold">
                        {new Date(photo.date).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <AnimatePresence>
              {selectedPhoto && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedPhoto(null)}
                    className="absolute inset-0"
                  />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative w-full max-w-2xl z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setSelectedPhoto(null)}
                      className="absolute -top-12 right-0 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X size={24} />
                    </button>
                    
                    {/* Navigation Arrows */}
                    {photos.length > 1 && (
                      <>
                        {photos.findIndex(p => p.id === selectedPhoto.id) > 0 && (
                          <button
                            onClick={() => navigatePhoto('prev')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                          >
                            <ChevronRight size={24} className="rotate-180" />
                          </button>
                        )}
                        {photos.findIndex(p => p.id === selectedPhoto.id) < photos.length - 1 && (
                          <button
                            onClick={() => navigatePhoto('next')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                          >
                            <ChevronRight size={24} />
                          </button>
                        )}
                      </>
                    )}
                    
                    <img 
                      src={selectedPhoto.url} 
                      alt="Pet" 
                      className="w-full h-auto max-h-[80vh] object-contain rounded-3xl shadow-2xl" 
                    />
                    <div className="flex gap-3 justify-center mt-6">
                      <button 
                        onClick={() => deletePhoto(selectedPhoto.id)}
                        className="px-6 py-3 bg-red-500 text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-red-600 transition-all"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {currentTab === 'health' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-black text-[#5C544E] mb-6">Health Tracker</h2>
            
            <section className="bg-white p-8 rounded-[2.5rem] shadow-md border-2 border-[#EDE0CE] mb-6">
              <h3 className="text-xs font-black text-[#8A7560] uppercase tracking-wider mb-6 flex items-center gap-2">
                <Syringe size={14} /> Vaccination Schedule
              </h3>
              <div className="space-y-4">
                {vaccinations.map(vax => (
                  <div key={vax.id} className="p-4 bg-stone-50 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-[#423D38]">{vax.name}</span>
                      <button
                        onClick={() => toggleVaccination(vax.id)}
                        className="transition-transform hover:scale-110 cursor-pointer"
                      >
                        {vax.done ? (
                          <CheckCircle2 size={24} className="text-green-500" />
                        ) : (
                          <Circle size={24} className="text-stone-300 hover:text-green-400" />
                        )}
                      </button>
                    </div>
                    <div className="text-xs text-stone-500 font-medium">
                      {vax.done ? (
                        <>Last: {vax.date} - Next: {vax.nextDue}</>
                      ) : (
                        <>Due: {vax.nextDue}</>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white p-8 rounded-[2.5rem] shadow-md border-2 border-[#EDE0CE] mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black text-[#8A7560] uppercase tracking-wider flex items-center gap-2">
                  <Pill size={14} /> Active Medications
                </h3>
                <button
                  onClick={() => setShowMedicationModal(true)}
                  className="px-4 py-2 bg-[#f9a57a] text-white rounded-xl text-xs font-black hover:bg-[#e88b5f] transition-all"
                >
                  <Plus size={14} className="inline mr-1" />
                  Add
                </button>
              </div>
              <div className="space-y-4">
                {medications.map(med => (
                  <div key={med.id} className="p-4 bg-purple-50/30 rounded-2xl border border-purple-100 flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-black text-[#423D38] mb-1">{med.name}</div>
                      <div className="text-xs text-stone-500 font-medium">
                        {med.frequency} - Last given: {med.lastGiven}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMedication(med.id)}
                      className="p-2 hover:bg-red-50 rounded-xl text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white p-8 rounded-[2.5rem] shadow-md border-2 border-[#EDE0CE]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-[#8A7560] uppercase tracking-wider flex items-center gap-2">
                  <Scale size={14} /> Weight History
                </h3>
                <button
                  onClick={() => setShowWeightModal(true)}
                  className="px-4 py-2 bg-[#f9a57a] text-white rounded-xl text-xs font-black hover:bg-[#e88b5f] transition-all"
                >
                  <Plus size={14} className="inline mr-1" />
                  Add Entry
                </button>
              </div>
              {weightHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Scale size={48} className="mx-auto text-stone-300 mb-3" />
                  <p className="text-sm font-bold text-stone-400">No weight records yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {weightHistory.map(entry => (
                    <div key={entry.id} className="p-4 bg-blue-50/30 rounded-2xl border border-blue-100 flex justify-between items-center">
                      <div>
                        <div className="font-black text-[#423D38] text-lg">{entry.weight} kg</div>
                        <div className="text-xs text-stone-500">{entry.date}</div>
                      </div>
                      <Scale size={20} className="text-blue-500" />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </motion.div>
        )}

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

            <div className="bg-gradient-to-br from-[#f9a57a]/10 to-[#FF7A35]/5 p-8 rounded-[2.5rem] border-2 border-[#f9a57a]/20 text-center">
              <Star size={48} className="mx-auto text-[#f9a57a] mb-3" fill="#f9a57a" />
              <h3 className="text-xl font-black text-[#5C544E] mb-2">Awesome Pet Parent!</h3>
              <p className="text-sm text-[#8A7560] font-medium">
                You're doing an amazing job caring for your furry friend!
              </p>
            </div>
          </motion.div>
        )}

        
        {currentTab === 'pettalk' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-black text-[#5C544E] mb-6">PetTalk Community</h2>

            <div className="bg-white rounded-3xl p-4 mb-4 h-[400px] overflow-y-auto border border-stone-200">
              {messages.length === 0 && (
                <p className="text-center text-stone-400 text-sm">No messages yet 🐾</p>
              )}

              {messages.map((msg, i) => (
                <div key={i} className="mb-4">
                  <div className="text-xs text-stone-400 font-bold">
                    {msg.user} • {msg.time}
                  </div>

                  <div className="bg-[#FDFBF7] p-3 rounded-2xl mt-1 text-sm font-medium">
                    {msg.text}
                    {msg.image && (
                      <img src={msg.image} className="mt-2 rounded-xl max-h-40" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write something..."
                className="p-4 rounded-2xl border border-stone-200 outline-none"
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (e) => setChatImage(e.target.result);
                  reader.readAsDataURL(file);
                }}
              />

              <button
                onClick={() => {
                  if (!newMessage && !chatImage) return;

                  const msg = {
                    user: currentUser?.name || 'Anonymous',
                    text: newMessage,
                    image: chatImage,
                    time: new Date().toLocaleTimeString()
                  };

                  setMessages([msg, ...messages]);
                  setNewMessage('');
                  setChatImage(null);
                }}
                className="bg-[#f9a57a] text-white py-3 rounded-2xl font-bold"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}


        {currentTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-black text-[#5C544E] mb-6">Pet Profile</h2>
            
            <div className="bg-white p-8 rounded-[2.5rem] shadow-md border-2 border-[#EDE0CE] mb-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-[#EDE0CE] mb-4 border-4 border-white shadow-lg">
                  <img src={petProfile.photo} alt="Pet" className="w-full h-full object-cover" />
                </div>
                <label className="text-xs font-bold text-[#f9a57a] flex items-center gap-1 cursor-pointer hover:text-[#e88b5f] transition-colors">
                  <Camera size={14} /> Change Photo
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleProfilePhotoChange}
                    className="hidden" 
                  />
                </label>
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
                    className="w-full p-4 bg-stone-50 rounded-2xl border-2 border-transparent focus:border-[#f9a57a] outline-none font-bold"
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
                    className="w-full p-4 bg-stone-50 rounded-2xl border-2 border-transparent focus:border-[#f9a57a] outline-none font-bold"
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
                      className="w-full p-4 bg-stone-50 rounded-2xl border-2 border-transparent focus:border-[#f9a57a] outline-none font-bold"
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
                      className="w-full p-4 bg-stone-50 rounded-2xl border-2 border-transparent focus:border-[#f9a57a] outline-none font-bold"
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
                    className="w-full p-4 bg-stone-50 rounded-2xl border-2 border-transparent focus:border-[#f9a57a] outline-none font-bold"
                  />
                </div>

                <button
                  onClick={savePetProfile}
                  className="w-full bg-[#f9a57a] hover:bg-[#e88b5f] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-[#f9a57a]/30 transition-all active:scale-95"
                >
                  Save Profile
                </button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-md border-2 border-[#EDE0CE]">
              <h3 className="text-xs font-black text-[#8A7560] uppercase tracking-wider mb-6 flex items-center gap-2">
                <Phone size={14} /> Emergency Contacts
              </h3>
              <div className="space-y-4">
                <div className="p-5 bg-red-50/50 rounded-2xl border border-red-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Stethoscope size={16} className="text-red-500" />
                      <span className="font-black text-sm text-[#423D38]">Primary Vet</span>
                    </div>
                    <button
                      onClick={() => setEditingContact(editingContact === 'vet' ? null : 'vet')}
                      className="p-2 hover:bg-red-100 rounded-xl transition-colors"
                    >
                      {editingContact === 'vet' ? <Check size={16} className="text-green-600" /> : <Edit size={16} className="text-red-500" />}
                    </button>
                  </div>
                  {editingContact === 'vet' ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Clinic Name"
                        value={emergencyContacts.primaryVet.name}
                        onChange={(e) => setEmergencyContacts({
                          ...emergencyContacts,
                          primaryVet: { ...emergencyContacts.primaryVet, name: e.target.value }
                        })}
                        className="w-full p-3 bg-white rounded-xl border border-red-200 text-sm font-bold outline-none focus:border-red-400"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={emergencyContacts.primaryVet.phone}
                        onChange={(e) => setEmergencyContacts({
                          ...emergencyContacts,
                          primaryVet: { ...emergencyContacts.primaryVet, phone: e.target.value }
                        })}
                        className="w-full p-3 bg-white rounded-xl border border-red-200 text-sm font-bold outline-none focus:border-red-400"
                      />
                      <input
                        type="text"
                        placeholder="Address"
                        value={emergencyContacts.primaryVet.address}
                        onChange={(e) => setEmergencyContacts({
                          ...emergencyContacts,
                          primaryVet: { ...emergencyContacts.primaryVet, address: e.target.value }
                        })}
                        className="w-full p-3 bg-white rounded-xl border border-red-200 text-sm font-bold outline-none focus:border-red-400"
                      />
                    </div>
                  ) : (
                    <div className="text-sm text-stone-600">
                      {emergencyContacts.primaryVet.name || 'Not set'}
                      {emergencyContacts.primaryVet.phone && <div className="text-xs font-medium mt-1">{emergencyContacts.primaryVet.phone}</div>}
                      {emergencyContacts.primaryVet.address && <div className="text-xs text-stone-500 mt-1">{emergencyContacts.primaryVet.address}</div>}
                    </div>
                  )}
                </div>
                
                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-blue-500" />
                      <span className="font-black text-sm text-[#423D38]">Emergency Clinic</span>
                    </div>
                    <button
                      onClick={() => setEditingContact(editingContact === 'emergency' ? null : 'emergency')}
                      className="p-2 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                      {editingContact === 'emergency' ? <Check size={16} className="text-green-600" /> : <Edit size={16} className="text-blue-500" />}
                    </button>
                  </div>
                  {editingContact === 'emergency' ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Clinic Name"
                        value={emergencyContacts.emergencyClinic.name}
                        onChange={(e) => setEmergencyContacts({
                          ...emergencyContacts,
                          emergencyClinic: { ...emergencyContacts.emergencyClinic, name: e.target.value }
                        })}
                        className="w-full p-3 bg-white rounded-xl border border-blue-200 text-sm font-bold outline-none focus:border-blue-400"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={emergencyContacts.emergencyClinic.phone}
                        onChange={(e) => setEmergencyContacts({
                          ...emergencyContacts,
                          emergencyClinic: { ...emergencyContacts.emergencyClinic, phone: e.target.value }
                        })}
                        className="w-full p-3 bg-white rounded-xl border border-blue-200 text-sm font-bold outline-none focus:border-blue-400"
                      />
                      <input
                        type="text"
                        placeholder="Address"
                        value={emergencyContacts.emergencyClinic.address}
                        onChange={(e) => setEmergencyContacts({
                          ...emergencyContacts,
                          emergencyClinic: { ...emergencyContacts.emergencyClinic, address: e.target.value }
                        })}
                        className="w-full p-3 bg-white rounded-xl border border-blue-200 text-sm font-bold outline-none focus:border-blue-400"
                      />
                    </div>
                  ) : (
                    <div className="text-sm text-stone-600">
                      {emergencyContacts.emergencyClinic.name || 'Not set'}
                      {emergencyContacts.emergencyClinic.phone && <div className="text-xs font-medium mt-1">{emergencyContacts.emergencyClinic.phone}</div>}
                      {emergencyContacts.emergencyClinic.address && <div className="text-xs text-stone-500 mt-1">{emergencyContacts.emergencyClinic.address}</div>}
                    </div>
                  )}
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
                className="w-full p-5 bg-stone-50 rounded-2xl border-2 border-transparent focus:border-[#f9a57a] outline-none mb-8 font-bold text-[#423D38]" 
                placeholder="e.g., Played fetch in the park"
                value={newAct}
                onChange={(e) => setNewAct(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddActivity()}
              />
              <button 
                onClick={handleAddActivity} 
                className="w-full bg-[#f9a57a] hover:bg-[#e88b5f] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-[#f9a57a]/30 active:scale-95 transition-all"
              >
                Save Activity
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Weight Entry Modal */}
      <AnimatePresence>
        {showWeightModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowWeightModal(false)} 
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className="relative bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl border-2 border-[#EDE0CE]"
            >
              <button
                onClick={() => setShowWeightModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X size={20} className="text-stone-400" />
              </button>
              <h3 className="text-2xl font-black mb-2 text-[#423D38] tracking-tight">Add Weight Entry</h3>
              <p className="text-[#8A7560] text-xs font-bold mb-8 uppercase tracking-wider">
                Track your pet's weight
              </p>
              <div className="space-y-4 mb-8">
                <input 
                  type="number"
                  step="0.1"
                  placeholder="Weight (kg)"
                  value={newWeight.weight}
                  onChange={(e) => setNewWeight({ ...newWeight, weight: e.target.value })}
                  className="w-full p-5 bg-stone-50 rounded-2xl border-2 border-transparent focus:border-[#f9a57a] outline-none font-bold text-[#423D38]" 
                />
                <input 
                  type="date"
                  value={newWeight.date}
                  onChange={(e) => setNewWeight({ ...newWeight, date: e.target.value })}
                  className="w-full p-5 bg-stone-50 rounded-2xl border-2 border-transparent focus:border-[#f9a57a] outline-none font-bold text-[#423D38]" 
                />
              </div>
              <button 
                onClick={addWeightEntry} 
                className="w-full bg-[#f9a57a] hover:bg-[#e88b5f] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-[#f9a57a]/30 active:scale-95 transition-all"
              >
                Save Entry
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Medication Modal */}
      <AnimatePresence>
        {showMedicationModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowMedicationModal(false)} 
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className="relative bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl border-2 border-[#EDE0CE]"
            >
              <button
                onClick={() => setShowMedicationModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X size={20} className="text-stone-400" />
              </button>
              <h3 className="text-2xl font-black mb-2 text-[#423D38] tracking-tight">Add Medication</h3>
              <p className="text-[#8A7560] text-xs font-bold mb-8 uppercase tracking-wider">
                Track medications
              </p>
              <div className="space-y-4 mb-8">
                <input 
                  type="text"
                  placeholder="Medication Name"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                  className="w-full p-5 bg-stone-50 rounded-2xl border-2 border-transparent focus:border-[#f9a57a] outline-none font-bold text-[#423D38]" 
                />
                <select
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                  className="w-full p-5 bg-stone-50 rounded-2xl border-2 border-transparent focus:border-[#f9a57a] outline-none font-bold text-[#423D38]"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="As Needed">As Needed</option>
                </select>
                <input 
                  type="date"
                  value={newMedication.lastGiven}
                  onChange={(e) => setNewMedication({ ...newMedication, lastGiven: e.target.value })}
                  className="w-full p-5 bg-stone-50 rounded-2xl border-2 border-transparent focus:border-[#f9a57a] outline-none font-bold text-[#423D38]" 
                />
              </div>
              <button 
                onClick={addMedication} 
                className="w-full bg-[#f9a57a] hover:bg-[#e88b5f] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-[#f9a57a]/30 active:scale-95 transition-all"
              >
                Save Medication
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 size={24} />
            <span className="font-bold">{toastMessage}</span>
          </motion.div>
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
