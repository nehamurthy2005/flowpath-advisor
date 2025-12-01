import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import QuizResult from "./pages/QuizResult";
import CareerAIQuiz from "./pages/CareerAIQuiz";
import CareerInsights from "./pages/CareerInsights";
import Streams from "./pages/Streams";
import StreamDetail from "./pages/StreamDetail";
import Resume from "./pages/Resume";
import ResumeBuilder from "./pages/ResumeBuilder";
import Scanner from "./pages/Scanner";
import Profile from "./pages/Profile";
import LinkedinTransformer from "./pages/LinkedinTransformer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import FindYourFlow from "./pages/FindYourFlow";
import FlowAssessment from "./pages/FlowAssessment";
import FlowCareer from "./pages/FlowCareer";
import FlowDashboard from "./pages/FlowDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/quiz/result" element={<QuizResult />} />
              <Route path="/career-ai-quiz" element={<CareerAIQuiz />} />
              <Route path="/career-insights" element={<CareerInsights />} />
              <Route path="/streams" element={<Streams />} />
              <Route path="/streams/:streamId" element={<StreamDetail />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/resume-builder/form" element={<Resume />} />
              <Route path="/scanner" element={<Scanner />} />
                <Route path="/linkedin-transformer" element={<LinkedinTransformer />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/find-your-flow" element={<FindYourFlow />} />
              <Route path="/flow-assessment" element={<FlowAssessment />} />
              <Route path="/flow-career" element={<FlowCareer />} />
              <Route path="/flow-dashboard" element={<FlowDashboard />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
