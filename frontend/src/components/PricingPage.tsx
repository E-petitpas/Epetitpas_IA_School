import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Check, 
  Star, 
  Users, 
  BookOpen, 
  Brain, 
  MessageSquare, 
  Download, 
  Trophy,
  Zap,
  Crown,
  Gift
} from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Gratuit",
    price: "0€",
    period: "/mois",
    description: "Découvre l'IA éducative",
    color: "gray",
    gradient: "from-gray-50 to-gray-100",
    borderColor: "border-gray-200",
    textColor: "text-gray-600",
    buttonStyle: "border-gray-300 text-gray-700 hover:bg-gray-50",
    icon: Gift,
    features: [
      { text: "5 questions par jour", included: true },
      { text: "Explications de base", included: true },
      { text: "Support communautaire", included: true },
      { text: "Quiz limités", included: true },
      { text: "Export PDF", included: false },
      { text: "IA avancée", included: false },
      { text: "Support prioritaire", included: false },
      { text: "Programmes professionnels", included: false }
    ]
  },
  {
    id: "standard",
    name: "Standard",
    price: "0,99€",
    period: "/mois",
    description: "Pour débuter sérieusement",
    color: "blue",
    gradient: "from-blue-50 to-blue-100",
    borderColor: "border-blue-200",
    textColor: "text-blue-600",
    buttonStyle: "bg-blue-500 hover:bg-blue-600 text-white",
    icon: BookOpen,
    features: [
      { text: "20 questions par jour", included: true },
      { text: "Explications détaillées", included: true },
      { text: "Export PDF inclus", included: true },
      { text: "Quiz basiques", included: true },
      { text: "Support email", included: true },
      { text: "IA avancée", included: false },
      { text: "Programmes professionnels", included: false },
      { text: "Analyse d'images", included: false }
    ]
  },
  {
    id: "premium",
    name: "Premium",
    price: "2,99€",
    period: "/mois",
    description: "L'expérience complète",
    color: "orange",
    gradient: "from-orange-50 to-orange-100",
    borderColor: "border-orange-200",
    textColor: "text-orange-600",
    buttonStyle: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white",
    icon: Star,
    popular: true,
    features: [
      { text: "100 questions par jour", included: true },
      { text: "Quiz interactifs illimités", included: true },
      { text: "Programmes professionnels", included: true },
      { text: "Export PDF/Word avancé", included: true },
      { text: "IA personnalisée", included: true },
      { text: "Suivi de progression", included: true },
      { text: "Support prioritaire", included: true },
      { text: "Analyse d'images", included: false }
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: "4,99€",
    period: "/mois",
    description: "Pour les plus exigeants",
    color: "green",
    gradient: "from-green-50 to-green-100",
    borderColor: "border-green-200",
    textColor: "text-green-600",
    buttonStyle: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white",
    icon: Crown,
    features: [
      { text: "200 questions par jour", included: true },
      { text: "IA la plus avancée", included: true },
      { text: "Analyse d'images incluse", included: true },
      { text: "Tout du plan Premium", included: true },
      { text: "Assistant IA personnel", included: true },
      { text: "Accès anticipé aux nouveautés", included: true },
      { text: "Support dédié 24/7", included: true },
      { text: "API développeur", included: true }
    ]
  }
];

