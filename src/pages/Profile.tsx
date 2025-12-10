import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import type { User } from "@supabase/supabase-js";

export default function Profile() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <Card className="p-12 text-center max-w-md animate-fade-in shadow-xl">
          <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-8">
            Please sign in to access your profile and manage your career journey.
          </p>
          <Link to="/auth">
            <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
              Sign In to Continue
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground mb-8">Fill in your details to create your professional profile</p>
        <ProfileFormInner user={user} />
      </div>
    </div>
  );
}

function ProfileFormInner({ user }: { user: User | null }) {
  type FormValues = {
    full_name: string;
    display_name: string;
    email_custom: string;
    phone: string;
    linkedin: string;
    portfolio: string;
    education: string;
    bio: string;
  };

  const { register, handleSubmit, reset, watch, formState } = useForm<FormValues>({
    defaultValues: {
      full_name: "",
      display_name: "",
      email_custom: "",
      phone: "",
      linkedin: "",
      portfolio: "",
      education: "",
      bio: "",
    },
  });

  const watchFields = watch();

  useEffect(() => {
    if (!user) return;
    const md = (user?.user_metadata ?? {}) as Record<string, string>;
    reset({
      full_name: md.full_name ?? md.name ?? "",
      display_name: md.display_name ?? md.username ?? "",
      email_custom: md.email_custom ?? user.email ?? "",
      phone: md.phone ?? "",
      linkedin: md.linkedin ?? "",
      portfolio: md.portfolio ?? "",
      education: md.education ?? "",
      bio: md.bio ?? "",
    });
  }, [user, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = await supabase.auth.updateUser({ data: values });
      if (error) throw error;
      toast({ title: "Profile saved", description: "Your profile has been updated successfully." });
    } catch (err: Error | unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      toast({ title: "Save failed", description: errorMsg });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <Card className="p-6 space-y-4">
        <h3 className="text-xl font-semibold">Personal Information</h3>
        
        <div>
          <Label htmlFor="full_name">Full Name *</Label>
          <Input id="full_name" {...register("full_name")} placeholder="John Doe" />
        </div>

        <div>
          <Label htmlFor="display_name">Display Name / Username</Label>
          <Input id="display_name" {...register("display_name")} placeholder="johndoe" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email_custom">Email</Label>
            <Input id="email_custom" type="email" {...register("email_custom")} placeholder="john@example.com" />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} placeholder="+91 98765 43210" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="linkedin">LinkedIn Profile</Label>
            <Input id="linkedin" {...register("linkedin")} placeholder="linkedin.com/in/johndoe" />
          </div>
          <div>
            <Label htmlFor="portfolio">Portfolio URL</Label>
            <Input id="portfolio" {...register("portfolio")} placeholder="johndoe.com" />
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-xl font-semibold">Professional Details</h3>
        
        <div>
          <Label htmlFor="education">Education</Label>
          <Input id="education" {...register("education")} placeholder="B.Tech in Computer Science, IIT Delhi (2024)" />
        </div>

        <div>
          <Label htmlFor="bio">Professional Bio / Summary</Label>
          <Textarea 
            id="bio" 
            {...register("bio")} 
            placeholder="Brief professional summary or about you..."
            rows={4}
          />
        </div>
      </Card>

      <Button type="submit" size="lg" className="w-full">
        Save Profile
      </Button>
    </form>
  );
}
