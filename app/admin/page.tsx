"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get(API.ADMIN.STATS);
        setStats(res.data.stats);
      } catch (err) {
        console.error("❌ Failed to fetch dashboard stats:", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  const cultureData = {
    labels: stats.cultureStats.map((c: any) => c._id),
    datasets: [{ data: stats.cultureStats.map((c: any) => c.count) }],
  };

  const genderData = {
    labels: stats.genderStats.map((g: any) => g._id),
    datasets: [{ data: stats.genderStats.map((g: any) => g.count) }],
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Total Users: {stats.totalUsers}</p>
      <p>Total Matches: {stats.totalMatches}</p>
      <Pie data={cultureData} />
      <Bar data={genderData} />
    </div>
  );
}
