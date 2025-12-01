import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Target,
  Award,
  BookOpen,
  Home,
} from "lucide-react";
import { futureTrends } from "@/utils/careerEngine";

const FlowDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, prediction } = location.state || {};

  useEffect(() => {
    if (!prediction) {
      navigate("/find-your-flow");
    }
  }, [prediction, navigate]);

  if (!prediction) return null;

  const { flowScore, resumeStarter, alternativeCareer } = prediction;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container max-w-6xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Complete Dashboard</h1>
          <p className="text-muted-foreground">Track your career journey with AI insights</p>
        </div>

        {/* Flow Score */}
        <Card className="mb-6 border-primary/50">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              Your Flow Score
            </CardTitle>
            <CardDescription>Comprehensive career alignment measurement</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Interest Match</span>
                    <span className="text-sm font-bold">{flowScore.interest}%</span>
                  </div>
                  <Progress value={flowScore.interest} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Skill Match</span>
                    <span className="text-sm font-bold">{Math.round(flowScore.skillMatch)}%</span>
                  </div>
                  <Progress value={flowScore.skillMatch} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Confidence Level</span>
                    <span className="text-sm font-bold">{flowScore.confidence}%</span>
                  </div>
                  <Progress value={flowScore.confidence} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Career Alignment</span>
                    <span className="text-sm font-bold">{flowScore.alignment}%</span>
                  </div>
                  <Progress value={flowScore.alignment} className="h-2" />
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="transform -rotate-90 w-48 h-48">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-muted"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={`${(flowScore.overall / 100) * 502.4} 502.4`}
                      className="text-primary"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-primary">{flowScore.overall}</div>
                    <div className="text-sm text-muted-foreground">Overall Flow</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume Starter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              AI Resume Starter Kit
            </CardTitle>
            <CardDescription>Key elements to add to your resume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Top Skills to Add</h4>
                <div className="space-y-2">
                  {resumeStarter.skills.map((skill: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="w-full justify-center">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Project Titles</h4>
                <ul className="space-y-2">
                  {resumeStarter.projects.map((project: string, idx: number) => (
                    <li key={idx} className="text-sm text-muted-foreground">• {project}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Important Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {resumeStarter.keywords.map((keyword: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <h4 className="font-semibold mb-2">Portfolio Suggestion</h4>
              <p className="text-sm text-muted-foreground">{resumeStarter.portfolio}</p>
            </div>
          </CardContent>
        </Card>

        {/* Career Comparison */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Career Path Comparison
            </CardTitle>
            <CardDescription>Compare your recommended career with an alternative</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border-2 border-primary rounded-lg bg-primary/5">
                <h3 className="font-bold text-lg mb-4">{prediction.career}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Salary</span>
                    <span className="font-semibold">{prediction.salaryRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Difficulty</span>
                    <Badge>{prediction.difficulty}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Market Demand</span>
                    <Badge variant="secondary">Very High</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Skill Match</span>
                    <span className="font-semibold">{Math.round(flowScore.skillMatch)}%</span>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-bold text-lg mb-4">{alternativeCareer.career}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Salary</span>
                    <span className="font-semibold">{alternativeCareer.salary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Difficulty</span>
                    <Badge variant="outline">{alternativeCareer.difficulty}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Market Demand</span>
                    <Badge variant="outline">{alternativeCareer.demand}</Badge>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm">Skills Required</span>
                    <span className="text-xs text-right text-muted-foreground max-w-[150px]">
                      {alternativeCareer.skillRequirement}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Courses */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Recommended Learning Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {prediction.recommendedCourses.map((course: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/70 transition-colors">
                  <div>
                    <div className="font-medium">{course.title}</div>
                    <div className="text-sm text-muted-foreground">{course.platform}</div>
                  </div>
                  <Badge variant="secondary">Recommended</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Future Trends */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Future Career Trends
            </CardTitle>
            <CardDescription>Stay ahead with industry insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-600 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Growing Careers
                </h4>
                <div className="space-y-2">
                  {futureTrends.growing.map((trend, idx) => (
                    <div key={idx} className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="font-medium text-sm">{trend.career}</div>
                      <div className="text-xs text-muted-foreground">{trend.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-orange-600 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Declining Careers
                </h4>
                <div className="space-y-2">
                  {futureTrends.declining.map((trend, idx) => (
                    <div key={idx} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="font-medium text-sm">{trend.career}</div>
                      <div className="text-xs text-muted-foreground">{trend.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={() => navigate("/find-your-flow")} variant="outline" className="w-full" size="lg">
          <Home className="mr-2 h-4 w-4" />
          Start New Assessment
        </Button>
      </div>
    </div>
  );
};

export default FlowDashboard;
