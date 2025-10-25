"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  Trash2,
  Save,
  X,
  LogOut,
  Users,
  LayoutDashboard,
  Loader2,
  UserCircle2,
  ArrowLeft,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

export default function ManageUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------- Fetch Users ----------
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin");
      return;
    }

    fetch("/api/user")
      .then(async (res) => {
        if (!res.ok) throw new Error("Network error");
        const data = await res.json();
        setUsers(data.users || []);
      })
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, [router]);

  // ---------- Delete User ----------
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/user/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== id));
        toast.success("User deleted successfully");
      } else {
        toast.error("Failed to delete user");
      }
    } catch {
      toast.error("Server error");
    }
  };

  // ---------- Save User Update ----------
  const handleSave = async (id) => {
    try {
      const res = await fetch(`/api/user/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("User updated successfully");
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? data.user || editingUser : u))
        );
        setEditingUser(null);
      } else {
        toast.error(data.error || "Failed to update user");
      }
    } catch {
      toast.error("Server error");
    }
  };

  // ---------- Back to Dashboard ----------
  const handleBack = () => {
    router.push("/admin/dashboard");
  };

  // ---------- Loading Spinner ----------
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        <Loader2 className="animate-spin text-blue-600 mr-2" size={28} />
        Loading users...
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Users className="text-blue-700" size={32} />
          <h1 className="text-3xl font-bold text-blue-800">
            Manage Registered Users
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition shadow-sm"
          >
            <LayoutDashboard size={18} /> Back to Dashboard
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              toast.success("Logged out successfully");
              setTimeout(() => router.push("/admin"), 1000);
            }}
            className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Edit User Form */}
      <AnimatePresence>
        {editingUser && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white/90 backdrop-blur-md border border-blue-100 p-6 rounded-xl shadow-lg mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              ✏️ Edit User
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {["name", "email", "password", "address", "city", "location", "phone"].map((field) => (
                <input
                  key={field}
                  type={field.includes("password") ? "password" : "text"}
                  value={editingUser[field] || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, [field]: e.target.value })
                  }
                  placeholder={field.toUpperCase()}
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-400"
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleSave(editingUser._id)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <Save size={18} /> Save
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                <X size={18} /> Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Cards */}
      {users.length === 0 ? (
        <p className="text-gray-600 text-center mt-10 text-lg">
          No users found
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <motion.div
              key={user._id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/90 border border-blue-100 shadow-sm hover:shadow-lg rounded-2xl p-5 transition backdrop-blur-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <UserCircle2 className="text-blue-600" size={24} />
                  <h3 className="text-lg font-semibold text-blue-800">
                    {user.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">📧 {user.email}</p>
                <p className="text-sm text-gray-600">📞 {user.phone}</p>
                <p className="text-sm text-gray-600">🏠 {user.address}</p>
                <p className="text-sm text-gray-600">
                  📍 {user.location || user.city}
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setEditingUser(user)}
                  className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
