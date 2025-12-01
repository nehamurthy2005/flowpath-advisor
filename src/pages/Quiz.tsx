import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

interface BasicInfo {
  name: string;
  age: string;
  standard: string;
  language: string;
}

interface QuestionAnswer {
  questionId: number;
  answer: string;
  points: { science: number; commerce: number; arts: number; vocational: number };
}

const interestQuestions = [
  {
    id: 1,
    question: "Do you enjoy solving complex mathematical problems?",
    options: [
      { text: "Love it!", points: { science: 3, commerce: 2, arts: 0, vocational: 1 } },
      { text: "Sometimes", points: { science: 2, commerce: 2, arts: 0, vocational: 1 } },
      { text: "Not really", points: { science: 0, commerce: 1, arts: 2, vocational: 1 } },
      { text: "Not at all", points: { science: 0, commerce: 0, arts: 3, vocational: 2 } },
    ],
  },
  {
    id: 2,
    question: "Are you interested in understanding how living beings function?",
    options: [
      { text: "Very interested", points: { science: 3, commerce: 0, arts: 1, vocational: 2 } },
      { text: "Somewhat interested", points: { science: 2, commerce: 0, arts: 1, vocational: 2 } },
      { text: "Not much", points: { science: 0, commerce: 2, arts: 2, vocational: 1 } },
      { text: "Not interested", points: { science: 0, commerce: 3, arts: 3, vocational: 1 } },
    ],
  },
  {
    id: 3,
    question: "Do you prefer creative writing or logical analysis?",
    options: [
      { text: "Creative writing", points: { science: 0, commerce: 1, arts: 3, vocational: 1 } },
      { text: "Logical analysis", points: { science: 3, commerce: 2, arts: 0, vocational: 1 } },
      { text: "Both equally", points: { science: 1, commerce: 2, arts: 2, vocational: 1 } },
      { text: "Neither", points: { science: 1, commerce: 1, arts: 1, vocational: 3 } },
    ],
  },
  {
    id: 4,
    question: "Do you like experimenting and discovering how things work?",
    options: [
      { text: "Absolutely!", points: { science: 3, commerce: 1, arts: 1, vocational: 2 } },
      { text: "Yes, often", points: { science: 2, commerce: 1, arts: 1, vocational: 2 } },
      { text: "Occasionally", points: { science: 1, commerce: 2, arts: 2, vocational: 2 } },
      { text: "Rarely", points: { science: 0, commerce: 2, arts: 3, vocational: 1 } },
    ],
  },
  {
    id: 5,
    question: "Are you drawn to drawing, designing, or performing arts?",
    options: [
      { text: "Very much!", points: { science: 0, commerce: 0, arts: 3, vocational: 2 } },
      { text: "Yes, I enjoy it", points: { science: 0, commerce: 1, arts: 3, vocational: 2 } },
      { text: "Sometimes", points: { science: 1, commerce: 2, arts: 2, vocational: 2 } },
      { text: "Not really", points: { science: 3, commerce: 3, arts: 0, vocational: 1 } },
    ],
  },
  {
    id: 6,
    question: "Do you enjoy debating or helping others solve problems?",
    options: [
      { text: "Love it!", points: { science: 1, commerce: 2, arts: 3, vocational: 1 } },
      { text: "Yes, frequently", points: { science: 1, commerce: 2, arts: 2, vocational: 1 } },
      { text: "Sometimes", points: { science: 2, commerce: 2, arts: 1, vocational: 2 } },
      { text: "Not much", points: { science: 3, commerce: 1, arts: 0, vocational: 3 } },
    ],
  },
  {
    id: 7,
    question: "Are you interested in business, finance, or economics?",
    options: [
      { text: "Very interested", points: { science: 0, commerce: 3, arts: 1, vocational: 1 } },
      { text: "Somewhat interested", points: { science: 1, commerce: 2, arts: 1, vocational: 1 } },
      { text: "Not much", points: { science: 2, commerce: 0, arts: 2, vocational: 2 } },
      { text: "Not interested", points: { science: 3, commerce: 0, arts: 3, vocational: 2 } },
    ],
  },
  {
    id: 8,
    question: "Do you prefer hands-on practical work over theoretical concepts?",
    options: [
      { text: "Definitely practical", points: { science: 1, commerce: 1, arts: 1, vocational: 3 } },
      { text: "Mostly practical", points: { science: 1, commerce: 2, arts: 1, vocational: 3 } },
      { text: "Balance of both", points: { science: 2, commerce: 2, arts: 2, vocational: 2 } },
      { text: "Prefer theory", points: { science: 3, commerce: 2, arts: 3, vocational: 0 } },
    ],
  },
  {
    id: 9,
    question: "Are you interested in technology and innovation?",
    options: [
      { text: "Extremely interested", points: { science: 3, commerce: 2, arts: 1, vocational: 3 } },
      { text: "Quite interested", points: { science: 3, commerce: 2, arts: 1, vocational: 2 } },
      { text: "Somewhat", points: { science: 2, commerce: 2, arts: 2, vocational: 2 } },
      { text: "Not really", points: { science: 0, commerce: 1, arts: 3, vocational: 1 } },
    ],
  },
  {
    id: 10,
    question: "Do you enjoy reading about history, culture, or social issues?",
    options: [
      { text: "Love it!", points: { science: 0, commerce: 1, arts: 3, vocational: 0 } },
      { text: "Yes, often", points: { science: 0, commerce: 2, arts: 3, vocational: 1 } },
      { text: "Sometimes", points: { science: 1, commerce: 2, arts: 2, vocational: 2 } },
      { text: "Rarely", points: { science: 3, commerce: 2, arts: 0, vocational: 3 } },
    ],
  },
];

