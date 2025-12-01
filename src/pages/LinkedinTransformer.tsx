import { useState } from "react";

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
import { Sparkles, FileText, Link as LinkIcon, ArrowRight } from "lucide-react";

export default function LinkedinTransformer() {
  const [profileContent, setProfileContent] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProfileResult | null>(null);

  // Basic extraction heuristic: looks for labeled fields, otherwise does a simple fallback
  const extractProfile = (text: string) => {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const lower = text.toLowerCase();

    const findSection = (label: string) => {
      const regex = new RegExp(`${label}[:]?\\s*(.+)`, 'i');
      const m = text.match(regex);
      return m ? m[1].trim() : '';
    };

    const name = findSection('name') || lines[0] || '';
    const headline = findSection('headline') || lines[1] || '';
    const about = findSection('about') || (() => {
      const afterHeader = text.split(/about[:]?/i)[1];
      if (afterHeader) return afterHeader.split(/\r?\n\r?\n/)[0].trim();
      // fallback: first paragraph
      return lines.slice(2, 6).join(' ');
    })();

    // Experience: try to grab a block after "experience" or look for company-like lines
    let experience = findSection('experience');
    if (!experience) {
      const expIndex = lines.findIndex(l => /experience/i.test(l));
      if (expIndex >= 0) {
        experience = lines.slice(expIndex + 1, expIndex + 6).join(' ');
      } else {
        // fallback: search for year ranges
        const yrs = lines.filter(l => /\b\d{4}[-–]\d{4}\b/.test(l));
        experience = yrs.join(' | ') || lines.slice(3, 6).join(' ');
      }
    }

    const education = findSection('education') || lines.find(l => /bsc|ba|ms|mba|phd|university|college/i.test(l)) || '';
    const skillsRaw = findSection('skills') || lines.find(l => /skills[:]?/i.test(l)) || '';
    const skills = skillsRaw || (() => {
      // try to infer comma separated list on last lines
      const last = lines.slice(-3).join(', ');
      return /,/.test(last) ? last : '';
    })();

    return {
      name: String(name).trim(),
      headline: String(headline).trim(),
      about: String(about).trim(),
      experience: String(experience).trim(),
      education: String(education).trim(),
      skills: String(skills).trim(),
    };
  };

  const dedupeSkills = (s: string) => {
    return Array.from(new Set(s.split(/[;,|\n]/).map(x => x.trim()).filter(Boolean))).slice(0, 12).join(', ');
  }

  const generateOptimized = (orig: ReturnType<typeof extractProfile>) => {
    const topSkills = dedupeSkills(orig.skills || '').split(', ').filter(Boolean);
    const primarySkill = topSkills[0] || 'your domain';

    const optimizedHeadline = orig.headline
      ? `${orig.headline} | ${primarySkill} Specialist | Driving Impact`
      : `${orig.name} | ${primarySkill} Professional | Results-driven`;

    const optimizedAbout = orig.about
      ? `${orig.about} Focused on measurable outcomes and collaboration. Proven record of delivering results and improving processes.`
      : `Experienced professional with a strong track record in ${primarySkill}. Adept at driving results, optimizing workflows, and mentoring teams.`;

    const optimizedExperience = orig.experience
      ? orig.experience.split(/;|\n|\|/).map(e => (e.trim().startsWith('-') ? e.trim() : `• ${e.trim()}`)).join('\n')
      : `• Worked on projects delivering measurable impact in ${primarySkill}.`;

    const optimizedEducation = orig.education || '';

    const optimizedSkills = dedupeSkills((topSkills.length ? topSkills.join(', ') : orig.skills) || '').slice(0, 300);

    return {
      name: orig.name || '',
      headline: optimizedHeadline,
      about: optimizedAbout,
      experience: optimizedExperience,
      education: optimizedEducation,
      skills: optimizedSkills,
    };
  };

  const handleTransform = async () => {
    setLoading(true);
    // Simulate AI processing (replace with real API call)
    setTimeout(() => {
      const orig = extractProfile(profileContent || '');
      const optimized = generateOptimized(orig);

      // simple scoring heuristic
      const scoreKeywords = (text: string) => (String(text).match(/\b(skill|lead|managed|led|improved|achieved|%|\d{4})\b/ig) || []).length;
      const beforeScore = Math.min(95, Math.max(10, 30 + scoreKeywords(orig.about) * 5 + (orig.headline ? 10 : 0)));
      const afterScore = Math.min(99, beforeScore + 25 + scoreKeywords(optimized.about) * 3);

      setResult({
        profile_score_before: Math.round(beforeScore),
        profile_score_after: Math.round(afterScore),
        score_improvement: Math.round(afterScore - beforeScore),
        original: {
          name: orig.name || '',
          headline: orig.headline || '',
          about: orig.about || '',
          experience: orig.experience || '',
          education: orig.education || '',
          skills: orig.skills || ''
        },
        optimized: optimized,
        section_feedback: {
          headline: 'Improved clarity, keywords, and recruiter focus.',
          about: 'Expanded summary, emphasized achievements and impact.',
          experience: 'Converted roles into concise bullet points with metrics where possible.',
          skills: 'Organized and prioritized relevant skills.',
          education: 'Clean formatting and relevant details highlighted.'
        }
      });
      setLoading(false);
    }, 900);
  };

  const copyOptimized = async () => {
    if (!result) return;
    const text = `Name: ${result.optimized.name}\nHeadline: ${result.optimized.headline}\n\nAbout:\n${result.optimized.about}\n\nExperience:\n${result.optimized.experience}\n\nEducation:\n${result.optimized.education}\n\nSkills:\n${result.optimized.skills}`;
    try {
      await navigator.clipboard.writeText(text);
      alert('Optimized profile copied to clipboard');
    } catch (e) {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      alert('Optimized profile copied to clipboard');
    }
  };

  const downloadTXT = (filename = 'optimized-linkedin.txt') => {
    if (!result) return;
    const text = `Name: ${result.optimized.name}\nHeadline: ${result.optimized.headline}\n\nAbout:\n${result.optimized.about}\n\nExperience:\n${result.optimized.experience}\n\nEducation:\n${result.optimized.education}\n\nSkills:\n${result.optimized.skills}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    if (!result) return;
    const html = `
      <html><head><title>Optimized LinkedIn Profile</title></head><body style="font-family:Arial,Helvetica,sans-serif;padding:24px;">
      <h1>${result.optimized.name}</h1>
      <h3>${result.optimized.headline}</h3>
      <h4>About</h4><p>${result.optimized.about.replace(/\n/g,'<br/>')}</p>
      <h4>Experience</h4><p>${result.optimized.experience.replace(/\n/g,'<br/>')}</p>
      <h4>Education</h4><p>${result.optimized.education}</p>
      <h4>Skills</h4><p>${result.optimized.skills}</p>
      </body></html>`;
    const w = window.open('', '_blank');
    if (!w) return alert('Please allow popups to enable PDF download/print');
    w.document.write(html);
    w.document.close();
    w.focus();
    // trigger print so user can save as PDF
    setTimeout(() => w.print(), 400);
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-3xl">
        <Card className="p-8 mb-8 shadow-xl animate-fade-in">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2">Transform Your LinkedIn Profile</h1>
            <p className="text-lg text-muted-foreground mb-4">Get AI-powered suggestions to optimize your profile for more views, connections, and opportunities.</p>
            <div className="flex justify-center gap-6 mb-4">
              <div className="text-center">
                <span className="text-2xl font-bold text-primary">3x</span>
                <div className="text-xs text-muted-foreground">More Profile Views</div>
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-primary">85%</span>
                <div className="text-xs text-muted-foreground">Profile Score Increase</div>
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-primary">5min</span>
                <div className="text-xs text-muted-foreground">Quick Setup</div>
              </div>
            </div>
            <div className="flex justify-center gap-8 mb-6">
              <div className="flex flex-col items-center">
                <FileText className="w-6 h-6 mb-1 text-primary" />
                <span className="text-xs">Copy LinkedIn</span>
              </div>
              <div className="flex flex-col items-center">
                <ArrowRight className="w-6 h-6 mb-1 text-primary" />
                <span className="text-xs">Paste</span>
              </div>
              <div className="flex flex-col items-center">
                <Sparkles className="w-6 h-6 mb-1 text-primary" />
                <span className="text-xs">AI Optimizes</span>
              </div>
              <div className="flex flex-col items-center">
                <ArrowRight className="w-6 h-6 mb-1 text-primary" />
                <span className="text-xs">See Results</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Textarea
              value={profileContent}
              onChange={e => setProfileContent(e.target.value)}
              placeholder="Paste your entire LinkedIn profile content here… (Name, Headline, About, Experience, Education, Skills)"
              rows={14}
              className="w-full min-h-[220px] rounded-xl border-2 border-primary/40 bg-white/80 px-4 py-3 text-base shadow-md focus-visible:ring-2 focus-visible:ring-primary transition-all"
            />
            <div className="flex items-center gap-2">
              <Input
                value={profileUrl}
                onChange={e => setProfileUrl(e.target.value)}
                placeholder="Enter your LinkedIn profile URL (optional)"
                className="w-full"
              />
              <LinkIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            <Button size="lg" className="w-full mt-2" onClick={handleTransform} disabled={loading || (!profileContent && !profileUrl)}>
              🚀 Transform My LinkedIn Profile
            </Button>
          </div>
        </Card>

        {loading && (
          <Card className="p-8 text-center animate-fade-in shadow-xl">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-bold mb-2">Analyzing your profile…</h2>
            <p className="text-muted-foreground">Our AI is extracting, scoring, and optimizing your LinkedIn profile. Please wait…</p>
          </Card>
        )}

        {result && (
          <Card className="p-8 shadow-xl animate-fade-in">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-2">✔ Profile Transformation Complete!</h2>
              <div className="text-lg font-semibold mb-2">
                {result.profile_score_before}% → {result.profile_score_after}% (+{result.score_improvement}% Improvement)
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4 bg-red-50 border border-red-200 rounded-lg shadow">
                <h3 className="text-lg font-bold text-red-600 mb-2">Original Profile</h3>
                <div className="space-y-2">
                  <div><strong>Name:</strong> {result.original.name}</div>
                  <div><strong>Headline:</strong> {result.original.headline}</div>
                  <div><strong>About:</strong> {result.original.about}</div>
                  <div><strong>Experience:</strong> {result.original.experience}</div>
                  <div><strong>Education:</strong> {result.original.education}</div>
                  <div><strong>Skills:</strong> {result.original.skills}</div>
                </div>
              </Card>
              <Card className="p-4 bg-green-50 border border-green-200 rounded-lg shadow">
                <h3 className="text-lg font-bold text-green-600 mb-2">Optimized Profile</h3>
                <div className="space-y-2">
                  <div><strong>Name:</strong> {result.optimized.name}</div>
                  <div><strong>Headline:</strong> {result.optimized.headline}</div>
                  <div><strong>About:</strong> {result.optimized.about}</div>
                  <div><strong>Experience:</strong> {result.optimized.experience}</div>
                  <div><strong>Education:</strong> {result.optimized.education}</div>
                  <div><strong>Skills:</strong> {result.optimized.skills}</div>
                </div>
              </Card>
            </div>
            <div className="mt-8">
              <h4 className="text-lg font-bold mb-2">Section Feedback</h4>
              <ul className="space-y-2">
                {Object.entries(result.section_feedback).map(([section, feedback]) => (
                  <li key={section} className="text-muted-foreground">
                    <strong className="capitalize">{section}:</strong> {String(feedback)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 flex flex-col md:flex-row gap-4">
              <Button variant="outline" className="w-full md:w-auto" onClick={copyOptimized}>Copy Optimized Profile</Button>
              <Button variant="outline" className="w-full md:w-auto" onClick={() => downloadTXT()}>Download (TXT)</Button>
              <Button variant="outline" className="w-full md:w-auto" onClick={downloadPDF}>Download (PDF)</Button>
              <Button variant="secondary" className="w-full md:w-auto" onClick={handleTransform}>Regenerate With AI</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
