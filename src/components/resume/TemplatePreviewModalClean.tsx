import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TemplateType, ResumeData } from "@/types/resume";
import { ModernTemplate } from "./templates/ModernTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";
import { MinimalistTemplate } from "./templates/MinimalistTemplate";
import { ElegantTemplate } from "./templates/ElegantTemplate";
import { TechTemplate } from "./templates/TechTemplate";

interface Props {
  template: TemplateType;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: TemplateType) => void;
}

export function TemplatePreviewModal({ template, isOpen, onClose, onUseTemplate }: Props) {
  const demo: ResumeData = {
    name: 'Demo Name',
    email: 'demo@example.com',
    phone: '',
    linkedin: '',
    portfolio: '',
    summary: '',
    education: [],
    skills: '',
    projects: [],
    experience: [],
    achievements: '',
  };

  const renderTemplate = (t: TemplateType) => {
    const props = { data: demo } as unknown as { data: ResumeData };
    switch (t) {
      case 'modern':
        return <ModernTemplate data={demo} />;
      case 'classic':
        return <ClassicTemplate data={demo} />;
      case 'creative':
        return <CreativeTemplate data={demo} />;
      case 'minimalist':
        return <MinimalistTemplate data={demo} />;
      case 'elegant':
        return <ElegantTemplate data={demo} />;
      case 'tech':
        return <TechTemplate data={demo} />;
      default:
        return <ModernTemplate data={demo} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Template Preview</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 p-4">
            <h4 className="font-semibold">{template}</h4>
            <p className="text-sm text-muted-foreground mt-2">A preview of the selected template.</p>
          </div>

          <div className="lg:col-span-2 p-6 bg-muted/30 rounded-lg">
            <div style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }} className="bg-white shadow-lg">
              {renderTemplate(template)}
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Link to={`/resume-builder/form?template=${template}`}>
            <Button onClick={() => onUseTemplate(template)}>Use This Template</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
