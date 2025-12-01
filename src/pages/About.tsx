import { Card } from "@/components/ui/card";
import { Target, Users, Sparkles, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Find Your Flow</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering students to discover their flow and shape their future
          </p>
        </div>

        <Card className="p-8 mb-12 bg-gradient-primary text-white animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Target className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold">Our Mission</h2>
          </div>
          <p className="text-lg text-white/90">
            At Find Your Flow, we believe every student has unique talents and passions waiting to be discovered. 
            Our mission is to guide students through the crucial decision of choosing their academic stream and 
            career path with confidence and clarity. We combine intelligent assessments, comprehensive career 
            information, and practical tools to help students make informed decisions about their future.
          </p>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
            <p className="text-muted-foreground">
              We envision a world where every student can confidently choose a career path aligned with their 
              interests and strengths. By providing personalized guidance and comprehensive resources, we aim 
              to reduce career confusion and help students achieve their full potential.
            </p>
          </Card>

          <Card className="p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Our Approach</h3>
            <p className="text-muted-foreground">
              We use a holistic approach combining intelligent assessments, detailed career information, 
              and practical tools. Our platform considers your interests, strengths, and preferences to 
              provide personalized recommendations that truly match your potential.
            </p>
          </Card>
        </div>

        <Card className="p-8 mb-12 bg-gradient-subtle animate-fade-in">
          <h2 className="text-3xl font-bold mb-8 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Career Assessment Quiz",
                description: "Intelligent two-level quiz that analyzes your interests and recommends the best stream for you.",
              },
              {
                title: "Comprehensive Stream Info",
                description: "Detailed information about each stream, career paths, roadmaps, and salary expectations.",
              },
              {
                title: "Resume Builder",
                description: "Professional templates and tools to create impressive resumes that stand out.",
              },
              {
                title: "Career Roadmaps",
                description: "Step-by-step guides showing exactly what you need to do to reach your career goals.",
              },
              {
                title: "Expert Guidance",
                description: "Information curated from industry experts and successful professionals.",
              },
              {
                title: "Personalized Support",
                description: "Tailored recommendations based on your unique profile and preferences.",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 bg-accent/10 border-accent/20 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Built with Students in Mind</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We understand the challenges students face when choosing their career path. That's why we've 
            created a platform that's easy to use, comprehensive, and genuinely helpful. Your success is 
            our success, and we're here to support you every step of the way.
          </p>
        </Card>
      </div>
    </div>
  );
}
