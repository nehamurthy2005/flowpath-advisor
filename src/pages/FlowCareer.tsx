import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Wrench,
  Briefcase,
  TrendingUp,
  ArrowRight,
  Target,
  Lightbulb,
  Calendar,
} from "lucide-react";

type Course = {
  title: string;
  platform?: string;
  url?: string;
};

type Roadmap = {
  learning: string[];
  tools: string[];
  courses: Course[];
  projects: string[];
  internship?: string;
  timeline?: string;
};

type Prediction = {
  career: string;
  description?: string;
  skillsYouHave: string[];
  skillsToImprove: string[];
  roadmap: Roadmap;
  salaryRange?: string;
};

const FlowCareer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, prediction } = (location.state || {}) as { userData?: unknown; prediction?: Prediction };

  useEffect(() => {
    if (!prediction) {
      navigate("/find-your-flow");
    }
  }, [prediction, navigate]);

  if (!prediction) return null;

  const handleViewDashboard = () => {
    navigate("/flow-dashboard", { state: { userData, prediction } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container max-w-6xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{prediction.career}</h1>
          <p className="text-xl text-muted-foreground">{prediction.description}</p>
        </div>

        {/* Skill Gap Analysis */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Your Skill Gap Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-600">✓ Skills You Have</h4>
                <div className="flex flex-wrap gap-2">
                  {prediction.skillsYouHave.map((skill: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="bg-green-100 text-green-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-orange-600">→ Skills to Improve</h4>
                <div className="flex flex-wrap gap-2">
                  {prediction.skillsToImprove.map((skill: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="border-orange-300 text-orange-700">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Roadmap */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Your 3-Month Learning Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  What to Learn
                </h4>
                <ul className="space-y-1 ml-6">
                  {prediction.roadmap.learning.map((item: string, idx: number) => (
                    <li key={idx} className="text-sm text-muted-foreground">• {item}</li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Recommended Tools
                </h4>
                <div className="flex flex-wrap gap-2">
                  {prediction.roadmap.tools.map((tool: string, idx: number) => (
                    <Badge key={idx} variant="outline">{tool}</Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">📚 Online Courses</h4>
                <div className="space-y-2">
                  {prediction.roadmap.courses.map((course: Course, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">{course.title}</span>
                      <Badge variant="secondary">{course.platform}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Mini Projects to Build
                </h4>
                <ul className="space-y-1 ml-6">
                  {prediction.roadmap.projects.map((project: string, idx: number) => (
                    <li key={idx} className="text-sm text-muted-foreground">• {project}</li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Internship Opportunity
                </h4>
                <p className="text-sm text-muted-foreground">{prediction.roadmap.internship}</p>
              </div>

              <Separator />

              <div className="bg-primary/5 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timeline
                </h4>
                <p className="text-sm">{prediction.roadmap.timeline}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Salary Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Expected Salary Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-2">{prediction.salaryRange}</div>
            <p className="text-sm text-muted-foreground">Average salary for entry to mid-level positions</p>
          </CardContent>
        </Card>

        <Button onClick={handleViewDashboard} className="w-full" size="lg">
          View Complete Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FlowCareer;
