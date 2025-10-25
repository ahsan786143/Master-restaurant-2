"use client";
import React, { useState } from "react";
import UserLogin from "../_components/UserLogin";
import UserSignUp from "../_components/UserSignUp";
import CustomerHeader from "../_components/CustomerHeader";


const UserAuth = () => {
  const [Login, setLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-100 via-sky-200 to-blue-300">
      {/* Header */}
      <CustomerHeader/>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Section (Welcome / Illustration) */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-600 via-sky-500 to-teal-400 text-white p-10">
          <div className="max-w-md text-center space-y-6">
            <h2 className="text-4xl font-extrabold drop-shadow-md">
               Welcome to <span className="text-yellow-300">Master Restaurant</span>
            </h2>
            <p className="text-lg leading-relaxed text-white/90 font-medium">
              Order your favorite meals with just a few clicks. Fresh food,
              quick delivery, and the best dining experience at your fingertips!
            </p>
            <img
              src="https://png.pngtree.com/png-clipart/20250106/original/pngtree-orange-delivery-man-on-motorcycle-png-image_20086589.png"

              alt="Food Illustration"
              className="mx-auto w-60 drop-shadow-2xl animate-bounce"
            />
          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md p-8 rounded-2xl ">
            {Login ? (
              <UserLogin onToggle={() => setLogin(false)} />
            ) : (
              <UserSignUp onToggle={() => setLogin(true)} />
            )}
          </div>
        </div>
      </main>

     
    </div>
  );
};

export default UserAuth;
