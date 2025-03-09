// "use client";
// import React, { useEffect, useState } from "react";
// import { DollarSign, ShoppingCart, Users, CreditCard } from "lucide-react";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";


// const Dashboard = () => {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
  
//     useEffect(() => {
//       const fetchProducts = async () => {
//         try {
//           setLoading(true);
//           const response = await fetch("/api/getPurchases");
  
//           if (!response.ok) {
//             throw new Error("Failed to fetch products");
//           }
  
//           const data = await response.json();
//           setProducts(data.products || []);
//         } catch (err) {
//           setError(err.message);
//           console.error("Error fetching products:", err);
//         } finally {
//           setLoading(false);
//         }
//       };
  
//       fetchProducts();
//     }, []);
  
//     console.log(products)
//     // 🧮 Calculate stats
//     const totalRevenue = products.reduce((sum, product) => sum + (product.totalAmount || 0), 0);
//     const totalOrders = products.length;
//     const totalCustomers = new Set(products.map(p => p.userId)).size;
//     const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;
  
//     // 📊 Prepare Data for Charts
//     const revenueData = products.map((p, index) => ({
//       day: `Day ${index + 1}`,
//       revenue: p.totalAmount || 0,
//     }));
  
//     const orderCustomerData = [
//       { name: "Orders", value: totalOrders },
//       { name: "Customers", value: totalCustomers },
//     ];
  
//     const COLORS = ["#3F72AF", "#F9A826"];
  
//     if (loading) return <p className="text-center text-lg font-semibold">Loading dashboard...</p>;
//     if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  
//     return (
//       <div className="p-6 bg-gray-100 min-h-screen">
//         {/* Header */}
//         <h2 className="text-2xl font-bold">Dashboard</h2>
//         <p className="text-gray-600 mb-6">Welcome back to your admin panel</p>
  
//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} change="+16% from last month" icon={<DollarSign className="text-blue-600" />} bgColor="bg-blue-100" textColor="text-green-600" />
//           <StatCard title="Total Orders" value={totalOrders} change="+12% from last month" icon={<ShoppingCart className="text-purple-600" />} bgColor="bg-purple-100" textColor="text-green-600" />
//           <StatCard title="Total Customers" value={totalCustomers} change="+9% from last month" icon={<Users className="text-orange-600" />} bgColor="bg-orange-100" textColor="text-green-600" />
//           <StatCard title="Avg. Order Value" value={`₹${avgOrderValue}`} change="-2% from last month" icon={<CreditCard className="text-green-600" />} bgColor="bg-green-100" textColor="text-red-600" />
//         </div>
  
//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
//           {/* Revenue Trend Line Chart */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h3 className="text-xl font-bold mb-4">Revenue Trend</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={revenueData}>
//                 <XAxis dataKey="day" />
//                 <YAxis />
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="revenue" stroke="#3F72AF" strokeWidth={3} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
  
//           {/* Orders vs Customers Pie Chart */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h3 className="text-xl font-bold mb-4">Orders vs Customers</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie data={orderCustomerData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value">
//                   {orderCustomerData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     );
//   };
  
//   // 📌 Reusable Stat Card Component
//   const StatCard = ({ title, value, change, icon, bgColor, textColor }) => {
//     return (
//       <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
//         <div>
//           <h3 className="text-gray-600">{title}</h3>
//           <p className="text-2xl font-bold">{value}</p>
//           <p className={`text-sm ${textColor}`}>{change}</p>
//         </div>
//         <div className={`p-3 rounded-full ${bgColor}`}>{icon}</div>
//       </div>
//     );
//   };
  
