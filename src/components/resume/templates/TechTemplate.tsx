import { ResumeData } from "@/types/resume";
import { Terminal, Mail, Phone, Linkedin, Globe } from "lucide-react";

interface TemplateProps {
  data: ResumeData;
}

export function TechTemplate({ data }: TemplateProps) {
  const skills = data.skills.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className="bg-gray-950 text-green-400 p-8 min-h-full" style={{ fontFamily: 'Monaco, monospace' }}>
      <div className="max-w-5xl mx-auto">
        {/* Terminal Header */}
        <div className="bg-gray-900 border border-green-500/30 rounded-t-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <Terminal className="w-4 h-4 ml-4" />
            <span className="text-xs">resume.sh</span>
          </div>
          <div className="space-y-2 text-sm">
            <div><span className="text-green-500">$</span> cat profile.txt</div>
            <div className="pl-4">
              <div className="text-2xl font-bold text-green-300">{data.name || 'Developer Name'}</div>
              {data.summary && <div className="text-xs mt-2 text-gray-400"># {data.summary}</div>}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border-x border-green-500/30 p-6 space-y-6 text-sm">
          {/* Contact */}
          <div>
            <div className="text-green-500 mb-2">$ ls contact/</div>
            <div className="pl-4 space-y-1 text-gray-300">
              {data.email && (
                <div className="flex items-start gap-2">
                  <Mail className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span className="text-xs break-all">{data.email}</span>
                </div>
              )}
              {data.phone && (
                <div className="flex items-start gap-2">
                  <Phone className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span className="text-xs whitespace-nowrap">{data.phone}</span>
                </div>
              )}
              {data.linkedin && (
                <div className="flex items-start gap-2">
                  <Linkedin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span className="text-xs break-all">{data.linkedin}</span>
                </div>
              )}
              {data.portfolio && (
                <div className="flex items-start gap-2">
                  <Globe className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span className="text-xs break-all">{data.portfolio}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <div className="text-green-500 mb-2">$ cat skills.json</div>
              <div className="pl-4 bg-gray-950 border border-green-500/20 p-3 rounded">
                <pre className="text-xs text-gray-300">
{`{
  "languages": [${skills.map(s => `"${s}"`).join(', ')}]
}`}
                </pre>
              </div>
            </div>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <div>
              <div className="text-green-500 mb-2">$ cat experience/*.md</div>
              {data.experience.map((exp, idx) => (
                <div key={exp.id} className="pl-4 mb-4 bg-gray-950 border border-green-500/20 p-3 rounded">
                  <div className="text-xs text-gray-500 mb-1"># File: experience_{idx + 1}.md</div>
                  <div className="text-green-300 font-bold">## {exp.role}</div>
                  <div className="text-gray-400 text-xs mt-1">**{exp.company}** | {exp.duration}</div>
                  <div className="text-gray-300 text-xs mt-2">{exp.description}</div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div>
              <div className="text-green-500 mb-2">$ ls education/</div>
              {data.education.map((edu) => (
                <div key={edu.id} className="pl-4 mb-2">
                  <div className="text-green-300 text-xs font-bold">{edu.degree}</div>
                  <div className="text-gray-400 text-xs">{edu.institution} ({edu.year})</div>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <div>
              <div className="text-green-500 mb-2">$ git log --projects</div>
              {data.projects.map((proj) => (
                <div key={proj.id} className="pl-4 mb-3 bg-gray-950 border border-green-500/20 p-3 rounded">
                  <div className="text-yellow-400 text-xs font-bold">commit: {proj.title}</div>
                  <div className="text-gray-300 text-xs mt-1">{proj.description}</div>
                  {proj.link && (
                    <div className="text-blue-400 text-xs mt-1 break-all">
                      link: {proj.link}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Achievements */}
          {data.achievements && (
            <div>
              <div className="text-green-500 mb-2">$ cat achievements.txt</div>
              <div className="pl-4 bg-gray-950 border border-green-500/20 p-3 rounded">
                <pre className="text-xs text-gray-300 whitespace-pre-line">{data.achievements}</pre>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-900 border border-green-500/30 rounded-b-lg p-4">
          <div className="text-green-500 text-sm">$ exit</div>
        </div>
      </div>
    </div>
  );
}
