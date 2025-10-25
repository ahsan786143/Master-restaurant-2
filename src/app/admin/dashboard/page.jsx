"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Mail,
  LogOut,
  Building2,
  Info,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalMessages: 0,
    totalRestaurants: 0,
    activeRestaurants: 0,
  });

  // ✅ Fetch all stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, contactsRes, restaurantsRes] = await Promise.all([
          fetch("/api/user"),
          fetch("/api/contact"),
          fetch("/api/restaurant"),
        ]);

        const usersData = await usersRes.json();
        const contactsData = await contactsRes.json();
        const restaurantsData = await restaurantsRes.json();

        // ----- USERS -----
        let totalUsers = 0;
        let activeUsers = 0;
        if (usersData.users) {
          totalUsers = usersData.totalUsers || usersData.users.length;
          activeUsers = usersData.users.filter((u) => u.isActive === true).length;
        }

        // ----- RESTAURANTS -----
        let totalRestaurants = 0;
        let activeRestaurants = 0;
        if (restaurantsData.users) {
          totalRestaurants = restaurantsData.totalUsers || restaurantsData.users.length;
          activeRestaurants = restaurantsData.users.filter(
            (r) => r.isActive === true
          ).length;
        }

        setStats({
          totalUsers,
          activeUsers,
          totalMessages: contactsData.success
            ? contactsData.contacts?.length || 0
            : 0,
          totalRestaurants,
          activeRestaurants,
        });
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin");
  };

  // ✅ Sidebar menu
  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/admin/dashboard",
    },
    {
      name: "Manage Users",
      icon: <Users className="w-5 h-5" />,
      path: "/admin/manage-users",
    },
    {
      name: "Manage Restaurants",
      icon: <Building2 className="w-5 h-5" />,
      path: "/admin/manage-restaurants",
    },
    {
      name: "About Page",
      icon: <Info className="w-5 h-5" />,
      path: "/admin/about",
    },
    {
      name: "Contact Messages",
      icon: <Mail className="w-5 h-5" />,
      path: "/admin/contact",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 🔹 Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-blue-300 mt-1">Welcome, Super Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => router.push(item.path)}
              className="flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 🔹 Main Dashboard Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">
          Dashboard Overview
        </h2>
        <p className="text-gray-600 mb-8">
          You have successfully logged in with your admin credentials.
        </p>

        {/* ================= USER SECTION ================= */}
        <h3 className="text-2xl font-bold text-gray-800 mb-4">👤 User Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-700">Total Users</h3>
            <p className="text-3xl font-bold text-blue-700 mt-2">
              {stats.totalUsers}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-700">Active Users</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.activeUsers}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-700">Messages</h3>
            <p className="text-3xl font-bold text-blue-700 mt-2">
              {stats.totalMessages}
            </p>
          </div>
        </div>

        {/* ================= RESTAURANT SECTION ================= */}
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-600" /> Restaurant Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-700">
              Total Restaurants
            </h3>
            <p className="text-3xl font-bold text-blue-700 mt-2">
              {stats.totalRestaurants}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-700">
              Active Restaurants
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.activeRestaurants}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
