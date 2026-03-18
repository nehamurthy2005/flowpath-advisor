import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles, TrendingUp, Brain, Target, Download, Plus, ArrowRight,
  Award, BookOpen, Wrench, Briefcase, Lightbulb, Calendar, FileText,
  TrendingDown, Home, Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { futureTrends } from "@/utils/careerEngine";

const STORAGE_KEY = "flow_assessment_result";

interface StoredResult {
  userData: any;
  prediction: any;
  timestamp: string;
}

const FindYourFlow = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storedResult, setStoredResult] = useState<StoredResult | null>(null);
  const [showForm, setShowForm] = useState(false);
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

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setStoredResult(JSON.parse(saved));
      } catch { /* ignore */ }
    }
  }, []);

  const toggleSelection = (type: "interests" | "skills", value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.marks || formData.interests.length === 0 || formData.skills.length === 0 || !formData.emotionalState) return;
    if (!user) {
      toast.error("Please login to start your assessment");
      navigate("/auth");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("flow_assessments").insert({
        user_id: user.id,
        name: formData.name,
        marks: parseInt(formData.marks),
        interests: formData.interests,
        skills: formData.skills,
        emotional_state: formData.emotionalState,
      });
      if (error) throw error;
      toast.success("Assessment started!");
      navigate("/flow-assessment", { state: { userData: formData } });
    } catch (error: any) {
      toast.error(error.message || "Failed to save assessment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadResult = () => {
    if (!storedResult) return;
    const { userData, prediction, timestamp } = storedResult;
    
    const content = `
╔══════════════════════════════════════════════════════╗
║           FIND YOUR FLOW - AI CAREER GUIDE           ║
╚══════════════════════════════════════════════════════╝

Generated: ${new Date(timestamp).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 YOUR PROFILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Name:            ${userData.name}
  Marks:           ${userData.marks}%
  Interests:       ${userData.interests?.join(", ")}
  Skills:          ${userData.skills?.join(", ")}
  Emotional State: ${userData.emotionalState}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 RECOMMENDED CAREER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Career:          ${prediction.career}
  Description:     ${prediction.description}
  Job Fit Score:   ${prediction.jobFitScore}%
  College Fit:     ${prediction.collegeFitScore}%
  Difficulty:      ${prediction.difficulty}
  Salary Range:    ${prediction.salaryRange}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 FLOW SCORE BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Overall Flow:    ${prediction.flowScore?.overall}%
  Interest Match:  ${prediction.flowScore?.interest}%
  Skill Match:     ${Math.round(prediction.flowScore?.skillMatch || 0)}%
  Confidence:      ${prediction.flowScore?.confidence}%
  Alignment:       ${prediction.flowScore?.alignment}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 EMOTIONAL GUIDANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ${prediction.emotionalAdvice}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SKILLS YOU HAVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ${prediction.skillsYouHave?.join(", ")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ SKILLS TO IMPROVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ${prediction.skillsToImprove?.join(", ")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 3-MONTH LEARNING ROADMAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  What to Learn:
${prediction.roadmap?.learning?.map((l: string) => `    • ${l}`).join("\n")}

  Tools to Master:
    ${prediction.roadmap?.tools?.join(", ")}

  Recommended Courses:
${prediction.roadmap?.courses?.map((c: any) => `    • ${c.title} (${c.platform})`).join("\n")}

  Projects to Build:
${prediction.roadmap?.projects?.map((p: string) => `    • ${p}`).join("\n")}

  Internship: ${prediction.roadmap?.internship}
  Timeline:   ${prediction.roadmap?.timeline}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 RESUME STARTER KIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Top Skills:  ${prediction.resumeStarter?.skills?.join(", ")}
  Keywords:    ${prediction.resumeStarter?.keywords?.join(", ")}
  Portfolio:   ${prediction.resumeStarter?.portfolio}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 ALTERNATIVE CAREER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Career:      ${prediction.alternativeCareer?.career}
  Salary:      ${prediction.alternativeCareer?.salary}
  Difficulty:  ${prediction.alternativeCareer?.difficulty}
  Demand:      ${prediction.alternativeCareer?.demand}

══════════════════════════════════════════════════════
  Generated by FindYourFlow AI Career Guide
══════════════════════════════════════════════════════
`.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FindYourFlow_${userData.name.replace(/\s+/g, "_")}_CareerGuide.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Career guide downloaded!");
  };

  const handleNewAssessment = () => {
    setShowForm(true);
    setFormData({ name: "", marks: "", interests: [], skills: [], emotionalState: "" });
  };

  // Show saved results
  if (storedResult && !showForm) {
    const { userData, prediction, timestamp } = storedResult;
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container max-w-6xl mx-auto py-12 px-4">
          {/* Header */}
          <div className="text-center mb-8 space-y-3">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Your AI Career Guide
              </h1>
            </div>
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" />
              Last assessed: {new Date(timestamp).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            <div className="flex gap-3 justify-center mt-4">
              <Button onClick={handleNewAssessment} variant="outline" size="lg">
                <Plus className="mr-2 h-4 w-4" /> New Assessment
              </Button>
              <Button onClick={handleDownloadResult} size="lg">
                <Download className="mr-2 h-4 w-4" /> Download Guide
              </Button>
            </div>
          </div>

          {/* Profile Summary */}
          <Card className="mb-6 border-primary/30">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-lg">👤 {userData.name}'s Profile</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-4 text-sm">
                <div><span className="font-medium">Marks:</span> {userData.marks}%</div>
                <Separator orientation="vertical" className="h-5" />
                <div><span className="font-medium">Interests:</span> {userData.interests?.join(", ")}</div>
                <Separator orientation="vertical" className="h-5" />
                <div><span className="font-medium">Feeling:</span> {userData.emotionalState}</div>
              </div>
            </CardContent>
          </Card>

          {/* Career Prediction & Metrics */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Recommended Career
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-2xl font-bold text-primary mb-2">{prediction.career}</h3>
                <p className="text-muted-foreground mb-4">{prediction.description}</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Job Fit Score</span>
                      <Badge variant="secondary">{prediction.jobFitScore}%</Badge>
                    </div>
                    <Progress value={prediction.jobFitScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">College Fit Score</span>
                      <Badge variant="secondary">{prediction.collegeFitScore}%</Badge>
                    </div>
                    <Progress value={prediction.collegeFitScore} className="h-2" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Difficulty</span>
                    <Badge>{prediction.difficulty}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Salary Range</span>
                    <Badge variant="outline">{prediction.salaryRange}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Flow Score */}
            <Card className="border-primary/30">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Flow Score
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center mb-4">
                  <div className="relative w-36 h-36">
                    <svg className="transform -rotate-90 w-36 h-36">
                      <circle cx="72" cy="72" r="60" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-muted" />
                      <circle cx="72" cy="72" r="60" stroke="currentColor" strokeWidth="10" fill="transparent"
                        strokeDasharray={`${(prediction.flowScore?.overall / 100) * 377} 377`} className="text-primary" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold text-primary">{prediction.flowScore?.overall}</div>
                      <div className="text-xs text-muted-foreground">Overall</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Interest", value: prediction.flowScore?.interest },
                    { label: "Skill Match", value: Math.round(prediction.flowScore?.skillMatch || 0) },
                    { label: "Confidence", value: prediction.flowScore?.confidence },
                    { label: "Alignment", value: prediction.flowScore?.alignment },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{item.label}</span>
                        <span className="font-semibold">{item.value}%</span>
                      </div>
                      <Progress value={item.value} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emotional Guidance */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Emotional Guidance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{prediction.emotionalAdvice}</p>
            </CardContent>
          </Card>

          {/* Skill Gap */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Skill Gap Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-primary">✓ Skills You Have</h4>
                  <div className="flex flex-wrap gap-2">
                    {prediction.skillsYouHave?.map((skill: string, idx: number) => (
                      <Badge key={idx} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-accent-foreground">→ Skills to Improve</h4>
                  <div className="flex flex-wrap gap-2">
                    {prediction.skillsToImprove?.map((skill: string, idx: number) => (
                      <Badge key={idx} variant="outline">{skill}</Badge>
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
                3-Month Learning Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2"><Lightbulb className="h-4 w-4" /> What to Learn</h4>
                <ul className="space-y-1 ml-6">
                  {prediction.roadmap?.learning?.map((item: string, idx: number) => (
                    <li key={idx} className="text-sm text-muted-foreground">• {item}</li>
                  ))}
                </ul>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2"><Wrench className="h-4 w-4" /> Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {prediction.roadmap?.tools?.map((tool: string, idx: number) => (
                    <Badge key={idx} variant="outline">{tool}</Badge>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3">📚 Courses</h4>
                <div className="space-y-2">
                  {prediction.roadmap?.courses?.map((course: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">{course.title}</span>
                      <Badge variant="secondary">{course.platform}</Badge>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2"><Briefcase className="h-4 w-4" /> Projects</h4>
                <ul className="space-y-1 ml-6">
                  {prediction.roadmap?.projects?.map((p: string, idx: number) => (
                    <li key={idx} className="text-sm text-muted-foreground">• {p}</li>
                  ))}
                </ul>
              </div>
              <Separator />
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-semibold mb-1 flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Internship</h4>
                  <p className="text-sm text-muted-foreground">{prediction.roadmap?.internship}</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-semibold mb-1 flex items-center gap-2"><Calendar className="h-4 w-4" /> Timeline</h4>
                  <p className="text-sm text-muted-foreground">{prediction.roadmap?.timeline}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resume Starter */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Resume Starter Kit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Top Skills</h4>
                  <div className="space-y-2">
                    {prediction.resumeStarter?.skills?.map((skill: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="w-full justify-center">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Projects</h4>
                  <ul className="space-y-2">
                    {prediction.resumeStarter?.projects?.map((p: string, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground">• {p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {prediction.resumeStarter?.keywords?.map((k: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">{k}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <h4 className="font-semibold mb-2">Portfolio Suggestion</h4>
                <p className="text-sm text-muted-foreground">{prediction.resumeStarter?.portfolio}</p>
              </div>
            </CardContent>
          </Card>

          {/* Alternative Career */}
          {prediction.alternativeCareer && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>🔄 Alternative Career Path</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border-2 border-primary rounded-lg bg-primary/5">
                    <h3 className="font-bold text-lg mb-3">{prediction.career}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Salary</span><span className="font-semibold">{prediction.salaryRange}</span></div>
                      <div className="flex justify-between"><span>Difficulty</span><Badge>{prediction.difficulty}</Badge></div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-bold text-lg mb-3">{prediction.alternativeCareer.career}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Salary</span><span className="font-semibold">{prediction.alternativeCareer.salary}</span></div>
                      <div className="flex justify-between"><span>Difficulty</span><Badge variant="outline">{prediction.alternativeCareer.difficulty}</Badge></div>
                      <div className="flex justify-between"><span>Demand</span><Badge variant="outline">{prediction.alternativeCareer.demand}</Badge></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Future Trends */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Future Career Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-600 dark:text-green-400 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Growing
                  </h4>
                  <div className="space-y-2">
                    {futureTrends.growing.map((t, idx) => (
                      <div key={idx} className="p-3 bg-muted rounded-lg">
                        <div className="font-medium text-sm">{t.career}</div>
                        <div className="text-xs text-muted-foreground">{t.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-orange-600 dark:text-orange-400 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4" /> Declining
                  </h4>
                  <div className="space-y-2">
                    {futureTrends.declining.map((t, idx) => (
                      <div key={idx} className="p-3 bg-muted rounded-lg">
                        <div className="font-medium text-sm">{t.career}</div>
                        <div className="text-xs text-muted-foreground">{t.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Actions */}
          <div className="flex gap-4">
            <Button onClick={handleDownloadResult} className="flex-1" size="lg">
              <Download className="mr-2 h-4 w-4" /> Download Full Guide
            </Button>
            <Button onClick={handleNewAssessment} variant="outline" className="flex-1" size="lg">
              <Plus className="mr-2 h-4 w-4" /> Take New Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show form (new assessment or first time)
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
            <Badge variant="secondary" className="px-4 py-2"><Brain className="h-4 w-4 mr-2" />Smart Predictions</Badge>
            <Badge variant="secondary" className="px-4 py-2"><TrendingUp className="h-4 w-4 mr-2" />Career Roadmaps</Badge>
            <Badge variant="secondary" className="px-4 py-2"><Target className="h-4 w-4 mr-2" />Skill Analysis</Badge>
          </div>
          {storedResult && (
            <Button variant="ghost" className="mt-4" onClick={() => setShowForm(false)}>
              ← Back to Previous Results
            </Button>
          )}
        </div>

        {/* Input Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Let's Get to Know You</CardTitle>
            <CardDescription>Tell us about yourself to get personalized career guidance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" placeholder="Enter your name" value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="marks">Average Marks (%)</Label>
              <Input id="marks" type="number" placeholder="Enter your average marks" value={formData.marks}
                onChange={(e) => setFormData(prev => ({ ...prev, marks: e.target.value }))} min="0" max="100" />
            </div>
            <div className="space-y-3">
              <Label>Select Your Interests</Label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => (
                  <Badge key={interest} variant={formData.interests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 hover:bg-primary/20 transition-colors"
                    onClick={() => toggleSelection("interests", interest)}>{interest}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Label>Select Your Skills</Label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map((skill) => (
                  <Badge key={skill} variant={formData.skills.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 hover:bg-primary/20 transition-colors"
                    onClick={() => toggleSelection("skills", skill)}>{skill}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Label>How are you feeling about your career?</Label>
              <div className="flex flex-wrap gap-2">
                {emotionalStates.map((state) => (
                  <Badge key={state} variant={formData.emotionalState === state ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 hover:bg-primary/20 transition-colors"
                    onClick={() => setFormData(prev => ({ ...prev, emotionalState: state }))}>{state}</Badge>
                ))}
              </div>
            </div>
            <Button onClick={handleSubmit} className="w-full" size="lg"
              disabled={isSubmitting || !formData.name || !formData.marks || formData.interests.length === 0 || formData.skills.length === 0 || !formData.emotionalState}>
              {isSubmitting ? "Saving..." : "Start Your Journey"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FindYourFlow;
