import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, BookOpen, ChevronDown, ChevronUp } from "lucide-react";

const streamData = {
  science: {
    name: "Science Stream",
    overview: "The Science stream opens doors to innovation, discovery, and cutting-edge technology. It's perfect for curious minds who love to understand how the world works.",
    emoji: "🔬",
    subjects: ["Physics", "Chemistry", "Biology", "Mathematics"],
    domains: [
      {
        id: "research",
        name: "Research & Development",
        icon: "🔬",
        color: "from-blue-500 to-cyan-600",
        overview: "Focused on discovery, innovation, and experimentation across physics, biology, chemistry, and technology.",
        careers: ["Research Scientist", "Biomedical Analyst", "Data Researcher", "Academic Professor"],
        studyPath: "B.Sc → M.Sc → PhD (Subject-specific)",
        skills: ["Analytical thinking", "Statistics", "Data Analysis", "Experimentation", "Critical Thinking"],
        tools: ["MATLAB", "R", "SPSS", "Python", "LabVIEW"],
        companies: ["ISRO", "DRDO", "CSIR", "IISc", "TIFR", "BARC"],
        futureScope: "AI-driven scientific research, biotech advancements, sustainable materials, quantum computing"
      },
      {
        id: "medicine",
        name: "Medicine & Healthcare",
        icon: "⚕️",
        color: "from-red-500 to-pink-600",
        overview: "Dedicated to healing, patient care, and advancing medical science through clinical practice and biomedical research.",
        careers: ["Doctor/Physician", "Surgeon", "Biotechnologist", "Medical Researcher", "Pharmacist"],
        studyPath: "MBBS / B.Pharm / BDS → MD/MS / M.Pharm → Specialization",
        skills: ["Medical knowledge", "Patient care", "Precision", "Communication", "Emergency response"],
        tools: ["Medical equipment", "Healthcare software", "Diagnostic tools", "Lab instruments"],
        companies: ["AIIMS", "Apollo Hospitals", "Fortis", "WHO", "Pfizer", "Dr. Reddy's"],
        futureScope: "Telemedicine, AI diagnostics, personalized medicine, genetic therapy, regenerative medicine"
      },
      {
        id: "engineering",
        name: "Engineering & Technology",
        icon: "⚙️",
        color: "from-indigo-500 to-purple-600",
        overview: "Building the future through innovation in software, mechanical systems, electrical solutions, and infrastructure.",
        careers: ["Software Engineer", "Mechanical Engineer", "Electrical Engineer", "Civil Engineer", "Aerospace Engineer"],
        studyPath: "B.Tech / B.E → M.Tech / MBA → Specialization",
        skills: ["Problem-solving", "Technical design", "Programming", "Project management", "Innovation"],
        tools: ["AutoCAD", "Python", "MATLAB", "SolidWorks", "Arduino", "Git"],
        companies: ["Google", "Microsoft", "Tesla", "SpaceX", "L&T", "TCS", "Infosys"],
        futureScope: "AI/ML engineering, robotics, renewable energy, autonomous vehicles, smart cities"
      },
      {
        id: "laboratory",
        name: "Laboratory Sciences",
        icon: "🧪",
        color: "from-emerald-500 to-teal-600",
        overview: "Conducting precise experiments and analysis in pathology, genetics, microbiology, and clinical diagnostics.",
        careers: ["Pathologist", "Geneticist", "Microbiologist", "Clinical Lab Scientist", "Biochemist"],
        studyPath: "B.Sc (Medical Lab Technology / Microbiology) → M.Sc → PhD",
        skills: ["Laboratory techniques", "Accuracy", "Data interpretation", "Quality control", "Scientific reporting"],
        tools: ["Microscopes", "Spectrophotometers", "PCR machines", "Centrifuges", "ELISA kits"],
        companies: ["Thyrocare", "Dr. Lal PathLabs", "SRL Diagnostics", "Quest Diagnostics", "CDC"],
        futureScope: "Genomic medicine, rapid diagnostics, biomarker discovery, precision testing"
      }
    ]
  },
  commerce: {
    name: "Commerce Stream",
    overview: "Commerce prepares you for the business world, teaching you about finance, economics, and entrepreneurship.",
    emoji: "💼",
    subjects: ["Accountancy", "Business Studies", "Economics", "Mathematics"],
    domains: [
      {
        id: "finance",
        name: "Finance & Investment",
        icon: "💰",
        color: "from-green-500 to-emerald-600",
        overview: "Involves managing money, investments, banking systems, and financial planning for individuals and organizations.",
        careers: ["Financial Analyst", "Investment Banker", "Portfolio Manager", "Financial Advisor", "Risk Manager"],
        studyPath: "B.Com / BBA → MBA (Finance) / CFA / CA",
        skills: ["Quantitative analysis", "Financial modeling", "Risk management", "Market analysis", "Investment strategy"],
        tools: ["Excel", "QuickBooks", "SAP", "Tally", "Bloomberg Terminal", "Power BI"],
        companies: ["Deloitte", "PwC", "JP Morgan", "HDFC Bank", "Goldman Sachs", "ICICI Bank"],
        futureScope: "FinTech, cryptocurrency finance, AI-driven trading, blockchain banking, robo-advisors"
      },
      {
        id: "marketing",
        name: "Marketing & Advertising",
        icon: "📢",
        color: "from-orange-500 to-red-600",
        overview: "Creating brand awareness, customer engagement, and driving sales through creative campaigns and digital strategies.",
        careers: ["Marketing Manager", "Brand Strategist", "Digital Marketer", "Content Creator", "Social Media Manager"],
        studyPath: "BBA / B.Com → MBA (Marketing) / Digital Marketing Certifications",
        skills: ["Creative thinking", "Communication", "Data analytics", "Consumer psychology", "Campaign management"],
        tools: ["Google Ads", "Canva", "HubSpot", "Mailchimp", "SEMrush", "Meta Business Suite"],
        companies: ["Unilever", "Procter & Gamble", "Ogilvy", "WPP", "Publicis", "Google", "Amazon"],
        futureScope: "Influencer marketing, AI personalization, metaverse advertising, voice search optimization"
      },
      {
        id: "business",
        name: "Business Management",
        icon: "🏢",
        color: "from-blue-500 to-indigo-600",
        overview: "Leading organizations, managing operations, developing strategies, and driving entrepreneurial ventures.",
        careers: ["Business Analyst", "Operations Manager", "Entrepreneur", "Management Consultant", "Product Manager"],
        studyPath: "BBA / B.Com → MBA (General Management) / Executive MBA",
        skills: ["Leadership", "Strategic thinking", "Project management", "Decision-making", "Team building"],
        tools: ["Microsoft Office", "Asana", "Trello", "Salesforce", "Tableau", "Slack"],
        companies: ["McKinsey", "BCG", "Bain & Company", "Flipkart", "Reliance", "Tata Group"],
        futureScope: "Digital transformation, remote team management, sustainable business, AI-powered decision systems"
      },
      {
        id: "accounting",
        name: "Accounting & Taxation",
        icon: "📊",
        color: "from-purple-500 to-pink-600",
        overview: "Managing financial records, ensuring compliance, conducting audits, and providing tax advisory services.",
        careers: ["Chartered Accountant", "Tax Consultant", "Auditor", "Financial Controller", "Accounts Manager"],
        studyPath: "B.Com → CA / CMA / CS / M.Com",
        skills: ["Attention to detail", "Financial reporting", "Tax laws", "Audit procedures", "Compliance management"],
        tools: ["Tally", "QuickBooks", "Zoho Books", "SAP FICO", "Excel", "GST Portal"],
        companies: ["EY", "KPMG", "Deloitte", "Grant Thornton", "BDO", "RSM India"],
        futureScope: "Automated accounting, AI auditing, digital tax compliance, blockchain accounting"
      }
    ]
  },
  arts: {
    name: "Arts/Humanities Stream",
    overview: "Arts and Humanities let you explore human expression, culture, and society through creative and analytical lenses.",
    emoji: "🎨",
    subjects: ["History", "Political Science", "Psychology", "Literature"],
    domains: [
      {
        id: "design",
        name: "Design & Visual Arts",
        icon: "🎨",
        color: "from-pink-500 to-rose-600",
        overview: "Focused on creativity, UI/UX, fashion, graphic design, and industrial design to create visually compelling experiences.",
        careers: ["Graphic Designer", "UI/UX Specialist", "Product Designer", "Animator", "Fashion Designer"],
        studyPath: "B.Des / BFA / Diploma in Design / Fashion Design",
        skills: ["Creativity", "Visual thinking", "User experience", "Color theory", "Digital illustration"],
        tools: ["Figma", "Adobe XD", "Canva", "Blender", "Photoshop", "Illustrator"],
        companies: ["Adobe", "Google", "Apple", "IDEO", "Zara", "H&M", "Myntra"],
        futureScope: "AR/VR design, creative AI tools, metaverse fashion, 3D design automation"
      },
      {
        id: "writing",
        name: "Writing & Content Creation",
        icon: "✍️",
        color: "from-indigo-500 to-blue-600",
        overview: "Crafting compelling stories, articles, scripts, and digital content for various media and platforms.",
        careers: ["Content Writer", "Journalist", "Copywriter", "Author", "Scriptwriter", "Technical Writer"],
        studyPath: "BA (English / Journalism) → MA / Diploma in Creative Writing",
        skills: ["Storytelling", "Research", "Grammar", "SEO writing", "Editing", "Communication"],
        tools: ["Google Docs", "Grammarly", "WordPress", "Medium", "Scrivener", "Hemingway Editor"],
        companies: ["The Times of India", "NDTV", "BBC", "Penguin Random House", "HarperCollins", "Netflix"],
        futureScope: "AI-assisted writing, podcast scripting, interactive storytelling, content personalization"
      },
      {
        id: "music",
        name: "Music & Audio Production",
        icon: "🎵",
        color: "from-purple-500 to-violet-600",
        overview: "Creating, performing, and producing music across genres including classical, contemporary, and electronic.",
        careers: ["Music Producer", "Singer", "Music Composer", "Sound Engineer", "Music Therapist"],
        studyPath: "BA (Music) / Diploma in Music Production → MA (Music)",
        skills: ["Musical talent", "Audio editing", "Composition", "Performance", "Sound design"],
        tools: ["FL Studio", "Logic Pro", "Ableton Live", "Pro Tools", "GarageBand", "Audacity"],
        companies: ["Sony Music", "T-Series", "Spotify", "Apple Music", "YouTube Music", "Film Studios"],
        futureScope: "AI music generation, spatial audio, NFT music, virtual concerts, music therapy apps"
      },
      {
        id: "film",
        name: "Film & Media Production",
        icon: "🎬",
        color: "from-red-500 to-orange-600",
        overview: "Bringing stories to life through filmmaking, video production, direction, and cinematography.",
        careers: ["Film Director", "Cinematographer", "Video Editor", "Producer", "Screenwriter"],
        studyPath: "BA (Film Studies) / Diploma in Film Making → Specialization courses",
        skills: ["Visual storytelling", "Video editing", "Camera operation", "Lighting", "Direction"],
        tools: ["Adobe Premiere Pro", "Final Cut Pro", "DaVinci Resolve", "After Effects", "Cinema 4D"],
        companies: ["Netflix", "Amazon Prime", "Disney", "Dharma Productions", "Yash Raj Films", "Red Chillies"],
        futureScope: "Streaming platforms, virtual production, 360° video, AI video editing, interactive cinema"
      },
      {
        id: "visual-arts",
        name: "Visual Arts & Photography",
        icon: "📸",
        color: "from-emerald-500 to-cyan-600",
        overview: "Capturing moments and creating art through photography, painting, sculpture, and mixed media.",
        careers: ["Photographer", "Fine Artist", "Art Director", "Illustrator", "Gallery Curator"],
        studyPath: "BFA (Fine Arts / Photography) → MFA / Portfolio Development",
        skills: ["Visual composition", "Photography", "Artistic expression", "Digital art", "Curation"],
        tools: ["Lightroom", "Photoshop", "Procreate", "DSLR cameras", "Drawing tablets", "3D sculpting tools"],
        companies: ["National Geographic", "Getty Images", "Magnum Photos", "Art galleries", "Creative agencies"],
        futureScope: "NFT art, digital exhibitions, AI-generated art, virtual galleries, augmented reality art"
      }
    ]
  },
  vocational: {
    name: "Vocational/Technical Stream",
    overview: "Vocational training focuses on practical skills that lead directly to employment in specialized fields.",
    emoji: "🔧",
    subjects: ["IT & Programming", "Design", "Hospitality", "Technical Skills"],
    domains: [
      {
        id: "it-programming",
        name: "IT & Programming",
        icon: "💻",
        color: "from-blue-500 to-cyan-600",
        overview: "Hands-on training in coding, web development, app development, and IT support for immediate employment.",
        careers: ["Web Developer", "App Developer", "IT Support Specialist", "Network Technician", "Database Administrator"],
        studyPath: "Diploma in IT / Computer Science / Coding Bootcamps / Certifications",
        skills: ["Programming", "Problem-solving", "Debugging", "Web technologies", "Database management"],
        tools: ["VS Code", "GitHub", "Python", "JavaScript", "React", "Node.js", "MySQL"],
        companies: ["Tech startups", "TCS", "Wipro", "Accenture", "Cognizant", "Local IT firms"],
        futureScope: "Cloud computing, DevOps, cybersecurity, mobile app development, AI integration"
      },
      {
        id: "hospitality",
        name: "Hospitality & Tourism",
        icon: "🏨",
        color: "from-amber-500 to-orange-600",
        overview: "Training in hotel management, culinary arts, tourism services, and event planning for the service industry.",
        careers: ["Hotel Manager", "Chef", "Event Planner", "Travel Consultant", "Restaurant Manager"],
        studyPath: "Diploma in Hotel Management / Culinary Arts / Tourism",
        skills: ["Customer service", "Communication", "Management", "Culinary skills", "Event coordination"],
        tools: ["POS systems", "Booking software", "Kitchen equipment", "Event management platforms"],
        companies: ["Marriott", "Taj Hotels", "ITC", "MakeMyTrip", "Cox & Kings", "Catering companies"],
        futureScope: "Eco-tourism, luxury hospitality, food tech, virtual travel experiences"
      },
      {
        id: "technical-trades",
        name: "Technical Trades & Crafts",
        icon: "🔧",
        color: "from-slate-500 to-gray-600",
        overview: "Specialized training in electrical work, plumbing, carpentry, automotive repair, and other skilled trades.",
        careers: ["Electrician", "Plumber", "Carpenter", "Automotive Technician", "HVAC Specialist"],
        studyPath: "ITI / Vocational Diploma / Apprenticeship Programs",
        skills: ["Technical expertise", "Manual dexterity", "Safety protocols", "Problem-solving", "Precision"],
        tools: ["Hand tools", "Power tools", "Diagnostic equipment", "Safety gear", "Measuring instruments"],
        companies: ["Construction firms", "Manufacturing plants", "Service companies", "Self-employment"],
        futureScope: "Green energy installation, smart home systems, electric vehicle maintenance"
      },
      {
        id: "beauty-wellness",
        name: "Beauty & Wellness",
        icon: "💆",
        color: "from-rose-500 to-pink-600",
        overview: "Professional training in cosmetology, spa therapy, fitness instruction, and personal care services.",
        careers: ["Beautician", "Makeup Artist", "Spa Therapist", "Fitness Trainer", "Hair Stylist"],
        studyPath: "Diploma in Cosmetology / Beauty Therapy / Fitness Training",
        skills: ["Beauty techniques", "Customer care", "Creativity", "Hygiene", "Physical fitness"],
        tools: ["Makeup kits", "Beauty equipment", "Spa tools", "Fitness equipment", "Salon software"],
        companies: ["Lakme", "VLCC", "Gold's Gym", "Anytime Fitness", "Salons", "Wellness centers"],
        futureScope: "Med-spas, organic beauty, wellness tech, home service apps, personal branding"
      }
    ]
  },
};

