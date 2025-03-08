// AdminDashboard.jsx
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Line, 
  BarChart,
  Activity, 
  Package, 
  Users, 
  CreditCard, 
  DollarSign, 
  ShoppingCart, 
  MoreHorizontal, 
  Search, 
  Bell 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  // Mock data
  const recentOrders = [
    { id: '#3210', customer: 'John Doe', status: 'Delivered', date: '2025-03-07', total: '$120.50' },
    { id: '#3209', customer: 'Jane Smith', status: 'Processing', date: '2025-03-07', total: '$85.20' },
    { id: '#3208', customer: 'Robert Johnson', status: 'Pending', date: '2025-03-06', total: '$210.75' },
    { id: '#3207', customer: 'Emily Brown', status: 'Delivered', date: '2025-03-06', total: '$45.99' },
    { id: '#3206', customer: 'Michael Wilson', status: 'Cancelled', date: '2025-03-05', total: '$67.30' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">ShopAdmin</h2>
        </div>
        <div className="flex flex-col flex-1 p-4 space-y-2">
          <Button variant="ghost" className="justify-start">
            <BarChart className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="justify-start">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Orders
          </Button>
          <Button variant="ghost" className="justify-start">
            <Package className="mr-2 h-4 w-4" />
            Products
          </Button>
          <Button variant="ghost" className="justify-start">
            <Users className="mr-2 h-4 w-4" />
            Customers
          </Button>
          <Button variant="ghost" className="justify-start">
            <CreditCard className="mr-2 h-4 w-4" />
            Transactions
          </Button>
          <Button variant="ghost" className="justify-start">
            <Activity className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="/api/placeholder/32/32" alt="Avatar" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <BarChart className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center ml-auto space-x-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-64 pl-8"
                />
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/api/placeholder/32/32" alt="Avatar" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Welcome back to your admin panel</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                    <h3 className="text-2xl font-bold">$12,426</h3>
                    <p className="text-green-500 text-sm">+16% from last month</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Orders</p>
                    <h3 className="text-2xl font-bold">142</h3>
                    <p className="text-green-500 text-sm">+12% from last month</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <ShoppingCart className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Customers</p>
                    <h3 className="text-2xl font-bold">89</h3>
                    <p className="text-green-500 text-sm">+9% from last month</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Avg. Order Value</p>
                    <h3 className="text-2xl font-bold">$87.50</h3>
                    <p className="text-red-500 text-sm">-2% from last month</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <CreditCard className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="orders" className="mb-6">
            <TabsList>
              <TabsTrigger value="orders">Recent Orders</TabsTrigger>
              <TabsTrigger value="products">Popular Products</TabsTrigger>
              <TabsTrigger value="customers">New Customers</TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>You have {recentOrders.length} new orders today</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === 'Delivered'
                                  ? 'default'
                                  : order.status === 'Processing'
                                  ? 'secondary'
                                  : order.status === 'Pending'
                                  ? 'outline'
                                  : 'destructive'
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>{order.total}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View details</DropdownMenuItem>
                                <DropdownMenuItem>Update status</DropdownMenuItem>
                                <DropdownMenuItem>Contact customer</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="products" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Products</CardTitle>
                  <CardDescription>Your top selling products this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-4 text-gray-500">Product list content goes here</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="customers" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>New Customers</CardTitle>
                  <CardDescription>Recently registered customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-4 text-gray-500">Customer list content goes here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}