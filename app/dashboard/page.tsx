"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Analytics {
  funnel: Record<string, number>;
  topFAQs: { query: string; count: number }[];
  experienceDistribution: Record<string, number>;
}

interface Session {
  sessionId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  currentStep?: string;
  completedSteps?: string[];
  startedAt?: string;
  completedAt?: string;
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sessionsRes, analyticsRes] = await Promise.all([
        fetch("/api/sessions"),
        fetch("/api/analytics"),
      ]);

      const sessionsData = await sessionsRes.json();
      const analyticsData = await analyticsRes.json();

      setSessions(sessionsData.sessions || []);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const funnelData = analytics
    ? Object.entries(analytics.funnel).map(([step, count]) => ({
        step,
        count,
      }))
    : [];

  const experienceData = analytics
    ? Object.entries(analytics.experienceDistribution).map(([level, count]) => ({
        name: level.charAt(0).toUpperCase() + level.slice(1),
        value: count,
      }))
    : [];

  const COLORS = ["#0B1F3B", "#3B82F6", "#10B981"];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B1F3B] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl font-semibold text-[#0B1F3B]">Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Sessions</h3>
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-[#0B1F3B]">{sessions.length}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Completed Applications
              </h3>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-[#0B1F3B]">
              {sessions.filter((s) => s.completedAt).length}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Top FAQs</h3>
              <MessageSquare className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-[#0B1F3B]">
              {analytics?.topFAQs.length || 0}
            </p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Step Funnel */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-[#0B1F3B] mb-4">
              Onboarding Funnel
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="step" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0B1F3B" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Experience Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-[#0B1F3B] mb-4">
              User Experience Level
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={experienceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {experienceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top FAQs */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-[#0B1F3B] mb-4">
            Most Common Questions
          </h3>
          <div className="space-y-3">
            {analytics?.topFAQs.map((faq, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-gray-900">{faq.query}</span>
                <span className="text-sm font-medium text-blue-600">
                  {faq.count} asks
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sessions Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-[#0B1F3B] mb-4">
            Recent Sessions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Session ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Progress
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Current Step
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Started
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => {
                  const progress =
                    ((session.completedSteps?.length || 0) / 7) * 100;
                  return (
                    <tr key={session.sessionId} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-900 font-mono">
                        {session.sessionId.slice(0, 12)}...
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {session.firstName && session.lastName
                          ? `${session.firstName} ${session.lastName}`
                          : "—"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {session.email || "—"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {Math.round(progress)}%
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {session.currentStep || "—"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {session.startedAt
                          ? new Date(session.startedAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="py-3 px-4">
                        {session.completedAt ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Complete
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            In Progress
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}


