'use client';

import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RootStore } from '@/models/RootStore';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as BarTooltip,
} from 'recharts';

// --- Instantiate the MST store ---
const store = RootStore.create({
  conversations: [],
  dateFrom: undefined,
  dateTo: undefined,
  selectedAgents: [],
  statuses: [],
  types: [],
  durationRange: [0, 0],
  costRange: [0, 0],
});

const Dashboard = observer(() => {
  // Load data once on mount
  useEffect(() => {
    store.loadConversations();
  }, []);

  // Derive filter options
  const allAgents   = Array.from(new Set(store.conversations.map(c => c.agent)));
  const allStatuses = ['busy', 'success', 'transfer', 'no_answer', 'dropped'];

  // Prepare pie-chart data
  const statusData = Object.entries(store.statusDistribution).map(
    ([name, value]) => ({ name, value })
  );
  const pieColors = ['#8b5cf6', '#ec4899', '#facc15', '#3b82f6', '#10b981'];

  // Prepare bar-chart data
  const costData = allAgents.map(agent => {
    const calls     = store.filtered.filter(c => c.agent === agent && c.duration > 0);
    const totalCost = calls.reduce((sum, c) => sum + c.cost, 0);
    const totalMin  = calls.reduce((sum, c) => sum + c.duration / 60, 0);
    return { agent, costPerMin: totalMin ? totalCost / totalMin : 0 };
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Header */}
        <header className="text-center space-y-3">
          <h1 className="text-6xl font-extrabold tracking-tight">Hooman Insights</h1>
          <p className="text-lg text-gray-300">Your call metrics dashboard</p>
        </header>

        {/* Filters */}
        <section className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {['From', 'To'].map((label, i) => (
              <div key={label}>
                <label className="block text-sm font-medium mb-1">{label}</label>
                <DatePicker
                  selected={i === 0 ? store.dateFrom : store.dateTo}
                  onChange={d =>
                    i === 0 ? store.setDateFrom(d!) : store.setDateTo(d!)
                  }
                  isClearable
                  placeholderText={`${label} date`}
                  className="w-full bg-white/10 placeholder-gray-400 border border-white/30 rounded-lg px-3 py-2 text-white"
                />
              </div>
            ))}

            <div>
              <span className="block text-sm font-medium mb-1">Agent</span>
              <div className="max-h-32 overflow-y-auto flex flex-wrap gap-3">
                {allAgents.map(a => (
                  <label key={a} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={store.selectedAgents.includes(a)}
                      onChange={() => {
                        const next = store.selectedAgents.includes(a)
                          ? store.selectedAgents.filter(x => x !== a)
                          : [...store.selectedAgents, a];
                        store.setSelectedAgents(next);
                      }}
                      className="accent-purple-500"
                    />
                    <span className="text-sm">{a}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-sm font-medium mb-1">Status</span>
              <div className="flex flex-wrap gap-3">
                {allStatuses.map(s => (
                  <label key={s} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={store.statuses.includes(s)}
                      onChange={() => {
                        const next = store.statuses.includes(s)
                          ? store.statuses.filter(x => x !== s)
                          : [...store.statuses, s];
                        store.setStatuses(next);
                      }}
                      className="accent-pink-500"
                    />
                    <span className="text-sm">{s}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            ['Total Calls',         store.totalCalls],
            ['Success Rate',        `${(store.successRate * 100).toFixed(1)}%`],
            ['Avg. Duration',       `${store.avgDuration.toFixed(1)} s`],
            ['Cost / Min',          store.costPerMinute.toFixed(2)],
            ['LLM Latency',         `${store.avgLlmLatency.toFixed(0)} ms`],
            ['TTS Latency',         `${store.avgTtsLatency.toFixed(0)} ms`],
            ['Interruptions / Min', store.interruptionRate.toFixed(2)],
          ].map(([label, value]) => (
            <div
              key={label as string}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition"
            >
              <div className="text-sm uppercase text-gray-300">{label}</div>
              <div className="mt-3 text-3xl font-bold">{value}</div>
            </div>
          ))}
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Status Distribution (Pie) */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Status Distribution</h2>
            <div className="h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={false}
                  >
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <PieTooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconSize={12}
                    formatter={(value, entry) =>
                      `${value}: ${entry.payload.value}`
                    }
                    wrapperStyle={{ color: '#d1d5db', marginTop: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cost / Min by Agent (Bar) */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Cost / Min by Agent</h2>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart
                  data={costData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="agent"
                    tick={{ angle: -45, textAnchor: 'end', fill: '#d1d5db' }}
                    interval={0}
                    height={60}
                  />
                  <YAxis tick={{ fill: '#d1d5db' }} />
                  <BarTooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(v: number) => v.toFixed(2)}
                  />
                  <Bar dataKey="costPerMin" barSize={32} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
});

export default Dashboard;
