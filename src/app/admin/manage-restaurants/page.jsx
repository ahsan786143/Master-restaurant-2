"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  Trash2,
  Save,
  X,
  PlusCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ManageRestaurantPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: "",
    location: "",
    img_URL: "",
  });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // -------- Fetch all restaurants --------
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/restaurant", { method: "GET" });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error("Failed to fetch restaurants");
      }
    } catch (err) {
      toast.error("Server error while fetching data");
    } finally {
      setLoading(false);
    }
  };

  // -------- Add new restaurant --------
  const handleAdd = async () => {
    try {
      if (!newUser.name || !newUser.email || !newUser.password) {
        toast.error("Name, email, and password are required");
        return;
      }

      const res = await fetch("/api/restaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Restaurant added successfully");
        setUsers((prev) => [...prev, data.user]);
        setNewUser({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          address: "",
          city: "",
          location: "",
          img_URL: "",
        });
        setAdding(false);
      } else {
        toast.error(data.error || "Error adding restaurant");
      }
    } catch (error) {
      toast.error("Server error while adding restaurant");
    }
  };

  // -------- Update restaurant --------
  const handleUpdate = async (id) => {
    try {
      const res = await fetch("/api/restaurant", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editingUser }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Restaurant updated successfully");
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? data.user : u))
        );
        setEditingUser(null);
      } else {
        toast.error(data.error || "Error updating restaurant");
      }
    } catch (err) {
      toast.error("Server error while updating restaurant");
    }
  };

  // -------- Delete restaurant --------
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this restaurant?")) return;
    try {
      const res = await fetch(`/api/restaurant?id=${id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        toast.success("Restaurant deleted successfully");
        setUsers((prev) => prev.filter((u) => u._id !== id));
      } else {
        toast.error(data.error || "Error deleting restaurant");
      }
    } catch (err) {
      toast.error("Server error while deleting restaurant");
    }
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <div className="flex items-center gap-3 mb-6">
        <ArrowLeft className="cursor-pointer" onClick={() => router.back()} />
        <h1 className="text-2xl font-bold">Manage Restaurants</h1>
      </div>

      <button
        onClick={() => setAdding(!adding)}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mb-4"
      >
        <PlusCircle size={18} /> {adding ? "Cancel" : "Add Restaurant"}
      </button>

      {/* Add Restaurant Form */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border p-4 rounded-lg mb-4 bg-gray-50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.keys(newUser).map((key) => (
                <input
                  key={key}
                  type={key.includes("password") ? "password" : "text"}
                  placeholder={key.replace("_", " ").toUpperCase()}
                  className="border px-3 py-2 rounded-md w-full"
                  value={newUser[key]}
                  onChange={(e) =>
                    setNewUser({ ...newUser, [key]: e.target.value })
                  }
                />
              ))}
            </div>
            <button
              onClick={handleAdd}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Restaurant List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin" size={40} />
        </div>
      ) : users.length === 0 ? (
        <p>No restaurants found.</p>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <motion.div
              key={user._id}
              className="border p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-white"
            >
              {editingUser?._id === user._id ? (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
                  {["name", "email", "password", "address", "location", "phone", "city"].map((field) => (
                    <input
                      key={field}
                      type={field.includes("password") ? "password" : "text"}
                      value={editingUser[field] || ""}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, [field]: e.target.value })
                      }
                      placeholder={field.toUpperCase()}
                      className="border px-2 py-1 rounded w-full"
                    />
                  ))}
                  <div className="flex gap-2 col-span-full mt-2">
                    <button
                      onClick={() => handleUpdate(user._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={() => setEditingUser(null)}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    {user.img_URL && (
                      <img
                        src={user.img_URL}
                        alt={user.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h2 className="font-semibold text-lg">{user.name}</h2>
                      <p className="text-sm text-gray-600">
                        📧 {user.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        📍 {user.location || user.city}
                      </p>
                      <p className="text-sm text-gray-600">
                        🏠 {user.address}
                      </p>
                      <p className="text-sm text-gray-600">
                        📞 {user.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
