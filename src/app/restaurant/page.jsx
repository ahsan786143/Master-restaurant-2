"use client";
import React, { useState } from "react";
import RestaurantLogin from "../_components/AdminLogin";
import RestaurantSignUp from "../_components/AdminSignUp";
import RestaurantHeader from "../_components/AdminHeader";

const Restaurant = () => {
  const [Login, setLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-100 via-sky-200 to-blue-300">
      {/* Header */}
      <RestaurantHeader />

     
        {/* Right Section (Form) */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md   p-8 rounded-2xl  ">
            {Login ? (
              <RestaurantLogin onToggle={() => setLogin(false)} />
            ) : (
              <RestaurantSignUp onToggle={() => setLogin(true)} />
            )}
          </div>
        </div>
     

     
    </div>
  );
};

export default Restaurant;
