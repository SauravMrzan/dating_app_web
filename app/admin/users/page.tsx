"use client";

import React, { useEffect, useState } from "react";
import {
  Edit2,
  Trash2,
  Eye,
  UserPlus,
  Search,
  Shield,
  CheckCircle,
  Filter,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";
import { toast } from "react-hot-toast";

export default function AdminUserTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination & Sorting state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filters state
  const [filters, setFilters] = useState<{
    role?: string;
    culture?: string;
    gender?: string;
  }>({});

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API.ADMIN.USERS, {
        params: {
          page,
          limit,
          sortField,
          sortOrder,
          ...filters,
        },
      });
      setUsers(res.data.users || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, sortField, sortOrder, filters]);

  // Delete User Logic
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name}?`)) return;

    try {
      const res = await axiosInstance.delete(`${API.ADMIN.USERS}/${id}`);
      if (res.data.success) {
        toast.success("User deleted successfully");
        setUsers(users.filter((user) => user._id !== id));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // Search Logic (client-side filter)
  const filteredUsers = users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user._id?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            User Directory
          </h1>
          <p className="text-sm text-gray-500">
            Manage, verify, and monitor MannMilap members.
          </p>
        </div>
        <Link
          href="/admin/users/create"
          className="flex items-center gap-2 px-6 py-3 bg-[#D32F2F] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#B71C1C] transition-all shadow-md shadow-[#D32F2F]/20"
        >
          <UserPlus size={16} /> Add New User
        </Link>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email or ID..."
            className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#D32F2F]/10 focus:border-[#D32F2F] outline-none transition-all"
          />
        </div>
        <button
          onClick={() => setFilters({ role: "admin" })}
          className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-600 hover:bg-gray-50"
        >
          <Filter size={18} /> Filters (Admin Only)
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-100 rounded-4xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th
                  onClick={() => {
                    setSortField("fullName");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                  className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 cursor-pointer"
                >
                  Member
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">
                  Account Status
                </th>
                <th
                  onClick={() => {
                    setSortField("role");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                  className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 cursor-pointer"
                >
                  Role
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-8">
                      <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-400 text-sm"
                  >
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                          {user.profilePicture ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_URL}${user.profilePicture}`}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as any).src =
                                  "https://via.placeholder.com/40";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Shield size={20} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {user.fullName}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wide">
                        <CheckCircle size={12} /> Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${user.role === "admin" ? "bg-purple-500" : "bg-blue-500"}`}
                        />
                        <span className="text-xs font-semibold text-gray-700 capitalize">
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/users/${user._id}`}
                          className="p-2 text-gray-400 hover:text-[#D32F2F] hover:bg-[#FFF5F5] rounded-lg transition-all"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/admin/users/${user._id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(user._id, user.fullName)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Page {page} of {totalPages} — {filteredUsers.length} Members
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 text-[10px] font-black border border-gray-200 rounded-lg uppercase disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
              disabled={page === totalPages}
              className="px-4 py-2 text-[10px] font-black border border-gray-200 rounded-lg uppercase disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
