import { ResumeData } from "@/types/resume";
import { Mail, Phone, Linkedin, Globe } from "lucide-react";

interface TemplateProps {
  data: ResumeData;
}

export function ModernTemplate({ data }: TemplateProps) {
  const skills = data.skills.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className="bg-white text-gray-900 min-h-full" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/3 bg-blue-600 text-white p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{data.name || 'Your Name'}</h1>
            <div className="h-1 w-16 bg-white"></div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3 uppercase tracking-wide">Contact</h2>
              <div className="space-y-2 text-sm">
                {data.email && (
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="break-all">{data.email}</span>
                  </div>
                )}
                {data.phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="break-words">{data.phone}</span>
                  </div>
                )}
                {data.linkedin && (
                  <div className="flex items-start gap-2">
                    <Linkedin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="break-all">{data.linkedin}</span>
                  </div>
                )}
                {data.portfolio && (
                  <div className="flex items-start gap-2">
                    <Globe className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="break-all">{data.portfolio}</span>
                  </div>
                )}
              </div>
            </div>

            {skills.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 uppercase tracking-wide">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="bg-white/20 px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-8">
          {data.summary && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-blue-600 mb-2 uppercase tracking-wide">Summary</h2>
              <div className="h-0.5 w-full bg-blue-600 mb-3"></div>
              <p className="text-sm leading-relaxed">{data.summary}</p>
            </div>
          )}

          {data.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-blue-600 mb-2 uppercase tracking-wide">Experience</h2>
              <div className="h-0.5 w-full bg-blue-600 mb-3"></div>
              {data.experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-base">{exp.role}</h3>
                    <span className="text-sm text-gray-600">{exp.duration}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{exp.company}</p>
                  <p className="text-sm text-gray-600">{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          {data.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-blue-600 mb-2 uppercase tracking-wide">Education</h2>
              <div className="h-0.5 w-full bg-blue-600 mb-3"></div>
              {data.education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-base">{edu.degree}</h3>
                      <p className="text-sm text-gray-700">{edu.institution}</p>
                    </div>
                    <span className="text-sm text-gray-600">{edu.year}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {data.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-blue-600 mb-2 uppercase tracking-wide">Projects</h2>
              <div className="h-0.5 w-full bg-blue-600 mb-3"></div>
              {data.projects.map((proj) => (
                <div key={proj.id} className="mb-3">
                  <h3 className="font-semibold text-base">{proj.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{proj.description}</p>
                  {proj.link && <p className="text-xs text-blue-600 break-all">{proj.link}</p>}
                </div>
              ))}
            </div>
          )}

          {data.achievements && (
            <div>
              <h2 className="text-xl font-bold text-blue-600 mb-2 uppercase tracking-wide">Achievements</h2>
              <div className="h-0.5 w-full bg-blue-600 mb-3"></div>
              <p className="text-sm text-gray-600 whitespace-pre-line">{data.achievements}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