function DomainCard({ domain }: { domain: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <div className={`p-6 bg-gradient-to-r ${domain.color} text-white cursor-pointer hover:opacity-90 transition-opacity`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{domain.icon}</span>
                <div className="text-left">
                  <h3 className="text-2xl font-bold">{domain.name}</h3>
                  <p className="text-white/90 mt-1">{domain.overview}</p>
                </div>
              </div>
              {isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="p-6 space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                💼 <span>Top Careers in This Domain</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {domain.careers.map((career: string, idx: number) => (
                  <span key={idx} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {career}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  🎓 <span>Study Path</span>
                </h4>
                <p className="text-muted-foreground">{domain.studyPath}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  🧠 <span>Key Skills Required</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {domain.skills.map((skill: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-muted rounded-lg text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                💾 <span>Tools & Technologies</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {domain.tools.map((tool: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 bg-secondary/50 rounded-lg text-sm font-mono">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                🏢 <span>Top Companies & Institutions</span>
              </h4>
              <p className="text-muted-foreground">{domain.companies.join(", ")}</p>
            </div>

            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                🚀 <span>Future Scope & Growth Opportunities</span>
              </h4>
              <p className="text-muted-foreground">{domain.futureScope}</p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export default function StreamDetail() {
  const { streamId } = useParams();
  const stream = streamData[streamId as keyof typeof streamData];

  if (!stream) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="mb-4">Stream not found.</p>
          <Link to="/streams">
            <Button>View All Streams</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <Link to="/streams">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Streams
          </Button>
        </Link>

        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">{stream.emoji}</span>
            <h1 className="text-4xl md:text-5xl font-bold">{stream.name}</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6">{stream.overview}</p>
          
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Core Subjects
            </h2>
            <div className="flex flex-wrap gap-2">
              {stream.subjects.map((subject) => (
                <span
                  key={subject}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">🧭 Explore Career Domains</h2>
          <p className="text-muted-foreground mb-8">
            Click on any domain below to explore detailed career paths, skills, study routes, and future opportunities.
          </p>
          
          <div className="space-y-4">
            {stream.domains.map((domain, index) => (
              <div key={domain.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <DomainCard domain={domain} />
              </div>
            ))}
          </div>
        </div>

        <Card className="p-8 bg-gradient-primary text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-white/90 mb-6">
            Take our career quiz to get personalized recommendations or explore other streams.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/quiz">
              <Button size="lg" variant="secondary">
                Take Career Quiz
              </Button>
            </Link>
            <Link to="/streams">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View All Streams
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
