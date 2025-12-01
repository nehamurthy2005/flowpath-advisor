import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";

const streamInfo = {
  science: {
    name: "Science Stream",
    description: "Perfect for curious minds who love exploring how the world works through experimentation and analysis.",
    careers: [
      "Software Engineer",
      "Doctor / Medical Professional",
      "Data Scientist",
      "Research Scientist",
      "Biotechnologist",
    ],
    color: "bg-primary",
  },
  commerce: {
    name: "Commerce Stream",
    description: "Ideal for those interested in business, finance, and understanding how economies function.",
    careers: [
      "Chartered Accountant",
      "Business Analyst",
      "Investment Banker",
      "Entrepreneur",
      "Financial Advisor",
    ],
    color: "bg-secondary",
  },
  arts: {
    name: "Arts/Humanities Stream",
    description: "Great for creative thinkers and those passionate about culture, society, and human expression.",
    careers: [
      "Journalist / Content Writer",
      "Psychologist",
      "Lawyer",
      "Social Worker",
      "Graphic Designer",
    ],
    color: "bg-accent",
  },
  vocational: {
    name: "Vocational/Technical Stream",
    description: "Perfect for hands-on learners who excel in practical skills and technical expertise.",
    careers: [
      "Web Developer",
      "Fashion Designer",
      "Chef / Culinary Expert",
      "Animator",
      "Electrician / Technician",
    ],
    color: "bg-primary",
  },
};

export default function QuizResult() {
  const location = useLocation();
  const { stream, basicInfo } = location.state || {};

  if (!stream) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="mb-4">No quiz results found.</p>
          <Link to="/quiz">
            <Button>Take the Quiz</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const streamData = streamInfo[stream as keyof typeof streamInfo];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="p-8 animate-fade-in shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Congratulations, {basicInfo?.name}!
            </h1>
            <p className="text-xl text-muted-foreground">
              Based on your responses, we've found your perfect match
            </p>
          </div>

          <div className={`${streamData.color} rounded-2xl p-8 text-white mb-8`}>
            <h2 className="text-3xl font-bold mb-4">{streamData.name}</h2>
            <p className="text-lg text-white/90 mb-6">{streamData.description}</p>
            
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4">Exciting Career Paths for You:</h3>
              <ul className="space-y-2">
                {streamData.careers.map((career, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>{career}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <Link to={`/streams/${stream}`} className="block">
              <Button size="lg" className="w-full shadow-lg hover:shadow-xl transition-all">
                <BookOpen className="w-5 h-5 mr-2" />
                Explore {streamData.name} in Detail
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link to="/streams" className="block">
              <Button size="lg" variant="outline" className="w-full">
                View All Streams
              </Button>
            </Link>

            <Link to="/quiz" className="block">
              <Button size="lg" variant="ghost" className="w-full">
                Retake Quiz
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
