import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, X, Sparkles, FileText, Briefcase, GraduationCap, Code, Home, Plus, MessageSquare, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: Array<{
    type: string;
    label: string;
    target?: string;
  }>;
}

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
}

const RobotIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="52" rx="16" ry="10" fill="hsl(var(--muted))" />
    <ellipse cx="32" cy="50" rx="14" ry="8" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1" />
    <circle cx="32" cy="28" r="16" fill="url(#robotGradient)" />
    <circle cx="32" cy="28" r="14" fill="url(#robotGradient)" opacity="0.9" />
    <rect x="24" y="25" width="4" height="6" rx="1" fill="hsl(var(--background))" opacity="0.9" />
    <rect x="36" y="25" width="4" height="6" rx="1" fill="hsl(var(--background))" opacity="0.9" />
    <circle cx="16" cy="28" r="3" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    <circle cx="48" cy="28" r="3" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    <defs>
      <linearGradient id="robotGradient" x1="16" y1="12" x2="48" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="hsl(262, 83%, 58%)" />
        <stop offset="1" stopColor="hsl(239, 84%, 67%)" />
      </linearGradient>
    </defs>
  </svg>
);

const quickActions = [
  { label: "Career Help", icon: Briefcase, prompt: "Help me find a suitable career path based on my interests" },
  { label: "Resume Tips", icon: FileText, prompt: "Give me tips to improve my resume" },
  { label: "Study Guide", icon: GraduationCap, prompt: "Create a study plan for my career goals" },
  { label: "Code Help", icon: Code, prompt: "Help me with coding and technical skills" },
];

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const messages = activeSession?.messages || [];

  // Load sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("flow-chat-sessions");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSessions(parsed.map((s: any) => ({ ...s, createdAt: new Date(s.createdAt) })));
      if (parsed.length > 0) {
        setActiveSessionId(parsed[0].id);
      }
    }
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("flow-chat-sessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      name: "New Chat",
      messages: [],
      createdAt: new Date(),
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(sessions.find(s => s.id !== sessionId)?.id || null);
    }
  };

  const generateSessionName = (content: string) => {
    return content.length > 25 ? content.substring(0, 25) + "..." : content;
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    // Create session if none exists
    if (!activeSessionId) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        name: generateSessionName(text),
        messages: [],
        createdAt: new Date(),
      };
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    // Update session with user message
    setSessions(prev => prev.map(s => {
      if (s.id === (activeSessionId || Date.now().toString())) {
        const updatedMessages = [...s.messages, userMessage];
        return {
          ...s,
          messages: updatedMessages,
          name: s.messages.length === 0 ? generateSessionName(text) : s.name,
        };
      }
      return s;
    }));

    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-assistant", {
        body: {
          message: text,
          user_id: user?.id || null,
          context_history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer_text || data.message || "I'm here to help! How can I assist you today?",
        actions: data.actions || [],
      };

      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...s.messages, assistantMessage] };
        }
        return s;
      }));
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment.",
      };
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...s.messages, errorMessage] };
        }
        return s;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (action: { type: string; target?: string }) => {
    if (action.target) {
      navigate(action.target);
      setIsOpen(false);
    }
  };

  const goToHome = () => {
    navigate("/");
    setIsOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Open AI Assistant"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-primary-foreground" />
        ) : (
          <RobotIcon className="w-10 h-10" />
        )}
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-accent-foreground" />
        </span>
      </button>

      {/* Large Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-[600px] h-[700px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)] shadow-2xl border-2 border-primary/20 flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-300 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-t-lg py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RobotIcon className="w-9 h-9" />
                <div>
                  <CardTitle className="text-lg">Flow Assistant</CardTitle>
                  <p className="text-xs text-primary-foreground/80">Your AI career guide</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={goToHome}
                  title="Go to Home"
                >
                  <Home className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={createNewSession}
                  title="New Chat"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <div className="flex-1 flex overflow-hidden">
            {/* Chat History Sidebar */}
            {showSidebar && (
              <div className="w-48 border-r bg-muted/30 flex flex-col">
                <div className="p-2 border-b">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Chat History</p>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-2 space-y-1">
                    {sessions.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">No chats yet</p>
                    ) : (
                      sessions.map((session) => (
                        <div
                          key={session.id}
                          className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                            activeSessionId === session.id
                              ? "bg-primary/10 border border-primary/20"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => setActiveSessionId(session.id)}
                        >
                          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="text-xs truncate flex-1">{session.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSession(session.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Main Chat Area */}
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                {messages.length === 0 ? (
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      <RobotIcon className="w-20 h-20 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Welcome to Flow Assistant!</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        I'm your AI-powered career guide. Ask me anything about careers, resumes, coding, or studying!
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                      {quickActions.map((action) => (
                        <Button
                          key={action.label}
                          variant="outline"
                          className="h-auto py-4 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary/30"
                          onClick={() => sendMessage(action.prompt)}
                        >
                          <action.icon className="h-5 w-5 text-primary" />
                          <span className="text-sm">{action.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[90%] rounded-2xl px-5 py-3 ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted/50 border border-border rounded-bl-md"
                          }`}
                        >
                          {msg.role === "assistant" ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <ReactMarkdown
                                components={{
                                  h1: ({ children }) => <h1 className="text-lg font-bold mt-4 mb-2 text-foreground">{children}</h1>,
                                  h2: ({ children }) => <h2 className="text-base font-semibold mt-3 mb-2 text-foreground">{children}</h2>,
                                  h3: ({ children }) => <h3 className="text-sm font-semibold mt-2 mb-1 text-foreground">{children}</h3>,
                                  p: ({ children }) => <p className="text-sm mb-3 leading-relaxed text-foreground">{children}</p>,
                                  ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 text-sm text-foreground">{children}</ul>,
                                  ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 text-sm text-foreground">{children}</ol>,
                                  li: ({ children }) => <li className="ml-2">{children}</li>,
                                  strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                                  code: ({ children }) => (
                                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
                                  ),
                                  pre: ({ children }) => (
                                    <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-xs my-3">{children}</pre>
                                  ),
                                  blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-primary/50 pl-4 italic my-3 text-muted-foreground">{children}</blockquote>
                                  ),
                                }}
                              >
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          )}
                          {msg.actions && msg.actions.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/50">
                              {msg.actions.map((action, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                  onClick={() => handleAction(action)}
                                >
                                  {action.label}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted/50 border border-border rounded-2xl rounded-bl-md px-5 py-4">
                          <div className="flex gap-1.5">
                            <span className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
                <div className="flex gap-3">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                    className="flex-1 h-11"
                  />
                  <Button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="shrink-0 h-11 w-11"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      )}
    </>
  );
};

export default AIChatbot;
