import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Users, 
  DollarSign, 
  Brain, 
  TrendingUp,
  UserPlus,
  CreditCard,
  MessageSquare,
  BookOpen,
  BarChart3,
  PieChart,
  Calendar,
  Activity
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AdminDashboardProps {
  user: any;
  session: any;
}

interface AdminStats {
  totalUsers: number;
  freeUsers: number;
  paidUsers: number;
  questionsToday: number;
  revenue: number;
  popularSubjects: Array<{
    subject: string;
    count: number;
  }>;
}

export function AdminDashboard({ user, session }: AdminDashboardProps) {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    freeUsers: 0,
    paidUsers: 0,
    questionsToday: 0,
    revenue: 0,
    popularSubjects: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    console.log('Using mock admin stats for development mode');
    
    // Create mock admin statistics
    const mockStats: AdminStats = {
      totalUsers: 1247,
      freeUsers: 956,
      paidUsers: 291,
      questionsToday: 342,
      revenue: 8450.50,
      popularSubjects: [
        { subject: 'Mathematics', count: 145 },
        { subject: 'Physics', count: 98 },
        { subject: 'Chemistry', count: 76 },
        { subject: 'Computer Science', count: 65 },
        { subject: 'French', count: 54 }
      ]
    };

    setStats(mockStats);
    setLoading(false);
  };

  const recentActivities = [
    { type: 'user_signup', user: 'Marie Dubois', time: '2 minutes ago', level: 'Terminale' },
    { type: 'subscription', user: 'Jean Martin', time: '5 minutes ago', plan: 'Premium' },
    { type: 'question', user: 'Sophie Laurent', time: '8 minutes ago', subject: 'Mathematics' },
    { type: 'user_signup', user: 'Pierre Durand', time: '12 minutes ago', level: 'BTS SIO' },
    { type: 'question', user: 'Emma Moreau', time: '15 minutes ago', subject: 'Physics' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-500 via-red-600 to-orange-500 p-8 rounded-2xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl text-white font-bold mb-2">Admin Dashboard</h2>
            <p className="text-red-100 mb-4">Monitor your E-petitpas IA School platform performance</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span className="text-sm">{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span className="text-sm">System: Online</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <BarChart3 className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Total Users</p>
              <p className="text-3xl text-blue-900 font-bold">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-blue-600 mt-1">+12% from last month</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Paid Users</p>
              <p className="text-3xl text-green-900 font-bold">{stats.paidUsers.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">{((stats.paidUsers / stats.totalUsers) * 100).toFixed(1)}% conversion</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium">Monthly Revenue</p>
              <p className="text-3xl text-purple-900 font-bold">€{stats.revenue.toLocaleString()}</p>
              <p className="text-xs text-purple-600 mt-1">+8.3% from last month</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 font-medium">Questions Today</p>
              <p className="text-3xl text-orange-900 font-bold">{stats.questionsToday.toLocaleString()}</p>
              <p className="text-xs text-orange-600 mt-1">AI interactions</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg text-gray-900 font-semibold">User Growth</h3>
            <Badge variant="outline" className="text-green-600 border-green-300">
              +15.2% this month
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Free Users</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(stats.freeUsers / stats.totalUsers) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-900 font-medium">{stats.freeUsers}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Standard Plan</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '35%' }} />
                </div>
                <span className="text-sm text-gray-900 font-medium">247</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Premium Plan</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '25%' }} />
                </div>
                <span className="text-sm text-gray-900 font-medium">156</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pro Plan</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '15%' }} />
                </div>
                <span className="text-sm text-gray-900 font-medium">89</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Most Requested Subjects */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg text-gray-900 font-semibold">Most Requested Subjects</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {stats.popularSubjects.map((subject, index) => (
              <div key={subject.subject} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    index === 0 ? 'bg-yellow-100 text-yellow-600' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    index === 2 ? 'bg-orange-100 text-orange-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <span className="text-sm font-semibold">#{index + 1}</span>
                  </div>
                  <span className="text-sm text-gray-700">{subject.subject}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {subject.count} questions
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg text-gray-900 font-semibold">Recent Activity</h3>
          <Button variant="outline" size="sm">
            View All Logs
          </Button>
        </div>
        
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === 'user_signup' ? 'bg-green-100 text-green-600' :
                activity.type === 'subscription' ? 'bg-purple-100 text-purple-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {activity.type === 'user_signup' ? <UserPlus className="w-4 h-4" /> :
                 activity.type === 'subscription' ? <CreditCard className="w-4 h-4" /> :
                 <Brain className="w-4 h-4" />}
              </div>
              
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span>
                  {activity.type === 'user_signup' && ' signed up'} 
                  {activity.type === 'subscription' && ` upgraded to ${activity.plan}`}
                  {activity.type === 'question' && ` asked a question about ${activity.subject}`}
                  {activity.level && ` (${activity.level})`}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              
              {activity.type === 'user_signup' && (
                <Badge variant="outline" className="text-green-600 border-green-300">
                  New User
                </Badge>
              )}
              {activity.type === 'subscription' && (
                <Badge variant="outline" className="text-purple-600 border-purple-300">
                  Upgrade
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Button className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
          <Users className="w-5 h-5 mr-2" />
          Manage Users
        </Button>
        
        <Button className="h-16 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
          <CreditCard className="w-5 h-5 mr-2" />
          View Subscriptions
        </Button>
        
        <Button className="h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
          <BarChart3 className="w-5 h-5 mr-2" />
          Analytics Report
        </Button>
      </div>
    </div>
  );
}