export function PricingPage() {
  const handleSelectPlan = (planId: string) => {
    alert(`Redirection vers l'abonnement ${planId}...`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl text-gray-900">
          Choisissez votre plan d'apprentissage
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Débloquez tout le potentiel de l'IA éducative avec nos formules adaptées à vos besoins.
          Commencez gratuitement et évoluez à votre rythme.
        </p>
        
        <div className="flex items-center justify-center space-x-2 mt-6">
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <Zap className="w-3 h-3 mr-1" />
            30 jours d'essai gratuit
          </Badge>
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <Trophy className="w-3 h-3 mr-1" />
            Annulation à tout moment
          </Badge>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          
          return (
            <Card 
              key={plan.id}
              className={`relative p-6 bg-gradient-to-br ${plan.gradient} ${plan.borderColor} ${
                plan.popular ? 'ring-2 ring-orange-300 scale-105' : ''
              } transition-all duration-300 hover:shadow-lg`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
                  <Star className="w-3 h-3 mr-1" />
                  Le plus populaire
                </Badge>
              )}

              <div className="space-y-6">
                {/* Plan Header */}
                <div className="text-center space-y-3">
                  <div className={`w-12 h-12 mx-auto bg-gradient-to-br ${
                    plan.color === 'gray' ? 'from-gray-400 to-gray-500' :
                    plan.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    plan.color === 'orange' ? 'from-orange-500 to-orange-600' :
                    'from-green-500 to-green-600'
                  } rounded-full flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <div>
                    <h3 className={`text-xl ${
                      plan.color === 'gray' ? 'text-gray-800' :
                      plan.color === 'blue' ? 'text-blue-800' :
                      plan.color === 'orange' ? 'text-orange-800' :
                      'text-green-800'
                    }`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm ${plan.textColor}`}>
                      {plan.description}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline justify-center space-x-1">
                      <span className={`text-3xl ${
                        plan.color === 'gray' ? 'text-gray-800' :
                        plan.color === 'blue' ? 'text-blue-800' :
                        plan.color === 'orange' ? 'text-orange-800' :
                        'text-green-800'
                      }`}>
                        {plan.price}
                      </span>
                      <span className={`text-sm ${plan.textColor}`}>
                        {plan.period}
                      </span>
                    </div>
                    {plan.id !== 'free' && (
                      <p className="text-xs text-gray-500">
                        Facturation mensuelle
                      </p>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        feature.included 
                          ? plan.color === 'gray' ? 'bg-gray-500' :
                            plan.color === 'blue' ? 'bg-blue-500' :
                            plan.color === 'orange' ? 'bg-orange-500' :
                            'bg-green-500'
                          : 'bg-gray-200'
                      }`}>
                        <Check className={`w-3 h-3 ${
                          feature.included ? 'text-white' : 'text-gray-400'
                        }`} />
                      </div>
                      <span className={`text-sm ${
                        feature.included 
                          ? plan.color === 'gray' ? 'text-gray-700' :
                            plan.color === 'blue' ? 'text-blue-700' :
                            plan.color === 'orange' ? 'text-orange-700' :
                            'text-green-700'
                          : 'text-gray-400'
                      }`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full rounded-xl py-3 transition-all duration-300 ${
                    plan.id === 'free' 
                      ? 'border-2 ' + plan.buttonStyle
                      : plan.buttonStyle + ' shadow-lg hover:shadow-xl'
                  }`}
                  variant={plan.id === 'free' ? 'outline' : 'default'}
                >
                  {plan.id === 'free' ? 'Commencer gratuitement' : 'Choisir ce plan'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl text-center text-gray-900">
          Questions fréquentes
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="text-blue-800 mb-2">Puis-je changer de plan à tout moment ?</h3>
            <p className="text-blue-700 text-sm">
              Oui ! Vous pouvez passer à un plan supérieur ou inférieur à tout moment. 
              Les changements prennent effet immédiatement.
            </p>
          </Card>

          <Card className="p-6 bg-green-50 border-green-200">
            <h3 className="text-green-800 mb-2">Y a-t-il des frais cachés ?</h3>
            <p className="text-green-700 text-sm">
              Aucun frais caché ! Le prix affiché est tout ce que vous payez. 
              Annulation possible à tout moment sans frais.
            </p>
          </Card>

          <Card className="p-6 bg-orange-50 border-orange-200">
            <h3 className="text-orange-800 mb-2">Comment fonctionne l'essai gratuit ?</h3>
            <p className="text-orange-700 text-sm">
              Tous les plans payants incluent 30 jours d'essai gratuit. 
              Aucune carte bancaire requise pour commencer.
            </p>
          </Card>

          <Card className="p-6 bg-purple-50 border-purple-200">
            <h3 className="text-purple-800 mb-2">Support technique inclus ?</h3>
            <p className="text-purple-700 text-sm">
              Oui ! Tous les plans incluent un support technique. 
              Les plans Premium et Pro bénéficient d'un support prioritaire.
            </p>
          </Card>
        </div>
      </div>

      {/* Contact */}
      <div className="text-center space-y-4 bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-2xl">
        <h3 className="text-xl text-gray-900">
          Besoin d'une solution sur mesure ?
        </h3>
        <p className="text-gray-600">
          Contactez notre équipe pour une offre personnalisée adaptée à votre établissement.
        </p>
        <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-xl px-8">
          <MessageSquare className="w-4 h-4 mr-2" />
          Nous contacter
        </Button>
      </div>
    </div>
  );
}