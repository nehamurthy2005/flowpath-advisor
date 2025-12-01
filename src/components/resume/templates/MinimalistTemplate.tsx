import { ResumeData } from "@/types/resume";

interface TemplateProps {
  data: ResumeData;
}

export function MinimalistTemplate({ data }: TemplateProps) {
  const skills = data.skills.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className="bg-white text-gray-800 p-16 min-h-full" style={{ fontFamily: 'Lato, sans-serif' }}>
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-light tracking-wide">{data.name || 'Your Name'}</h1>
          <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>{data.phone}</span>}
            {data.linkedin && <span>{data.linkedin}</span>}
            {data.portfolio && <span>{data.portfolio}</span>}
          </div>
        </div>

        {data.summary && (
          <div className="space-y-3">
            <div className="h-px bg-gray-200"></div>
            <p className="text-center text-sm leading-relaxed text-gray-600">{data.summary}</p>
            <div className="h-px bg-gray-200"></div>
          </div>
        )}

        {data.experience.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-light tracking-wide text-center">Experience</h2>
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-lg">{exp.role}</h3>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">{exp.duration}</span>
                </div>
                <p className="text-sm text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {data.education.length > 0 && (
          <div className="space-y-6">
            <div className="h-px bg-gray-200"></div>
            <h2 className="text-xl font-light tracking-wide text-center">Education</h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="space-y-1 text-center">
                <h3 className="font-medium">{edu.degree}</h3>
                <p className="text-sm text-gray-600">{edu.institution}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{edu.year}</p>
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div className="space-y-4">
            <div className="h-px bg-gray-200"></div>
            <h2 className="text-xl font-light tracking-wide text-center">Skills</h2>
            <p className="text-center text-sm text-gray-600">{skills.join(' · ')}</p>
          </div>
        )}

        {data.projects.length > 0 && (
          <div className="space-y-6">
            <div className="h-px bg-gray-200"></div>
            <h2 className="text-xl font-light tracking-wide text-center">Projects</h2>
            {data.projects.map((proj) => (
              <div key={proj.id} className="space-y-2">
                <h3 className="font-medium">{proj.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{proj.description}</p>
                {proj.link && <p className="text-xs text-gray-400 break-all">{proj.link}</p>}
              </div>
            ))}
          </div>
        )}

        {data.achievements && (
          <div className="space-y-4">
            <div className="h-px bg-gray-200"></div>
            <h2 className="text-xl font-light tracking-wide text-center">Achievements</h2>
            <p className="text-sm text-gray-500 leading-relaxed text-center whitespace-pre-line">{data.achievements}</p>
          </div>
        )}
      </div>
    </div>
  );
}
