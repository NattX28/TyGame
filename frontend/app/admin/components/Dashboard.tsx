"use client";

import { useEffect } from "react";
import { Bar, BarChart, XAxis } from "recharts";
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

import { TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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
  const activeUsers = 6800;
  const totalCommunities = 120;
  const topCommunities = [
    {
      name: "League of legends",
      shortname: "LOL",
      members: 2300,
      color: "hsl(var(--chart-5))",
    },
    {
      name: "Valorant",
      shortname: "Valorant",
      members: 1800,
      color: "hsl(var(--chart-5))",
    },
    {
      name: "ROV",
      shortname: "ROV",
      members: 1500,
      color: "hsl(var(--chart-5))",
    },
    {
      name: "Call of duty",
      shortname: "COD",
      members: 1200,
      color: "hsl(var(--chart-5))",
    },
    {
      name: "Dead by daylight",
      shortname: "DBD",
      members: 900,
      color: "hsl(var(--chart-5))",
    },
  ];

  // Config Bar Chart
  const BarConfig = {
    commu: {
      color: "hsl(var(--dark-chart-1))",
    },
  } satisfies ChartConfig;

  // Config Radial Chart & Chartdata
  const RadialConfig = {
    Active: {
      label: "Active",
      color: "hsl(var(--dark-chart-2))",
    },
    Inactive: {
      label: "Inactive",
      color: "hsl(var(--dark-chart-4))",
    },
  } satisfies ChartConfig;
  const RadialData = [
    { month: "abc", Active: activeUsers, Inactive: totalUsers - activeUsers },
  ];

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

          {/* Bar Chart */}
          <Card className="bg-second border-none shadow-none z-0">
            <CardHeader className="text-white">
              <CardTitle>Admin Analysis</CardTitle>
              <CardDescription>
                Tools For Analysis Top Community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={BarConfig}>
                <BarChart accessibilityLayer data={topCommunities}>
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(_, index) =>
                      topCommunities[index].shortname
                    }
                  />
                  <Bar
                    dataKey="members"
                    stackId="a"
                    fill="var(--color-commu)"
                    radius={[4, 4, 0, 0]}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={false}
                    defaultIndex={1}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        <div className="bg-second p-6 rounded-lg">
          <div className="flex gap-2">
            <Activity />
            <h2 className="text-xl font-semibold text-main-color mb-4">
              Active Users
            </h2>
          </div>
          {/* Radial Chart */}
          <Card className="flex flex-col bg-second border-none shadow-none">
            <CardHeader className="items-center pb-0">
              <CardTitle className="text-white">Radial Chart - Users</CardTitle>
              <CardDescription>January - June 2025</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 items-center pb-0">
              <ChartContainer
                config={RadialConfig}
                className="mx-auto aspect-square w-full max-w-[250px]">
                <RadialBarChart
                  data={RadialData}
                  endAngle={180}
                  innerRadius={80}
                  outerRadius={130}>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <PolarRadiusAxis
                    tick={false}
                    tickLine={false}
                    axisLine={false}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle">
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) - 16}
                                className="fill-white text-2xl font-bold">
                                {totalUsers.toLocaleString()}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 4}
                                className="fill-muted-foreground">
                                Total Users
                              </tspan>
                            </text>
                          );
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
                Trending up by 5.2% this month{" "}
                <TrendingUp className="h-4 w-4" />
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
