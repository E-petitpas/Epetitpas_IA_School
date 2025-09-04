import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { 
  CreditCard, 
  DollarSign, 
  Users,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Check,
  Zap,
  Star,
  Crown,
  MessageSquare
} from "lucide-react";
import { useState } from "react";

interface SubscriptionManagementPageProps {
  user: any;
  session: any;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  billing: 'monthly' | 'yearly';
  features: string[];
  quotas: {
    dailyQuestions: number;
    monthlyQuestions: number;
    exportLimit: number;
  };
  popular?: boolean;
  active: boolean;
}

export function SubscriptionManagementPage({ user, session }: SubscriptionManagementPageProps) {
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: 'free',
      name: 'Free',
      price: 0,
      billing: 'monthly',
      features: [
        '20 questions per day',
        'Basic AI explanations',
        'Text export only',
        'Community support'
      ],
      quotas: {
        dailyQuestions: 20,
        monthlyQuestions: 600,
        exportLimit: 10
      },
      active: true
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 9.99,
      billing: 'monthly',
      features: [
        '100 questions per day',
        'Advanced AI explanations',
        'PDF & Word export',
        'Priority support',
        'Quiz generation'
      ],
      quotas: {
        dailyQuestions: 100,
        monthlyQuestions: 3000,
        exportLimit: 50
      },
      active: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 19.99,
      billing: 'monthly',
      features: [
        '500 questions per day',
        'Expert AI explanations',
        'All export formats',
        'Priority support',
        'Advanced quizzes',
        'Progress analytics',
        'Study plans'
      ],
      quotas: {
        dailyQuestions: 500,
        monthlyQuestions: 15000,
        exportLimit: 200
      },
      popular: true,
      active: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 39.99,
      billing: 'monthly',
      features: [
        'Unlimited questions',
        'Premium AI explanations',
        'All features included',
        'Dedicated support',
        'Custom integrations',
        'Team management',
        'White-label options'
      ],
      quotas: {
        dailyQuestions: -1, // Unlimited
        monthlyQuestions: -1,
        exportLimit: -1
      },
      active: true
    }
  ]);

  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Plan | null>(null);

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan.id);
    setEditForm({ ...plan });
  };

  const handleSavePlan = () => {
    if (editForm) {
      setPlans(plans.map(p => p.id === editForm.id ? editForm : p));
      setEditingPlan(null);
      setEditForm(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingPlan(null);
    setEditForm(null);
  };

  const handleDeletePlan = (planId: string) => {
    if (window.confirm('Are you sure you want to delete this plan? Users subscribed to this plan will need to be migrated.')) {
      setPlans(plans.filter(p => p.id !== planId));
    }
  };

  const handleToggleActive = (planId: string) => {
    setPlans(plans.map(p => 
      p.id === planId ? { ...p, active: !p.active } : p
    ));
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'free':
        return <MessageSquare className="w-5 h-5" />;
      case 'standard':
        return <Zap className="w-5 h-5" />;
      case 'premium':
        return <Star className="w-5 h-5" />;
      case 'pro':
        return <Crown className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const totalSubscribers = 1247;
  const monthlyRevenue = 18450;

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Monthly Revenue</p>
              <p className="text-2xl text-green-900 font-semibold">€{monthlyRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Total Subscribers</p>
              <p className="text-2xl text-blue-900 font-semibold">{totalSubscribers.toLocaleString()}</p>
              <p className="text-xs text-blue-600 mt-1">Paid subscribers</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium">Avg. Revenue Per User</p>
              <p className="text-2xl text-purple-900 font-semibold">€{(monthlyRevenue / totalSubscribers).toFixed(2)}</p>
              <p className="text-xs text-purple-600 mt-1">Monthly ARPU</p>
            </div>
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 font-medium">Conversion Rate</p>
              <p className="text-2xl text-orange-900 font-semibold">8.3%</p>
              <p className="text-xs text-orange-600 mt-1">Free to paid</p>
            </div>
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Plans Management */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg text-gray-900 font-semibold">Subscription Plans</h3>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add New Plan
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">Most Popular</Badge>
              </div>
            )}
            
            <div className="p-6">
              {editingPlan === plan.id && editForm ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="planName">Plan Name</Label>
                    <Input
                      id="planName"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="planPrice">Price (€)</Label>
                    <Input
                      id="planPrice"
                      type="number"
                      step="0.01"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dailyQuestions">Daily Questions</Label>
                    <Input
                      id="dailyQuestions"
                      type="number"
                      value={editForm.quotas.dailyQuestions === -1 ? 'Unlimited' : editForm.quotas.dailyQuestions}
                      onChange={(e) => {
                        const value = e.target.value === 'Unlimited' ? -1 : parseInt(e.target.value) || 0;
                        setEditForm({ 
                          ...editForm, 
                          quotas: { ...editForm.quotas, dailyQuestions: value }
                        });
                      }}
                      placeholder="Enter number or 'Unlimited'"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={handleSavePlan} size="sm" className="flex-1">
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                    <Button onClick={handleCancelEdit} size="sm" variant="outline" className="flex-1">
                      <X className="w-3 h-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        plan.name === 'Free' ? 'bg-gray-100 text-gray-600' :
                        plan.name === 'Standard' ? 'bg-orange-100 text-orange-600' :
                        plan.name === 'Premium' ? 'bg-blue-100 text-blue-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {getPlanIcon(plan.name)}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
                        <div className="flex items-center space-x-2">
                          {plan.active ? (
                            <Badge className="bg-green-100 text-green-800 border-green-300">Active</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800 border-gray-300">Inactive</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditPlan(plan)}
                        className="p-2"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      {plan.id !== 'free' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeletePlan(plan.id)}
                          className="p-2 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-gray-900">
                      {plan.price === 0 ? 'Free' : `€${plan.price}`}
                    </div>
                    <div className="text-sm text-gray-500">per month</div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="text-sm">
                      <strong>Daily Questions:</strong> {plan.quotas.dailyQuestions === -1 ? 'Unlimited' : plan.quotas.dailyQuestions}
                    </div>
                    <div className="text-sm">
                      <strong>Monthly Questions:</strong> {plan.quotas.monthlyQuestions === -1 ? 'Unlimited' : plan.quotas.monthlyQuestions.toLocaleString()}
                    </div>
                    <div className="text-sm">
                      <strong>Export Limit:</strong> {plan.quotas.exportLimit === -1 ? 'Unlimited' : plan.quotas.exportLimit}
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <Check className="w-3 h-3 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleToggleActive(plan.id)}
                      size="sm"
                      variant={plan.active ? "outline" : "default"}
                      className="flex-1"
                    >
                      {plan.active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Subscription Analytics */}
      <Card className="p-6">
        <h3 className="text-lg text-gray-900 font-semibold mb-4">Plan Distribution</h3>
        <div className="space-y-4">
          {plans.map((plan) => {
            // Mock subscriber counts
            const subscriberCounts = {
              'free': 8543,
              'standard': 847,
              'premium': 356,
              'pro': 44
            };
            const count = subscriberCounts[plan.id as keyof typeof subscriberCounts] || 0;
            const percentage = ((count / 9790) * 100).toFixed(1);
            
            return (
              <div key={plan.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    plan.name === 'Free' ? 'bg-gray-100 text-gray-600' :
                    plan.name === 'Standard' ? 'bg-orange-100 text-orange-600' :
                    plan.name === 'Premium' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {getPlanIcon(plan.name)}
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{plan.name}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        plan.name === 'Free' ? 'bg-gray-500' :
                        plan.name === 'Standard' ? 'bg-orange-500' :
                        plan.name === 'Premium' ? 'bg-blue-500' :
                        'bg-purple-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-right min-w-0">
                    <p className="text-sm text-gray-900 font-medium">{count.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{percentage}%</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}