//   export default Dashboard;
"use client";
import React, { useEffect, useState } from "react";
import { DollarSign, ShoppingCart, Users, CreditCard, Package } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/getPurchases");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Calculate stats
  const totalRevenue = products.reduce((sum, product) => sum + (product.totalAmount || 0), 0);
  const totalOrders = products.length;
  const totalCustomers = new Set(products.map(p => p.userId)).size;
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

  // Prepare Data for Charts
  const revenueData = products.map((p, index) => ({
    day: `Day ${index + 1}`,
    revenue: p.totalAmount || 0,
  }));

  const orderCustomerData = [
    { name: "Orders", value: totalOrders },
    { name: "Customers", value: totalCustomers },
  ];

  const COLORS = ["#3F72AF", "#F9A826"];

  const updateStatus = (orderId, newStatus) => {
    setProducts(prevProducts =>
      prevProducts.map(order =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Get order status counts for status chart
  const statusCounts = products.reduce((acc, order) => {
    const status = order.status || "Pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }));

  const STATUS_COLORS = {
    "Pending": "#FFB74D",
    "Dispatched": "#42A5F5",
    "Delivered": "#66BB6A",
    "Cancelled": "#EF5350"
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
        <p className="text-lg font-semibold text-gray-700">Loading dashboard...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <p className="text-xl font-bold text-red-600 mb-2">Error</p>
        <p className="text-gray-700">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back to your admin panel</p>
            </div>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition">
                Export Data
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                New Order
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button 
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview" 
                    ? "border-blue-500 text-blue-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button 
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "orders" 
                    ? "border-blue-500 text-blue-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("orders")}
              >
                Orders
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="Total Revenue" 
                value={`₹${totalRevenue.toLocaleString()}`} 
                change="+16% from last month" 
                icon={<DollarSign className="text-blue-600" />} 
                bgColor="bg-blue-100" 
                textColor="text-green-600" 
              />
              <StatCard 
                title="Total Orders" 
                value={totalOrders} 
                change="+12% from last month" 
                icon={<ShoppingCart className="text-purple-600" />} 
                bgColor="bg-purple-100" 
                textColor="text-green-600" 
              />
              <StatCard 
                title="Total Customers" 
                value={totalCustomers} 
                change="+9% from last month" 
                icon={<Users className="text-orange-600" />} 
                bgColor="bg-orange-100" 
                textColor="text-green-600" 
              />
              <StatCard 
                title="Avg. Order Value" 
                value={`₹${avgOrderValue}`} 
                change="-2% from last month" 
                icon={<CreditCard className="text-green-600" />} 
                bgColor="bg-green-100" 
                textColor="text-red-600" 
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Trend Line Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Revenue Trend</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "white", borderRadius: "0.5rem", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", border: "none" }}
                        formatter={(value) => [`₹${value}`, "Revenue"]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3F72AF" 
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: "#3F72AF" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Order Status Pie Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Order Status</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={statusData} 
                        cx="50%" 
                        cy="50%" 
                        labelLine={false}
                        outerRadius={110} 
                        fill="#8884d8" 
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [value, "Orders"]}
                        contentStyle={{ backgroundColor: "white", borderRadius: "0.5rem", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", border: "none" }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
                <button 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  onClick={() => setActiveTab("orders")}
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="p-3 text-gray-600 text-sm font-medium">Order ID</th>
                      <th className="p-3 text-gray-600 text-sm font-medium">User ID</th>
                      <th className="p-3 text-gray-600 text-sm font-medium">Date</th>
                      <th className="p-3 text-gray-600 text-sm font-medium">Amount</th>
                      <th className="p-3 text-gray-600 text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.slice(0, 5).map(order => (
                      <tr key={order.orderId} className="hover:bg-gray-50">
                        <td className="p-3 text-gray-900">#{order.orderId}</td>
                        <td className="p-3 text-gray-600">{order.userId}</td>
                        <td className="p-3 text-gray-600">{order.date}</td>
                        <td className="p-3 text-gray-900 font-medium">₹{order.totalAmount}</td>
                        <td className="p-3">
                          <StatusBadge status={order.status || "Pending"} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          // Orders Tab
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6 text-gray-800">All Orders</h3>
            
            {/* Orders Filter */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="w-64">
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="w-48">
                <select className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Filter by status</option>
                  <option value="Pending">Pending</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                Apply Filters
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-left border-b">
                    <th className="p-4 text-gray-600 font-medium">Order ID</th>
                    <th className="p-4 text-gray-600 font-medium">User ID</th>
                    <th className="p-4 text-gray-600 font-medium">Date</th>
                    <th className="p-4 text-gray-600 font-medium">Total Amount</th>
                    <th className="p-4 text-gray-600 font-medium">Status</th>
                    <th className="p-4 text-gray-600 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map(order => (
                    <tr key={order.orderId} className="hover:bg-gray-50">
                      <td className="p-4 text-gray-900">#{order.orderId}</td>
                      <td className="p-4 text-gray-600">{order.userId}</td>
                      <td className="p-4 text-gray-600">{order.date || "N/A"}</td>
                      <td className="p-4 text-gray-900 font-medium">₹{order.totalAmount}</td>
                      <td className="p-4">
                        <select
                          className="border border-gray-300 p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={order.status || "Pending"}
                          onChange={(e) => updateStatus(order.orderId, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button className="p-1 text-blue-600 hover:text-blue-800">
                            <Package size={18} />
                          </button>
                          <button className="p-1 text-gray-600 hover:text-gray-800">
                            <DollarSign size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <p className="text-gray-600 text-sm">
                Showing <span className="font-medium">{products.length}</span> orders
              </p>
              <div className="flex space-x-1">
                <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 border border-blue-500 rounded-md bg-blue-500 text-white hover:bg-blue-600">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Components
const StatCard = ({ title, value, change, icon, bgColor, textColor }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-600">{title}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900">{value}</p>
          <p className={`text-sm mt-2 ${textColor}`}>{change}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>{icon}</div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch(status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Dispatched":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {status}
    </span>
  );
};

export default Dashboard;