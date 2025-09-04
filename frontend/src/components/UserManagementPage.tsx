import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { 
  Users, 
  Search, 
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Trash2,
  Eye,
  Mail,
  Calendar,
  CreditCard,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from '../utils/supabase/client';

interface UserManagementPageProps {
  user: any;
  session: any;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  academic_level?: string;
  plan: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  last_login?: string;
  questions_count: number;
}

export function UserManagementPage({ user, session }: UserManagementPageProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // For development, create mock data
      const mockUsers: UserProfile[] = [
        {
          id: '1',
          email: 'marie.dubois@email.com',
          name: 'Marie Dubois',
          role: 'student',
          academic_level: 'Terminale',
          plan: 'Premium',
          status: 'active',
          created_at: '2024-01-15T08:00:00Z',
          last_login: '2024-01-20T14:30:00Z',
          questions_count: 127
        },
        {
          id: '2',
          email: 'jean.martin@email.com',
          name: 'Jean Martin',
          role: 'student',
          academic_level: 'BTS SIO',
          plan: 'Standard',
          status: 'active',
          created_at: '2024-01-10T10:15:00Z',
          last_login: '2024-01-19T16:45:00Z',
          questions_count: 89
        },
        {
          id: '3',
          email: 'sophie.laurent@email.com',
          name: 'Sophie Laurent',
          role: 'student',
          academic_level: '6ème',
          plan: 'Free',
          status: 'active',
          created_at: '2024-01-18T12:00:00Z',
          last_login: '2024-01-20T09:20:00Z',
          questions_count: 23
        },
        {
          id: '4',
          email: 'pierre.durand@email.com',
          name: 'Pierre Durand',
          role: 'student',
          academic_level: 'DWWM',
          plan: 'Pro',
          status: 'inactive',
          created_at: '2024-01-05T14:30:00Z',
          last_login: '2024-01-15T11:00:00Z',
          questions_count: 256
        }
      ];

      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserAction = async (userId: string, action: 'activate' | 'deactivate' | 'delete') => {
    // Mock action for now
    console.log(`${action} user ${userId}`);
    
    if (action === 'delete') {
      if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        setUsers(users.filter(u => u.id !== userId));
      }
    } else {
      const newStatus = action === 'activate' ? 'active' : 'inactive';
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus as any } : u));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Inactive</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'Pro':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Pro</Badge>;
      case 'Premium':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Premium</Badge>;
      case 'Standard':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-300">Standard</Badge>;
      case 'Free':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Free</Badge>;
      default:
        return <Badge variant="outline">{plan}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Total Users</p>
              <p className="text-2xl text-blue-900 font-semibold">{users.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Active Users</p>
              <p className="text-2xl text-green-900 font-semibold">
                {users.filter(u => u.status === 'active').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 font-medium">Paid Users</p>
              <p className="text-2xl text-orange-900 font-semibold">
                {users.filter(u => u.plan !== 'Free').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-medium">New This Week</p>
              <p className="text-2xl text-red-900 font-semibold">12</p>
            </div>
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-400"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="admin">Admins</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg text-gray-900 font-semibold">
            Users ({filteredUsers.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Academic Level</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Plan</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Questions</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Last Login</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((userProfile) => (
                <tr key={userProfile.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {userProfile.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
                        <p className="text-xs text-gray-500">{userProfile.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{userProfile.academic_level || 'Not set'}</span>
                  </td>
                  <td className="py-4 px-4">
                    {getPlanBadge(userProfile.plan)}
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(userProfile.status)}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{userProfile.questions_count}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs text-gray-500">
                      {userProfile.last_login 
                        ? new Date(userProfile.last_login).toLocaleDateString()
                        : 'Never'
                      }
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {userProfile.status === 'active' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction(userProfile.id, 'deactivate')}
                          className="text-orange-600 border-orange-200 hover:bg-orange-50"
                        >
                          <UserX className="w-3 h-3 mr-1" />
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction(userProfile.id, 'activate')}
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Activate
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUserAction(userProfile.id, 'delete')}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg text-gray-900 font-medium mb-2">No users found</h4>
              <p className="text-gray-600">
                {searchTerm || filterRole !== "all" || filterStatus !== "all"
                  ? "Try adjusting your search terms or filters."
                  : "No users have signed up yet."
                }
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}