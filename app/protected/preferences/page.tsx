'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Target, 
  Users, 
  Tags,
  Plus,
  X
} from 'lucide-react';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const ConferencePreferences = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    goals: string[];
    interests: string[];
    rolesInterested: string[];
  }>({
    goals: [],
    interests: [],
    rolesInterested: []
  });
  
  const [newGoal, setNewGoal] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newRole, setNewRole] = useState('');

  const commonRoles = [
    'Software Engineer',
    'Product Manager',
    'Data Scientist',
    'Designer',
    'Founder',
    'Investor',
    'Marketing',
    'Sales',
    'Researcher'
  ];

  const commonInterests = [
    'Artificial Intelligence',
    'Machine Learning',
    'Web Development',
    'Mobile Development',
    'Blockchain',
    'Cloud Computing',
    'UX/UI Design',
    'Startup',
    'Innovation'
  ];

  const addItem = (key: 'goals' | 'interests' | 'rolesInterested', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [key]: [...(prev[key] as string[]), value]
      }));
      if (key === 'goals') setNewGoal('');
      if (key === 'interests') setNewInterest('');
      if (key === 'rolesInterested') setNewRole('');
    }
  };

  const removeItem = (key: 'goals' | 'interests' | 'rolesInterested', index: number) => {
    setFormData(prev => ({
      ...prev,
      [key]: [...prev[key] as string[]].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    // Save to Supabase
    // const { data, error } = await supabase
    //   .from('user_preferences')
    //   .upsert({
    //     user_id: currentUserId,
    //     ...formData
    //   });

    router.push('/recommendations');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Personalize Your Conference Experience
          </h1>
          <p className="mt-2 text-gray-600">
            Help us find the right people for you to meet (all fields are optional)
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Goals Section */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Your Goals
              </CardTitle>
              <CardDescription>
                What do you hope to achieve? (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a goal..."
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem('goals', newGoal)}
                />
                <Button 
                  onClick={() => addItem('goals', newGoal)}
                  size="icon"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.goals.map((goal, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {goal}
                    <X 
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeItem('goals', index)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Interests Section */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tags className="w-5 h-5 text-blue-600" />
                Interests
              </CardTitle>
              <CardDescription>
                Select or add your interests (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {commonInterests.map((interest) => (
                  <Badge
                    key={interest}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50"
                    onClick={() => {
                      if (!formData.interests.includes(interest)) {
                        addItem('interests', interest);
                      }
                    }}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom interest..."
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem('interests', newInterest)}
                />
                <Button 
                  onClick={() => addItem('interests', newInterest)}
                  size="icon"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.interests.map((interest, index) => (
                  <Badge 
                    key={index}
                    className="flex items-center gap-1"
                  >
                    {interest}
                    <X 
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeItem('interests', index)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Looking to Meet Section */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Looking to Meet
              </CardTitle>
              <CardDescription>
                Select roles you'd like to connect with (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {commonRoles.map((role) => (
                  <Badge
                    key={role}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50"
                    onClick={() => {
                      if (!formData.rolesInterested.includes(role)) {
                        addItem('rolesInterested', role);
                      }
                    }}
                  >
                    {role}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom role..."
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem('rolesInterested', newRole)}
                />
                <Button 
                  onClick={() => addItem('rolesInterested', newRole)}
                  size="icon"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.rolesInterested.map((role, index) => (
                  <Badge 
                    key={index}
                    className="flex items-center gap-1"
                  >
                    {role}
                    <X 
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeItem('rolesInterested', index)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mt-8">
          <Button 
            size="lg"
            onClick={handleSubmit}
            className="w-full md:w-auto"
          >
            Find My Matches
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConferencePreferences;