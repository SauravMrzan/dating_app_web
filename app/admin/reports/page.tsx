"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";
import { ShieldAlert, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

type UserLite = {
  _id: string;
  fullName?: string;
  email?: string;
};

type ReportItem = {
  _id: string;
  reporter: UserLite;
  reportedUser: UserLite;
  reason: string;
  status: "pending" | "resolved";
  createdAt?: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message?: string }).message);
  }
  return fallback;
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      const res = await axios.get(API.ADMIN.REPORTS.LIST);
      setReports(res.data?.data || []);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to fetch reports"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const resolveReport = async (report: ReportItem) => {
    const confirmed = window.confirm(
      `Resolve this report and unmatch ${report.reporter?.fullName || "reporter"} and ${report.reportedUser?.fullName || "reported user"}?`,
    );

    if (!confirmed) return;

    try {
      setResolvingId(report._id);
      await axios.post(API.ADMIN.REPORTS.RESOLVE(report._id));
      toast.success("Report resolved and users unmatched");
      setReports((prev) =>
        prev.map((item) =>
          item._id === report._id ? { ...item, status: "resolved" } : item,
        ),
      );
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to resolve report"));
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          User Reports
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review reports and unmatch users when action is required.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FEECEB] text-[#D32F2F] mx-auto flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <p className="font-bold text-gray-900">No reports found</p>
            <p className="text-sm text-gray-500">New user reports will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {reports.map((report) => (
              <div key={report._id} className="p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                    <span className={`px-2.5 py-1 rounded-full ${report.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                      {report.status}
                    </span>
                    <span className="text-gray-400">Report ID: {report._id.slice(-8)}</span>
                  </div>

                  <p className="text-sm text-gray-700">
                    <span className="font-bold">Reporter:</span> {report.reporter?.fullName || "Unknown"} ({report.reporter?.email || "no email"})
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-bold">Reported user:</span> {report.reportedUser?.fullName || "Unknown"} ({report.reportedUser?.email || "no email"})
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-bold">Reason:</span> {report.reason}
                  </p>
                </div>

                {report.status === "pending" ? (
                  <button
                    type="button"
                    onClick={() => resolveReport(report)}
                    disabled={resolvingId === report._id}
                    className="px-4 py-2 rounded-xl bg-[#D32F2F] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#B71C1C] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {resolvingId === report._id ? "Resolving..." : "Resolve & Unmatch"}
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-green-700 bg-green-100 px-3 py-2 rounded-xl uppercase tracking-wide">
                    <CheckCircle2 className="w-4 h-4" />
                    Resolved
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
