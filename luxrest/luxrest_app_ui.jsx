import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, Bluetooth, Settings, Download, Users, Wifi, AlertCircle, ClipboardCheck, Brain, Sun, BarChart3 } from "lucide-react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const lightData = [
  { time: "06:00", lux: 50 },
  { time: "09:00", lux: 300 },
  { time: "12:00", lux: 700 },
  { time: "15:00", lux: 500 },
  { time: "18:00", lux: 100 },
  { time: "21:00", lux: 20 },
  { time: "00:00", lux: 5 }
];

function GaugeDisplay({ label, value, max, segments }) {
  const radius = 40;
  const centerX = 50;
  const centerY = 50;
  const normalize = (val) => Math.min(max, Math.max(0, val));
  const percent = normalize(value) / max;
  const rotation = 180 * percent;

  const polarToCartesian = (angle, offset = 0) => {
    const rad = (Math.PI * angle) / 180;
    return {
      x: centerX + (radius + offset) * Math.cos(rad),
      y: centerY - (radius + offset) * Math.sin(rad),
    };
  };

  const drawArc = (start, end, color) => {
    const startP = polarToCartesian(180 - start);
    const endP = polarToCartesian(180 - end);
    const largeArc = end - start > 180 ? 1 : 0;
    return (
      <path
        d={`M ${startP.x},${startP.y} A ${radius},${radius} 0 ${largeArc} 1 ${endP.x},${endP.y}`}
        stroke={color}
        strokeWidth="6"
        fill="none"
      />
    );
  };

  const needleEnd = polarToCartesian(180 - rotation);

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm text-white mb-1">{label}</p>
      <svg viewBox="0 0 100 80" className="w-48 h-32">
        {segments.map((seg, i) => drawArc(seg.start, seg.end, seg.color))}
        <line
          x1={centerX}
          y1={centerY}
          x2={needleEnd.x}
          y2={needleEnd.y}
          stroke="#38bdf8"
          strokeWidth="2"
        />
        {segments.map((seg, i) => {
          const p = polarToCartesian(180 - seg.end, 12);
          return (
            <text
              key={i}
              x={p.x}
              y={p.y - 4}
              fontSize="9"
              textAnchor="middle"
              fill="white"
            >
              {seg.label}
            </text>
          );
        })}
      </svg>
      <p className="text-lg font-bold text-cyan-300 mt-1">{value}</p>
    </div>
  );
}

