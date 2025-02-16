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

//new
import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


// end new
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

 // config chart & chartdata
  const chartConfig = {
    Active: {
      label: "Active",
      color: "hsl(var(--dark-chart-2))",
    },
    Inactive: {
      label: "Inactive",
      color: "hsl(var(--dark-chart-4))",
    },
  } satisfies ChartConfig
  const chartData = [{ month: "abc", Active: activeUsers, Inactive: totalUsers - activeUsers }]
  
  return (
    <div className="container mx-auto px-4 py-6 w-full">
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

          <Card className="flex flex-col bg-second border-none shadow-none">
            <CardHeader className="items-center pb-0">
              <CardTitle className="text-white">Radial Chart - Users</CardTitle>
              <CardDescription>January - June 2025</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 items-center pb-0">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square w-full max-w-[250px]"
              >
                <RadialBarChart
                  data={chartData}
                  endAngle={180}
                  innerRadius={80}
                  outerRadius={130}
                >
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) - 16}
                                className="fill-white text-2xl font-bold"
                              >
                                {totalUsers.toLocaleString()}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 4}
                                className="fill-muted-foreground"
                              >
                                Total Users
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                  <RadialBar
                    dataKey="Active"
                    stackId="a"
                    cornerRadius={5}
                    fill="var(--color-Active)"
                    className="stroke-transparent stroke-2"
                  />
                  <RadialBar
                    dataKey="Inactive"
                    fill="var(--color-Inactive)"
                    stackId="a"
                    cornerRadius={5}
                    className="stroke-transparent stroke-2"
                  />
                </RadialBarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className=" text-white flex items-center gap-2 font-medium leading-none">
                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing total users for the last 6 months
              </div>
            </CardFooter>
        </Card>

        </div>
      </div>
    </div>
  );
};
export default Dashboard;
