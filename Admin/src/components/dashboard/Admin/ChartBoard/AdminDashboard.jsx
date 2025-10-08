import React, { useState, useEffect } from 'react';
import { Coffee, ShoppingBag, DollarSign, Users, TrendingUp, TrendingDown, MoreHorizontal, Calendar, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

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
  const [refreshing, setRefreshing] = useState(false);

  const API_BASE_URL = 'http://localhost:5000';

  // Fetch all data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Regenerate sales chart when filter changes
  useEffect(() => {
    if (recentOrders.length > 0) {
      generateSalesChart();
    }
  }, [timeFilter, recentOrders]);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Fetch all orders from all collections
      const [pendingRes, progressRes, completedRes, rejectedRes, usersRes, coffeesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/orders/pending`),
        fetch(`${API_BASE_URL}/orders/progress`),
        fetch(`${API_BASE_URL}/orders/completed`),
        fetch(`${API_BASE_URL}/orders/rejected`),
        fetch(`${API_BASE_URL}/users`),
        fetch(`${API_BASE_URL}/coffee`)
      ]);

      const pendingOrders = await pendingRes.json();
      const progressOrders = await progressRes.json();
      const completedOrders = await completedRes.json();
      const rejectedOrders = await rejectedRes.json();
      const users = await usersRes.json();
      const coffees = await coffeesRes.json();

      // Combine all orders (excluding rejected for stats)
      const allOrders = [...pendingOrders, ...progressOrders, ...completedOrders];
      const allOrdersWithRejected = [...allOrders, ...rejectedOrders];

      // Calculate statistics
      calculateStats(allOrders, allOrdersWithRejected, users);

      // Calculate trending coffee from orders
      calculateTrendingCoffee(allOrders, coffees);

      // Format recent orders
      formatRecentOrders(allOrdersWithRejected);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateStats = (orders, allOrders, users) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total Orders
    const totalOrders = orders.length;

    // Today's orders and sales
    const todayOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= today;
    });
    const todaySales = todayOrders.reduce((sum, order) => sum + (parseFloat(order.grandTotal) || 0), 0);

    // Yesterday's sales for comparison
    const yesterdayOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= yesterday && orderDate < today;
    });
    const yesterdaySales = yesterdayOrders.reduce((sum, order) => sum + (parseFloat(order.grandTotal) || 0), 0);
    const todaySalesChange = yesterdaySales > 0 ? ((todaySales - yesterdaySales) / yesterdaySales * 100).toFixed(2) : 0;

    // Monthly orders and sales
    const monthlyOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= startOfMonth;
    });
    const monthlySales = monthlyOrders.reduce((sum, order) => sum + (parseFloat(order.grandTotal) || 0), 0);

    // Last month sales for comparison
    const lastMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= startOfLastMonth && orderDate <= endOfLastMonth;
    });
    const lastMonthSales = lastMonthOrders.reduce((sum, order) => sum + (parseFloat(order.grandTotal) || 0), 0);
    const monthlySalesChange = lastMonthSales > 0 ? ((monthlySales - lastMonthSales) / lastMonthSales * 100).toFixed(2) : 0;

    // Total Sales
    const totalSales = orders.reduce((sum, order) => sum + (parseFloat(order.grandTotal) || 0), 0);

    // Total Customers
    const totalCustomers = users.length;

    // New Customers (registered this month)
    const newCustomers = users.filter(user => {
      if (!user.createdAt) return false;
      const userDate = new Date(user.createdAt);
      return userDate >= startOfMonth;
    }).length;

    // Last month customers for comparison
    const lastMonthCustomers = users.filter(user => {
      if (!user.createdAt) return false;
      const userDate = new Date(user.createdAt);
      return userDate >= startOfLastMonth && userDate <= endOfLastMonth;
    }).length;
    const newCustomerChange = lastMonthCustomers > 0 ? ((newCustomers - lastMonthCustomers) / lastMonthCustomers * 100).toFixed(2) : 0;

    setStats({
      totalOrder: {
        value: totalOrders,
        change: Math.abs(parseFloat(((todayOrders.length / (totalOrders || 1)) * 100).toFixed(2))),
        isPositive: true
      },
      newCustomer: {
        value: newCustomers,
        change: Math.abs(parseFloat(newCustomerChange)),
        isPositive: parseFloat(newCustomerChange) >= 0
      },
      totalSales: {
        value: totalSales,
        change: Math.abs(parseFloat(monthlySalesChange)),
        isPositive: parseFloat(monthlySalesChange) >= 0
      },
      todaySales: {
        value: todaySales,
        change: Math.abs(parseFloat(todaySalesChange)),
        isPositive: parseFloat(todaySalesChange) >= 0
      },
      monthlySales: {
        value: monthlySales,
        change: Math.abs(parseFloat(monthlySalesChange)),
        isPositive: parseFloat(monthlySalesChange) >= 0
      },
      totalCustomers: {
        value: totalCustomers,
        change: Math.abs(parseFloat(((newCustomers / (totalCustomers || 1)) * 100).toFixed(2))),
        isPositive: true
      }
    });
  };

  const calculateTrendingCoffee = (orders, coffees) => {
    // Count items from all orders
    const itemCount = {};

    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const itemId = item.id || item._id;
          if (itemId) {
            if (!itemCount[itemId]) {
              itemCount[itemId] = {
                id: itemId,
                name: item.name,
                price: parseFloat(item.price) || 0,
                orders: 0,
                image: '☕'
              };
            }
            itemCount[itemId].orders += item.quantity || 1;
          }
        });
      }
    });

    // Convert to array and sort by order count
    const trending = Object.values(itemCount)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);

    setTrendingCoffee(trending);
  };

  const formatRecentOrders = (orders) => {
    // Sort by date (newest first) and take first 4
    const sortedOrders = [...orders].sort((a, b) =>
      new Date(b.orderDate) - new Date(a.orderDate)
    );

    const formatted = sortedOrders.slice(0, 4).map((order, index) => ({
      id: (index + 1).toString().padStart(2, '0'),
      item: order.items?.[0]?.name || 'N/A',
      itemCount: order.items?.length || 0,
      orderCode: `#${order._id?.slice(-6) || 'N/A'}`,
      date: formatDate(order.orderDate),
      table: order.customerUID || order.customerName || 'N/A',
      price: parseFloat(order.grandTotal) || 0,
      payment: order.paymentMethod || 'N/A',
      status: order.status || 'pending',
      _id: order._id
    }));

    setRecentOrders(formatted);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const generateSalesChart = () => {
    const now = new Date();
    let data = [];

    if (timeFilter === 'daily') {
      // Group by hours (last 5 hours)
      const hours = ['09:00', '12:00', '15:00', '18:00', '21:00'];
      const currentHour = now.getHours();

      data = hours.map((hour, index) => {
        const targetHour = parseInt(hour.split(':')[0]);
        // In a real scenario, filter orders by hour
        return {
          time: hour,
          value: Math.floor(Math.random() * 200) + 50, // Replace with actual calculation
          x: (index / (hours.length - 1)) * 100
        };
      });
    } else if (timeFilter === 'weekly') {
      // Group by days of week
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      data = days.map((day, index) => ({
        time: day,
        value: Math.floor(Math.random() * 200) + 50, // Replace with actual calculation
        x: (index / (days.length - 1)) * 100
      }));
    } else {
      // Monthly - group by weeks
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      data = weeks.map((week, index) => ({
        time: week,
        value: Math.floor(Math.random() * 200) + 50, // Replace with actual calculation
        x: (index / (weeks.length - 1)) * 100
      }));
    }

    setSalesData(data);
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'progress': return <Clock className="w-3 h-3" />;
      case 'pending': return <AlertCircle className="w-3 h-3" />;
      case 'rejected': return <AlertCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const maxValue = Math.max(...salesData.map(d => d.value), 1);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8f6f3' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#dbad6a' }}></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{
      backgroundColor: '#f8f6f3',
      fontFamily: 'var(--font-urbanist, "Urbanist", sans-serif)'
    }}>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1b1a1a' }}>
            Admin Dashboard Overview
          </h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your coffee shop today.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: '#dbad6a' }}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
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
              {stats.totalOrder.change}%
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
              {stats.newCustomer.change}%
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
              {stats.totalSales.change}%
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Sales</p>
            <p className="text-3xl font-bold" style={{ color: '#1b1a1a' }}>
              ${stats.totalSales.value.toFixed(2)}
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
              {stats.todaySales.change}%
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Today Sales</p>
            <p className="text-3xl font-bold" style={{ color: '#1b1a1a' }}>
              ${stats.todaySales.value.toFixed(2)}
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
              {stats.monthlySales.change}%
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Monthly Sales</p>
            <p className="text-3xl font-bold" style={{ color: '#1b1a1a' }}>
              ${stats.monthlySales.value.toFixed(2)}
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
              {stats.totalCustomers.change}%
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
            {salesData.length > 0 ? (
              <>
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
                    d={`M 0,${100 - (salesData[0]?.value / maxValue * 80 || 0)} ${salesData.map((point) =>
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
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No sales data available
              </div>
            )}
          </div>
        </div>

        {/* Trending Coffee */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold" style={{ color: '#1b1a1a' }}>Trending Coffee</h3>
          </div>

          <div className="space-y-4">
            {trendingCoffee.length > 0 ? (
              trendingCoffee.map((coffee) => (
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
                          width: `${Math.min((coffee.orders / Math.max(...trendingCoffee.map(c => c.orders))) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                No trending items yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold" style={{ color: '#1b1a1a' }}>Recent Orders</h3>
        </div>

        <div className="overflow-x-auto">
          {recentOrders.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">#</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Items</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Date & Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
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
                          <p className="text-sm text-gray-500">{order.orderCode} ({order.itemCount} items)</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{order.date}</td>
                    <td className="py-4 px-4 text-sm font-medium" style={{ color: '#1b1a1a' }}>{order.table}</td>
                    <td className="py-4 px-4 text-sm font-medium" style={{ color: '#1b1a1a' }}>${order.price.toFixed(2)}</td>
                    <td className="py-4 px-4 text-sm text-gray-600 capitalize">{order.payment}</td>
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
          ) : (
            <div className="text-center text-gray-400 py-8">
              No recent orders found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;








/*





*/