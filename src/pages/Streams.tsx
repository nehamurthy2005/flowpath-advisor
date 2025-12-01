import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Microscope, Briefcase, Palette, Wrench, ArrowRight } from "lucide-react";

const streams = [
  {
    id: "science",
    name: "Science Stream",
    description: "Explore the wonders of nature, technology, and innovation through physics, chemistry, biology, and mathematics.",
    icon: Microscope,
    color: "from-blue-500 to-indigo-600",
    subjects: ["Physics", "Chemistry", "Biology", "Mathematics"],
  },
  {
    id: "commerce",
    name: "Commerce Stream",
    description: "Master the art of business, finance, and economics to become a leader in the corporate world.",
    icon: Briefcase,
    color: "from-emerald-500 to-teal-600",
    subjects: ["Accountancy", "Business Studies", "Economics", "Mathematics"],
  },
  {
    id: "arts",
    name: "Arts/Humanities Stream",
    description: "Express yourself through literature, history, social sciences, and creative pursuits that shape society.",
    icon: Palette,
    color: "from-purple-500 to-pink-600",
    subjects: ["History", "Political Science", "Psychology", "Literature"],
  },
  {
    id: "vocational",
    name: "Vocational/Technical Stream",
    description: "Develop practical skills in specialized fields that lead directly to rewarding careers.",
    icon: Wrench,
    color: "from-orange-500 to-red-600",
    subjects: ["IT & Programming", "Design", "Hospitality", "Technical Skills"],
  },
];

export default function Streams() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Your Options</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the different streams available and find the one that aligns with your passions and career goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {streams.map((stream, index) => {
            const Icon = stream.icon;
            return (
              <Card
                key={stream.id}
                className="p-8 hover:shadow-xl transition-all animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stream.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold mb-3">{stream.name}</h2>
                <p className="text-muted-foreground mb-6">{stream.description}</p>
                
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                    Key Subjects
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {stream.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="px-3 py-1 bg-muted rounded-full text-sm"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Link to={`/streams/${stream.id}`}>
                  <Button className="w-full group-hover:shadow-lg transition-all">
                    Explore Careers & Roadmaps
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>

        <Card className="mt-12 p-8 bg-gradient-primary text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Not Sure Which Stream to Choose?</h2>
          <p className="text-white/90 mb-6">
            Take our intelligent career quiz to discover which stream aligns best with your interests and strengths.
          </p>
          <Link to="/quiz">
            <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-xl transition-all">
              Take the Career Quiz
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
