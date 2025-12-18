import React, { useState, useEffect , useContext } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link,
} from "react-router-dom";
import {
  Heart,
  TrendingUp,
  BarChart3,
  Brain,
  Menu,
  X,
  LogOut,
  User,
  MessageCircle,
  Calendar,
  BookOpen,
  PlayCircle,
  Shield,
  Sun,
  Wind,
  Smile,
  Meh,
  Frown,
  ArrowRight,
  CheckCircle,
  Activity,
  Lock,
  Smartphone,
  Globe,
  Users,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
} from "lucide-react";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

import { AuthContext } from "../context/AuthContext";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const appId = "Aroha-health-app";

const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
}) => {
  const baseStyle =
    "px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary:
      "bg-[#FF7E46] text-white hover:bg-[#E66A35] shadow-lg shadow-orange-200",
    secondary:
      "bg-white text-gray-700 border-2 border-gray-100 hover:border-[#FF7E46] hover:text-[#FF7E46]",
    ghost: "text-gray-600 hover:bg-gray-50 font-medium",
    outline: "border-2 border-white text-white hover:bg-white/10",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 ${className}`}
  >
    {children}
  </div>
);

const Input = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF7E46] focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-gray-50 focus:bg-white"
    />
  </div>
);

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // 🔥 If user is logged in → redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="h-10 w-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white shadow-md">
              <Brain className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              Aroha
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {["How It Works", "The Science", "Business Solutions", "About"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm font-semibold text-gray-600 hover:text-[#FF7E46] transition-colors"
                >
                  {item}
                </a>
              )
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/signin")}>
              Log In
            </Button>
            <Button onClick={() => navigate("/signup")}>Get Started</Button>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-16 pb-24 lg:pt-32 overflow-hidden">
          <div className="container relative mx-auto px-4">
            <div className="flex flex-wrap items-center">
              <div className="w-full lg:w-6/12 px-4 text-center lg:text-left z-10">
                <h1 className="text-4xl lg:text-4xl font-bold leading-tight mb-6 tracking-tight text-gray-900">
                  Overcome negative thoughts, <br />
                  <span className="text-[#FF7E46] relative">
                    stress & challenges!
                    <svg
                      className="absolute w-full h-3 -bottom-1 left-0 text-orange-200 -z-10"
                      viewBox="0 0 100 10"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 5 Q 50 10 100 5"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                      />
                    </svg>
                  </span>
                </h1>
                <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Break old patterns and form new habits. Aroha brings you
                  effective, science-based tools to help you take control of
                  your emotional well-being.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    onClick={() => navigate("/signup")}
                    className="text-lg px-10 py-4 shadow-orange-300/50"
                  >
                    Get Started
                  </Button>
                  <Button
                    onClick={() => {
                      document.getElementById("science")?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                    variant="secondary"
                    className="text-lg px-10 py-4"
                  >
                    How It Works
                  </Button>
                </div>
              </div>

              {/* Illustration */}
              <div className="w-full lg:w-5/12 px-4 mt-16 lg:mt-0 relative">
                <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

                <div className="relative z-10 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center shadow-inner">
                      <Activity className="text-blue-600 h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-800">
                        Daily Progress
                      </h3>
                      <p className="text-sm text-gray-500">
                        Building resilience...
                      </p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-[#FF7E46] to-pink-500 rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 font-medium">
                      <span>Focus</span>
                      <span>85%</span>
                    </div>
                    <p className="text-gray-600 italic bg-blue-50 p-4 rounded-xl">
                      "I feel more in control of my anxiety today."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured In Strip */}
        <section className="py-10 border-y border-gray-100 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
              Trusted by students from
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholder Logos */}
              <span className="text-xl font-bold font-serif">Universities</span>
              <span className="text-xl font-bold font-mono">COLLEGE</span>
              <span className="text-xl font-black italic">INSTITUTE</span>
              <span className="text-xl font-bold">ACADEMY</span>
              <span className="text-xl font-semibold tracking-tighter">
                HigherEd
              </span>
            </div>
          </div>
        </section>

        {/* "Break Old Patterns" Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Break old patterns, <br />
                  <span className="text-pink-500">form new habits.</span>
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  How you feel matters! Whether you're feeling sad, anxious, or
                  stressed, Aroha brings you effective tools and programs to
                  help you take control of your feelings and thoughts.
                </p>
                <ul className="space-y-4">
                  {[
                    "Evidence-based interventions",
                    "Developed by leading scientists",
                    "Personalized to your goals",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center text-gray-700 font-medium"
                    >
                      <CheckCircle className="h-5 w-5 text-[#FF7E46] mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:w-1/2 relative">
                {/* Circular Icon Grid Layout */}
                <div className="grid grid-cols-2 gap-6 max-w-md mx-auto relative z-10">
                  <div className="bg-orange-50 p-8 rounded-3xl flex flex-col items-center text-center transform translate-y-8 hover:-translate-y-2 transition-transform duration-300">
                    <Sun className="h-10 w-10 text-orange-500 mb-4" />
                    <h4 className="font-bold text-gray-800">Positivity</h4>
                  </div>
                  <div className="bg-purple-50 p-8 rounded-3xl flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
                    <Brain className="h-10 w-10 text-purple-500 mb-4" />
                    <h4 className="font-bold text-gray-800">Mindfulness</h4>
                  </div>
                  <div className="bg-blue-50 p-8 rounded-3xl flex flex-col items-center text-center transform translate-y-8 hover:-translate-y-2 transition-transform duration-300">
                    <Shield className="h-10 w-10 text-blue-500 mb-4" />
                    <h4 className="font-bold text-gray-800">Coping</h4>
                  </div>
                  <div className="bg-pink-50 p-8 rounded-3xl flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
                    <Heart className="h-10 w-10 text-pink-500 mb-4" />
                    <h4 className="font-bold text-gray-800">Self-Love</h4>
                  </div>
                </div>
                {/* Decorative Blob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-orange-100/50 to-purple-100/50 rounded-full blur-3xl -z-0"></div>
              </div>
            </div>
          </div>
        </section>

        {/* "Fits Into Your Life" Section */}
        <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600 rounded-full blur-[100px]"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
              <div className="lg:w-1/2">
                <h2 className="text-4xl font-bold mb-6">
                  Fits into your life & <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
                    transforms it.
                  </span>
                </h2>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  Our engaging activities and games can be used anytime,
                  anywhere—on your smartphone, tablet or computer. Small slices
                  of time can make big-time changes.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="text-gray-900">
                    <Smartphone className="h-5 w-5 mr-2" /> Get the App
                  </Button>
                  <Button variant="outline">
                    <Globe className="h-5 w-5 mr-2" /> Use on Web
                  </Button>
                </div>
              </div>

              <div className="lg:w-1/2 flex justify-center">
                <div className="relative w-72 h-[500px] bg-gray-800 rounded-[2.5rem] border-8 border-gray-700 shadow-2xl overflow-hidden">
                  {/* Mockup Screen */}
                  <div className="absolute top-0 left-0 w-full h-full bg-white text-gray-900 flex flex-col">
                    <div className="h-32 bg-gradient-to-br from-orange-400 to-pink-500 p-6 text-white flex flex-col justify-end">
                      <h3 className="font-bold text-xl">Good Morning!</h3>
                      <p className="text-sm opacity-90">
                        Ready for your check-in?
                      </p>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-sm">Daily Mood</span>
                          <Smile className="h-4 w-4 text-orange-500" />
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full w-2/3 bg-orange-400 rounded-full"></div>
                        </div>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-3">
                        <PlayCircle className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="font-bold text-sm">3-Min Breathing</p>
                          <p className="text-xs text-gray-500">Relaxation</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto p-4 bg-gray-50 border-t border-gray-200 flex justify-around text-gray-400">
                      <Brain className="h-6 w-6 text-[#FF7E46]" />
                      <BarChart3 className="h-6 w-6" />
                      <User className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Science Section (Cards) */}
        <section className="py-24 bg-gray-50 science">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                The Science of Happiness
              </h2>
              <p className="text-gray-600">
                We translate the latest research in positive psychology and CBT
                into fun, interactive activities.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "What is Happiness?",
                  desc: "Happiness isn't just a feeling—it's a skill you can practice and improve.",
                  color: "bg-yellow-400",
                },
                {
                  title: "The Science of Habits",
                  desc: "Small, consistent actions create new neural pathways in your brain.",
                  color: "bg-blue-400",
                },
                {
                  title: "Building Resilience",
                  desc: "Learn to bounce back from stress and challenges stronger than before.",
                  color: "bg-green-400",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className={`h-32 ${card.color} opacity-90 group-hover:opacity-100 transition-opacity`}
                  ></div>
                  <div className="p-8 relative">
                    <div className="absolute -top-8 left-8 h-16 w-16 bg-white rounded-xl shadow-md flex items-center justify-center">
                      <Brain className="h-8 w-8 text-gray-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {card.desc}
                    </p>
                    <button className="text-[#FF7E46] font-bold text-sm flex items-center group-hover:translate-x-2 transition-transform">
                      Read More <ArrowRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#a7d06c] text-gray-800 py-16">
        {/* Using a color similar to the Happify footer screenshot */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold text-lg mb-6 text-gray-900">Company</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Business Solutions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-gray-900">
                Resources
              </h4>
              <ul className="space-y-3 text-sm font-medium">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    The Science
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Crisis Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-gray-900">
                Community
              </h4>
              <ul className="space-y-3 text-sm font-medium">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Student Stories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    For Universities
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Ambassadors
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-gray-900">
                Accessibility
              </h4>
              <div className="flex gap-4 mb-6">
                <a
                  href="#"
                  className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
              <div className="inline-flex items-center bg-white/30 px-4 py-2 rounded-lg text-sm font-bold">
                <Globe className="h-4 w-4 mr-2" /> English
              </div>
            </div>
          </div>
          <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm font-medium opacity-80">
            <div className="mb-4 md:mb-0">
              &copy; 2024 Aroha. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white">
                GDPR Commitment
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
