export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  education: Education[];
  skills: string;
  projects: Project[];
  experience: Experience[];
  achievements: string;
}

export type TemplateType = 'modern' | 'classic' | 'creative' | 'minimalist' | 'elegant' | 'tech';
