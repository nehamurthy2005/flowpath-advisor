import { ResumeData } from "@/types/resume";
import { Mail, Phone, Linkedin, Globe } from "lucide-react";

interface TemplateProps {
  data: ResumeData;
}

export function ElegantTemplate({ data }: TemplateProps) {
  const skills = data.skills.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className="bg-white min-h-full" style={{ fontFamily: 'Roboto, sans-serif' }}>
      {/* Dark Header */}
      <div className="bg-gray-900 text-white p-10">
        <h1 className="text-4xl font-bold mb-2">{data.name || 'Your Name'}</h1>
        <p className="text-lg text-gray-300 italic">{data.summary || 'Professional Summary'}</p>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/3 bg-gray-800 text-white p-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-600 italic">Contact</h2>
              <div className="space-y-3 text-sm">
                {data.email && (
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="break-all">{data.email}</span>
                  </div>
                )}
                {data.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{data.phone}</span>
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
                <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-600 italic">Skills</h2>
                <div className="space-y-2">
                  {skills.map((skill, idx) => (
                    <div key={idx} className="text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span>{skill}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.education.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-600 italic">Education</h2>
                {data.education.map((edu) => (
                  <div key={edu.id} className="mb-4 text-sm">
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-gray-300 text-xs">{edu.institution}</p>
                    <p className="text-gray-400 text-xs">{edu.year}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-10 text-gray-900">
          {data.experience.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-gray-900 italic">Professional Experience</h2>
              {data.experience.map((exp) => (
                <div key={exp.id} className="mb-6">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg">{exp.role}</h3>
                    <span className="text-sm text-gray-600 italic">{exp.duration}</span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium mb-2">{exp.company}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          {data.projects.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-gray-900 italic">Key Projects</h2>
              {data.projects.map((proj) => (
                <div key={proj.id} className="mb-4">
                  <h3 className="font-bold text-base">{proj.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mt-1">{proj.description}</p>
                  {proj.link && <p className="text-xs text-gray-500 mt-1 italic break-all">{proj.link}</p>}
                </div>
              ))}
            </div>
          )}

          {data.achievements && (
            <div>
              <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-gray-900 italic">Achievements & Certifications</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{data.achievements}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
