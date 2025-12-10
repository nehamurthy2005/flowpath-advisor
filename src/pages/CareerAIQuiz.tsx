import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2, Brain, Sparkles, CheckCircle2 } from "lucide-react";

interface QuizData {
  education_level: string;
  stream: string;
  interests: string[];
  work_preference: string;
  favorite_subjects: string[];
  learning_style: string;
  hardware_software: string;
  user_goal: string;
}

const CareerAIQuiz = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [hasSelection, setHasSelection] = useState(false);
  const [selectedCareerData, setSelectedCareerData] = useState<any>(null);
  const [quizData, setQuizData] = useState<QuizData>({
    education_level: "",
    stream: "",
    interests: [],
    work_preference: "",
    favorite_subjects: [],
    learning_style: "",
    hardware_software: "",
    user_goal: ""
  });

  const totalSteps = 8;
  const progress = (step / totalSteps) * 100;

  useEffect(() => {
    checkExistingSelection();
  }, []);

  const checkExistingSelection = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setCheckingExisting(false);
        return;
      }

      // Check if user has selected a career
      const { data: selection, error: selectionError } = await supabase
        .from('user_career_selections' as any)
        .select(`
          *,
          recommendation:career_recommendations(*)
        `)
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (selectionError) throw selectionError;

      if (selection) {
        setHasSelection(true);
        setSelectedCareerData(selection);
      }
    } catch (error) {
      console.error("Error checking existing selection:", error);
    } finally {
      setCheckingExisting(false);
    }
  };

  const interestOptions = [
    "Coding & Programming",
    "Design & Creativity",
    "Business & Management",
    "Healthcare & Medicine",
    "Engineering & Technology",
    "Arts & Entertainment",
    "Science & Research",
    "Teaching & Education",
    "Finance & Economics",
    "Law & Legal Services"
  ];

  const subjectOptions = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "English",
    "Economics",
    "Business Studies",
    "Accountancy",
    "History",
    "Psychology",
    "Design",
    "Engineering"
  ];

  const handleInterestToggle = (interest: string) => {
    setQuizData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubjectToggle = (subject: string) => {
    setQuizData(prev => ({
      ...prev,
      favorite_subjects: prev.favorite_subjects.includes(subject)
        ? prev.favorite_subjects.filter(s => s !== subject)
        : [...prev.favorite_subjects, subject]
    }));
  };

  const canProceed = () => {
    switch(step) {
      case 1: return quizData.education_level !== "";
      case 2: return quizData.stream !== "";
      case 3: return quizData.interests.length > 0;
      case 4: return quizData.work_preference !== "";
      case 5: return quizData.favorite_subjects.length > 0;
      case 6: return quizData.learning_style !== "";
      case 7: return quizData.hardware_software !== "";
      case 8: return quizData.user_goal.trim() !== "";
      default: return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to get AI career recommendations",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      const response = await supabase.functions.invoke('career-recommendation', {
        body: { quizData }
      });

      if (response.error) throw response.error;

      navigate('/career-insights', { 
        state: { 
          recommendation: response.data,
          quizData 
        } 
      });

    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingExisting) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (hasSelection && selectedCareerData) {
    const recommendation = selectedCareerData.recommendation;
    const primaryDomain = recommendation.recommended_domain;
    const roadmap = recommendation.roadmap;

    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="border-primary/50 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Your Selected Career Path</CardTitle>
            </div>
            <CardDescription>
              You've selected <strong>{primaryDomain}</strong> as your main career path
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Confidence Score</h3>
                <div className="text-3xl font-bold text-primary">
                  {recommendation.confidence_score}%
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Selected On</h3>
                <p className="text-muted-foreground">
                  {new Date(selectedCareerData.selected_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button 
                onClick={() => {
                  setHasSelection(false);
                  setSelectedCareerData(null);
                  setStep(1);
                }}
                variant="outline"
                className="w-full"
              >
                Retake Career Quiz
              </Button>
              <Button 
                onClick={() => navigate('/career-insights', { 
                  state: { 
                    recommendation: recommendation,
                    quizData: null,
                    isFromSelection: true
                  } 
                })}
                className="w-full mt-3"
              >
                View Full Career Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (checkingExisting) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (hasSelection && selectedCareerData) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle2 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Your Career Path</h1>
          </div>
          <p className="text-muted-foreground">You have already selected your career path</p>
        </div>

        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Your Selected Career
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Career Domain</h3>
                <p className="text-muted-foreground">{selectedCareerData.recommendation.recommended_domain}</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => navigate('/career-insights', { state: { recommendation: selectedCareerData.recommendation, isFromSelection: true } })}>
                  View Full Roadmap
                </Button>
                <Button variant="outline" onClick={() => {
                  setHasSelection(false);
                  setSelectedCareerData(null);
                }}>
                  Retake Quiz
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Career Discovery</h1>
        </div>
        <p className="text-muted-foreground">Answer a few questions to get personalized career recommendations</p>
      </div>

      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Step {step} of {totalSteps}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {step === 1 && "Current Education Level"}
            {step === 2 && "Academic Stream"}
            {step === 3 && "Your Interests"}
            {step === 4 && "Work Environment Preference"}
            {step === 5 && "Favorite Subjects"}
            {step === 6 && "Learning Style"}
            {step === 7 && "Technical Preference"}
            {step === 8 && "Your Goals"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "What is your current education level?"}
            {step === 2 && "Which stream are you in or planning to pursue?"}
            {step === 3 && "Select areas that interest you (choose multiple)"}
            {step === 4 && "What kind of work environment do you prefer?"}
            {step === 5 && "Which subjects do you enjoy the most?"}
            {step === 6 && "How do you prefer to learn?"}
            {step === 7 && "Are you more interested in hardware or software?"}
            {step === 8 && "What are your career goals?"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <div className="space-y-2">
              <Label>Education Level</Label>
              <Select value={quizData.education_level} onValueChange={(value) => setQuizData(prev => ({ ...prev, education_level: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10th">10th Standard</SelectItem>
                  <SelectItem value="12th">12th Standard</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="ug">Undergraduate</SelectItem>
                  <SelectItem value="pg">Postgraduate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <Label>Stream</Label>
              <Select value={quizData.stream} onValueChange={(value) => setQuizData(prev => ({ ...prev, stream: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your stream" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="science">Science (PCM/PCB)</SelectItem>
                  <SelectItem value="commerce">Commerce</SelectItem>
                  <SelectItem value="arts">Arts/Humanities</SelectItem>
                  <SelectItem value="vocational">Vocational/Technical</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              {interestOptions.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={quizData.interests.includes(interest)}
                    onCheckedChange={() => handleInterestToggle(interest)}
                  />
                  <Label htmlFor={interest} className="cursor-pointer">
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-2">
              <Label>Work Preference</Label>
              <Select value={quizData.work_preference} onValueChange={(value) => setQuizData(prev => ({ ...prev, work_preference: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your preferred work style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Office Environment</SelectItem>
                  <SelectItem value="remote">Remote/Work from Home</SelectItem>
                  <SelectItem value="fieldwork">Field Work/On-site</SelectItem>
                  <SelectItem value="creative">Creative Studio</SelectItem>
                  <SelectItem value="lab">Laboratory/Research</SelectItem>
                  <SelectItem value="flexible">Flexible/Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              {subjectOptions.map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject}
                    checked={quizData.favorite_subjects.includes(subject)}
                    onCheckedChange={() => handleSubjectToggle(subject)}
                  />
                  <Label htmlFor={subject} className="cursor-pointer">
                    {subject}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {step === 6 && (
            <div className="space-y-2">
              <Label>Learning Style</Label>
              <Select value={quizData.learning_style} onValueChange={(value) => setQuizData(prev => ({ ...prev, learning_style: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="How do you learn best?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hands-on">Hands-on/Practical</SelectItem>
                  <SelectItem value="theory">Theory/Conceptual</SelectItem>
                  <SelectItem value="visual">Visual/Diagrams</SelectItem>
                  <SelectItem value="discussion">Discussion/Collaborative</SelectItem>
                  <SelectItem value="self-paced">Self-paced/Independent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-2">
              <Label>Technical Preference</Label>
              <Select value={quizData.hardware_software} onValueChange={(value) => setQuizData(prev => ({ ...prev, hardware_software: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="software">Software/Programming</SelectItem>
                  <SelectItem value="hardware">Hardware/Electronics</SelectItem>
                  <SelectItem value="both">Both Hardware & Software</SelectItem>
                  <SelectItem value="neither">Neither/Not Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-2">
              <Label>Your Career Goals</Label>
              <Textarea
                value={quizData.user_goal}
                onChange={(e) => setQuizData(prev => ({ ...prev, user_goal: e.target.value }))}
                placeholder="Describe your career aspirations, what you want to achieve, and where you see yourself in the future..."
                rows={6}
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={loading}
              >
                Previous
              </Button>
            )}
            {step < totalSteps ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed() || loading}
                className="ml-auto"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                className="ml-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Recommendations...
                  </>
                ) : (
                  "Get AI Recommendations"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerAIQuiz;