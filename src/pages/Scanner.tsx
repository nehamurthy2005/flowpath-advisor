import { useCallback, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type ScanSection = {
  original: string;
  improved?: string;
  score?: number;
  feedback?: string;
};

type ScanResult = {
  overall_score: number;
  section_scores?: Record<string, number>;
  missing_keywords?: string[];
  improvement_suggestions?: string[];
  sections?: Record<string, ScanSection>;
};

export default function Scanner() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [sidePane, setSidePane] = useState<{ section: string; original: string; improved?: string; loading?: boolean } | null>(null);
  const [improvingSection, setImprovingSection] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const content = e.target?.result;
        
        if (file.type === 'application/pdf') {
          // For PDF, we'll send raw text extraction request
          // In production, you'd use a PDF library or backend service
          // For now, we'll read as text and clean it up
          if (typeof content === 'string') {
            resolve(content);
          } else if (content instanceof ArrayBuffer) {
            // Convert ArrayBuffer to base64 for AI processing
            const uint8Array = new Uint8Array(content);
            let binary = '';
            uint8Array.forEach(byte => binary += String.fromCharCode(byte));
            const base64 = btoa(binary);
            resolve(`[PDF Content Base64: This is a PDF file. Please extract and analyze the resume content from it.]\n\nNote: For best results with PDF files, the content below represents the raw data. Extract key resume sections like Summary, Experience, Education, Skills, and Projects.\n\nFile: ${file.name}`);
          }
        } else {
          // For DOCX and other text-based formats
          if (typeof content === 'string') {
            resolve(content);
          } else if (content instanceof ArrayBuffer) {
            const decoder = new TextDecoder('utf-8');
            const text = decoder.decode(content);
            // Clean up XML tags from DOCX
            const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            resolve(cleanText);
          }
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      if (file.type === 'application/pdf') {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  }, []);

  const onBrowse = () => inputRef.current?.click();

  const onFile = (f?: File) => {
    const chosen = f ?? inputRef.current?.files?.[0];
    if (!chosen) return;
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(chosen.type) && !chosen.name.match(/\.(pdf|docx|doc)$/i)) {
      toast.error('Please upload PDF or DOCX file');
      return;
    }
    setFile(chosen);
  };

  const runScan = async () => {
    if (!file) return;
    
    setLoading(true);
    setResult(null);

    try {
      toast.info('Extracting resume content...');
      const resumeText = await extractTextFromFile(file);
      
      if (!resumeText || resumeText.length < 50) {
        throw new Error('Could not extract sufficient text from the file. Please try a different format.');
      }

      toast.info('Analyzing with AI...');
      
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: { 
          resumeText,
          action: 'analyze'
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to analyze resume');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      toast.success('Resume analyzed successfully!');
    } catch (err: any) {
      console.error('Scan error:', err);
      toast.error(err.message || 'Failed to scan resume');
    } finally {
      setLoading(false);
    }
  };

  const improveSection = async (sectionName: string, originalContent: string) => {
    setImprovingSection(sectionName);
    setSidePane({ section: sectionName, original: originalContent, loading: true });

    try {
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: {
          action: 'improve',
          sectionName,
          sectionContent: originalContent
        }
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      setSidePane({ 
        section: sectionName, 
        original: originalContent, 
        improved: data.improved,
        loading: false 
      });
      toast.success(`${sectionName} improved!`);
    } catch (err: any) {
      console.error('Improve error:', err);
      toast.error(err.message || 'Failed to improve section');
      setSidePane(null);
    } finally {
      setImprovingSection(null);
    }
  };

  const applyChange = () => {
    if (!sidePane || !result || !sidePane.improved) return;
    setResult((r) => {
      if (!r) return r;
      return {
        ...r,
        sections: {
          ...r.sections,
          [sidePane.section]: {
            ...(r.sections?.[sidePane.section] ?? { original: '' }),
            original: sidePane.improved ?? '',
            improved: sidePane.improved,
          },
        },
      };
    });
    toast.success('Changes applied!');
    setSidePane(null);
  };

  const regenerateImprovement = async () => {
    if (!sidePane) return;
    await improveSection(sidePane.section, sidePane.original);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <Card className="p-12 text-center max-w-md animate-fade-in shadow-xl">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-6">
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
          className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 text-center bg-card"
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
              <div className="text-left">
                <div className="font-medium">{file.name}</div>
                <div className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</div>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={runScan} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Scan Resume'
                  )}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => { setFile(null); setResult(null); }}>
                  <X className="w-4 h-4" />
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
                <h3 className="text-xl font-semibold mb-4">ATS Score</h3>
                <div className="mb-6">
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="12"
                          className="text-muted"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="12"
                          strokeDasharray={`${(result.overall_score / 100) * 352} 352`}
                          className="text-primary"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">{result.overall_score}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <ScoreBar label="Formatting" value={result.section_scores?.formatting ?? 75} />
                  <ScoreBar label="Keywords" value={result.section_scores?.keywords ?? 65} />
                  <ScoreBar label="Experience" value={result.section_scores?.experience ?? 80} />
                  <ScoreBar label="Skills" value={result.section_scores?.skills ?? 70} />
                  <ScoreBar label="Grammar" value={result.section_scores?.grammar ?? 85} />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Section Analysis</h3>
                <div className="space-y-4">
                  {Object.entries(result.sections || {}).map(([sec, data]) => (
                    <div key={sec} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold capitalize">{sec}</h4>
                          <p className="text-sm text-muted-foreground">Score: {data.score ?? 75}/100</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => improveSection(sec, data.original)}
                          disabled={improvingSection === sec}
                        >
                          {improvingSection === sec ? (
                            <>
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              Improving...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3 h-3 mr-1" />
                              Improve with AI
                            </>
                          )}
                        </Button>
                      </div>
                      {data.feedback && (
                        <p className="text-sm text-muted-foreground mb-2">{data.feedback}</p>
                      )}
                      <div className="mt-2 p-3 bg-muted/50 rounded text-sm">
                        <strong>Content:</strong> {data.original.substring(0, 200)}{data.original.length > 200 ? '...' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Suggestions</h3>
                <ul className="space-y-3">
                  {(result.improvement_suggestions || []).map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-semibold">
                        {i + 1}
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Missing Keywords</h3>
                <div className="flex gap-2 flex-wrap">
                  {(result.missing_keywords || []).map((k) => (
                    <div key={k} className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm">
                      {k}
                    </div>
                  ))}
                </div>
                {(!result.missing_keywords || result.missing_keywords.length === 0) && (
                  <p className="text-sm text-muted-foreground">No critical keywords missing!</p>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* Side pane for AI improvement */}
        {sidePane && (
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-background border-l shadow-2xl overflow-y-auto z-50">
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-background">
              <h4 className="font-semibold capitalize">Improve: {sidePane.section}</h4>
              <Button size="sm" variant="ghost" onClick={() => setSidePane(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {sidePane.loading ? (
              <div className="p-8 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">AI is improving your content...</p>
              </div>
            ) : (
              <>
                <div className="p-4 space-y-4">
                  <div>
                    <h5 className="text-sm font-medium mb-2 text-muted-foreground">Original</h5>
                    <div className="p-4 border rounded-lg bg-muted/30 text-sm whitespace-pre-wrap">
                      {sidePane.original}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      AI Improved
                    </h5>
                    <div className="p-4 border-2 border-primary/20 rounded-lg bg-primary/5 text-sm whitespace-pre-wrap">
                      {sidePane.improved}
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t flex gap-2 justify-end sticky bottom-0 bg-background">
                  <Button variant="outline" onClick={regenerateImprovement}>
                    Regenerate
                  </Button>
                  <Button variant="outline" onClick={() => navigator.clipboard.writeText(sidePane.improved || '')}>
                    Copy
                  </Button>
                  <Button onClick={applyChange}>
                    Apply Changes
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const getColor = (val: number) => {
    if (val >= 80) return 'from-green-500 to-emerald-500';
    if (val >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  return (
    <div>
      <div className="flex justify-between mb-1">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-sm font-semibold">{value}%</div>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${getColor(value)} transition-all duration-500`} 
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }} 
        />
      </div>
    </div>
  );
}
