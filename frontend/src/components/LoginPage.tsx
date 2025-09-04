import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { 
  Brain, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Gift,
  Clock,
  Users,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(isLogin ? 'Connexion en cours...' : 'Inscription en cours...');
  };

  const handleGoogleLogin = () => {
    alert('Connexion avec Google...');
  };

  const handleAppleLogin = () => {
    alert('Connexion avec Apple...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl text-gray-900 tracking-tight">
              E-petitpas IA School
            </h1>
            <p className="text-lg text-gray-600">
              Ton professeur IA disponible 24/7
            </p>
          </div>

          {/* Free Plan Badge */}
          <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-green-300 px-4 py-2">
            <Gift className="w-4 h-4 mr-2" />
            Plan gratuit – 5 questions/jour
          </Badge>
        </div>

        {/* Login/Signup Form */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 px-4 py-2 rounded-md transition-all ${
                  isLogin 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 px-4 py-2 rounded-md transition-all ${
                  !isLogin 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Inscription
              </button>
            </div>

            {/* Full Name Field (Signup only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Nom complet</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Ton nom complet"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="ton-email@exemple.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
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

            {/* Confirm Password Field (Signup only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Forgot Password (Login only) */}
            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-sm text-blue-600 hover:text-blue-700">
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLogin ? 'Se connecter' : 'Créer mon compte'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <Separator className="flex-1" />
            <span className="px-3 text-sm text-gray-500">ou</span>
            <Separator className="flex-1" />
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <Button
              type="button"
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full border-gray-200 hover:bg-gray-50 py-3 rounded-xl"
            >
              <div className="w-5 h-5 mr-3 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">G</span>
              </div>
              Continuer avec Google
            </Button>

            <Button
              type="button"
              onClick={handleAppleLogin}
              variant="outline"
              className="w-full border-gray-200 hover:bg-gray-50 py-3 rounded-xl"
            >
              <div className="w-5 h-5 mr-3 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🍎</span>
              </div>
              Continuer avec Apple
            </Button>
          </div>
        </Card>

        {/* Features Highlight */}
        <Card className="p-4 bg-gradient-to-r from-orange-50 to-green-50 border-0">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-8 h-8 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-xs text-gray-600">Disponible 24/7</p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600">IA personnalisée</p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs text-gray-600">Résultats garantis</p>
            </div>
          </div>
        </Card>

        {/* Terms */}
        <p className="text-xs text-center text-gray-500">
          En continuant, tu acceptes nos{' '}
          <button className="text-blue-600 hover:text-blue-700 underline">
            conditions d'utilisation
          </button>{' '}
          et notre{' '}
          <button className="text-blue-600 hover:text-blue-700 underline">
            politique de confidentialité
          </button>
        </p>
      </div>
    </div>
  );
}