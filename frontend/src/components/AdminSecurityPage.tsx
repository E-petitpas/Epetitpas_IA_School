import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { 
  Shield, 
  Search, 
  Download,
  Calendar,
  Clock,
  User,
  MapPin,
  Smartphone,
  Monitor,
  AlertTriangle,
  CheckCircle,
  Eye,
  Trash2,
  Filter,
  RefreshCw
} from "lucide-react";
import { useState, useEffect } from "react";

interface AdminSecurityPageProps {
  user: any;
  session: any;
}

interface LoginLog {
  id: string;
  userId: string;
  userName: string;
  email: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  success: boolean;
  riskLevel: 'low' | 'medium' | 'high';
}

interface SecurityEvent {
  id: string;
  type: 'failed_login' | 'suspicious_activity' | 'data_export' | 'admin_action';
  description: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  userId?: string;
  userName?: string;
}

export function AdminSecurityPage({ user, session }: AdminSecurityPageProps) {
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("7days");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    // Mock data for development
    const mockLoginLogs: LoginLog[] = [
      {
        id: '1',
        userId: 'user_1',
        userName: 'Marie Dubois',
        email: 'marie.dubois@email.com',
        timestamp: '2024-01-20T14:30:00Z',
        ipAddress: '192.168.1.1',
        location: 'Paris, France',
        device: 'iPhone 14',
        browser: 'Safari 17.0',
        success: true,
        riskLevel: 'low'
      },
      {
        id: '2',
        userId: 'user_2',
        userName: 'Jean Martin',
        email: 'jean.martin@email.com',
        timestamp: '2024-01-20T13:15:00Z',
        ipAddress: '10.0.0.1',
        location: 'Lyon, France',
        device: 'Windows PC',
        browser: 'Chrome 120.0',
        success: true,
        riskLevel: 'low'
      },
      {
        id: '3',
        userId: 'user_3',
        userName: 'Unknown User',
        email: 'suspicious@example.com',
        timestamp: '2024-01-20T12:00:00Z',
        ipAddress: '45.123.45.67',
        location: 'Unknown, Russia',
        device: 'Linux',
        browser: 'Firefox 115.0',
        success: false,
        riskLevel: 'high'
      }
    ];

    const mockSecurityEvents: SecurityEvent[] = [
      {
        id: '1',
        type: 'failed_login',
        description: 'Multiple failed login attempts from suspicious IP',
        severity: 'warning',
        timestamp: '2024-01-20T12:00:00Z',
        userId: 'user_3',
        userName: 'Unknown User'
      },
      {
        id: '2',
        type: 'data_export',
        description: 'User data export requested via GDPR',
        severity: 'info',
        timestamp: '2024-01-20T10:30:00Z',
        userId: 'user_1',
        userName: 'Marie Dubois'
      },
      {
        id: '3',
        type: 'admin_action',
        description: 'Admin user deactivated student account',
        severity: 'info',
        timestamp: '2024-01-20T09:15:00Z',
        userId: user.id,
        userName: user.name
      }
    ];

    setLoginLogs(mockLoginLogs);
    setSecurityEvents(mockSecurityEvents);
    setLoading(false);
  };

  const filteredLogs = loginLogs.filter(log => 
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ipAddress.includes(searchTerm)
  );

  const handleExportUserData = async (userId: string) => {
    if (window.confirm('Are you sure you want to export all data for this user? This action will be logged for GDPR compliance.')) {
      // Mock export functionality
      const exportData = {
        userId: userId,
        exportDate: new Date().toISOString(),
        data: {
          profile: '...',
          questions: '...',
          usage: '...'
        }
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${userId}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleDeleteUserData = async (userId: string) => {
    if (window.confirm('Are you sure you want to permanently delete all data for this user? This action cannot be undone and will be logged for GDPR compliance.')) {
      // Mock delete functionality
      alert('User data deletion has been queued. The user will be notified and data will be permanently deleted within 30 days.');
    }
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-300">High Risk</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-300">Medium Risk</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Low Risk</Badge>;
      default:
        return <Badge variant="outline">{riskLevel}</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Critical</Badge>;
      case 'warning':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-300">Warning</Badge>;
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Info</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Successful Logins</p>
              <p className="text-2xl text-green-900 font-semibold">1,234</p>
              <p className="text-xs text-green-600 mt-1">Last 24 hours</p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-medium">Failed Attempts</p>
              <p className="text-2xl text-red-900 font-semibold">23</p>
              <p className="text-xs text-red-600 mt-1">Last 24 hours</p>
            </div>
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 font-medium">Suspicious Activity</p>
              <p className="text-2xl text-orange-900 font-semibold">5</p>
              <p className="text-xs text-orange-600 mt-1">Last 7 days</p>
            </div>
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Data Requests</p>
              <p className="text-2xl text-blue-900 font-semibold">12</p>
              <p className="text-xs text-blue-600 mt-1">GDPR exports</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
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
                placeholder="Search by user, email, or IP address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-400"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-400 focus:outline-none"
              >
                <option value="1day">Last 24 hours</option>
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={fetchSecurityData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </div>
      </Card>

      {/* Login Activity */}
      <Card className="p-6">
        <h3 className="text-lg text-gray-900 font-semibold mb-4">Connection History</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Location</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Device</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Risk</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{log.userName}</p>
                        <p className="text-xs text-gray-500">{log.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-900">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-900">{log.location}</p>
                        <p className="text-xs text-gray-500">{log.ipAddress}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {log.device.includes('iPhone') || log.device.includes('Android') ? (
                        <Smartphone className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Monitor className="w-4 h-4 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm text-gray-900">{log.device}</p>
                        <p className="text-xs text-gray-500">{log.browser}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {log.success ? (
                      <Badge className="bg-green-100 text-green-800 border-green-300">Success</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 border-red-300">Failed</Badge>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {getRiskBadge(log.riskLevel)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        Details
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Security Events */}
      <Card className="p-6">
        <h3 className="text-lg text-gray-900 font-semibold mb-4">Security Events</h3>
        
        <div className="space-y-3">
          {securityEvents.map((event) => (
            <div key={event.id} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                event.severity === 'critical' ? 'bg-red-100 text-red-600' :
                event.severity === 'warning' ? 'bg-orange-100 text-orange-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {event.type === 'failed_login' || event.type === 'suspicious_activity' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : event.type === 'data_export' ? (
                  <Download className="w-4 h-4" />
                ) : (
                  <Shield className="w-4 h-4" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-900 font-medium">{event.description}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      <p className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                      {event.userName && (
                        <p className="text-xs text-gray-500">User: {event.userName}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getSeverityBadge(event.severity)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* GDPR Compliance */}
      <Card className="p-6">
        <h3 className="text-lg text-gray-900 font-semibold mb-4">GDPR Data Management</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-gray-900 font-medium mb-3">Data Export Requests</h4>
            <p className="text-sm text-gray-600 mb-4">
              Export all user data for GDPR compliance. This includes profile information, 
              questions asked, usage analytics, and transaction history.
            </p>
            
            <div className="space-y-2">
              <Input
                placeholder="Enter user email or ID"
                className="border-gray-300 focus:border-blue-400"
              />
              <Button
                onClick={() => handleExportUserData('example-user-id')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export User Data
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="text-gray-900 font-medium mb-3">Data Deletion Requests</h4>
            <p className="text-sm text-gray-600 mb-4">
              Permanently delete all user data. This action is irreversible and will 
              completely remove the user from all systems within 30 days.
            </p>
            
            <div className="space-y-2">
              <Input
                placeholder="Enter user email or ID"
                className="border-gray-300 focus:border-blue-400"
              />
              <Button
                onClick={() => handleDeleteUserData('example-user-id')}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete User Data
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-blue-800 font-medium">GDPR Compliance Notice</h4>
              <p className="text-sm text-blue-700 mt-1">
                All data operations are logged and audited for compliance with GDPR regulations. 
                Users will be notified of any data exports or deletions as required by law.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}