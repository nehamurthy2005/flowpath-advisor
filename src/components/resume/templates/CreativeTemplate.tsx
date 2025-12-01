import { ResumeData } from "@/types/resume";
import { Mail, Phone, Linkedin, Globe, Award, Briefcase, GraduationCap, Lightbulb } from "lucide-react";

interface TemplateProps {
  data: ResumeData;
}

export function CreativeTemplate({ data }: TemplateProps) {
  const skills = data.skills.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className="bg-white min-h-full" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Colorful Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white p-8">
        <h1 className="text-4xl font-bold mb-2">{data.name || 'Your Name'}</h1>
        <p className="text-lg opacity-90">{data.summary || 'Professional Title'}</p>
        <div className="flex flex-wrap gap-3 mt-4 text-sm">
          {data.email && (
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="break-all">{data.email}</span>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{data.phone}</span>
            </div>
          )}
          {data.linkedin && (
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
              <Linkedin className="w-4 h-4 flex-shrink-0" />
              <span className="break-all">{data.linkedin}</span>
            </div>
          )}
          {data.portfolio && (
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
              <Globe className="w-4 h-4 flex-shrink-0" />
              <span className="break-all">{data.portfolio}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 text-gray-900">
        {/* Skills Section */}
        {skills.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {data.experience.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Experience</h2>
            </div>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id} className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{exp.role}</h3>
                      <p className="text-sm text-orange-600 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">{exp.duration}</span>
                  </div>
                  <p className="text-sm text-gray-600">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {data.education.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Education</h2>
            </div>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base text-gray-800">{edu.degree}</h3>
                      <p className="text-sm text-blue-600">{edu.institution}</p>
                    </div>
                    <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">{edu.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {data.projects.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
            </div>
            <div className="space-y-3">
              {data.projects.map((proj) => (
                <div key={proj.id} className="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-xl border border-green-200">
                  <h3 className="font-bold text-base text-gray-800">{proj.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{proj.description}</p>
                  {proj.link && <p className="text-xs text-green-600 mt-1 break-all">{proj.link}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Section */}
        {data.achievements && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Achievements</h2>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
              <p className="text-sm text-gray-600 whitespace-pre-line">{data.achievements}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
