import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual form submission
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Mail,
              title: "Email Us",
              content: "support@findyourflow.com",
              color: "bg-primary",
            },
            {
              icon: Phone,
              title: "Call Us",
              content: "+91 98765 43210",
              color: "bg-secondary",
            },
            {
              icon: MapPin,
              title: "Visit Us",
              content: "Mumbai, Maharashtra, India",
              color: "bg-accent",
            },
          ].map((contact, index) => (
            <Card
              key={index}
              className="p-6 text-center hover:shadow-lg transition-all animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-xl ${contact.color} flex items-center justify-center mx-auto mb-4`}>
                <contact.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{contact.title}</h3>
              <p className="text-sm text-muted-foreground">{contact.content}</p>
            </Card>
          ))}
        </div>

        <Card className="p-8 animate-fade-in">
          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                placeholder="Tell us how we can help you..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="mt-2 min-h-[150px]"
              />
            </div>

            <Button type="submit" size="lg" className="w-full shadow-lg hover:shadow-xl transition-all">
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </Button>
          </form>
        </Card>

        <Card className="mt-8 p-6 bg-gradient-subtle text-center">
          <h3 className="font-semibold mb-2">Follow Us on Social Media</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Stay updated with the latest career guidance tips and resources
          </p>
          <div className="flex justify-center gap-4">
            {["LinkedIn", "Instagram", "Twitter"].map((social) => (
              <Button key={social} variant="outline" size="sm">
                {social}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
