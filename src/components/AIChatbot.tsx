import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, X, Sparkles, FileText, Briefcase, GraduationCap, Code } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

const RobotIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body base */}
    <ellipse cx="32" cy="52" rx="16" ry="10" fill="hsl(var(--muted))" />
    <ellipse cx="32" cy="50" rx="14" ry="8" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Head */}
    <circle cx="32" cy="28" r="16" fill="url(#robotGradient)" />
    <circle cx="32" cy="28" r="14" fill="url(#robotGradient)" opacity="0.9" />
    
    {/* Eyes */}
    <rect x="24" y="25" width="4" height="6" rx="1" fill="hsl(var(--background))" opacity="0.9" />
    <rect x="36" y="25" width="4" height="6" rx="1" fill="hsl(var(--background))" opacity="0.9" />
    
    {/* Antenna ears */}
    <circle cx="16" cy="28" r="3" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    <circle cx="48" cy="28" r="3" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
    
    {/* Gradient definition */}
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages(prev => [...prev, userMessage]);
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

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment.",
      };
      setMessages(prev => [...prev, errorMessage]);
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

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-[380px] h-[520px] shadow-2xl border-2 border-primary/20 flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-300">
          <CardHeader className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground rounded-t-lg py-4">
            <div className="flex items-center gap-3">
              <RobotIcon className="w-10 h-10" />
              <div>
                <CardTitle className="text-lg">Flow Assistant</CardTitle>
                <p className="text-xs text-primary-foreground/80">Your AI career guide</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <div className="text-center py-6">
                    <RobotIcon className="w-16 h-16 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Hi! I'm your Flow Assistant. I can help with career guidance, study tips, resume advice, and more!
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => (
                      <Button
                        key={action.label}
                        variant="outline"
                        size="sm"
                        className="h-auto py-3 flex flex-col gap-1"
                        onClick={() => sendMessage(action.prompt)}
                      >
                        <action.icon className="h-4 w-4" />
                        <span className="text-xs">{action.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted text-foreground rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {msg.actions.map((action, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="cursor-pointer hover:bg-secondary/80 text-xs"
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
                      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AIChatbot;
