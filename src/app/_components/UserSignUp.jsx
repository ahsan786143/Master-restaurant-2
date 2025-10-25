"use client";
import React, { useState } from "react";
import { User, Mail, Lock, Phone, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

const UserSignUp = ({ onToggle }) => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
          city,
          phone,
        }),
      });

      const data = await res.json();
      console.log("API response:", data);

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        router.push("https://master-restaurant-2.vercel.app/");
      } else {
        setErrorMsg(data.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.log("Error:", error);
      setErrorMsg("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full p-8 rounded-2xl shadow-xl bg-white"
    >
      <h3 className="text-3xl font-bold text-center text-purple-700 mb-2">
        Sign Up
      </h3>
      <p className="text-center text-gray-500 mb-6">
        Join us today! Create an account to explore amazing food delivery.
      </p>

      {/* Error Message */}
      {errorMsg && (
        <p className="text-center text-red-500 mb-4 font-medium">{errorMsg}</p>
      )}

      {/* Input fields */}
      <div className="mb-4 flex items-center bg-gray-100 rounded-lg px-4">
        <User size={18} className="text-gray-500 mr-2" />
        <input
          className="bg-transparent outline-none py-2 flex-1"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-4 flex items-center bg-gray-100 rounded-lg px-4">
        <Mail size={18} className="text-gray-500 mr-2" />
        <input
          className="bg-transparent outline-none py-2 flex-1"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-4 flex items-center bg-gray-100 rounded-lg px-4">
        <Lock size={18} className="text-gray-500 mr-2" />
        <input
          className="bg-transparent outline-none py-2 flex-1"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="mb-4 flex items-center bg-gray-100 rounded-lg px-4">
        <Lock size={18} className="text-gray-500 mr-2" />
        <input
          className="bg-transparent outline-none py-2 flex-1"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <div className="mb-4 flex items-center bg-gray-100 rounded-lg px-4">
        <MapPin size={18} className="text-gray-500 mr-2" />
        <input
          className="bg-transparent outline-none py-2 flex-1"
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
      </div>

      <div className="mb-4 flex items-center bg-gray-100 rounded-lg px-4">
        <Phone size={18} className="text-gray-500 mr-2" />
        <input
          className="bg-transparent outline-none py-2 flex-1"
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className={` w-full py-3 rounded-lg text-white font-semibold transition cursor-pointer ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
        }`}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>

      {/* Divider */}
      {/* <div className="my-6 flex items-center gap-4">
        <hr className="flex-1 border-gray-300" />
        <span className="text-gray-400 text-sm">OR</span>
        <hr className="flex-1 border-gray-300" />
      </div> */}

      {/* Social Signup */}
      {/* <button
        type="button"
        className="w-full py-2 mb-3 rounded-lg border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-100 cursor-pointer transition"
      >
        <img
          src="https://img.icons8.com/color/48/google-logo.png"
          alt="Google"
          className="w-5"
        />
        Sign up with Google
      </button> */}
      {/* <button
        type="button"
        className="w-full py-2 rounded-lg border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-100  cursor-pointer transition"
      >
        <img
          src="https://img.icons8.com/color/48/facebook.png"
          alt="Facebook"
          className="w-5"
        />
        Sign up with Facebook
      </button> */}

      {/* Toggle Login */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className="text-purple-600 font-medium hover:underline cursor-pointer"
        >
          Login
        </button>
      </p>
    </form>
  );
};

export default UserSignUp;
