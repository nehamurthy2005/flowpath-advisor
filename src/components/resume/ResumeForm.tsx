import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Plus, X, Sparkles } from "lucide-react";
import { ResumeData, Education, Project, Experience } from "@/types/resume";
import { useState } from "react";

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export function ResumeForm({ data, onChange }: ResumeFormProps) {
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  const updateField = (field: keyof ResumeData, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  const handleAIAssist = async (fieldName: string, currentValue: string, action: 'rewrite' | 'bullet' | 'expand') => {
    setAiLoading(`${fieldName}-${action}`);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock AI responses
      let aiResponse = currentValue;
      if (action === 'bullet' && currentValue) {
        aiResponse = `• ${currentValue.split('.').join('.\n• ').trim()}`;
      } else if (action === 'expand' && currentValue) {
        aiResponse = currentValue + '\n(AI expanded content would go here)';
      } else if (action === 'rewrite') {
        aiResponse = currentValue; // Placeholder for rewrite logic
      }
      
      // Apply AI response
      if (fieldName === 'summary') updateField('summary', aiResponse);
      if (fieldName === 'skills') updateField('skills', aiResponse);
      if (fieldName === 'achievements') updateField('achievements', aiResponse);
    } finally {
      setAiLoading(null);
    }
  };

  const addEducation = () => {
    updateField('education', [...data.education, { id: crypto.randomUUID(), degree: '', institution: '', year: '' }]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    updateField('education', data.education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const removeEducation = (id: string) => {
    updateField('education', data.education.filter(edu => edu.id !== id));
  };

  const addProject = () => {
    updateField('projects', [...data.projects, { id: crypto.randomUUID(), title: '', description: '', link: '' }]);
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    updateField('projects', data.projects.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    ));
  };

  const removeProject = (id: string) => {
    updateField('projects', data.projects.filter(proj => proj.id !== id));
  };

  const addExperience = () => {
    updateField('experience', [...data.experience, { id: crypto.randomUUID(), company: '', role: '', duration: '', description: '' }]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    updateField('experience', data.experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeExperience = (id: string) => {
    updateField('experience', data.experience.filter(exp => exp.id !== id));
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="p-6 space-y-4">
        <h3 className="text-xl font-semibold">Personal Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={data.linkedin}
                onChange={(e) => updateField('linkedin', e.target.value)}
                placeholder="linkedin.com/in/johndoe"
              />
            </div>
            <div>
              <Label htmlFor="portfolio">Portfolio URL</Label>
              <Input
                id="portfolio"
                value={data.portfolio}
                onChange={(e) => updateField('portfolio', e.target.value)}
                placeholder="johndoe.com"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Summary</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAIAssist('summary', data.summary, 'expand')}
              disabled={aiLoading === 'summary-expand'}
              className="gap-1"
            >
              <Sparkles className="w-3 h-3" />
              {aiLoading === 'summary-expand' ? 'Expanding...' : 'Expand'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAIAssist('summary', data.summary, 'rewrite')}
              disabled={aiLoading === 'summary-rewrite'}
              className="gap-1"
            >
              <Sparkles className="w-3 h-3" />
              {aiLoading === 'summary-rewrite' ? 'Rewriting...' : 'Rewrite'}
            </Button>
          </div>
        </div>
        <Textarea
          value={data.summary}
          onChange={(e) => updateField('summary', e.target.value)}
          placeholder="Brief professional summary or career objective..."
          rows={4}
        />
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Education</h3>
          <Button onClick={addEducation} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {data.education.map((edu) => (
          <div key={edu.id} className="border rounded-lg p-4 space-y-3 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => removeEducation(edu.id)}
            >
              <X className="w-4 h-4" />
            </Button>
            <div>
              <Label>Degree</Label>
              <Input
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                placeholder="B.Tech in Computer Science"
              />
            </div>
            <div>
              <Label>Institution</Label>
              <Input
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                placeholder="IIT Delhi"
              />
            </div>
            <div>
              <Label>Year</Label>
              <Input
                value={edu.year}
                onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                placeholder="2020 - 2024"
              />
            </div>
          </div>
        ))}
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Skills</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAIAssist('skills', data.skills, 'expand')}
            disabled={aiLoading === 'skills-expand'}
            className="gap-1"
          >
            <Sparkles className="w-3 h-3" />
            {aiLoading === 'skills-expand' ? 'Suggesting...' : 'AI Suggest'}
          </Button>
        </div>
        <Textarea
          value={data.skills}
          onChange={(e) => updateField('skills', e.target.value)}
          placeholder="React, Node.js, Python, Machine Learning, Communication"
          rows={3}
        />
        <p className="text-sm text-muted-foreground">Separate skills with commas</p>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Experience</h3>
          <Button onClick={addExperience} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {data.experience.map((exp) => (
          <div key={exp.id} className="border rounded-lg p-4 space-y-3 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => removeExperience(exp.id)}
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Company</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder="Google"
                />
              </div>
              <div>
                <Label>Role</Label>
                <Input
                  value={exp.role}
                  onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
            </div>
            <div>
              <Label>Duration</Label>
              <Input
                value={exp.duration}
                onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                placeholder="Jan 2023 - Present"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                placeholder="Key responsibilities and achievements..."
                rows={3}
              />
            </div>
          </div>
        ))}
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Projects</h3>
          <Button onClick={addProject} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {data.projects.map((proj) => (
          <div key={proj.id} className="border rounded-lg p-4 space-y-3 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => removeProject(proj.id)}
            >
              <X className="w-4 h-4" />
            </Button>
            <div>
              <Label>Project Title</Label>
              <Input
                value={proj.title}
                onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                placeholder="AI Chatbot"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={proj.description}
                onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                placeholder="Built a chatbot using GPT-4..."
                rows={3}
              />
            </div>
            <div>
              <Label>Link</Label>
              <Input
                value={proj.link}
                onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                placeholder="github.com/johndoe/project"
              />
            </div>
          </div>
        ))}
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Achievements / Certifications</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAIAssist('achievements', data.achievements, 'bullet')}
            disabled={aiLoading === 'achievements-bullet'}
            className="gap-1"
          >
            <Sparkles className="w-3 h-3" />
            {aiLoading === 'achievements-bullet' ? 'Formatting...' : 'Format'}
          </Button>
        </div>
        <Textarea
          value={data.achievements}
          onChange={(e) => updateField('achievements', e.target.value)}
          placeholder="AWS Certified Developer, Hackathon Winner 2023..."
          rows={4}
        />
      </Card>
    </div>
  );
}
