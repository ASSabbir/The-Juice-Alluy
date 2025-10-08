import React, { useState, useEffect } from 'react';
import { Coffee, ShoppingBag, DollarSign, Users, TrendingUp, TrendingDown, MoreHorizontal, Calendar, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TbCurrencyTaka } from "react-icons/tb";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('daily');
  const [salesData, setSalesData] = useState({ labels: [], values: [] });
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (recentOrders.length > 0 || !loading) {
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

      const allOrders = [...pendingOrders, ...progressOrders, ...completedOrders];
      const allOrdersWithRejected = [...allOrders, ...rejectedOrders];

      calculateStats(allOrders, allOrdersWithRejected, users);
      calculateTrendingCoffee(allOrders, coffees);
      formatRecentOrders(allOrdersWithRejected);
      generateSalesChartFromOrders(allOrders);

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

    const totalOrders = orders.length;

    const todayOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= today;
    });
    const todaySales = todayOrders.reduce((sum, order) => sum + (parseFloat(order.grandTotal) || 0), 0);

    const yesterdayOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= yesterday && orderDate < today;
    });
    const yesterdaySales = yesterdayOrders.reduce((sum, order) => sum + (parseFloat(order.grandTotal) || 0), 0);
    const todaySalesChange = yesterdaySales > 0 ? ((todaySales - yesterdaySales) / yesterdaySales * 100).toFixed(2) : 0;

    const monthlyOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= startOfMonth;
    });
    const monthlySales = monthlyOrders.reduce((sum, order) => sum + (parseFloat(order.grandTotal) || 0), 0);

    const lastMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= startOfLastMonth && orderDate <= endOfLastMonth;
    });
    const lastMonthSales = lastMonthOrders.reduce((sum, order) => sum + (parseFloat(order.grandTotal) || 0), 0);
    const monthlySalesChange = lastMonthSales > 0 ? ((monthlySales - lastMonthSales) / lastMonthSales * 100).toFixed(2) : 0;

    const totalSales = orders.reduce((sum, order) => sum + (parseFloat(order.grandTotal) || 0), 0);
    const totalCustomers = users.length;

    const newCustomers = users.filter(user => {
      if (!user.createdAt) return false;
      const userDate = new Date(user.createdAt);
      return userDate >= startOfMonth;
    }).length;

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
    const itemCount = {};
    const coffeeMap = {};

    coffees.forEach(coffee => {
      coffeeMap[coffee._id] = coffee;
    });

    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const itemId = item.id || item._id || item.coffeeId;
          if (itemId) {
            if (!itemCount[itemId]) {
              const coffeeData = coffeeMap[itemId];
              itemCount[itemId] = {
                id: itemId,
                name: item.name || coffeeData?.name || coffeeData?.title || 'Unknown Item',
                price: parseFloat(item.price) || parseFloat(coffeeData?.price) || 0,
                orders: 0,
                image: coffeeData?.image || '☕'
              };
            }
            itemCount[itemId].orders += item.quantity || 1;
          }
        });
      }
    });

    const trending = Object.values(itemCount)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);

    setTrendingCoffee(trending);
  };

  const formatRecentOrders = (orders) => {
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

  const generateSalesChartFromOrders = (orders) => {
    const now = new Date();
    let labels = [];
    let values = [];

    if (timeFilter === 'daily') {
      labels = ['09:00', '12:00', '15:00', '18:00', '21:00'];
      const hourlyData = {};

      labels.forEach(label => {
        hourlyData[label] = 0;
      });

      orders.forEach(order => {
        const orderDate = new Date(order.orderDate);
        const orderHour = orderDate.getHours();
        const orderMinutes = orderDate.getMinutes();
        const timeKey = `${orderHour.toString().padStart(2, '0')}:${orderMinutes < 30 ? '00' : '00'}`;

        const closestLabel = labels.reduce((prev, curr) => {
          const prevHour = parseInt(prev.split(':')[0]);
          const currHour = parseInt(curr.split(':')[0]);
          return Math.abs(currHour - orderHour) < Math.abs(prevHour - orderHour) ? curr : prev;
        });

        hourlyData[closestLabel] += parseFloat(order.grandTotal) || 0;
      });

      values = labels.map(label => hourlyData[label]);
    } else if (timeFilter === 'weekly') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const dailyData = {};

      labels.forEach(label => {
        dailyData[label] = 0;
      });

      orders.forEach(order => {
        const orderDate = new Date(order.orderDate);
        const dayIndex = orderDate.getDay();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayLabel = days[dayIndex];

        if (dailyData[dayLabel] !== undefined) {
          dailyData[dayLabel] += parseFloat(order.grandTotal) || 0;
        }
      });

      values = labels.map(label => dailyData[label]);
    } else {
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      const weeklyData = {};

      labels.forEach(label => {
        weeklyData[label] = 0;
      });

      orders.forEach(order => {
        const orderDate = new Date(order.orderDate);
        const dayOfMonth = orderDate.getDate();
        let weekLabel = '';

        if (dayOfMonth <= 7) weekLabel = 'Week 1';
        else if (dayOfMonth <= 14) weekLabel = 'Week 2';
        else if (dayOfMonth <= 21) weekLabel = 'Week 3';
        else weekLabel = 'Week 4';

        weeklyData[weekLabel] += parseFloat(order.grandTotal) || 0;
      });

      values = labels.map(label => weeklyData[label]);
    }

    setSalesData({ labels, values });
  };

  const generateSalesChart = () => {
    const now = new Date();
    let labels = [];
    let values = [];

    if (timeFilter === 'daily') {
      labels = ['09:00', '12:00', '15:00', '18:00', '21:00'];
      values = labels.map(() => Math.floor(Math.random() * 200) + 50);
    } else if (timeFilter === 'weekly') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      values = labels.map(() => Math.floor(Math.random() * 200) + 50);
    } else {
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      values = labels.map(() => Math.floor(Math.random() * 200) + 50);
    }

    setSalesData({ labels, values });
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
              <TbCurrencyTaka className="text-2xl" /> {stats.totalSales.value.toFixed(2)}
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

          <div className="relative h-64">
            {salesData.labels.length > 0 ? (
              <Line
                data={{
                  labels: salesData.labels,
                  datasets: [
                    {
                      label: 'Sales ($)',
                      data: salesData.values,
                      borderColor: '#dbad6a',
                      backgroundColor: 'rgba(219, 173, 106, 0.1)',
                      fill: true,
                      tension: 0.4,
                      pointRadius: 4,
                      pointBackgroundColor: '#dbad6a',
                      pointBorderColor: '#fff',
                      pointBorderWidth: 2,
                      pointHoverRadius: 6,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      backgroundColor: '#1b1a1a',
                      padding: 12,
                      titleColor: '#fff',
                      bodyColor: '#fff',
                      borderColor: '#dbad6a',
                      borderWidth: 1,
                      displayColors: false,
                      callbacks: {
                        label: function(context) {
                          return `Sales: $${context.parsed.y.toFixed(2)}`;
                        }
                      }
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: '#6b7280',
                        font: {
                          size: 12,
                        },
                      },
                    },
                    y: {
                      grid: {
                        color: '#f3f4f6',
                        drawBorder: false,
                      },
                      ticks: {
                        color: '#6b7280',
                        font: {
                          size: 12,
                        },
                        callback: function(value) {
                          return '$' + value;
                        }
                      },
                    },
                  },
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No sales data available
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold" style={{ color: '#1b1a1a' }}>Trending Coffee</h3>
          </div>

          <div className="space-y-4">
            {trendingCoffee.length > 0 ? (
              trendingCoffee.map((coffee) => (
                <div key={coffee.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">

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