export default function Quiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    name: "",
    age: "",
    standard: "",
    language: "",
  });
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleBasicInfoChange = (field: keyof BasicInfo, value: string) => {
    setBasicInfo({ ...basicInfo, [field]: value });
  };

  const handleNextToQuestions = () => {
    if (basicInfo.name && basicInfo.age && basicInfo.standard && basicInfo.language) {
      setStep(2);
    }
  };

  const handleAnswer = (points: { science: number; commerce: number; arts: number; vocational: number }) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex((a) => a.questionId === interestQuestions[currentQuestion].id);
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = {
        questionId: interestQuestions[currentQuestion].id,
        answer: "",
        points,
      };
    } else {
      newAnswers.push({
        questionId: interestQuestions[currentQuestion].id,
        answer: "",
        points,
      });
    }
    
    setAnswers(newAnswers);

    if (currentQuestion < interestQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate results
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (answers: QuestionAnswer[]) => {
    const totals = { science: 0, commerce: 0, arts: 0, vocational: 0 };
    
    answers.forEach((answer) => {
      totals.science += answer.points.science;
      totals.commerce += answer.points.commerce;
      totals.arts += answer.points.arts;
      totals.vocational += answer.points.vocational;
    });

    const maxScore = Math.max(totals.science, totals.commerce, totals.arts, totals.vocational);
    let recommendedStream = "";
    
    if (totals.science === maxScore) recommendedStream = "science";
    else if (totals.commerce === maxScore) recommendedStream = "commerce";
    else if (totals.arts === maxScore) recommendedStream = "arts";
    else recommendedStream = "vocational";

    navigate("/quiz/result", { state: { stream: recommendedStream, basicInfo, totals } });
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {step === 1 && (
          <Card className="p-8 animate-fade-in shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Career Discovery Quiz</h1>
                <p className="text-muted-foreground">Step 1: Tell us about yourself</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={basicInfo.name}
                  onChange={(e) => handleBasicInfoChange("name", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={basicInfo.age}
                  onChange={(e) => handleBasicInfoChange("age", e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="standard">Current Standard *</Label>
                <Select value={basicInfo.standard} onValueChange={(value) => handleBasicInfoChange("standard", value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your standard" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8th Standard</SelectItem>
                    <SelectItem value="9">9th Standard</SelectItem>
                    <SelectItem value="10">10th Standard</SelectItem>
                    <SelectItem value="11">11th Standard</SelectItem>
                    <SelectItem value="12">12th Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language">Preferred Study Language *</Label>
                <Select value={basicInfo.language} onValueChange={(value) => handleBasicInfoChange("language", value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your preferred language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="regional">Regional Language</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleNextToQuestions}
                className="w-full mt-6"
                size="lg"
                disabled={!basicInfo.name || !basicInfo.age || !basicInfo.standard || !basicInfo.language}
              >
                Continue to Questions
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-8 animate-fade-in shadow-xl">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Question {currentQuestion + 1} of {interestQuestions.length}</h2>
                <span className="text-sm text-muted-foreground">
                  {Math.round(((currentQuestion + 1) / interestQuestions.length) * 100)}% Complete
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-primary transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / interestQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-6">{interestQuestions[currentQuestion].question}</h3>
              <div className="space-y-3">
                {interestQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.points)}
                    className="w-full p-4 text-left border border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-all"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>

            {currentQuestion > 0 && (
              <Button onClick={handlePrevious} variant="outline" className="mt-4">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Previous Question
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
