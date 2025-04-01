"use client";
import { useEffect, useState } from "react";
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
import {
  Bar,
  BarChart,
  XAxis,
  Label,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  CartesianGrid,
  YAxis,
} from "recharts";
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
import { getAllUserAllCommunity, getStatRegister } from "@/services/user/admin";
import {
  getAmountCommunity,
  listAllCommunities,
  getCommunitys,
} from "@/services/community/communities";
import { Community, StatPost, StatRegister } from "@/types/types";
import { GetStatPosts } from "@/services/post/post";

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
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: statCardProps) {
  return (
    <div className="bg-second rounded-lg p-6">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-300 uppercase">{title}</p>
          <h3 className="text-2xl font-semibold text-main-color mt-1">
            {value}
          </h3>
        </div>

        <div className="text-gray-300">{icon}</div>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalCommunities, setTotalCommunities] = useState<number | null>(null);
  const [topCommunities, setTopCommunities] = useState<Community[]>([]);
  const [monthLimit, setMonthLimit] = useState(6);
  const [statRegis, setStatRegis] = useState<StatRegister[]>([]);
  const [statPost, setStatPost] = useState<StatPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = "Dashboard | Community Stats";

    const fetchStats = async () => {
      try {
        const [resUserTotal, resCommuTotal, resTopCommu, resTopPost] =
          await Promise.all([
            getAllUserAllCommunity(),
            getAmountCommunity(),
            listAllCommunities(5),
            GetStatPosts(),
          ]);

        setTotalUsers(resUserTotal);
        setTotalCommunities(resCommuTotal);

        // Add community_name to resTopCommu
        const updatedTopCommu = resTopCommu.map((community) => ({
          ...community,
          community_name: community.name,
        }));
        setTopCommunities(updatedTopCommu);

        const communityIDs = resTopPost.map((post) => post.community_id);
        const communities = await getCommunitys(communityIDs);
        const updatedTopPost = resTopPost.map((post) => {
          const community = communities.find(
            (comm) => comm.uuid === post.community_id
          );
          return {
            ...post,
            community_name: community ? community.name : "Unknown",
          };
        });
        setStatPost(updatedTopPost);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resStatRegis] = await Promise.all([getStatRegister(monthLimit)]);

        setStatRegis(resStatRegis);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, [monthLimit]);

  const handleMonthLimitChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setMonthLimit(value);
    }
  };

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

  return (
    <div className="container mx-auto px-4 py-6 w-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title={"Users"}
          value={totalUsers?.toLocaleString() ?? "N/A"}
          icon={<UsersRound className="w-8 h-8" />}
        />
        <StatCard
          title={"Communities"}
          value={totalCommunities?.toLocaleString() ?? "N/A"}
          icon={<Handshake className="w-8 h-8" />}
        />
        <StatCard
          title={"Posts"}
          value={totalCommunities?.toLocaleString() ?? "N/A"}
          icon={<Flame className="w-8 h-8" />}
        />
      </div>
      <h1 className="text-2xl font-bold text-main-color my-6">Statical</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* ===================== Communities Member ========================== */}
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
              {/* <CardTitle>Admin Analysis</CardTitle>
              <CardDescription>
                Tools For Analysis Top Community.
              </CardDescription> */}
            </CardHeader>
            <CardContent>
              <ChartContainer config={BarConfig}>
                <BarChart accessibilityLayer data={statPost}>
                  <XAxis
                    dataKey="community_name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(name) => name.slice(0, 10)}
                  />
                  <Bar
                    dataKey="post_count"
                    stackId="a"
                    fill="var(--color-commu)"
                    radius={[4, 4, 0, 0]}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={false}
                    defaultIndex={-1}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* ===================== Communities Post ========================== */}
        <div className="bg-second p-6 rounded-lg ">
          <div className="flex gap-2">
            <Flame />
            <h2 className="text-xl font-semibold text-main-color mb-4">
              Top 5 Communities Member
            </h2>
          </div>

          {/* Bar Chart */}
          <Card className="bg-second border-none shadow-none z-0">
            <CardHeader className="text-white">
              {/* <CardTitle>Admin Analysis</CardTitle>
              <CardDescription>
                Tools For Analysis Top Community.
              </CardDescription> */}
            </CardHeader>
            <CardContent>
              <ChartContainer config={BarConfig}>
                <BarChart accessibilityLayer data={topCommunities}>
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(name) => name.slice(0, 10)}
                  />
                  <Bar
                    dataKey="member_count"
                    stackId="a"
                    fill="var(--color-commu)"
                    radius={[4, 4, 0, 0]}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={false}
                    defaultIndex={-1}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="w-full mt-6">
        <div className="p-4 bg-second rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-lg font-medium">
              User Registrations - Last {monthLimit} Months
            </h2>
            <select
              value={monthLimit}
              onChange={(e) => setMonthLimit(parseInt(e.target.value))}
              className="bg-second text-white rounded p-1 text-sm border border-gray-700">
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
            </select>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statRegis}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                barSize={20}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF" }}
                />
                <Bar
                  dataKey="count"
                  name="New Users"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
