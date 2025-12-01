import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Target, 
  Briefcase,
  Building2,
  Award,
  ArrowRight,
  BookOpen,
  Wrench,
  Cpu,
  GraduationCap,
  Loader2,
  Check
} from "lucide-react";

const CareerInsights = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { recommendation, quizData, isFromSelection } = location.state || {};
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!recommendation || !recommendation.primary_domain || !recommendation.roadmap) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No recommendations found. Please take the career quiz first.
            </p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate('/career-ai-quiz')}>
                Take Career Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { primary_domain, alternative_domains, roadmap } = recommendation;

  const handleSelectCareer = async (domainName: string) => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save your career selection",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      // Get the recommendation ID from the database
      const { data: recommendationData, error: recError } = await supabase
        .from('career_recommendations' as any)
        .select('id')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (recError) throw recError;

      if (!recommendationData) {
        toast({
          title: "Error",
          description: "Could not find recommendation data",
          variant: "destructive"
        });
        return;
      }

      // Save or update the selection
      const { error: upsertError } = await supabase
        .from('user_career_selections' as any)
        .upsert({
          user_id: session.user.id,
          recommendation_id: (recommendationData as any).id,
          selected_domain: domainName
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) throw upsertError;

      setSelectedDomain(domainName);
      toast({
        title: "Career Saved!",
        description: `${domainName} has been saved as your main career path`,
      });

      setTimeout(() => {
        navigate('/career-ai-quiz');
      }, 1500);

    } catch (error) {
      console.error("Error saving career selection:", error);
      toast({
        title: "Error",
        description: "Failed to save your career selection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Your Career Insights</h1>
        </div>
        <p className="text-muted-foreground">AI-powered personalized career recommendations</p>
      </div>

      {/* Primary Recommendation */}
      <Card className="mb-6 border-primary/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl flex items-center gap-2 mb-2">
                <Sparkles className="h-6 w-6 text-primary" />
                {primary_domain.name}
              </CardTitle>
              <CardDescription className="text-base">
                {primary_domain.description}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {primary_domain.confidence}%
              </div>
              <p className="text-sm text-muted-foreground">Match Score</p>
            </div>
          </div>
          <Progress value={primary_domain.confidence} className="mt-4 h-2" />
        </CardHeader>
        {!isFromSelection && (
          <CardContent className="pt-6">
            <Button 
              onClick={() => handleSelectCareer(primary_domain.name)}
              disabled={saving || selectedDomain === primary_domain.name}
              className="w-full"
              size="lg"
            >
              {saving && selectedDomain === primary_domain.name ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : selectedDomain === primary_domain.name ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Selected as Main Career
                </>
              ) : (
                "Select as My Main Career"
              )}
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Alternative Domains */}
      {alternative_domains && alternative_domains.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Alternative Career Paths
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {alternative_domains.map((domain: any, idx: number) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{domain.name}</CardTitle>
                      <CardDescription className="mt-2">{domain.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{domain.confidence}%</Badge>
                  </div>
                </CardHeader>
                {!isFromSelection && (
                  <CardContent>
                    <Button 
                      onClick={() => handleSelectCareer(domain.name)}
                      disabled={saving || selectedDomain === domain.name}
                      variant="outline"
                      className="w-full"
                    >
                      {saving && selectedDomain === domain.name ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : selectedDomain === domain.name ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Selected
                        </>
                      ) : (
                        "Select This Career"
                      )}
                    </Button>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Roadmap Overview */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Core Subjects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Core Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {roadmap.core_subjects.map((subject: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{subject}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Software Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Software Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {roadmap.software_tools.map((tool: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{tool}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Key Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Key Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {roadmap.key_skills.map((skill: string, idx: number) => (
                <Badge key={idx} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Job Roles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Potential Job Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {roadmap.job_roles.map((role: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{role}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Companies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Top Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {roadmap.companies.map((company: string, idx: number) => (
                <Badge key={idx} variant="outline">
                  {company}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Recommended Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {roadmap.certifications.map((cert: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Learning Path */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            Your Personalized Learning Roadmap
          </CardTitle>
          <CardDescription>Step-by-step path to achieve your career goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {roadmap.learning_path.map((phase: any, idx: number) => (
              <div key={idx} className="relative pl-8 pb-6 border-l-2 border-primary/30 last:border-l-0 last:pb-0">
                <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{phase.phase}</h3>
                  <p className="text-sm text-muted-foreground mb-3">Duration: {phase.duration}</p>
                  <ul className="space-y-2">
                    {phase.activities.map((activity: string, actIdx: number) => (
                      <li key={actIdx} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={() => navigate('/career-ai-quiz')}>
          Retake Quiz
        </Button>
        <Button onClick={() => navigate('/streams')}>
          Explore All Streams
        </Button>
      </div>
    </div>
  );
};

export default CareerInsights;