export default function LuxRestAppUI() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const daytimeSegments = [
    { start: 0, end: (150 / 1000) * 180, color: "#ef4444", label: 150 },
    { start: (150 / 1000) * 180, end: (250 / 1000) * 180, color: "#facc15", label: 250 },
    { start: (250 / 1000) * 180, end: 180, color: "#22c55e", label: 1000 },
  ];

  const eveningSegments = [
    { start: 0, end: (10 / 250) * 180, color: "#22c55e", label: 10 },
    { start: (10 / 250) * 180, end: (30 / 250) * 180, color: "#facc15", label: 30 },
    { start: (30 / 250) * 180, end: 180, color: "#ef4444", label: 250 },
  ];

  return (
    <div className="bg-slate-900 min-h-screen text-white flex flex-col justify-between">
      <div className="p-6 overflow-y-auto space-y-6 flex-grow">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold">LuxRest</h1>
              <div className="flex items-center gap-3">
                <Bluetooth className="text-cyan-400" />
                <div className="flex items-center gap-1">
                  <Battery className="text-lime-400" />
                  <span className="text-sm text-white">82%</span>
                </div>
              </div>
            </div>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-center text-lg text-white">Light Exposure Gauges</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row justify-around items-center space-y-6 md:space-y-0">
                <GaugeDisplay label="Daytime" value={310} max={1000} segments={daytimeSegments} />
                <GaugeDisplay label="Evening" value={20} max={250} segments={eveningSegments} />
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Daily Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-white">
                <div className="flex justify-between">
                  <p>Bright-light exposure</p>
                  <p className="text-cyan-300">3h 15m</p>
                </div>
                <div className="flex justify-between">
                  <p>Evening low-light compliance</p>
                  <p className="text-cyan-300">92%</p>
                </div>
                <div className="flex justify-between">
                  <p>Sleep duration (prev. night)</p>
                  <p className="text-cyan-300">7h 10m</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* History */}
        {activeTab === "history" && (
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Light & Sleep History</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={lightData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="time" stroke="#ffffff" tick={{ fill: '#ffffff' }} />
                    <YAxis stroke="#ffffff" tick={{ fill: '#ffffff' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#ffffff' }} />
                    <Line type="monotone" dataKey="lux" stroke="#38bdf8" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div className="space-y-6 text-white">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-white">
                <div className="flex justify-between items-center">
                  <p>Bluetooth Pairing</p>
                  <Bluetooth className="text-cyan-400" />
                </div>
                <div className="flex justify-between items-center">
                  <p>WiFi Status</p>
                  <Wifi className="text-lime-400" />
                </div>
                <div className="flex justify-between items-center">
                  <p>Firmware Version</p>
                  <span className="text-gray-300">v1.2.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <p>Data Export</p>
                  <Download className="text-cyan-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Admin */}
        {activeTab === "admin" && (
          <div className="space-y-6 text-white">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Researcher Admin Panel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-white">
                <div className="flex justify-between">
                  <p>Participants Synced</p>
                  <p className="text-cyan-300">18/20</p>
                </div>
                <div className="flex justify-between">
                  <p>Data Integrity</p>
                  <p className="text-cyan-300">96%</p>
                </div>
                <div className="flex justify-between">
                  <p>Last Sync</p>
                  <p className="text-cyan-300">2h ago</p>
                </div>
                <div className="flex justify-between">
                  <p>Alerts</p>
                  <AlertCircle className="text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Survey */}
        {activeTab === "survey" && (
          <div className="space-y-6 text-white">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Daily Survey</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-white">
                <div>
                  <p>Sleep Duration (hours)</p>
                  <input type="number" min="0" max="12" defaultValue="7" className="w-full p-2 bg-slate-700 text-white rounded" />
                </div>
                <div>
                  <p>Coffee Intake (cups)</p>
                  <input type="number" min="0" max="10" defaultValue="2" className="w-full p-2 bg-slate-700 text-white rounded" />
                </div>
                <div>
                  <p>Mood (1–5)</p>
                  <input type="range" min="1" max="5" defaultValue="3" className="w-full" />
                </div>
                <button className="bg-cyan-600 text-white px-4 py-2 rounded w-full">Submit</button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Cognitive Test */}
        {activeTab === "cognitive" && (
          <div className="space-y-6 text-white">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Cognitive Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-white text-center">
                <p>Test your reaction time using a Stroop-style task.</p>
                <button className="bg-cyan-600 text-white px-4 py-2 rounded">Start Test</button>
                <div className="bg-slate-700 py-10 mt-4 rounded">[ Color Test Area ]</div>
                <div className="flex justify-between text-sm mt-4">
                  <p>Avg Reaction Time: <span className="text-cyan-300">520 ms</span></p>
                  <p>Accuracy: <span className="text-cyan-300">93%</span></p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-slate-800 border-t border-slate-700 flex justify-around p-3">
        <button onClick={() => setActiveTab("dashboard")} className={`${activeTab === "dashboard" ? "text-cyan-400" : "text-gray-400"}`}><Sun className="inline mr-1" size={16} />Dashboard</button>
        <button onClick={() => setActiveTab("history")} className={`${activeTab === "history" ? "text-cyan-400" : "text-gray-400"}`}><BarChart3 className="inline mr-1" size={16} />History</button>
        <button onClick={() => setActiveTab("survey")} className={`${activeTab === "survey" ? "text-cyan-400" : "text-gray-400"}`}><ClipboardCheck className="inline mr-1" size={16} />Survey</button>
        <button onClick={() => setActiveTab("cognitive")} className={`${activeTab === "cognitive" ? "text-cyan-400" : "text-gray-400"}`}><Brain className="inline mr-1" size={16} />Cognitive</button>
        <button onClick={() => setActiveTab("settings")} className={`${activeTab === "settings" ? "text-cyan-400" : "text-gray-400"}`}><Settings className="inline mr-1" size={16} />Settings</button>
        <button onClick={() => setActiveTab("admin")} className={`${activeTab === "admin" ? "text-cyan-400" : "text-gray-400"}`}><Users className="inline mr-1" size={16} />Admin</button>
      </div>
    </div>
  );
}
