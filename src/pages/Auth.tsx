import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Compass, Mail, Lock, User, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

// Validation schemas
const signInSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password is too long")
    .regex(/^(?=.*[a-zA-Z])/, "Password must contain at least one letter"),
});

export default function Auth() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signInErrors, setSignInErrors] = useState<{ email?: string; password?: string }>({});
  const [signUpErrors, setSignUpErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInErrors({});
    
    // Validate inputs
    const validation = signInSchema.safeParse({
      email: signInEmail,
      password: signInPassword,
    });

    if (!validation.success) {
      const errors: { email?: string; password?: string } = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0] === "email") errors.email = err.message;
        if (err.path[0] === "password") errors.password = err.message;
      });
      setSignInErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInEmail.trim(),
        password: signInPassword,
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password. Please check your credentials.");
        } else if (error.message.includes("Email not confirmed")) {
          throw new Error("Please verify your email address before signing in.");
        }
        throw error;
      }

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpErrors({});
    
    // Validate inputs
    const validation = signUpSchema.safeParse({
      name: signUpName,
      email: signUpEmail,
      password: signUpPassword,
    });

    if (!validation.success) {
      const errors: { name?: string; email?: string; password?: string } = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0] === "name") errors.name = err.message;
        if (err.path[0] === "email") errors.email = err.message;
        if (err.path[0] === "password") errors.password = err.message;
      });
      setSignUpErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: signUpEmail.trim(),
        password: signUpPassword,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: signUpName.trim(),
          },
        },
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes("User already registered")) {
          throw new Error("An account with this email already exists. Please sign in instead.");
        } else if (error.message.includes("Password should be")) {
          throw new Error("Password does not meet requirements. Please use a stronger password.");
        }
        throw error;
      }

      if (data.user) {
        toast({
          title: "Account created!",
          description: "Welcome to Find Your Flow. Let's get started!",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Please try again with different credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Find Your Flow</span>
          </Link>
          <p className="text-muted-foreground">
            Sign in to access your profile, saved resumes, and career recommendations
          </p>
        </div>

        <Card className="p-8 shadow-xl animate-fade-in">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your.email@example.com"
                      className={`pl-10 ${signInErrors.email ? "border-destructive" : ""}`}
                      value={signInEmail}
                      onChange={(e) => {
                        setSignInEmail(e.target.value);
                        setSignInErrors({ ...signInErrors, email: undefined });
                      }}
                      required
                    />
                  </div>
                  {signInErrors.email && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {signInErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      className={`pl-10 ${signInErrors.password ? "border-destructive" : ""}`}
                      value={signInPassword}
                      onChange={(e) => {
                        setSignInPassword(e.target.value);
                        setSignInErrors({ ...signInErrors, password: undefined });
                      }}
                      required
                    />
                  </div>
                  {signInErrors.password && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {signInErrors.password}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full mt-6" size="lg" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      placeholder="Enter your name"
                      className={`pl-10 ${signUpErrors.name ? "border-destructive" : ""}`}
                      value={signUpName}
                      onChange={(e) => {
                        setSignUpName(e.target.value);
                        setSignUpErrors({ ...signUpErrors, name: undefined });
                      }}
                      required
                    />
                  </div>
                  {signUpErrors.name && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {signUpErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      className={`pl-10 ${signUpErrors.email ? "border-destructive" : ""}`}
                      value={signUpEmail}
                      onChange={(e) => {
                        setSignUpEmail(e.target.value);
                        setSignUpErrors({ ...signUpErrors, email: undefined });
                      }}
                      required
                    />
                  </div>
                  {signUpErrors.email && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {signUpErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="At least 6 characters with letters"
                      className={`pl-10 ${signUpErrors.password ? "border-destructive" : ""}`}
                      value={signUpPassword}
                      onChange={(e) => {
                        setSignUpPassword(e.target.value);
                        setSignUpErrors({ ...signUpErrors, password: undefined });
                      }}
                      required
                    />
                  </div>
                  {signUpErrors.password && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {signUpErrors.password}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full mt-6" size="lg" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
