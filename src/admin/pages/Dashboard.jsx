import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    products: 0,
    orders: 0,
    users: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    satisfaction: 4.8
  });
  const [deliveryStatus, setDeliveryStatus] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          axios.get("http://localhost:5000/Products"),
          axios.get("http://localhost:5000/orders"),
          axios.get("http://localhost:5000/users")
        ]);

        // Calculate metrics
        const totalRevenue = ordersRes.data.reduce((sum, order) => sum + order.total, 0);
        const avgOrderValue = ordersRes.data.length > 0 
          ? totalRevenue / ordersRes.data.length 
          : 0;
        
        // Calculate delivery status (mock calculation - adjust based on your actual data)
        const statusCounts = {
          Delivered: ordersRes.data.filter(o => o.status === "Delivered").length,
          Pending: ordersRes.data.filter(o => !o.status || o.status === "Pending").length,
          Cancelled: ordersRes.data.filter(o => o.status === "Cancelled").length
        };

        // Calculate weekly revenue (mock - you might want to implement this properly)
        const today = new Date();
        const lastWeek = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - 6 + i);
          return {
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            revenue: Math.floor(Math.random() * 30000) + 10000 // Replace with actual calculation
          };
        });

        setMetrics({
          products: productsRes.data.length,
          orders: ordersRes.data.length,
          users: usersRes.data.length,
          totalRevenue,
          avgOrderValue,
          conversionRate: 3.2, // This would need actual calculation
          satisfaction: 4.8 // This would come from reviews/ratings
        });

        setDeliveryStatus([
          { name: "Delivered", value: statusCounts.Delivered, color: "#10b981" },
          { name: "Pending", value: statusCounts.Pending, color: "#f59e0b" },
          { name: "Cancelled", value: statusCounts.Cancelled, color: "#ef4444" }
        ]);

        setWeeklyRevenue(lastWeek);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Custom label function for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h2>

      {/* All Metrics in a Single Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Products</h3>
              <p className="text-3xl font-bold">{metrics.products}</p>
            </div>
            <div className="text-4xl opacity-80">📦</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Orders</h3>
              <p className="text-3xl font-bold">{metrics.orders}</p>
            </div>
            <div className="text-4xl opacity-80">🛒</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Users</h3>
              <p className="text-3xl font-bold">{metrics.users}</p>
            </div>
            <div className="text-4xl opacity-80">👤</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Total Revenue</h3>
              <p className="text-3xl font-bold">₹{metrics.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="text-4xl opacity-80">💰</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Redesigned Pie Chart for Delivery Status */}
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold text-gray-700 mb-6 flex items-center">
            <span className="mr-3">🚚</span>
            Delivery Status Overview
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={deliveryStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                innerRadius={60}
                paddingAngle={3}
                dataKey="value"
              >
                {deliveryStatus.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffffff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={60}
                iconType="circle"
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart for Last Week Revenue */}
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold text-gray-700 mb-6 flex items-center">
            <span className="mr-3">📊</span>
            Last Week Revenue
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={weeklyRevenue}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(value) => `₹${value/1000}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                labelStyle={{ color: '#d1d5db' }}
              />
              <Bar 
                dataKey="revenue" 
                radius={[4, 4, 0, 0]}
                fill="url(#colorGradient)"
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={1}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      
    </div>
  );
}