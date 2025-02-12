"use client";

import { useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { UsersRound, Flame, Activity, Handshake } from "lucide-react";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

interface statCardProps {
  title: string;
  value: string | number;
  change: {
    type: "increase" | "decrease";
    value: string;
    text: string;
  };
  icon: React.ReactNode;
}

function StatCard({ title, value, change, icon }: statCardProps) {
  return (
    <div className="bg-second rounded-lg p-6">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-300 uppercase">{title}</p>
          <h3 className="text-2xl font-semibold text-main-color mt-1">
            {value}
          </h3>
          <div className="flex items-center mt-2">
            <span
              className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                change.type === "increase"
                  ? "text-green-100 bg-green-800"
                  : "text-red-100 bg-red-800"
              }`}>
              {change.type === "increase" ? "+" : "-"}
              {change.value}
            </span>
            <span className="text-sm text-gray-300 ml-2">{change.text}</span>
          </div>
        </div>

        <div className="text-gray-300">{icon}</div>
      </div>
    </div>
  );
}

const Dashboard = () => {
  useEffect(() => {
    document.title = "Dashboard | Community Stats";
  }, []);

  // Mock data
  const totalUsers = 10500;
  const totalCommunities = 120;
  const activeUsers = 6800;
  const topCommunities = [
    { name: "League of legends", members: 2300 },
    { name: "valorant", members: 1800 },
    { name: "ROV", members: 1500 },
    { name: "Call of duty", members: 1200 },
    { name: "Dead by daylight", members: 900 },
  ];

  // Data for Bar Chart (Top 5 Communities)
  const barData = {
    labels: topCommunities.map((c) => c.name),
    datasets: [
      {
        label: "Members",
        data: topCommunities.map((c) => c.members),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    scales: {
      x: {
        ticks: {
          color: "white", // เปลี่ยนสีตัวเลขบนแกน X เป็นสีขาว
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // เปลี่ยนสีเส้น Grid เป็นสีขาวจางๆ
        },
      },
      y: {
        ticks: {
          color: "white", // เปลี่ยนสีตัวเลขบนแกน Y เป็นสีขาว
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // เปลี่ยนสีเส้น Grid เป็นสีขาวจางๆ
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "white", // เปลี่ยนสีตัวหนังสือของ Legend เป็นสีขาว
        },
      },
    },
  };

  // Data for Pie Chart (Active Users)
  const pieData = {
    labels: ["Active Users", "Inactive Users"],
    datasets: [
      {
        data: [activeUsers, totalUsers - activeUsers],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        labels: {
          color: "white", // เปลี่ยนสีของ Legend เป็นสีขาว
        },
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={"Total User"}
          value={totalUsers.toLocaleString()}
          change={{
            type: "increase",
            value: "11%",
            text: "11s previous",
          }}
          icon={<UsersRound className="w-8 h-8" />}
        />
        <StatCard
          title={"Total Communities"}
          value={totalCommunities.toLocaleString()}
          change={{
            type: "increase",
            value: "40%",
            text: "in last week",
          }}
          icon={<Handshake className="w-8 h-8" />}
        />
      </div>
      <h1 className="text-2xl font-bold text-main-color my-6">Statical</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-second p-6 rounded-lg ">
          <div className="flex gap-2">
            <Flame />
            <h2 className="text-xl font-semibold text-main-color mb-4">
              Top 5 Communities
            </h2>
          </div>
          <Bar data={barData} options={barOptions} />
        </div>
        <div className="bg-second p-6 rounded-lg">
          <div className="flex gap-2">
            <Activity />
            <h2 className="text-xl font-semibold text-main-color mb-4">
              Active Users
            </h2>
          </div>
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
