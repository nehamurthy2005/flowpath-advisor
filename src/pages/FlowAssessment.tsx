import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { generateCareerPrediction } from "@/utils/careerEngine";

const personalityQuestions = [
  { id: 1, question: "I prefer working with data and numbers", type: "analytical" },
  { id: 2, question: "I enjoy expressing ideas through creative means", type: "creative" },
  { id: 3, question: "I like helping and interacting with people", type: "social" },
  { id: 4, question: "I'm comfortable with technology and tools", type: "technical" },
  { id: 5, question: "I enjoy solving complex problems", type: "logical" },
];

const FlowAssessment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = location.state || {};
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);

  useEffect(() => {
    if (!userData) {
      navigate("/find-your-flow");
    }
  }, [userData, navigate]);

  const handleAnswer = (questionId: number, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length === personalityQuestions.length) {
      setIsAnalyzing(true);
      
      // Simulate AI processing
      setTimeout(() => {
        const personalityProfile = personalityQuestions.reduce((acc, q) => {
          acc[q.type] = (acc[q.type] || 0) + (answers[q.id] || 0);
          return acc;
        }, {} as Record<string, number>);

        const result = generateCareerPrediction({
          ...userData,
          personality: personalityProfile,
        });

        setPrediction(result);
        setIsAnalyzing(false);
        setShowResults(true);
      }, 2000);
    }
  };

  const handleViewCareer = () => {
    navigate("/flow-career", { state: { userData, prediction } });
  };

  if (!userData) return null;

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <h3 className="text-xl font-semibold">Analyzing Your Profile...</h3>
            <p className="text-muted-foreground">AI is processing your responses</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults && prediction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container max-w-4xl mx-auto py-12 px-4">
          <div className="text-center mb-8">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Your Career Prediction</h1>
            <p className="text-muted-foreground">AI has analyzed your profile</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Career</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-2xl font-bold text-primary mb-2">{prediction.career}</h3>
                <p className="text-muted-foreground mb-4">{prediction.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Job Fit Score</span>
                    <Badge variant="secondary">{prediction.jobFitScore}%</Badge>
                  </div>
                  <Progress value={prediction.jobFitScore} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Career Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">College Fit Score</span>
                    <span className="text-sm font-semibold">{prediction.collegeFitScore}%</span>
                  </div>
                  <Progress value={prediction.collegeFitScore} className="h-2" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Difficulty Level</span>
                  <Badge>{prediction.difficulty}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Salary Band</span>
                  <Badge variant="outline">{prediction.salaryBand}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Emotional Guidance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{prediction.emotionalAdvice}</p>
            </CardContent>
          </Card>

          <Button onClick={handleViewCareer} className="w-full" size="lg">
            View Detailed Career Roadmap
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Personality Assessment</h1>
          <p className="text-muted-foreground">Rate each statement from 1 (Disagree) to 5 (Strongly Agree)</p>
        </div>

        <div className="space-y-4 mb-8">
          {personalityQuestions.map((q) => (
            <Card key={q.id}>
              <CardHeader>
                <CardTitle className="text-lg font-medium">{q.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <Button
                      key={score}
                      variant={answers[q.id] === score ? "default" : "outline"}
                      className="w-12 h-12"
                      onClick={() => handleAnswer(q.id, score)}
                    >
                      {score}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full"
          size="lg"
          disabled={Object.keys(answers).length !== personalityQuestions.length}
        >
          Analyze My Profile
        </Button>
      </div>
    </div>
  );
};

export default FlowAssessment;
