import React, { useState , useEffect } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import {
  Heart,
  TrendingUp,
  BarChart3,
  Wind,
  Smile,
  PlayCircle,
  User,
  MessageCircle,
  Calendar,
  BookOpen,
  Shield,
  Sun,
  Brain
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { Navigation } from "../components/Navigate";
import { useNavigate } from "react-router-dom";

// -------------------------------------
// FAKE 7-DAY MOOD HISTORY
// -------------------------------------
const fakeMoodHistory = [
  { date: "Mon", value: 5 },
  { date: "Tue", value: 6 },
  { date: "Wed", value: 8 },
  { date: "Thu", value: 7 },
  { date: "Fri", value: 9 },
  { date: "Sat", value: 8 },
  { date: "Sun", value: 6 },
];

// -------------------------------------
// FAKE RECENT ACTIVITY
// -------------------------------------
const fakeActivity = [
  { title: "Completed 'Stress 101'", time: "2 hours ago", icon: PlayCircle },
  { title: "Mood Logged: Great", time: "Yesterday", icon: Smile },
  { title: "Joined 'Exam Anxiety' Group", time: "2 days ago", icon: User },
  { title: "Started Journaling Habit", time: "3 days ago", icon: BookOpen },
];

// -------------------------------------
// QUICK ACTIONS
// -------------------------------------
const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: MessageCircle,
      label: "AI Chatbot",
      desc: "24/7 Support",
      color: "text-blue-600",
      bg: "bg-blue-50",
      route: "/chatbot",
    },
    {
      icon: Calendar,
      label: "Book Session",
      desc: "With Counsellor",
      color: "text-purple-600",
      bg: "bg-purple-50",
      route: "/counseling",
    },
    {
      icon: BookOpen,
      label: "Journal",
      desc: "Private Diary",
      color: "text-pink-600",
      bg: "bg-pink-50",
      route: "/journal",
    },
    {
      icon: Shield,
      label: "SOS",
      desc: "Emergency",
      color: "text-red-600",
      bg: "bg-red-50",
      route: "/sos",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => navigate(action.route)}
          className={`flex flex-col items-start p-4 rounded-2xl transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer ${action.bg}`}
        >
          <div className={`p-2 rounded-lg bg-white shadow-sm mb-3 ${action.color}`}>
            <action.icon className="h-5 w-5" />
          </div>
          <span className="font-bold text-gray-900 text-sm">{action.label}</span>
          <span className="text-xs text-gray-500">{action.desc}</span>
        </button>
      ))}
    </div>
  );
};

