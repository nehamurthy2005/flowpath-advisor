import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Brain, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FindYourFlow = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    marks: "",
    interests: [] as string[],
    skills: [] as string[],
    emotionalState: "",
  });

  const interestOptions = ["Technology", "Creative Arts", "Business", "Science", "Social Work", "Sports"];
  const skillOptions = ["Analytical", "Creative", "Communication", "Technical", "Leadership", "Problem Solving"];
  const emotionalStates = ["Excited", "Confused", "Stressed", "Curious", "Neutral"];

  const toggleSelection = (type: "interests" | "skills", value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const handleSubmit = () => {
    if (formData.name && formData.marks && formData.interests.length > 0 && formData.skills.length > 0 && formData.emotionalState) {
      navigate("/flow-assessment", { state: { userData: formData } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Find Your Flow
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered career guidance that helps you discover your perfect path
          </p>
          <div className="flex gap-4 justify-center flex-wrap mt-6">
            <Badge variant="secondary" className="px-4 py-2">
              <Brain className="h-4 w-4 mr-2" />
              Smart Predictions
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              Career Roadmaps
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Target className="h-4 w-4 mr-2" />
              Skill Analysis
            </Badge>
          </div>
        </div>

        {/* Input Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Let's Get to Know You</CardTitle>
            <CardDescription>Tell us about yourself to get personalized career guidance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            {/* Marks */}
            <div className="space-y-2">
              <Label htmlFor="marks">Average Marks (%)</Label>
              <Input
                id="marks"
                type="number"
                placeholder="Enter your average marks"
                value={formData.marks}
                onChange={(e) => setFormData(prev => ({ ...prev, marks: e.target.value }))}
                min="0"
                max="100"
              />
            </div>

            {/* Interests */}
            <div className="space-y-3">
              <Label>Select Your Interests</Label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => (
                  <Badge
                    key={interest}
                    variant={formData.interests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 hover:bg-primary/20 transition-colors"
                    onClick={() => toggleSelection("interests", interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <Label>Select Your Skills</Label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map((skill) => (
                  <Badge
                    key={skill}
                    variant={formData.skills.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 hover:bg-primary/20 transition-colors"
                    onClick={() => toggleSelection("skills", skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Emotional State */}
            <div className="space-y-3">
              <Label>How are you feeling about your career?</Label>
              <div className="flex flex-wrap gap-2">
                {emotionalStates.map((state) => (
                  <Badge
                    key={state}
                    variant={formData.emotionalState === state ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 hover:bg-primary/20 transition-colors"
                    onClick={() => setFormData(prev => ({ ...prev, emotionalState: state }))}
                  >
                    {state}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full"
              size="lg"
              disabled={!formData.name || !formData.marks || formData.interests.length === 0 || formData.skills.length === 0 || !formData.emotionalState}
            >
              Start Your Journey
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FindYourFlow;
