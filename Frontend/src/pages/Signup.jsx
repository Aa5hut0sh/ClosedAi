import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Brain, AlertCircle } from "lucide-react"; // Added AlertCircle for error icon
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const Signup = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to store error messages
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = async () => {
    // 1. Basic Client-side validation
    if (!firstname || !lastname || !email || !password) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      setError(""); // Clear previous errors

      const response = await axios.post(
        "http://localhost:3000/api/v1/user/signup",
        { email, firstname, lastname, password }
      );

      await login(response.data.token);
      navigate("/dashboard");
    } catch (err) {
      // 2. Handle Server Errors (400, 500, etc.)
      console.error("Signup Error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        // Display the exact message sent by the backend (e.g., "Email already taken")
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-pink-300 rounded-full blur-[140px] opacity-30"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-orange-300 rounded-full blur-[140px] opacity-30"></div>

      {/* Card */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white p-10 w-[90%] max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-16 w-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-md">
            <Brain className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Create Account
          </h1>
          <p className="text-gray-600 mt-1 text-center">
            Join ClosedAI and take your first step towards emotional well-being.
          </p>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-center gap-2 text-sm border border-red-100">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              First Name
            </label>
            <input
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="John"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF7E46] focus:ring-2 focus:ring-orange-100 bg-gray-50 focus:bg-white outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Last Name
            </label>
            <input
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Doe"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF7E46] focus:ring-2 focus:ring-orange-100 bg-gray-50 focus:bg-white outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ashutosh@gmail.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF7E46] focus:ring-2 focus:ring-orange-100 bg-gray-50 focus:bg-white outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF7E46] focus:ring-2 focus:ring-orange-100 bg-gray-50 focus:bg-white outline-none transition-all"
            />
          </div>
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className={`mt-6 w-full py-3 rounded-full font-bold shadow-lg transition-all text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#FF7E46] hover:bg-[#e86b34]"
          }`}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        {/* Bottom Text */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-[#FF7E46] font-semibold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
