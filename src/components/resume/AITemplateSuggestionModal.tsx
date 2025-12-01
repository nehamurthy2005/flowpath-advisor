import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { TemplateType } from "@/types/resume";
import { Link } from "react-router-dom";

interface AITemplateSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: TemplateType) => void;
}

type Purpose = 'job' | 'internship' | 'college' | 'student' | 'scholarship';
type Tone = 'professional' | 'creative' | 'minimal' | 'ats' | 'modern';
type Field = 'engineering' | 'it' | 'business' | 'finance' | 'design' | 'marketing' | 'healthcare' | 'science' | 'arts' | 'commerce' | 'other';

interface Recommendation {
  template: TemplateType;
  name: string;
  reason: string;
  useCase: string;
  aesthetic: string;
  atsCompatibility: string;
}

export function AITemplateSuggestionModal({
  isOpen,
  onClose,
  onSelectTemplate,
}: AITemplateSuggestionModalProps) {
  const STORAGE_KEY = 'aiTemplateSuggestion';

  const [step, setStep] = useState<'purpose' | 'tone' | 'field' | 'results'>(
    'purpose'
  );
  const [purpose, setPurpose] = useState<Purpose | null>(null);
  const [tone, setTone] = useState<Tone | null>(null);
  const [field, setField] = useState<Field | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // Load saved data from localStorage on mount or when modal opens
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const { step: savedStep, purpose: savedPurpose, tone: savedTone, field: savedField, recommendations: savedRecs } = JSON.parse(saved);
          setStep(savedStep);
          setPurpose(savedPurpose);
          setTone(savedTone);
          setField(savedField);
          if (savedRecs) setRecommendations(savedRecs);
        } catch (error) {
          console.error('Failed to load saved AI template data', error);
        }
      }
    }
  }, [isOpen]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const data = { step, purpose, tone, field, recommendations };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [step, purpose, tone, field, recommendations]);

  const purposeOptions: { value: Purpose; label: string }[] = [
    { value: 'job', label: 'Job Application' },
    { value: 'internship', label: 'Internship' },
    { value: 'college', label: 'College Admission' },
    { value: 'student', label: 'Student CV' },
    { value: 'scholarship', label: 'Scholarship Application' },
  ];

  const toneOptions: { value: Tone; label: string }[] = [
    { value: 'professional', label: 'Professional' },
    { value: 'creative', label: 'Creative' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'ats', label: 'ATS Friendly' },
    { value: 'modern', label: 'Modern Clean' },
  ];

  const fieldOptions: { value: Field; label: string }[] = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'it', label: 'IT / Software' },
    { value: 'business', label: 'Business / Management' },
    { value: 'finance', label: 'Finance' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'healthcare', label: 'Medicine / Healthcare' },
    { value: 'science', label: 'Science' },
    { value: 'arts', label: 'Arts' },
    { value: 'commerce', label: 'Commerce' },
    { value: 'other', label: 'Any other' },
  ];

  const getRecommendations = (purpose: Purpose, tone: Tone, field: Field): Recommendation[] => {
    // AI logic to recommend templates based on user inputs
    const recommendations: Recommendation[] = [];

    if (tone === 'ats' || purpose === 'job') {
      recommendations.push({
        template: 'classic',
        name: 'Classic Professional',
        reason: 'Optimized for ATS scanning and applicant tracking systems',
        useCase: 'Perfect for large companies and formal job applications',
        aesthetic: 'Traditional, clean, easy-to-parse formatting',
        atsCompatibility: '99% - Best for automated screening',
      });
    }

    if (tone === 'modern' || (field === 'it' && purpose === 'job')) {
      recommendations.push({
        template: 'tech',
        name: 'Tech Executive',
        reason: 'Perfect for tech professionals and modern roles',
        useCase: 'Ideal for software engineers, designers, and tech roles',
        aesthetic: 'Contemporary, code-like styling, developer-friendly',
        atsCompatibility: '95% - Good for tech-focused companies',
      });
    }

    if (tone === 'creative' || field === 'design' || field === 'marketing') {
      recommendations.push({
        template: 'creative',
        name: 'Student Starter CV',
        reason: 'Stands out with creative flair while staying professional',
        useCase: 'Great for creative roles and design positions',
        aesthetic: 'Vibrant, modern, visually appealing',
        atsCompatibility: '85% - Better for direct human review',
      });
    }

    if (!recommendations.length) {
      recommendations.push({
        template: 'minimalist',
        name: 'Clean Minimal',
        reason: 'Versatile design works across all industries and purposes',
        useCase: 'Universal choice for any application',
        aesthetic: 'Minimalist, focus on content, elegant whitespace',
        atsCompatibility: '97% - Excellent parsing compatibility',
      });
    }

    // Add a second recommendation
    if (recommendations.length < 2) {
      recommendations.push({
        template: 'modern',
        name: 'Modern Gradient',
        reason: 'Contemporary design with subtle visual interest',
        useCase: 'Good for startups and progressive companies',
        aesthetic: 'Modern, gradient accents, professional but fresh',
        atsCompatibility: '90% - Good for most applications',
      });
    }

    // Add a third recommendation
    if (recommendations.length < 3) {
      recommendations.push({
        template: 'elegant',
        name: 'Professional Elegant',
        reason: 'Executive-level design for senior positions',
        useCase: 'Management, finance, and corporate roles',
        aesthetic: 'Sophisticated, premium feel, corporate',
        atsCompatibility: '92% - Good ATS compatibility',
      });
    }

    return recommendations;
  };

  const handleNext = () => {
    if (step === 'purpose' && purpose) {
      setStep('tone');
    } else if (step === 'tone' && tone) {
      setStep('field');
    } else if (step === 'field' && field) {
      const recs = getRecommendations(purpose!, tone!, field);
      setRecommendations(recs);
      setStep('results');
    }
  };

  const handleReset = () => {
    setStep('purpose');
    setPurpose(null);
    setTone(null);
    setField(null);
    setRecommendations([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <DialogTitle>AI Template Suggestion</DialogTitle>
          </div>
        </DialogHeader>

        {/* Step: Purpose */}
        {step === 'purpose' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-4">
                What is your purpose for this resume?
              </h3>
              <div className="space-y-2">
                {purposeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={purpose === option.value ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setPurpose(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            <Button onClick={handleNext} disabled={!purpose} className="w-full">
              Next →
            </Button>
          </div>
        )}

        {/* Step: Tone */}
        {step === 'tone' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-4">What tone do you want?</h3>
              <div className="space-y-2">
                {toneOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={tone === option.value ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setTone(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('purpose')}
                className="flex-1"
              >
                ← Back
              </Button>
              <Button onClick={handleNext} disabled={!tone} className="flex-1">
                Next →
              </Button>
            </div>
          </div>
        )}

        {/* Step: Field */}
        {step === 'field' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-4">
                What field are you applying for?
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {fieldOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={field === option.value ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setField(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('tone')}
                className="flex-1"
              >
                ← Back
              </Button>
              <Button onClick={handleNext} disabled={!field} className="flex-1">
                Get Recommendations →
              </Button>
            </div>
          </div>
        )}

        {/* Results: Recommendations */}
        {step === 'results' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-4">
                🎯 Top 3 Recommended Templates
              </h3>
              <div className="space-y-4">
                {recommendations.map((rec, idx) => (
                  <Card
                    key={rec.template}
                    className="p-4 border-l-4 border-l-primary hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">
                            #{idx + 1} - {rec.name}
                          </h4>
                          {idx === 0 && (
                            <Badge className="bg-primary">Top Pick</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {rec.reason}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Best for:</span>
                          <p className="text-muted-foreground">{rec.useCase}</p>
                        </div>
                        <div>
                          <span className="font-medium">Style:</span>
                          <p className="text-muted-foreground">{rec.aesthetic}</p>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-sm">
                          ATS Compatibility:
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500"
                              style={{
                                width: rec.atsCompatibility.split('%')[0] + '%',
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold">
                            {rec.atsCompatibility}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          // Show preview
                        }}
                      >
                        Preview
                      </Button>
                      <Link
                        to={`/resume-builder/form?template=${rec.template}`}
                        className="flex-1"
                      >
                        <Button size="sm" className="w-full">
                          Use Template
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1"
              >
                ← Start Over
              </Button>
              <Button onClick={onClose} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
