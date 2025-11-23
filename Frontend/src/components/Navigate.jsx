import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Brain, Menu, X, Shield, Calendar, User } from "lucide-react";

export const Navigation = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Community", path: "/community" },
    { name: "Resources", path: "/resources" },
    { name: "Find Help", path: "/findhelp" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              <Brain className="h-8 w-8 text-pink-500 mr-2" />
              <span className="font-bold text-xl bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                ClosedAI
              </span>
            </div>

            {/* Desktop Nav */}
            {user && (
              <div className="hidden md:flex md:space-x-4 ml-8">
                {navLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? "text-pink-600 bg-pink-50"
                        : "text-gray-600 hover:text-pink-500 hover:bg-gray-50"
                    }`}
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          {user && (
            <div className="flex items-center space-x-4">
              {/* Streak Badge */}
              <div className="hidden md:flex items-center bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                <span className="text-orange-600 font-bold text-sm">
                  🔥 {user.streak} Day Streak
                </span>
              </div>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none transition-transform active:scale-95"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-400 to-orange-400 flex items-center justify-center text-white font-bold shadow-md">
                    {user.firstname?.[0] || "U"}
                  </div>
                </button>

                {/* Dropdown Menu - Condition Based on State */}
                {isProfileMenuOpen && (
                  <>
                    {/* Invisible Backdrop to close menu when clicking outside */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsProfileMenuOpen(false)}
                    />

                    {/* The Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 border border-gray-100 z-20 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-50">
                        Signed in as{" "}
                        <span className="font-bold text-gray-900">
                          {user.firstname}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          onLogout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile menu Toggle */}
              <button
                className="md:hidden p-2 text-gray-600"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && user && (
        <div className="md:hidden bg-white border-t animate-slide-down">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => {
                navigate(link.path);
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 ${
                location.pathname === link.path
                  ? "text-pink-600 bg-pink-50"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {link.name}
            </button>
          ))}

          <button
            onClick={onLogout}
            className="block w-full text-left px-3 py-2 text-red-500 hover:bg-red-50"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};