// -------------------------------------
// RECENT ACTIVITY
// -------------------------------------
const RecentActivity = () => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border">
    <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
    <div className="space-y-4">
      {fakeActivity.map((a, i) => (
        <div key={i} className="flex items-start gap-3">
          <a.icon className="h-5 w-5 text-pink-500" />
          <div>
            <p className="text-sm font-medium">{a.title}</p>
            <p className="text-xs text-gray-400">{a.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// -------------------------------------
// MAIN DASHBOARD
// -------------------------------------
export const Dashboard = ({ user, onLogout }) => {
  const [streak, setStreak] = useState(user.streak || 1);
  useEffect(() => {
    const updateStreak = async () => {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/user/activity`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Backend sends updated streak
        if (res.data?.streak) {
          setStreak(res.data.streak);
        }
      } catch (err) {
        console.log("Failed to update streak");
      }
    };

    updateStreak();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onLogout={onLogout} />

      <div className="container mx-auto px-4 py-10 space-y-10">
        {/* Greeting */}
        <div>
          <h1 className="text-3xl font-bold">
            Hello, {user.firstname} 👋
          </h1>
          <p className="text-gray-600">Track your mental health journey.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat title="Current Mood" value="Good" icon={<Heart />} color="border-pink-500" />
          <Stat title="Streak Days" value={streak} icon={<Wind />} color="border-orange-500" />
          <Stat title="Assessments" value="3" icon={<BarChart3 />} color="border-blue-500" />
          <Stat title="Wellness Score" value={user.wellnessScore} icon={<Brain />} color="border-purple-500" />
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Mood Graph */}
          <MoodGraph moods={fakeMoodHistory} />

          {/* Sidebar */}
          <div className="space-y-8">
            <QuickActions />
            <RecentActivity />
            <QuoteCard />
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------
// SMALL COMPONENTS
// -------------------------------------
const Stat = ({ title, value, color, icon }) => (
  <div className={`bg-white rounded-xl p-6 shadow-md border-l-4 ${color}`}>
    <div className="flex justify-between text-gray-600">
      <span>{title}</span>
      {icon}
    </div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

const MoodGraph = ({ moods }) => {
  const highest = moods.reduce((a, b) => (a.value > b.value ? a : b));
  const lowest = moods.reduce((a, b) => (a.value < b.value ? a : b));
  const avg = (moods.reduce((sum, m) => sum + m.value, 0) / moods.length).toFixed(1);

  const tips = [
    "Try a 5-minute breathing exercise today.",
    "Consider journaling your thoughts tonight.",
    "Take a short walk outside to refresh your mind.",
    "Practice gratitude — write down 3 things you appreciate.",
  ];
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  const wellnessInfo = [
    { title: "Active Therapists", value: "12 online", icon: Shield, bg: "bg-red-50", color: "text-red-600" },
    { title: "Next Session", value: "Tomorrow 3 PM", icon: Calendar, bg: "bg-purple-50", color: "text-purple-600" },
    { title: "Support Groups", value: "5 active", icon: User, bg: "bg-blue-50", color: "text-blue-600" },
    { title: "Students Online", value: "423", icon: MessageCircle, bg: "bg-green-50", color: "text-green-600" },
    { title: "Helpline Status", value: "Available", icon: Sun, bg: "bg-yellow-50", color: "text-yellow-600" },
    { title: "Top Resource", value: "Exam Stress Guide", icon: BookOpen, bg: "bg-pink-50", color: "text-pink-600" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <TrendingUp className="text-blue-500" /> Mood Trends
      </h3>

      <div className="h-52">
        <ResponsiveContainer>
          <AreaChart data={moods}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#ec4899"
              strokeWidth={2}
              fill="url(#moodGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <InsightCard title="Highest Mood" value={highest.value} day={highest.date} color="pink" />
        <InsightCard title="Lowest Mood" value={lowest.value} day={lowest.date} color="blue" />
        <InsightCard title="Weekly Avg" value={avg} day="This Week" color="purple" />
      </div>

      {/* Tip */}
      <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-700">
          💡 <span className="font-medium">Tip:</span> {randomTip}
        </p>
      </div>

      {/* Wellness Data */}
      <div className="mt-6">
        <h4 className="font-bold text-gray-800 mb-3">Wellness Overview</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wellnessInfo.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl ${item.bg} border border-gray-200 flex items-center gap-3`}
            >
              <item.icon className={`h-6 w-6 ${item.color}`} />
              <div>
                <p className="text-sm font-medium text-gray-700">{item.title}</p>
                <p className="text-sm font-bold text-gray-900">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const InsightCard = ({ title, value, day, color }) => {
  const colors = {
    pink: "bg-pink-50 border-pink-200 text-pink-600",
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
  };

  return (
    <div className={`p-4 rounded-xl border ${colors[color]}`}>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="font-bold text-gray-900">{day}</p>
      <p className="font-semibold">{value}/10</p>
    </div>
  );
};

const QuoteCard = () => (
  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl text-white">
    <p className="italic">
      "You don't have to control your thoughts. You just have to stop letting them control you."
    </p>
    <p className="text-xs mt-4 opacity-80">— Dan Millman</p>
  </div>
);
