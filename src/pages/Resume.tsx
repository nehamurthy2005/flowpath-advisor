import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Download, ArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ResumeForm } from "@/components/resume/ResumeForm";
import { ModernTemplate } from "@/components/resume/templates/ModernTemplate";
import { ClassicTemplate } from "@/components/resume/templates/ClassicTemplate";
import { CreativeTemplate } from "@/components/resume/templates/CreativeTemplate";
import { MinimalistTemplate } from "@/components/resume/templates/MinimalistTemplate";
import { ElegantTemplate } from "@/components/resume/templates/ElegantTemplate";
import { TechTemplate } from "@/components/resume/templates/TechTemplate";
import { ResumeData, TemplateType } from "@/types/resume";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useToast } from "@/hooks/use-toast";
import html2pdf from "html2pdf.js";

const templates = [
  { id: 'modern' as TemplateType, name: 'Modern', description: 'Clean Blue Two-Column' },
  { id: 'classic' as TemplateType, name: 'Classic', description: 'Black & White Traditional' },
  { id: 'creative' as TemplateType, name: 'Creative', description: 'Colorful Header Style' },
  { id: 'minimalist' as TemplateType, name: 'Minimalist', description: 'Whitespace Focused' },
  { id: 'elegant' as TemplateType, name: 'Elegant', description: 'Professional Corporate' },
  { id: 'tech' as TemplateType, name: 'Tech', description: 'Developer Terminal Style' },
];

export default function Resume() {
  const { user } = useAuth();
  const { toast } = useToast();
  const isAuthenticated = !!user;
  const previewRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();

  const templateParam = searchParams.get('template') as TemplateType | null;
  const isFromBuilder = !!templateParam;

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(
    templateParam || 'modern'
  );
  const [resumeData, setResumeData] = useState<ResumeData>({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    summary: '',
    education: [],
    skills: '',
    projects: [],
    experience: [],
    achievements: '',
  });

  // Auto-populate from user profile on load
  useEffect(() => {
    if (!user) return;
    const md = (user.user_metadata ?? {}) as Record<string, unknown>;
    const getStr = (k: string) => {
      const v = md[k];
      return typeof v === 'string' ? (v as string) : undefined;
    };

    setResumeData((prev) => ({
      ...prev,
      name: getStr('full_name') ?? getStr('name') ?? prev.name,
      email: getStr('email_custom') ?? user.email ?? prev.email,
      phone: getStr('phone') ?? prev.phone,
      linkedin: getStr('linkedin') ?? prev.linkedin,
      portfolio: getStr('portfolio') ?? prev.portfolio,
      summary: getStr('bio') ?? prev.summary,
      education:
        prev.education.length === 0 && typeof md['education'] === 'string' && md['education']
          ? [{ id: crypto.randomUUID(), degree: md['education'] as string, institution: '', year: '' }]
          : prev.education,
    }));
  }, [user]);

  const renderTemplate = () => {
    const props = { data: resumeData };
    switch (selectedTemplate) {
      case 'modern':
        return <ModernTemplate {...props} />;
      case 'classic':
        return <ClassicTemplate {...props} />;
      case 'creative':
        return <CreativeTemplate {...props} />;
      case 'minimalist':
        return <MinimalistTemplate {...props} />;
      case 'elegant':
        return <ElegantTemplate {...props} />;
      case 'tech':
        return <TechTemplate {...props} />;
      default:
        return <ModernTemplate {...props} />;
    }
  };

  const downloadPDF = async () => {
    if (!previewRef.current) return;

    toast({
      title: "Generating PDF...",
      description: "Please wait while we create your resume.",
    });

    try {
      const element = previewRef.current;
      const opt = {
        margin: 0,
        filename: `${resumeData.name || 'resume'}_${selectedTemplate}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
      };

      await html2pdf().set(opt).from(element).save();
      
      toast({
        title: "Success!",
        description: "Your resume has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <Card className="p-12 text-center max-w-md animate-fade-in shadow-xl">
          <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-8">
            Please sign in to access the Resume Builder and create your professional resume.
          </p>
          <Link to="/auth">
            <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
              Sign In to Continue
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {isFromBuilder && (
                <Link to="/resume-builder">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
              )}
              <h1 className="text-2xl font-bold">Resume Builder</h1>
            </div>
            <div className="flex gap-2">
              {isFromBuilder && (
                <Link to="/resume-builder">
                  <Button variant="outline" className="gap-2">
                    Change Template
                  </Button>
                </Link>
              )}
              <Button onClick={downloadPDF} className="gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selector */}
      <div className="bg-muted/30 border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {templates.map((template) => (
              <Button
                key={template.id}
                variant={selectedTemplate === template.id ? 'default' : 'outline'}
                onClick={() => setSelectedTemplate(template.id)}
                className="flex-shrink-0 transition-all"
              >
                <div className="text-left">
                  <div className="font-semibold">{template.name}</div>
                  <div className="text-xs opacity-80">{template.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Split View */}
      <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-140px)] w-full">
        <ResizablePanel defaultSize={40} minSize={30}>
          <div className="h-full overflow-y-auto">
            <ResumeForm data={resumeData} onChange={setResumeData} />
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={60} minSize={40}>
          <div className="h-full overflow-y-auto bg-muted/20 p-8">
            <div 
              ref={previewRef}
              className="mx-auto shadow-2xl animate-fade-in"
              style={{ 
                width: '210mm',
                minHeight: '297mm',
              }}
            >
              {renderTemplate()}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
