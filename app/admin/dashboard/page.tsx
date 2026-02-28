"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get(API.ADMIN.STATS);
        setStats(res.data.stats);
      } catch (err) {
        console.error("❌ Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">
            Analyzing system data...
          </p>
        </div>
      </div>
    );
  }

  if (!stats)
    return (
      <div className="p-8 text-red-500 text-center">
        Failed to load system metrics.
      </div>
    );

  // Swapped to Doughnut for a modern look
  const cultureData = {
    labels: stats.cultureStats.map((c: any) => c._id),
    datasets: [
      {
        data: stats.cultureStats.map((c: any) => c.count),
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#06b6d4",
        ],
        hoverOffset: 4,
        borderWidth: 0,
      },
    ],
  };

  const genderData = {
    labels: stats.genderStats.map((g: any) => g._id),
    datasets: [
      {
        label: "Users",
        data: stats.genderStats.map((g: any) => g.count),
        backgroundColor: "#6366f1",
        borderRadius: 6,
      },
    ],
  };

  const roleData = {
    labels: ["Admins", "Users"],
    datasets: [
      {
        data: [stats.activeAdmins, stats.totalUsers - stats.activeAdmins],
        backgroundColor: ["#f43f5e", "#10b981"],
        innerRadius: "70%",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            System Overview
          </h1>
          <p className="text-slate-500 mt-1">
            Real-time statistics and user distribution metrics.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <StatCard
            title="New Today"
            value={stats.newToday}
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <StatCard
            title="Active Admins"
            value={stats.activeAdmins}
            color="text-rose-600"
            bg="bg-rose-50"
          />
          <StatCard
            title="Total Matches"
            value={stats.totalMatches}
            color="text-purple-600"
            bg="bg-purple-50"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Distribution */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-6">
              Culture Distribution
            </h2>
            <div className="h-75 flex justify-center">
              <Doughnut
                data={cultureData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "right" } },
                }}
              />
            </div>
          </div>

          {/* User Roles */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-6">
              User Roles
            </h2>
            <div className="h-62.5 flex justify-center">
              <Pie data={roleData} options={{ maintainAspectRatio: false }} />
            </div>
            <div className="mt-4 text-center text-sm text-slate-500">
              Total account split
            </div>
          </div>

          {/* Gender Stats */}
          <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-6">
              Gender Demographics
            </h2>
            <div className="h-75">
              <Bar
                data={genderData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: { beginAtZero: true, grid: { display: false } },
                    x: { grid: { display: false } },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Sub-component for clean code
function StatCard({
  title,
  value,
  color,
  bg,
}: {
  title: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
      <span
        className={`text-xs font-bold uppercase tracking-wider mb-2 ${color} ${bg} px-3 py-1 rounded-full`}
      >
        {title}
      </span>
      <p className="text-4xl font-black text-slate-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
