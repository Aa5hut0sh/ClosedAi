import React, { useState, useContext } from "react";
import { Navigation } from "../components/Navigate";
import { AuthContext } from "../context/AuthContext";

import {
  User,
  Phone,
  Mail,
  Calendar,
  Star,
  MessageCircle,
  X,
  Clock,
  CheckCircle
} from "lucide-react";

export const BookSession = () => {
  const { user } = useContext(AuthContext);

  // STATE
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");

  // Data: Therapists
  const therapists = [
    {
      id: 1,
      name: "Dr. Anjali Mehra",
      specialization: "Clinical Psychologist",
      experience: "8 Years Exp.",
      email: "anjali.mehra@therapy.com",
      rating: 4.9,
      reviews: 120,
      available: true,
      image: "https://i.pravatar.cc/150?img=5",
      price: "₹1500/hr"
    },
    {
      id: 2,
      name: "Dr. Rohan Desai",
      specialization: "Counselling Psychologist",
      experience: "5 Years Exp.",
      email: "rohan.desai@therapy.com",
      rating: 4.7,
      reviews: 85,
      available: false,
      image: "https://i.pravatar.cc/150?img=11",
      price: "₹1200/hr"
    },
    {
      id: 3,
      name: "Dr. Meera Singh",
      specialization: "Child & Adolescent Therapist",
      experience: "12 Years Exp.",
      email: "meera.singh@therapy.com",
      rating: 4.8,
      reviews: 200,
      available: true,
      image: "https://i.pravatar.cc/150?img=9",
      price: "₹2000/hr"
    },
  ];

  // Data: Upcoming Sessions
  const [upcomingSessions] = useState([
    {
      id: 201,
      therapist: "Dr. Meera Singh",
      date: "2024-02-15",
      time: "2:00 PM",
      image: "https://i.pravatar.cc/150?img=9"
    },
  ]);

  // Data: Past Sessions (Stateful for independent ratings)
  const [attendedSessions, setAttendedSessions] = useState([
    {
      id: 101,
      therapist: "Dr. Anjali Mehra",
      date: "2024-01-12",
      time: "3:00 PM",
      userRating: 4, 
    },
    {
      id: 102,
      therapist: "Dr. Rohan Desai",
      date: "2023-12-03",
      time: "11:00 AM",
      userRating: 0, 
    },
  ]);

  // --- HANDLERS ---

  const openBooking = (t) => {
    setSelectedTherapist(t);
    setShowModal(true);
  };

  const bookSession = () => {
    if (!sessionDate || !sessionTime) return alert("Please pick a date & time!");
    
    alert(`Success! Session booked with ${selectedTherapist.name} on ${sessionDate} at ${sessionTime}`);

    setShowModal(false);
    setSessionDate("");
    setSessionTime("");
  };

  // RATING LOGIC (Fixed)
  const handleRateSession = (sessionId, score) => {
    setAttendedSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === sessionId ? { ...session, userRating: score } : session
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Navigation user={user} />

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: Therapist List (8 cols) --- */}
        <div className="lg:col-span-8 space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
               <Calendar className="text-pink-500" /> Find a Specialist
            </h1>
            <p className="text-gray-500 mt-2">Book a session with our top-rated mental health professionals.</p>
          </div>

          {therapists.map((t) => (
            <div
              key={t.id}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col sm:flex-row gap-6 items-start"
            >
              {/* Avatar Image */}
              <div className="relative">
                <img 
                  src={t.image} 
                  alt={t.name} 
                  className="w-24 h-24 rounded-2xl object-cover shadow-sm"
                />
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm">
                    {t.available ? (
                        <CheckCircle className="w-6 h-6 text-green-500 fill-green-50" />
                    ) : (
                        <Clock className="w-6 h-6 text-red-500 fill-red-50" />
                    )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors flex items-center gap-2">
                      {t.name}
                    </h2>
                    <p className="text-purple-500 font-medium text-sm">{t.specialization}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{t.price}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-yellow-700">{t.rating}</span>
                        <span className="text-xs">({t.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                         <Clock className="w-4 h-4 text-gray-400" /> {t.experience}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Mail className="w-3 h-3 text-blue-500" /> {t.email}
                    </div>
                    
                    <button
                        disabled={!t.available}
                        onClick={() => openBooking(t)}
                        className={`px-6 py-2.5 rounded-xl font-semibold transition-all transform active:scale-95 text-white shadow-md ${
                        t.available
                            ? "bg-pink-500 hover:bg-pink-600 shadow-pink-200"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                    >
                        {t.available ? "Book Session" : "Busy"}
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- RIGHT COLUMN: Dashboard (4 cols) --- */}
        <div className="lg:col-span-4 space-y-8">
            {/* Sticky Container */}
            <div className="sticky top-6 space-y-6">
                
                {/* Upcoming Card (Purple Theme) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-500" /> Upcoming
                    </h3>

                    {upcomingSessions.length === 0 ? (
                        <p className="text-gray-400 text-sm italic">No upcoming sessions.</p>
                    ) : (
                        upcomingSessions.map((s) => (
                        <div key={s.id} className="flex gap-4 items-center p-3 bg-purple-50 rounded-xl border border-purple-100">
                            <img src={s.image} alt="doc" className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p className="font-bold text-sm text-gray-800">{s.therapist}</p>
                                <p className="text-xs text-purple-600 font-medium">
                                    {s.date} at {s.time}
                                </p>
                            </div>
                        </div>
                        ))
                    )}
                </div>

                {/* History & Rating Card (Green/Yellow Theme) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-green-600" /> Previously Attended
                    </h3>

                    <div className="space-y-4">
                    {attendedSessions.length === 0 ? (
                        <p className="text-gray-400 text-sm">No past sessions.</p>
                    ) : (
                        attendedSessions.map((s) => (
                        <div key={s.id} className="p-4 rounded-xl bg-green-50 border border-green-100">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-bold text-sm text-gray-800">{s.therapist}</p>
                                    <p className="text-xs text-gray-500">{s.date}</p>
                                </div>
                            </div>

                            {/* INDEPENDENT RATING LOGIC */}
                            <div className="flex items-center gap-1 mt-2 bg-white/60 p-2 rounded-lg justify-center">
                                <span className="text-xs font-medium text-gray-400 mr-2">Rate:</span>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        onClick={() => handleRateSession(s.id, star)}
                                        className={`w-5 h-5 cursor-pointer transition-transform hover:scale-110 ${
                                            star <= s.userRating
                                                ? "text-yellow-500 fill-yellow-500"
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                        ))
                    )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- MODAL (Purple/Pink Theme) --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowModal(false)}
          />

          {/* Modal Content */}
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative z-10 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Book Appointment</h2>
                <p className="text-gray-500 text-sm mt-1">
                    with <span className="font-semibold text-pink-500">{selectedTherapist?.name}</span>
                </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Select Date</label>
                <input
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Select Time</label>
                <input
                    type="time"
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <button
                onClick={bookSession}
                className="w-full bg-purple-600 text-white py-3.5 rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-200 transform active:scale-95 transition-all"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};