import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Activity,
  Calendar,
  BarChart3
} from 'lucide-react';

const DashboardContent: React.FC = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      title: 'Active Users',
      value: '2,350',
      change: '+15.3%',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+7.2%',
      changeType: 'positive',
      icon: ShoppingCart,
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '-2.1%',
      changeType: 'negative',
      icon: TrendingUp,
    },
  ];

  const recentActivity = [
    {
      title: 'New order from Sarah Johnson',
      description: 'Order #3847 - $89.99',
      time: '2 minutes ago',
      type: 'order',
    },
    {
      title: 'User registration',
      description: 'Mike Chen created an account',
      time: '5 minutes ago',
      type: 'user',
    },
    {
      title: 'Payment received',
      description: 'Invoice #2847 - $299.99',
      time: '1 hour ago',
      type: 'payment',
    },
    {
      title: 'Product review',
      description: 'New 5-star review on Premium Plan',
      time: '2 hours ago',
      type: 'review',
    },
  ];

  const projects = [
    {
      name: 'Website Redesign',
      progress: 75,
      status: 'In Progress',
      dueDate: '2024-02-15',
    },
    {
      name: 'Mobile App Development',
      progress: 45,
      status: 'In Progress',
      dueDate: '2024-03-01',
    },
    {
      name: 'API Integration',
      progress: 90,
      status: 'Near Completion',
      dueDate: '2024-01-30',
    },
    {
      name: 'Database Migration',
      progress: 30,
      status: 'Planning',
      dueDate: '2024-04-15',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Welcome back, John!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center space-x-2 mt-2">
                <Badge 
                  variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
                <span className="text-xs text-gray-500">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest updates from your dashboard
                </CardDescription>
              </div>
              <Badge variant="secondary">Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Project Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Project Progress
            </CardTitle>
            <CardDescription>
              Track your ongoing projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {projects.map((project, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {project.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge 
                        variant={
                          project.status === 'Near Completion' ? 'default' :
                          project.status === 'In Progress' ? 'secondary' : 'outline'
                        }
                        className="text-xs"
                      >
                        {project.status}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {project.dueDate}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {project.progress}%
                  </span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Additional Content Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
          <CardDescription>
            Detailed insights and metrics for your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Chart visualization would go here</p>
              <p className="text-sm text-gray-400 mt-2">Connect your analytics to see detailed insights</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;