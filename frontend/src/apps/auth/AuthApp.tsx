// ========================================
// E-petitpas AI School - Auth App
// ========================================

import React, {useState} from 'react';
import {useAuth} from '../../core/auth/context';
import {Button} from "../../components/ui/button";
import {Card} from "../../components/ui/card";
import {Input} from "../../components/ui/input";
import {Label} from "../../components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../components/ui/select";
import {
  AlertCircle,
  Brain,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
  Shield,
  Star,
  User,
  UserPlus,
  Zap
} from "lucide-react";
import {Logo} from "../../components/Logo";

type Mode = "signin" | "signup";
type UserType = "student" | "admin";

export const AuthApp: React.FC = () => {
  const { signup, signin, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [userType, setUserType] = useState<UserType>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    academicLevel: ''
  });

  const academicLevels = [
    { value: 'CE1', label: 'CE1' },
    { value: '6ème', label: '6ème' },
    { value: '4ème', label: '4ème' },
    { value: 'Terminale', label: 'Terminale' },
    { value: 'BTS SIO', label: 'BTS SIO' },
    { value: 'TSSR', label: 'TSSR' },
    { value: 'DWWM', label: 'DWWM' },
    { value: 'CDA', label: 'CDA' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSignin = async () => {
    setError('');
    try {
      await signin(formData.email, formData.password);
    } catch (error: any) {
      setError(error.message || 'Erreur de connexion');
    }
  };

  const handleSignup = async () => {
    setError('');
    try {
      await signup({
        email: formData.email,
        password: formData.password,
        name: formData.name || "Student",
        preferences: {
          academic_level: formData.academicLevel || 'CE1',
          subjects: ['Mathematics'],
          language: 'fr',
          theme: 'light'
        }
      });
    } catch (error: any) {
      setError(error.message || 'Erreur lors de l\'inscription');
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signin") await handleSignin();
    else await handleSignup();
  };

  const features = [
    { icon: Brain, text: "AI-powered personalized tutoring" },
    { icon: Star, text: "Adaptive learning paths" },
    { icon: Zap, text: "Interactive quizzes & exercises" },
    { icon: Check, text: "Real-time progress tracking" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 p-12 flex-col justify-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute top-40 right-20 w-20 h-20 bg-orange-400 rounded-full"></div>
            <div className="absolute bottom-40 left-20 w-24 h-24 bg-green-400 rounded-full"></div>
            <div className="absolute bottom-20 right-40 w-16 h-16 bg-white rounded-full"></div>
          </div>

          <div className="max-w-md mx-auto text-white relative z-10">
            <div className="flex items-center justify-center mb-8">
              <Logo size="lg" showText={true} variant="white" />
            </div>
            <p className="text-blue-100 text-lg mb-6">Smart Learning Platform</p>

            <h2 className="text-2xl text-white font-semibold mb-6">
              Transform Your Learning Journey with AI
            </h2>
            
            <p className="text-lg text-blue-100 mb-8">
              Join thousands of students already accelerating their learning with personalized AI tutoring, 
              step-by-step explanations, and adaptive content designed just for you.
            </p>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-blue-100">{feature.text}</span>
                  </div>
                );
              })}
            </div>

            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-orange-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-green-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-purple-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-blue-400 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-white font-bold">1K+</span>
                  </div>
                </div>
                <div>
                  <p className="text-white font-medium">1,247+ active learners</p>
                  <p className="text-sm text-blue-200">improving grades daily</p>
                </div>
              </div>
              <p className="text-sm text-blue-100 italic">
                "My grades improved by 45% in just 3 months! The AI explanations are incredibly clear."
              </p>
              <p className="text-xs text-blue-200 mt-2">- Emma M., Terminale S</p>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Logo size="md" showText={true} variant="default" />
              </div>
              <p className="text-gray-600">Smart Learning Platform</p>
            </div>

            <Card className="p-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              {/* User Type Selection */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setUserType("student")}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    userType === "student"
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">Student</span>
                </button>
                <button
                  onClick={() => setUserType("admin")}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    userType === "admin"
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Admin</span>
                </button>
              </div>

              {/* Mode Selection */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setMode("signin")}
                  className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    mode === "signin" 
                      ? `${userType === "admin" ? 'bg-red-600 text-white' : 'bg-gradient-to-r from-blue-600 to-green-600 text-white'} shadow-md` 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  Sign in
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    mode === "signup" 
                      ? `${userType === "admin" ? 'bg-red-600 text-white' : 'bg-gradient-to-r from-blue-600 to-green-600 text-white'} shadow-md` 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  Create account
                </button>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl text-gray-900 font-semibold mb-2">
                  {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-gray-600">
                  {mode === 'signup' 
                    ? `Create your ${userType} account to get started`
                    : `Sign in to your ${userType} portal`
                  }
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-4">
                {mode === "signup" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="pl-10 border-gray-300 focus:border-blue-400"
                          required
                        />
                      </div>
                    </div>

                    {userType === "student" && (
                      <div className="space-y-2">
                        <Label htmlFor="academicLevel">Academic Level</Label>
                        <Select 
                          value={formData.academicLevel} 
                          onValueChange={(value: string) => handleInputChange('academicLevel', value)}
                        >
                          <SelectTrigger className="border-gray-300 focus:border-blue-400">
                            <SelectValue placeholder="Select your academic level" />
                          </SelectTrigger>
                          <SelectContent>
                            {academicLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={userType === 'admin' ? 'admin@e-petitpas.fr' : 'student@email.fr'}
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 border-gray-300 focus:border-blue-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password (min 8 chars)"
                      minLength={8}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10 border-gray-300 focus:border-blue-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full text-white py-3 relative rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
                    userType === 'admin'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                      : 'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600'
                  }`}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {mode === 'signup' ? <UserPlus className="w-4 h-4 mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
                      {mode === 'signup' ? 'Create Account' : 'Sign In'}
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center mt-6">
                <p className="text-gray-600">
                  {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                  <button
                    type="button"
                    onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                    className={`ml-1 font-medium ${
                      userType === 'admin' ? 'text-red-600 hover:text-red-700' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    {mode === 'signup' ? 'Sign in' : 'Sign up'}
                  </button>
                </p>
              </div>

              {userType === 'admin' && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-red-600" />
                    <p className="text-sm text-red-700 font-medium">Secure Admin Access</p>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    Admin accounts require verified credentials and additional security.
                  </p>
                </div>
              )}
            </Card>

            {/* Footer */}
            <div className="text-center mt-8 text-sm text-gray-500">
              <p>
                By signing up, you agree to our 
                <a href="#" className="text-blue-600 hover:text-blue-700 mx-1">Terms of Service</a>
                and
                <a href="#" className="text-blue-600 hover:text-blue-700 mx-1">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};