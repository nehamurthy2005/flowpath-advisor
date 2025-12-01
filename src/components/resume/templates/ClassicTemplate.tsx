import { ResumeData } from "@/types/resume";

interface TemplateProps {
  data: ResumeData;
}

export function ClassicTemplate({ data }: TemplateProps) {
  const skills = data.skills.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className="bg-white text-black p-12 min-h-full" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="text-center mb-8 border-b-2 border-black pb-4">
        <h1 className="text-4xl font-bold mb-2">{data.name || 'YOUR NAME'}</h1>
        <div className="text-sm flex items-center justify-center flex-wrap gap-x-3 gap-y-1">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>• {data.phone}</span>}
          {data.linkedin && <span>• {data.linkedin}</span>}
          {data.portfolio && <span>• {data.portfolio}</span>}
        </div>
      </div>

      {data.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 border-b border-black">PROFESSIONAL SUMMARY</h2>
          <p className="text-sm leading-relaxed mt-2">{data.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 border-b border-black">EXPERIENCE</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mt-3">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold text-base">{exp.role}</h3>
                  <p className="text-sm italic">{exp.company}</p>
                </div>
                <span className="text-sm">{exp.duration}</span>
              </div>
              <p className="text-sm mt-1">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 border-b border-black">EDUCATION</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mt-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base">{edu.degree}</h3>
                  <p className="text-sm italic">{edu.institution}</p>
                </div>
                <span className="text-sm">{edu.year}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 border-b border-black">SKILLS</h2>
          <p className="text-sm mt-2">{skills.join(' • ')}</p>
        </div>
      )}

      {data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 border-b border-black">PROJECTS</h2>
          {data.projects.map((proj) => (
            <div key={proj.id} className="mt-3">
              <h3 className="font-bold text-base">{proj.title}</h3>
              <p className="text-sm mt-1">{proj.description}</p>
              {proj.link && <p className="text-xs mt-1 italic">{proj.link}</p>}
            </div>
          ))}
        </div>
      )}

      {data.achievements && (
        <div>
          <h2 className="text-xl font-bold mb-2 border-b border-black">ACHIEVEMENTS & CERTIFICATIONS</h2>
          <p className="text-sm mt-2 whitespace-pre-line">{data.achievements}</p>
        </div>
      )}
    </div>
  );
}
