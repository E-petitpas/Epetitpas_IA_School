import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
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
  TrendingUp
} from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

interface StudentSettingsProps {
  user: any;
  session: any;
  onUpdate: () => void;
}

const academicLevels = [
  { value: 'primary', label: 'Primary School' },
  { value: '6eme', label: '6ème' },
  { value: '5eme', label: '5ème' },
  { value: '4eme', label: '4ème' },
  { value: '3eme', label: '3ème' },
  { value: '2nde', label: '2nde' },
  { value: '1ere', label: '1ère' },
  { value: 'terminale', label: 'Terminale' },
  { value: 'bts', label: 'BTS' },
  { value: 'licence', label: 'Licence' },
  { value: 'professional', label: 'Professional Training' },
];

const availableSubjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'French', 'English', 'Spanish', 'German',
  'History', 'Geography', 'Philosophy', 'Economics', 'Computer Science', 'Excel', 'TSSR',
  'Literature', 'Art', 'Music', 'Sports Science', 'Psychology', 'Sociology'
];

const learningPreferences = [
  { id: 'detailed_explanations', label: 'Detailed explanations', description: 'Get thorough, step-by-step explanations' },
  { id: 'visual_examples', label: 'Visual examples', description: 'Include diagrams and visual aids when possible' },
  { id: 'practice_exercises', label: 'Practice exercises', description: 'Generate additional practice problems' },
  { id: 'real_world_examples', label: 'Real-world examples', description: 'Connect concepts to everyday situations' },
  { id: 'quick_summaries', label: 'Quick summaries', description: 'Provide concise summaries at the end' },
  { id: 'interactive_quizzes', label: 'Interactive quizzes', description: 'Include quizzes to test understanding' }
];

export function StudentSettings({ user, session, onUpdate }: StudentSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    academic_level: user?.academic_level || '',
    subjects: user?.subjects || [],
    learning_preferences: user?.learning_preferences || {},
    bio: user?.bio || ''
  });

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
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: profile.name,
          academic_level: profile.academic_level,
          subjects: profile.subjects,
          learning_preferences: profile.learning_preferences,
          bio: profile.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setSaved(true);
      onUpdate();
      
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User, color: 'blue' },
    { id: 'academic', label: 'Academic Info', icon: BookOpen, color: 'green' },
    { id: 'subjects', label: 'Subjects', icon: Brain, color: 'purple' },
    { id: 'preferences', label: 'Learning', icon: SettingsIcon, color: 'orange' },
    { id: 'progress', label: 'Progress', icon: TrendingUp, color: 'pink' }
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

            <div className="grid md:grid-cols-2 gap-6">
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
                    value={profile.email}
                    disabled
                    className="pl-10 bg-gray-50 border-gray-200"
                  />
                </div>
                <p className="text-xs text-gray-500">Email cannot be changed here</p>
              </div>
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
        );

      case 'academic':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="academic_level">Academic Level</Label>
              <select
                id="academic_level"
                value={profile.academic_level}
                onChange={(e) => handleInputChange('academic_level', e.target.value)}
                className="w-full px-3 py-2 border border-green-200 rounded-lg focus:border-green-400 focus:outline-none"
              >
                <option value="">Select your level</option>
                {academicLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">Selected Level Benefits</h4>
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
                <h3 className="font-semibold text-gray-900">Select Your Subjects</h3>
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
                <h4 className="font-medium text-purple-800 mb-2">Your Selected Subjects</h4>
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
              <h3 className="font-semibold text-gray-900 mb-2">Learning Preferences</h3>
              <p className="text-sm text-gray-600">Customize how AI explains concepts to you</p>
            </div>

            <div className="space-y-4">
              {learningPreferences.map((pref) => (
                <div key={pref.id} className="flex items-start justify-between p-4 bg-white border border-orange-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{pref.label}</h4>
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
              <h4 className="font-medium text-orange-800 mb-2">Active Preferences</h4>
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
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Questions Asked</p>
                    <p className="text-2xl font-semibold text-blue-900">127</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">This month</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Study Streak</p>
                    <p className="text-2xl font-semibold text-green-900">12</p>
                  </div>
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">Days in a row</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Quiz Score</p>
                    <p className="text-2xl font-semibold text-purple-900">87%</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs text-purple-600 mt-2">Average this week</p>
              </Card>
            </div>

            <Card className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Learning Activity</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mathematics</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Physics</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">72%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">French</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '91%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">91%</span>
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
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeSection === section.id
                  ? `bg-${section.color}-100 text-${section.color}-700 border-2 border-${section.color}-300`
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{section.label}</span>
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