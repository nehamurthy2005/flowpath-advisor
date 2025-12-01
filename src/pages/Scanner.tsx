import { useCallback, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, FilePlus, X, Sparkles, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export default function Scanner() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  type ScanSection = {
    original: string;
    improved?: string;
  };

  type ScanResult = {
    overall_score: number;
    section_scores?: Record<string, number>;
    missing_keywords?: string[];
    improvement_suggestions?: string[];
    sections?: Record<string, ScanSection>;
  };

  const [result, setResult] = useState<ScanResult | null>(null);
  const [sidePane, setSidePane] = useState<{ section: string; original: string; improved?: string } | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  }, []);

  const onBrowse = () => inputRef.current?.click();

  const onFile = (f?: File) => {
    const chosen = f ?? inputRef.current?.files?.[0];
    if (!chosen) return;
    if (!['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/msword'].includes(chosen.type) && !chosen.name.match(/\.(pdf|docx|doc)$/i)) {
      alert('Please upload PDF or DOCX');
      return;
    }
    setFile(chosen);
    runScan(chosen);
  };

  const runScan = async (f: File) => {
    setLoading(true);
    setResult(null);

    // In a real app: upload file to backend, extract text, call AI. Here we simulate.
    setTimeout(() => {
      const demo = {
        overall_score: 78,
        section_scores: {
          summary: 70,
          experience: 85,
          projects: 80,
          skills: 60,
          education: 90,
        },
        missing_keywords: ['react', 'node.js', 'aws'],
        improvement_suggestions: ['Add measurable metrics', 'Include keywords from JD', 'Improve summary'],
        sections: {
          summary: {
            original: 'Experienced developer with web background.',
            improved: 'Full-stack developer with 5+ years building scalable web applications; improved performance by 40% and led a team of 4.',
          },
          experience: {
            original: 'Worked on multiple projects...',
            improved: 'Led frontend team to deliver X, improved performance by Y%.',
          }
        }
      };
      setResult(demo);
      setLoading(false);
    }, 1400);
  };

  const openImprove = (section: string) => {
    if (!result) return;
    const original = result.sections?.[section]?.original ?? '';
    const improved = result.sections?.[section]?.improved ?? original + ' (AI improved)';
    setSidePane({ section, original, improved });
  };

  const applyChange = () => {
    if (!sidePane || !result) return;
    setResult((r) => {
      if (!r) return r;
      return {
        ...r,
        sections: {
          ...r.sections,
          [sidePane.section]: {
            ...(r.sections?.[sidePane.section] ?? {}),
            original: sidePane.improved ?? '',
          },
        },
      };
    });
    setSidePane(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <Card className="p-12 text-center max-w-md animate-fade-in shadow-xl">
          <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6">
            <UploadCloud className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-8">
            Please sign in to use the Resume Scanner.
          </p>
          <Link to="/auth">
            <Button size="lg">Sign In</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/resume-builder">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Resume Scanner</h1>
            <p className="text-muted-foreground">Upload your resume (PDF or DOCX) to get an ATS scan and AI-driven improvements.</p>
          </div>
        </div>

        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-muted-foreground rounded-xl p-8 text-center bg-white"
        >
          {!file ? (
            <div>
              <div className="flex items-center justify-center mb-4">
                <UploadCloud className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Upload your resume</h3>
              <p className="text-muted-foreground mb-4">Drag & drop your resume here or browse files (PDF, DOCX)</p>
              <input ref={inputRef} type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={() => onFile()} />
              <div className="flex items-center justify-center gap-4">
                <Button onClick={onBrowse} variant="outline">Browse Files</Button>
                <div className="text-sm text-muted-foreground">Accepted: PDF, DOCX</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{file.name}</div>
                <div className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</div>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => runScan(file)} disabled={loading}>
                  {loading ? 'Scanning...' : 'Scan Resume'}
                </Button>
                <Button variant="ghost" onClick={() => setFile(null)}>
                  <X />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-2">ATS Score</h3>
                <div className="space-y-3">
                  <ScoreBar label="Overall" value={result.overall_score} />
                  <ScoreBar label="Formatting" value={result.section_scores?.formatting ?? 92} />
                  <ScoreBar label="Keywords" value={result.section_scores?.keywords ?? 65} />
                  <ScoreBar label="Experience" value={result.section_scores?.experience ?? 85} />
                  <ScoreBar label="Skills" value={result.section_scores?.skills ?? 60} />
                  <ScoreBar label="Grammar" value={result.section_scores?.grammar ?? 84} />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Section Analysis</h3>
                <div className="space-y-4">
                  {Object.keys(result.sections || {}).map((sec: string) => (
                    <div key={sec} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{sec}</h4>
                          <p className="text-sm text-muted-foreground">Score: {(result.section_scores?.[sec] ?? 75)}/100</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openImprove(sec)}>
                            Improve with AI
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3 text-sm">
                        <p><strong>What is good:</strong> Clear headings and dates.</p>
                        <p><strong>What is missing:</strong> Measurable metrics, keywords.</p>
                        <p className="mt-2"><strong>Original:</strong> {result.sections[sec].original}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-2">Suggestions</h3>
                <ul className="list-disc pl-5 text-sm space-y-2">
                  {(result.improvement_suggestions || []).map((s: string, i: number) => (
                    <li key={i}>{s} <Button size="sm" variant="ghost" className="ml-2" onClick={() => alert('Will apply suggestion via AI')}>Apply with AI</Button></li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-2">Missing Keywords</h3>
                <div className="flex gap-2 flex-wrap">
                  {(result.missing_keywords || []).map((k: string) => (
                    <div key={k} className="px-3 py-1 bg-muted rounded-full text-sm">{k}</div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Side pane for AI improvement */}
        {sidePane && (
          <div className="fixed right-6 top-16 bottom-6 w-[520px] bg-white shadow-2xl rounded-lg overflow-y-auto z-50">
            <div className="p-4 border-b flex justify-between items-center">
              <h4 className="font-semibold">Improve: {sidePane.section}</h4>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setSidePane(null)}><X /></Button>
              </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium mb-2">Original</h5>
                <div className="p-3 border rounded h-56 overflow-auto text-sm">{sidePane.original}</div>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-2">AI Improved</h5>
                <div className="p-3 border rounded h-56 overflow-auto text-sm">{sidePane.improved}</div>
              </div>
            </div>
            <div className="p-4 border-t flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setSidePane((s) => s ? { ...s, improved: s.original + ' (Try another version)' } : s)}>Generate Another Version</Button>
              <Button onClick={() => { navigator.clipboard.writeText(sidePane.improved || ''); }}>Copy AI Version</Button>
              <Button onClick={applyChange}>Apply Changes</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-sm font-semibold">{value}%</div>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}
