import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { TemplatePreviewModal } from "@/components/resume/TemplatePreviewModalClean";
import { AITemplateSuggestionModal } from "../components/resume/AITemplateSuggestionModal";
import { TemplateType } from "@/types/resume";

interface Template {
  id: TemplateType;
  name: string;
  description: string;
  tags: string[];
  preview: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'ATS-friendly traditional resume with clean formatting',
    tags: ['Professional', 'ATS', 'Traditional'],
    preview: '/templates/classic-preview.svg',
  },
  {
    id: 'minimalist',
    name: 'Clean Minimal',
    description: 'Minimalist design with whitespace focus',
    tags: ['Minimal', 'Clean', 'Modern'],
    preview: '/templates/minimalist-preview.svg',
  },
  {
    id: 'modern',
    name: 'Modern Gradient',
    description: 'Contemporary style with subtle gradient accents',
    tags: ['Modern', 'Creative', 'Contemporary'],
    preview: '/templates/modern-preview.svg',
  },
  {
    id: 'tech',
    name: 'Tech Executive',
    description: 'Perfect for tech professionals and developers',
    tags: ['Tech', 'Developer', 'Modern'],
    preview: '/templates/tech-preview.svg',
  },
  {
    id: 'creative',
    name: 'Student Starter CV',
    description: 'Ideal for fresh graduates and students',
    tags: ['Student', 'Creative', 'Entry-level'],
    preview: '/templates/creative-preview.svg',
  },
];

export default function ResumeBuilder() {
  const { user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showAISuggestion, setShowAISuggestion] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <Card className="p-12 text-center max-w-md animate-fade-in shadow-xl">
          <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-8">
            Please sign in to access the AI Resume Builder.
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
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            AI Resume Builder
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose your perfect resume template and let AI help you create a stunning resume
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {/* Quick scanner card */}
          <div className="lg:col-span-5">
            <Card className="p-6 mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Resume Scanner</h3>
                <p className="text-sm text-muted-foreground">Scan your resume for ATS compatibility and get AI improvements instantly.</p>
              </div>
              <div>
                <Link to="/scanner">
                  <Button size="sm">Open Scanner</Button>
                </Link>
              </div>
            </Card>
              <Card className="p-6 mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">LinkedIn Transformer</h3>
                  <p className="text-sm text-muted-foreground">Paste your LinkedIn profile or URL and get AI-powered optimization and before/after comparison.</p>
                </div>
                <div>
                  <Link to="/linkedin-transformer">
                    <Button size="sm" variant="secondary">Open Transformer</Button>
                  </Link>
                </div>
              </Card>
          </div>
          {TEMPLATES.map((template) => (
            <Card
              key={template.id}
              className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
            >
              {/* Template Preview Image */}
              <div className="bg-gradient-to-b h-64 flex items-center justify-center overflow-hidden relative"
                style={{
                  background: 
                    template.id === 'classic' ? 'linear-gradient(135deg, #000 0%, #333 100%)' :
                    template.id === 'modern' ? 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' :
                    template.id === 'creative' ? 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' :
                    template.id === 'minimalist' ? 'linear-gradient(135deg, #6b7280 0%, #d1d5db 100%)' :
                    template.id === 'elegant' ? 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)' :
                    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                }}
              >
                <div className="text-center text-white space-y-2 p-4">
                  <div className="text-3xl">📄</div>
                  <p className="font-semibold text-sm">{template.name}</p>
                  <p className="text-xs opacity-75">Click to preview</p>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Buttons */}
                <div className="space-y-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setShowPreview(true);
                    }}
                  >
                    Preview
                  </Button>
                  <Link to={`/resume-builder/form?template=${template.id}`}>
                    <Button size="sm" className="w-full">
                      Use This Template
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* AI Suggestion Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">AI Pick My Template</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Not sure which template fits you best? Let our AI analyze your needs and suggest the perfect resume template for your situation.
          </p>
          <Button
            size="lg"
            onClick={() => setShowAISuggestion(true)}
            className="gap-2"
          >
            <Sparkles className="w-5 h-5" />
            AI Suggest Template
          </Button>
        </Card>
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <TemplatePreviewModal
          template={selectedTemplate}
          isOpen={showPreview}
          onClose={() => {
            setShowPreview(false);
            setSelectedTemplate(null);
          }}
          onUseTemplate={(template) => {
            setShowPreview(false);
            // Navigation handled by button link
          }}
        />
      )}

      {/* AI Suggestion Modal */}
      {showAISuggestion && (
        <AITemplateSuggestionModal
          isOpen={showAISuggestion}
          onClose={() => setShowAISuggestion(false)}
          onSelectTemplate={(template) => {
            setShowAISuggestion(false);
            // Can redirect to form with selected template
          }}
        />
      )}
    </div>
  );
}
