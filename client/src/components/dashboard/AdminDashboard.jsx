import React, { useState, useEffect } from 'react';
import { Coffee, ShoppingBag, DollarSign, Users, TrendingUp, TrendingDown, Eye, MoreHorizontal, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('daily');


 const [salesData, setSalesData] = useState([]);
  const [stats, setStats] = useState({
    totalOrder: { value: 0, change: 0, isPositive: true },
    newCustomer: { value: 0, change: 0, isPositive: true },
    totalSales: { value: 0, change: 0, isPositive: true },
    todaySales: { value: 0, change: 0, isPositive: true },
    monthlySales: { value: 0, change: 0, isPositive: true },
    totalCustomers: { value: 0, change: 0, isPositive: true }
  });

  const [trendingCoffee, setTrendingCoffee] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
 const API_BASE_URL = 'http://localhost:5000';


  // Generate mock sales data for chart
  useEffect(() => {
    const generateSalesData = () => {
      const data = [];
      const timePoints = timeFilter === 'daily' ?
        ['09:00', '12:00', '15:00', '18:00', '21:00'] :
        timeFilter === 'weekly' ?
        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
        ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

      timePoints.forEach((time, index) => {
        data.push({
          time,
          value: Math.floor(Math.random() * 200) + 50,
          x: (index / (timePoints.length - 1)) * 100
        });
      });
      setSalesData(data);
    };

    generateSalesData();
  }, [timeFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-amber-100 text-amber-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'preparing': return <Clock className="w-3 h-3" />;
      case 'ready': return <Coffee className="w-3 h-3" />;
      case 'pending': return <AlertCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const maxValue = Math.max(...salesData.map(d => d.value));

  return (
    <div className="min-h-screen p-6" style={{
      backgroundColor: '#f8f6f3',
      fontFamily: 'var(--font-urbanist, "Urbanist", sans-serif)'
    }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1b1a1a' }}>
          AdminDashboard Overview
        </h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your coffee shop today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: '#f3f0ed' }}>
              <ShoppingBag className="w-6 h-6" style={{ color: '#dbad6a' }} />
            </div>
            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              stats.totalOrder.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {stats.totalOrder.isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              +{stats.totalOrder.change}%
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Orders</p>
            <p className="text-3xl font-bold" style={{ color: '#1b1a1a' }}>
              {stats.totalOrder.value.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: '#f3f0ed' }}>
              <Users className="w-6 h-6" style={{ color: '#dbad6a' }} />
            </div>
            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              stats.newCustomer.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {stats.newCustomer.isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              +{stats.newCustomer.change}%
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">New Customers</p>
            <p className="text-3xl font-bold" style={{ color: '#1b1a1a' }}>
              {stats.newCustomer.value.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: '#f3f0ed' }}>
              <DollarSign className="w-6 h-6" style={{ color: '#dbad6a' }} />
            </div>
            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              stats.totalSales.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {stats.totalSales.isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              +{stats.totalSales.change}%
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Sales</p>
            <p className="text-3xl font-bold" style={{ color: '#1b1a1a' }}>
              ${stats.totalSales.value.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: '#f3f0ed' }}>
              <Calendar className="w-6 h-6" style={{ color: '#dbad6a' }} />
            </div>
            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              stats.todaySales.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {stats.todaySales.isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              +{stats.todaySales.change}%
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Today Sales</p>
            <p className="text-3xl font-bold" style={{ color: '#1b1a1a' }}>
              ${stats.todaySales.value.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: '#f3f0ed' }}>
              <TrendingUp className="w-6 h-6" style={{ color: '#dbad6a' }} />
            </div>
            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              stats.monthlySales.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {stats.monthlySales.isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              +{stats.monthlySales.change}%
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Monthly Sales</p>
            <p className="text-3xl font-bold" style={{ color: '#1b1a1a' }}>
              ${stats.monthlySales.value.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: '#f3f0ed' }}>
              <Users className="w-6 h-6" style={{ color: '#dbad6a' }} />
            </div>
            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              stats.totalCustomers.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {stats.totalCustomers.isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              +{stats.totalCustomers.change}%
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Customers</p>
            <p className="text-3xl font-bold" style={{ color: '#1b1a1a' }}>
              {stats.totalCustomers.value.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Analytics */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold" style={{ color: '#1b1a1a' }}>Sales Analytics</h3>
            <div className="flex gap-2">
              {['daily', 'weekly', 'monthly'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    timeFilter === filter
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  style={{
                    backgroundColor: timeFilter === filter ? '#dbad6a' : 'transparent'
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="relative h-64">
            <svg width="100%" height="100%" className="overflow-visible">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="0"
                  y1={`${(i / 4) * 100}%`}
                  x2="100%"
                  y2={`${(i / 4) * 100}%`}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
              ))}

              {/* Chart area */}
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#dbad6a" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#dbad6a" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Area */}
              <path
                d={`M 0,${100 - (salesData[0]?.value / maxValue * 80 || 0)} ${salesData.map((point, index) =>
                  `L ${point.x},${100 - (point.value / maxValue * 80)}`
                ).join(' ')} L 100,100 L 0,100 Z`}
                fill="url(#chartGradient)"
              />

              {/* Line */}
              <path
                d={`M 0,${100 - (salesData[0]?.value / maxValue * 80 || 0)} ${salesData.map((point) =>
                  `L ${point.x},${100 - (point.value / maxValue * 80)}`
                ).join(' ')}`}
                fill="none"
                stroke="#dbad6a"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Points */}
              {salesData.map((point, index) => (
                <circle
                  key={index}
                  cx={`${point.x}%`}
                  cy={`${100 - (point.value / maxValue * 80)}%`}
                  r="4"
                  fill="#dbad6a"
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between mt-4 text-sm text-gray-600">
              {salesData.map((point, index) => (
                <span key={index}>{point.time}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Trending Coffee */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold" style={{ color: '#1b1a1a' }}>Trending Coffee</h3>
            <button className="text-sm" style={{ color: '#dbad6a' }}>See all</button>
          </div>

          <div className="space-y-4">
            {trendingCoffee.map((coffee) => (
              <div key={coffee.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                       style={{ backgroundColor: '#f3f0ed' }}>
                    {coffee.image}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: '#1b1a1a' }}>{coffee.name}</p>
                    <p className="text-sm text-gray-600">${coffee.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold" style={{ color: '#1b1a1a' }}>{coffee.orders}</p>
                  <div className="w-16 h-1 rounded-full mt-1" style={{ backgroundColor: '#f3f0ed' }}>
                    <div
                      className="h-1 rounded-full"
                      style={{
                        backgroundColor: '#dbad6a',
                        width: `${(coffee.orders / 240) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold" style={{ color: '#1b1a1a' }}>Recent Orders</h3>
          <button className="text-sm" style={{ color: '#dbad6a' }}>See all</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-600">#</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Items</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date & Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Table Number</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Payment</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                           style={{ backgroundColor: '#f3f0ed' }}>
                        ☕
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: '#1b1a1a' }}>{order.item}</p>
                        <p className="text-sm text-gray-500">{order.orderCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{order.date}</td>
                  <td className="py-4 px-4 text-sm font-medium" style={{ color: '#1b1a1a' }}>{order.table}</td>
                  <td className="py-4 px-4 text-sm font-medium" style={{ color: '#1b1a1a' }}>${order.price}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{order.payment}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;