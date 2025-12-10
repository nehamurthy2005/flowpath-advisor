import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Compass, BookOpen, FileText, ArrowRight, CheckCircle2, Brain, Sparkles } from "lucide-react";
export default function Home() {
  return <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Flow
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Discover your passion, choose your stream, and shape your future
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/quiz">
                
              </Link>
              <Link to="/streams">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20 shadow-xl text-lg">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explore Streams
                </Button>
              </Link>
              <Link to="/scanner">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20 shadow-xl text-lg">
                  <FileText className="w-5 h-5 mr-2" />
                  Resume Scanner
                </Button>
              </Link>
                <Link to="/linkedin-transformer">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20 shadow-xl text-lg">
                    <Sparkles className="w-5 h-5 mr-2" />
                    LinkedIn Transformer
                  </Button>
                </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Guide */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Your Journey in 3 Simple Steps
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[{
            icon: Compass,
            title: "1. Discover",
            description: "Take our intelligent career quiz to understand your interests, strengths, and ideal career paths.",
            color: "bg-primary"
          }, {
            icon: BookOpen,
            title: "2. Choose",
            description: "Explore detailed information about different streams and the exciting career opportunities they offer.",
            color: "bg-secondary"
          }, {
            icon: FileText,
            title: "3. Build",
            description: "Create a professional resume with our easy-to-use builder and get ready to pursue your dream career.",
            color: "bg-accent"
          }].map((step, index) => <Card key={index} className="p-6 hover:shadow-lg transition-all animate-fade-in" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-4 shadow-md`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Why Find Your Flow?
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  We understand that choosing the right career path can be overwhelming. That's why we've created a platform that guides you every step of the way.
                </p>
                <ul className="space-y-4">
                  {["AI-powered career assessment", "Detailed stream and career information", "Professional resume templates", "Personalized recommendations", "Career roadmaps and guidance"].map((feature, index) => <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-lg">{feature}</span>
                    </li>)}
                </ul>
              </div>
              <Card className="p-8 bg-gradient-primary text-white animate-fade-in shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
                <p className="mb-6 text-white/90">
                  Join thousands of students who have discovered their perfect career path with Find Your Flow.
                </p>
                <Link to="/quiz">
                  <Button size="lg" variant="secondary" className="w-full shadow-lg hover:shadow-xl transition-all">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Building Your Future Today
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Take the first step towards a fulfilling career. Our platform is designed to help you make informed decisions about your future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quiz">
              <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
                <Compass className="w-5 h-5 mr-2" />
                Take Career Quiz
              </Button>
            </Link>
            <Link to="/resume-builder">
              <Button size="lg" variant="outline" className="w-full sm:w-auto shadow-md">Build Resume<FileText className="w-5 h-5 mr-2" />
                Build Resume
              </Button>
            </Link>
            <Link to="/scanner">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-md">
                <FileText className="w-5 h-5 mr-2" />
                Resume Scanner
              </Button>
            </Link>
              <Link to="/linkedin-transformer">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-md">
                  <Sparkles className="w-5 h-5 mr-2" />
                  LinkedIn Transformer
                </Button>
              </Link>
          </div>
        </div>
      </section>
    </div>;
}