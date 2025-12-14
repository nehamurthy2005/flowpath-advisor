import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type ProfileSectionFeedback = {
  headline: string;
  about: string;
  experience: string;
  skills: string;
  education: string;
};

type ProfileResult = {
  profile_score_before: number;
  profile_score_after: number;
  score_improvement: number;
  original: {
    name: string;
    headline: string;
    about: string;
    experience: string;
    education: string;
    skills: string;
  };
  optimized: {
    name: string;
    headline: string;
    about: string;
    experience: string;
    education: string;
    skills: string;
  };
  section_feedback: ProfileSectionFeedback;
};

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, FileText, ArrowRight, Target, Copy, Download, RefreshCw } from "lucide-react";

export default function LinkedinTransformer() {
  const [profileContent, setProfileContent] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProfileResult | null>(null);

  const handleTransform = async () => {
    if (!profileContent.trim()) {
      toast.error("Please paste your LinkedIn profile content");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('linkedin-optimizer', {
        body: { 
          profileContent: profileContent.trim(),
          targetRole: targetRole.trim() || undefined
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        toast.error(error.message || 'Failed to analyze profile');
        setLoading(false);
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      setResult(data);
      toast.success('Profile analysis complete!');
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to analyze profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyOptimized = async () => {
    if (!result) return;
    const text = `Name: ${result.optimized.name}\nHeadline: ${result.optimized.headline}\n\nAbout:\n${result.optimized.about}\n\nExperience:\n${result.optimized.experience}\n\nEducation:\n${result.optimized.education}\n\nSkills:\n${result.optimized.skills}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Optimized profile copied to clipboard!');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      toast.success('Optimized profile copied to clipboard!');
    }
  };

  const downloadTXT = () => {
    if (!result) return;
    const text = `OPTIMIZED LINKEDIN PROFILE
========================

Name: ${result.optimized.name}

Headline:
${result.optimized.headline}

About:
${result.optimized.about}

Experience:
${result.optimized.experience}

Education:
${result.optimized.education}

Skills:
${result.optimized.skills}

========================
Profile Score: ${result.profile_score_before}% → ${result.profile_score_after}% (+${result.score_improvement}% improvement)
`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized-linkedin-profile.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Profile downloaded!');
  };

  const downloadPDF = () => {
    if (!result) return;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Optimized LinkedIn Profile</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; }
          h1 { color: #0077b5; border-bottom: 2px solid #0077b5; padding-bottom: 10px; }
          h2 { color: #333; margin-top: 24px; }
          .score { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 24px; border-radius: 8px; text-align: center; margin-bottom: 24px; }
          .section { background: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
          .section-title { font-weight: bold; color: #0077b5; margin-bottom: 8px; }
        </style>
      </head>
      <body>
        <div class="score">
          <strong>Profile Score: ${result.profile_score_before}% → ${result.profile_score_after}%</strong><br/>
          <span>+${result.score_improvement}% Improvement</span>
        </div>
        <h1>${result.optimized.name}</h1>
        <h2>${result.optimized.headline}</h2>
        
        <div class="section">
          <div class="section-title">About</div>
          <p>${result.optimized.about.replace(/\n/g, '<br/>')}</p>
        </div>
        
        <div class="section">
          <div class="section-title">Experience</div>
          <p>${result.optimized.experience.replace(/\n/g, '<br/>')}</p>
        </div>
        
        <div class="section">
          <div class="section-title">Education</div>
          <p>${result.optimized.education}</p>
        </div>
        
        <div class="section">
          <div class="section-title">Skills</div>
          <p>${result.optimized.skills}</p>
        </div>
      </body>
      </html>`;
    const w = window.open('', '_blank');
    if (!w) {
      toast.error('Please allow popups to download PDF');
      return;
    }
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 400);
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-4xl">
        {/* Header Card */}
        <Card className="p-8 mb-8 shadow-xl animate-fade-in border-primary/20">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Powered Profile Optimization
            </div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Transform Your LinkedIn Profile
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Paste your LinkedIn profile content and let AI analyze, score, and optimize it for your target career role.
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <span className="text-3xl font-bold text-primary">3x</span>
              <div className="text-sm text-muted-foreground">More Profile Views</div>
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold text-primary">85%</span>
              <div className="text-sm text-muted-foreground">Score Increase</div>
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold text-primary">2min</span>
              <div className="text-sm text-muted-foreground">AI Analysis</div>
            </div>
          </div>

          {/* How it works */}
          <div className="flex justify-center items-center gap-4 mb-8 flex-wrap">
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Copy Profile</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Set Target Role</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">AI Optimizes</span>
            </div>
          </div>

          {/* Input Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Target Career Role (Optional)
              </label>
              <Input
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., Software Engineer, Product Manager, Data Scientist..."
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                LinkedIn Profile Content <span className="text-destructive">*</span>
              </label>
              <div className="text-xs text-muted-foreground mb-2">
                Go to your LinkedIn profile → Click "More" → "Save to PDF" or simply copy all visible text from your profile page
              </div>
              <Textarea
                value={profileContent}
                onChange={(e) => setProfileContent(e.target.value)}
                placeholder={`Paste your entire LinkedIn profile here...

Example format:
John Doe
Senior Software Engineer at Tech Company
San Francisco Bay Area

About
I am a passionate software engineer with 5+ years of experience...

Experience
Senior Software Engineer
Tech Company · Full-time
Jan 2020 - Present · 4 yrs
- Led development of microservices architecture...

Education
Bachelor of Science in Computer Science
Stanford University
2014 - 2018

Skills
JavaScript, React, Node.js, Python, AWS, Docker...`}
                rows={16}
                className="w-full min-h-[300px] rounded-xl border-2 border-primary/30 bg-background px-4 py-3 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-primary transition-all font-mono"
              />
            </div>

            <Button 
              size="lg" 
              className="w-full mt-4 h-14 text-lg font-semibold" 
              onClick={handleTransform} 
              disabled={loading || !profileContent.trim()}
            >
              {loading ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Transform My LinkedIn Profile
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="p-8 text-center animate-fade-in shadow-xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h2 className="text-xl font-bold mb-2">AI is analyzing your profile...</h2>
            <p className="text-muted-foreground">
              Extracting sections, scoring content, and generating optimizations. This may take a moment.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </Card>
        )}

        {/* Results */}
        {result && (
          <Card className="p-8 shadow-xl animate-fade-in">
            {/* Score Banner */}
            <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-primary-foreground text-center">
              <h2 className="text-2xl font-bold mb-2">✨ Profile Transformation Complete!</h2>
              <div className="flex justify-center items-center gap-4 text-lg">
                <span className="bg-white/20 px-4 py-2 rounded-lg">
                  Before: <strong>{result.profile_score_before}%</strong>
                </span>
                <ArrowRight className="w-6 h-6" />
                <span className="bg-white/20 px-4 py-2 rounded-lg">
                  After: <strong>{result.profile_score_after}%</strong>
                </span>
                <span className="bg-green-500 px-4 py-2 rounded-lg font-bold">
                  +{result.score_improvement}%
                </span>
              </div>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Original Profile */}
              <Card className="p-5 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  Original Profile
                </h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-muted-foreground">Name:</strong>
                    <p>{result.original.name || 'Not detected'}</p>
                  </div>
                  <div>
                    <strong className="text-muted-foreground">Headline:</strong>
                    <p>{result.original.headline || 'Not detected'}</p>
                  </div>
                  <div>
                    <strong className="text-muted-foreground">About:</strong>
                    <p className="whitespace-pre-wrap">{result.original.about || 'Not detected'}</p>
                  </div>
                  <div>
                    <strong className="text-muted-foreground">Experience:</strong>
                    <p className="whitespace-pre-wrap">{result.original.experience || 'Not detected'}</p>
                  </div>
                  <div>
                    <strong className="text-muted-foreground">Education:</strong>
                    <p>{result.original.education || 'Not detected'}</p>
                  </div>
                  <div>
                    <strong className="text-muted-foreground">Skills:</strong>
                    <p>{result.original.skills || 'Not detected'}</p>
                  </div>
                </div>
              </Card>

              {/* Optimized Profile */}
              <Card className="p-5 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  Optimized Profile
                </h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong className="text-muted-foreground">Name:</strong>
                    <p>{result.optimized.name}</p>
                  </div>
                  <div>
                    <strong className="text-muted-foreground">Headline:</strong>
                    <p className="font-medium text-green-700 dark:text-green-300">{result.optimized.headline}</p>
                  </div>
                  <div>
                    <strong className="text-muted-foreground">About:</strong>
                    <p className="whitespace-pre-wrap">{result.optimized.about}</p>
                  </div>
                  <div>
                    <strong className="text-muted-foreground">Experience:</strong>
                    <p className="whitespace-pre-wrap">{result.optimized.experience}</p>
                  </div>
                  <div>
                    <strong className="text-muted-foreground">Education:</strong>
                    <p>{result.optimized.education}</p>
                  </div>
                  <div>
                    <strong className="text-muted-foreground">Skills:</strong>
                    <p>{result.optimized.skills}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Section Feedback */}
            <Card className="p-5 mb-6 bg-muted/30">
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Improvement Feedback
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(result.section_feedback).map(([section, feedback]) => (
                  <div key={section} className="bg-background p-3 rounded-lg border">
                    <strong className="capitalize text-primary">{section}:</strong>
                    <p className="text-sm text-muted-foreground mt-1">{String(feedback)}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={copyOptimized} className="flex-1 min-w-[150px]">
                <Copy className="w-4 h-4 mr-2" />
                Copy Optimized
              </Button>
              <Button variant="outline" onClick={downloadTXT} className="flex-1 min-w-[150px]">
                <Download className="w-4 h-4 mr-2" />
                Download TXT
              </Button>
              <Button variant="outline" onClick={downloadPDF} className="flex-1 min-w-[150px]">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="secondary" onClick={handleTransform} disabled={loading} className="flex-1 min-w-[150px]">
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
