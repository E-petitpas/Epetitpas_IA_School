import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { 
  User, 
  Mail, 
  Camera, 
  BookOpen, 
  Settings as SettingsIcon, 
  Brain,
  Save,
  Upload,
  Edit3,
  Check,
  Star,
  Target,
  TrendingUp,
  MessageSquare
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface StudentSettingsPageProps {
  user: any;
  session: any;
  onUpdate: () => void;
}

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

const availableSubjects = [
  'Math', 'English', 'Physics', 'Word', 'Excel', 'TSSR', 'DWWM', 'CDA',
  'French', 'Spanish', 'German', 'History', 'Geography', 'Philosophy', 
  'Economics', 'Computer Science', 'Literature', 'Chemistry', 'Biology'
];

const learningPreferences = [
  { id: 'detailed_explanations', label: 'Detailed explanations', description: 'Get thorough, step-by-step explanations' },
  { id: 'visual_examples', label: 'Visual examples', description: 'Include diagrams and visual aids when possible' },
  { id: 'practice_exercises', label: 'Practice exercises', description: 'Generate additional practice problems' },
  { id: 'real_world_examples', label: 'Real-world examples', description: 'Connect concepts to everyday situations' },
  { id: 'quick_summaries', label: 'Quick summaries', description: 'Provide concise summaries at the end' },
  { id: 'interactive_quizzes', label: 'Interactive quizzes', description: 'Include quizzes to test understanding' }
];

export function StudentSettingsPage({ user, session, onUpdate }: StudentSettingsPageProps) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [profile, setProfile] = useState({
    name: user?.name || '',
    academic_level: user?.academic_level || '',
    subjects: user?.subjects || [],
    learning_preferences: user?.learning_preferences || {},
    bio: user?.bio || ''
  });

  // Get email from session since it's not stored in user_profiles
  const userEmail = session?.user?.email || '';

  const handleInputChange = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSubjectToggle = (subject: string) => {
    setProfile(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
    setSaved(false);
  };

  const handlePreferenceToggle = (prefId: string) => {
    setProfile(prev => ({
      ...prev,
      learning_preferences: {
        ...prev.learning_preferences,
        [prefId]: !prev.learning_preferences[prefId]
      }
    }));
    setSaved(false);
  };

  const saveProfile = async () => {
    setLoading(true);
    
    // Simulate save operation for development mode
    console.log('Saving profile in development mode:', profile);
    
    // Simulate async operation
    setTimeout(() => {
      setSaved(true);
      onUpdate();
      setTimeout(() => setSaved(false), 3000);
      setLoading(false);
    }, 1000);
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User, color: 'blue' },
    { id: 'academic', label: 'Academic Info', icon: BookOpen, color: 'green' },
    { id: 'subjects', label: 'Subjects/Modules', icon: Brain, color: 'purple' },
    { id: 'preferences', label: 'Learning Preferences', icon: SettingsIcon, color: 'orange' },
    { id: 'progress', label: 'Progress Tracking', icon: TrendingUp, color: 'pink' }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-white" />
              </div>
              <Button variant="outline" className="border-blue-300 text-blue-600">
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    value={userEmail}
                    disabled
                    className="pl-10 bg-gray-50 border-gray-200"
                  />
                </div>
                <p className="text-xs text-gray-500">Email cannot be changed here</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us a bit about yourself, your learning goals, and interests..."
                  value={profile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="border-blue-200 focus:border-blue-400"
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 'academic':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="academic_level">Academic Level</Label>
              <Select 
                value={profile.academic_level} 
                onValueChange={(value) => handleInputChange('academic_level', value)}
              >
                <SelectTrigger className="border-green-200 focus:border-green-400">
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

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="text-green-800 font-medium mb-2">Selected Level Benefits</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li className="flex items-center space-x-2">
                  <Check className="w-3 h-3" />
                  <span>Content adapted to your academic level</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3 h-3" />
                  <span>Appropriate vocabulary and complexity</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3 h-3" />
                  <span>Level-specific examples and exercises</span>
                </li>
              </ul>
            </div>
          </div>
        );

      case 'subjects':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-900 font-semibold">Select Your Subjects/Modules</h3>
                <p className="text-sm text-gray-600">Choose subjects you're interested in learning</p>
              </div>
              <Badge variant="outline" className="border-purple-300 text-purple-600">
                {profile.subjects.length} selected
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableSubjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => handleSubjectToggle(subject)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    profile.subjects.includes(subject)
                      ? 'bg-purple-100 border-purple-400 text-purple-800'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>

            {profile.subjects.length > 0 && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="text-purple-800 font-medium mb-2">Your Selected Subjects</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.subjects.map((subject) => (
                    <Badge key={subject} className="bg-purple-100 text-purple-800 border-purple-300">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-gray-900 font-semibold mb-2">Learning Preferences</h3>
              <p className="text-sm text-gray-600">Customize how AI explains concepts to you</p>
            </div>

            <div className="space-y-4">
              {learningPreferences.map((pref) => (
                <div key={pref.id} className="flex items-start justify-between p-4 bg-white border border-orange-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-gray-900 font-medium">{pref.label}</h4>
                    <p className="text-sm text-gray-600">{pref.description}</p>
                  </div>
                  <Switch
                    checked={profile.learning_preferences[pref.id] || false}
                    onCheckedChange={() => handlePreferenceToggle(pref.id)}
                    className="data-[state=checked]:bg-orange-500"
                  />
                </div>
              ))}
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="text-orange-800 font-medium mb-2">Active Preferences</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(profile.learning_preferences)
                  .filter(([_, enabled]) => enabled)
                  .map(([prefId, _]) => {
                    const pref = learningPreferences.find(p => p.id === prefId);
                    return pref ? (
                      <Badge key={prefId} className="bg-orange-100 text-orange-800 border-orange-300">
                        {pref.label}
                      </Badge>
                    ) : null;
                  })}
                {Object.values(profile.learning_preferences).every(v => !v) && (
                  <span className="text-sm text-orange-600">No preferences selected</span>
                )}
              </div>
            </div>
          </div>
        );

      case 'progress':
        return (
          <div className="space-y-6">
            {/* Daily Quota */}
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <h4 className="text-blue-800 font-medium">Daily Question Quota</h4>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                  Free Plan
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Questions used today</span>
                  <span className="text-blue-800 font-medium">3/20</span>
                </div>
                <Progress value={15} className="h-2" />
                <p className="text-xs text-blue-600">17 questions remaining today</p>
              </div>
            </Card>

            {/* Progress Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 font-medium">Questions Asked</p>
                    <p className="text-2xl text-green-900 font-semibold">127</p>
                  </div>
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">This month</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-700 font-medium">Study Streak</p>
                    <p className="text-2xl text-orange-900 font-semibold">12</p>
                  </div>
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs text-orange-600 mt-2">Days in a row</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700 font-medium">Quiz Score</p>
                    <p className="text-2xl text-purple-900 font-semibold">87%</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs text-purple-600 mt-2">Average this week</p>
              </Card>
            </div>

            {/* Subject Progress */}
            <Card className="p-6">
              <h4 className="text-gray-900 font-semibold mb-4">Subject Progress</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mathematics</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={85} className="w-32 h-2" />
                    <span className="text-sm text-gray-900 font-medium">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Physics</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={72} className="w-32 h-2" />
                    <span className="text-sm text-gray-900 font-medium">72%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">French</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={91} className="w-32 h-2" />
                    <span className="text-sm text-gray-900 font-medium">91%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all font-medium ${
                activeSection === section.id
                  ? `bg-${section.color}-100 text-${section.color}-700 border-2 border-${section.color}-300`
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{section.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section Content */}
      <Card className="p-6">
        {renderSection()}
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          {saved && (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Settings saved successfully!</span>
            </>
          )}
        </div>
        
        <Button
          onClick={saveProfile}
          disabled={loading || saved}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? (
            <>
              <Upload className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}