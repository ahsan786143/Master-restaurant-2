"use client";
import React, { useState } from "react";
import { User, Lock } from "lucide-react";

const UserLogin = ({ onToggle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and Password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Save token & user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      // redirect
      window.location.href = "https://master-restaurant-2.vercel.app/";
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/80 backdrop-blur-md">
        {/* Title */}
        <h3 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
          Welcome Back 
        </h3>
        <p className="text-center text-gray-600 mb-8">
          Please login to continue
        </p>

        {/* Email Input */}
        <div className="mb-4 flex items-center bg-gray-100 rounded-lg px-4">
          <User className="text-gray-500 mr-2" size={18} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="bg-transparent outline-none py-3 flex-1 text-gray-800"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4 flex items-center bg-gray-100 rounded-lg px-4">
          <Lock className="text-gray-500 mr-2" size={18} />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="bg-transparent outline-none py-3 flex-1 text-gray-800"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm font-medium mb-3">{error}</p>
        )}

        {/* Login Button */}
        <button
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition disabled:opacity-50"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        {/* <div className="my-6 flex items-center gap-4">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-400 text-sm">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div> */}

        {/* Social Login */}
        {/* <button className="w-full py-3 mb-3 rounded-xl border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-100 transition shadow-sm">
          <img
            src="https://img.icons8.com/color/48/google-logo.png"
            className="w-5"
          />
          Continue with Google
        </button>
        <button className="w-full py-3 rounded-xl border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-100 transition shadow-sm">
          <img
            src="https://img.icons8.com/color/48/facebook.png"
            className="w-5"
          />
          Continue with Facebook
        </button> */}

        {/* Toggle SignUp */}
        <p className="text-center text-sm text-gray-700 mt-6">
          Don’t have an account?{" "}
          <button
            onClick={onToggle}
            className="text-purple-600 font-medium hover:underline cursor-pointer"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
