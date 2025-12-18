import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Brain } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSignin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/signin`, {
        email,
        password,
      });

      await login(response.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 relative overflow-hidden">
      
      {/* Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-300 rounded-full blur-[140px] opacity-30"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-orange-300 rounded-full blur-[140px] opacity-30"></div>

      {/* Card */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white p-10 w-[90%] max-w-md">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-16 w-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-md">
            <Brain className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Welcome Back</h1>
          <p className="text-gray-600 mt-1 text-center">
            Enter your credentials to access your account.
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ashutosh@gmail.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF7E46] focus:ring-2 focus:ring-orange-100 bg-gray-50 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF7E46] focus:ring-2 focus:ring-orange-100 bg-gray-50 focus:bg-white outline-none"
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleSignin}
          className="mt-6 w-full bg-[#FF7E46] text-white py-3 rounded-full font-bold shadow-lg hover:bg-[#e86b34] transition-all"
        >
          Sign In
        </button>

        {/* Link */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-[#FF7E46] font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};
