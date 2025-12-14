import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Menu, X, Home, Compass, BookOpen, FileText, User, Mail, Info, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AIChatbot from "@/components/AIChatbot";
const navItems = [
  { name: "Home", path: "/", icon: Home, public: true },
  { name: "AI Guide", path: "/find-your-flow", icon: Compass, public: true },
  { name: "Career Quiz", path: "/quiz", icon: Compass, public: true },
  { name: "Streams", path: "/streams", icon: BookOpen, public: true },
  { name: "Resume Builder", path: "/resume-builder", icon: FileText, public: false },
  { name: "About", path: "/about", icon: Info, public: true },
  { name: "Contact", path: "/contact", icon: Mail, public: true },
  { name: "Profile", path: "/profile", icon: User, public: false },
];

export const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAuthenticated = !!user;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out successfully",
      description: "Come back soon!",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Find Your Flow
            </span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <Button 
                onClick={handleSignOut}
                variant="default" 
                size="sm" 
                className="shadow-md hover:shadow-lg transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm" className="shadow-md hover:shadow-lg transition-all">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Sliding Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden",
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleMenu}
      />

      {/* Sliding Menu */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 w-80 bg-card border-r border-border z-50 transform transition-transform md:hidden",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2" onClick={toggleMenu}>
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold">Find Your Flow</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={toggleMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                  {!item.public && !isAuthenticated && (
                    <span className="ml-auto text-xs text-muted-foreground">🔒</span>
                  )}
                </Link>
              );
            })}
            {isAuthenticated ? (
              <Button 
                onClick={() => {
                  toggleMenu();
                  handleSignOut();
                }}
                variant="default" 
                className="w-full mt-4 shadow-md"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Link to="/auth" onClick={toggleMenu}>
                <Button variant="default" className="w-full mt-4 shadow-md">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-16">
        <Outlet />
      </main>

      {/* AI Chatbot */}
      <AIChatbot />

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg font-bold">Find Your Flow</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-md">
                Empowering students to discover their passion, choose their stream, and shape their future.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/quiz" className="hover:text-primary transition-colors">Career Quiz</Link></li>
                <li><Link to="/streams" className="hover:text-primary transition-colors">Explore Streams</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2024 Find Your Flow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
