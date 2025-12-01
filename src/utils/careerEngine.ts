// Rule-based career prediction engine
export interface UserProfile {
  marks: string;
  interests: string[];
  skills: string[];
  emotionalState: string;
  personality: Record<string, number>;
}

export interface CareerPrediction {
  career: string;
  description: string;
  jobFitScore: number;
  collegeFitScore: number;
  difficulty: string;
  salaryBand: string;
  emotionalAdvice: string;
  skillsYouHave: string[];
  skillsToImprove: string[];
  roadmap: {
    learning: string[];
    tools: string[];
    courses: Array<{ title: string; platform: string }>;
    projects: string[];
    internship: string;
    timeline: string;
  };
  salaryRange: string;
  flowScore: {
    interest: number;
    skillMatch: number;
    confidence: number;
    alignment: number;
    overall: number;
  };
  resumeStarter: {
    skills: string[];
    projects: string[];
    keywords: string[];
    portfolio: string;
  };
  recommendedCourses: Array<{ title: string; platform: string; url?: string }>;
  alternativeCareer?: {
    career: string;
    salary: string;
    difficulty: string;
    demand: string;
    skillRequirement: string;
  };
}

const careerDatabase = {
  "Software Engineer": {
    description: "Build applications and solve problems through code",
    requiredSkills: ["Technical", "Problem Solving", "Analytical", "Creative"],
    interests: ["Technology"],
    difficulty: "High",
    salaryBand: "High",
    salaryRange: "₹6-25 LPA",
    tools: ["VS Code", "Git", "Docker", "React", "Node.js"],
    courses: [
      { title: "Full Stack Web Development", platform: "Udemy" },
      { title: "Data Structures & Algorithms", platform: "Coursera" },
      { title: "CS50 Introduction to Computer Science", platform: "edX" }
    ],
    projects: ["Build a portfolio website", "Create a task management app"],
    keywords: ["JavaScript", "Python", "React", "API", "Database"],
  },
  "Data Scientist": {
    description: "Analyze data and extract insights using AI/ML",
    requiredSkills: ["Analytical", "Technical", "Problem Solving"],
    interests: ["Technology", "Science"],
    difficulty: "High",
    salaryBand: "High",
    salaryRange: "₹8-30 LPA",
    tools: ["Python", "Jupyter", "TensorFlow", "Tableau", "SQL"],
    courses: [
      { title: "Machine Learning Specialization", platform: "Coursera" },
      { title: "Data Science with Python", platform: "DataCamp" },
      { title: "Statistics for Data Science", platform: "Udemy" }
    ],
    projects: ["Stock price prediction model", "Customer segmentation analysis"],
    keywords: ["Python", "ML", "Statistics", "Pandas", "Visualization"],
  },
  "UX/UI Designer": {
    description: "Design beautiful and intuitive user experiences",
    requiredSkills: ["Creative", "Communication", "Problem Solving"],
    interests: ["Creative Arts", "Technology"],
    difficulty: "Medium",
    salaryBand: "Medium",
    salaryRange: "₹4-15 LPA",
    tools: ["Figma", "Adobe XD", "Sketch", "Illustrator", "InVision"],
    courses: [
      { title: "UI/UX Design Specialization", platform: "Coursera" },
      { title: "User Experience Design Fundamentals", platform: "Udemy" },
      { title: "Figma UI Design", platform: "YouTube" }
    ],
    projects: ["Redesign a popular app", "Create a design system"],
    keywords: ["Figma", "Prototyping", "User Research", "Wireframes", "Visual Design"],
  },
  "Digital Marketer": {
    description: "Promote brands and products through digital channels",
    requiredSkills: ["Communication", "Creative", "Analytical"],
    interests: ["Business", "Creative Arts"],
    difficulty: "Medium",
    salaryBand: "Medium",
    salaryRange: "₹3-12 LPA",
    tools: ["Google Analytics", "SEMrush", "Canva", "Mailchimp", "Hootsuite"],
    courses: [
      { title: "Digital Marketing Specialization", platform: "Coursera" },
      { title: "Google Ads Certification", platform: "Google" },
      { title: "Social Media Marketing", platform: "HubSpot" }
    ],
    projects: ["Run a social media campaign", "Create content marketing strategy"],
    keywords: ["SEO", "Content Marketing", "Analytics", "Social Media", "Branding"],
  },
  "HR Manager": {
    description: "Manage people and build strong organizational culture",
    requiredSkills: ["Communication", "Leadership", "Problem Solving"],
    interests: ["Social Work", "Business"],
    difficulty: "Medium",
    salaryBand: "Medium",
    salaryRange: "₹4-15 LPA",
    tools: ["Workday", "BambooHR", "LinkedIn Recruiter", "Slack", "MS Teams"],
    courses: [
      { title: "Human Resource Management", platform: "Coursera" },
      { title: "Talent Acquisition", platform: "LinkedIn Learning" },
      { title: "Employee Engagement Strategies", platform: "Udemy" }
    ],
    projects: ["Design recruitment strategy", "Create employee wellness program"],
    keywords: ["Recruitment", "Employee Relations", "Performance Management", "Training"],
  },
  "Financial Analyst": {
    description: "Analyze financial data and guide business decisions",
    requiredSkills: ["Analytical", "Problem Solving", "Technical"],
    interests: ["Business", "Technology"],
    difficulty: "High",
    salaryBand: "High",
    salaryRange: "₹5-20 LPA",
    tools: ["Excel", "Power BI", "SQL", "Bloomberg Terminal", "Python"],
    courses: [
      { title: "Financial Analysis & Modeling", platform: "Coursera" },
      { title: "CFA Level 1 Preparation", platform: "Kaplan" },
      { title: "Advanced Excel for Finance", platform: "Udemy" }
    ],
    projects: ["Build financial forecast model", "Investment portfolio analysis"],
    keywords: ["Excel", "Financial Modeling", "Valuation", "Risk Analysis", "Reporting"],
  },
};

export const generateCareerPrediction = (profile: UserProfile): CareerPrediction => {
  const marks = parseInt(profile.marks);
  const { interests, skills, emotionalState, personality } = profile;

  // Rule-based matching
  let bestCareer = "Software Engineer";
  let maxScore = 0;

  Object.entries(careerDatabase).forEach(([career, data]) => {
    let score = 0;
    
    // Interest match
    const interestMatch = interests.some(i => data.interests.includes(i));
    if (interestMatch) score += 30;

    // Skill match
    const skillMatch = skills.filter(s => data.requiredSkills.includes(s)).length;
    score += skillMatch * 10;

    // Marks bonus
    if (marks >= 80) score += 20;
    else if (marks >= 60) score += 10;

    // Personality match
    if (personality.analytical > 15 && career.includes("Data")) score += 15;
    if (personality.creative > 15 && career.includes("Designer")) score += 15;
    if (personality.social > 15 && career.includes("HR")) score += 15;
    if (personality.technical > 15 && career.includes("Software")) score += 15;
    if (personality.logical > 15 && career.includes("Financial")) score += 15;

    if (score > maxScore) {
      maxScore = score;
      bestCareer = career;
    }
  });

  const careerData = careerDatabase[bestCareer as keyof typeof careerDatabase];

  // Calculate scores
  const jobFitScore = Math.min(95, 60 + maxScore);
  const collegeFitScore = Math.min(95, marks + (marks >= 80 ? 10 : 0));

  // Skill gap analysis
  const skillsYouHave = skills.filter(s => careerData.requiredSkills.includes(s));
  const skillsToImprove = careerData.requiredSkills.filter(s => !skills.includes(s));

  // Emotional advice
  const emotionalAdvice = getEmotionalAdvice(emotionalState, careerData.difficulty);

  // Flow Score calculation
  const interestScore = interests.some(i => careerData.interests.includes(i)) ? 90 : 60;
  const skillMatchScore = (skillsYouHave.length / careerData.requiredSkills.length) * 100;
  const confidenceScore = marks >= 70 ? 85 : 70;
  const alignmentScore = jobFitScore;
  const overallFlow = Math.round((interestScore + skillMatchScore + confidenceScore + alignmentScore) / 4);

  // Alternative career
  const allCareers = Object.keys(careerDatabase).filter(c => c !== bestCareer);
  const altCareer = allCareers[0];
  const altData = careerDatabase[altCareer as keyof typeof careerDatabase];

  return {
    career: bestCareer,
    description: careerData.description,
    jobFitScore,
    collegeFitScore,
    difficulty: careerData.difficulty,
    salaryBand: careerData.salaryBand,
    emotionalAdvice,
    skillsYouHave,
    skillsToImprove,
    roadmap: {
      learning: careerData.requiredSkills.map(s => `Master ${s} skills`),
      tools: careerData.tools,
      courses: careerData.courses,
      projects: careerData.projects,
      internship: `${bestCareer.split(" ")[0]} Intern at tech companies`,
      timeline: "3 months intensive learning + 3 months project building",
    },
    salaryRange: careerData.salaryRange,
    flowScore: {
      interest: interestScore,
      skillMatch: skillMatchScore,
      confidence: confidenceScore,
      alignment: alignmentScore,
      overall: overallFlow,
    },
    resumeStarter: {
      skills: careerData.requiredSkills.slice(0, 3),
      projects: careerData.projects,
      keywords: careerData.keywords,
      portfolio: `Create a portfolio showcasing ${careerData.projects[0]}`,
    },
    recommendedCourses: careerData.courses,
    alternativeCareer: {
      career: altCareer,
      salary: altData.salaryRange,
      difficulty: altData.difficulty,
      demand: altData.difficulty === "High" ? "Very High" : "High",
      skillRequirement: altData.requiredSkills.join(", "),
    },
  };
};

const getEmotionalAdvice = (state: string, difficulty: string): string => {
  const advice: Record<string, string> = {
    Confused: `Since you're feeling confused, we recommend this ${difficulty.toLowerCase()}-difficulty path which provides clear structure and defined learning milestones. Focus on one step at a time.`,
    Excited: "Your excitement is great! This creative and dynamic role will keep you energized. Channel that enthusiasm into learning and building projects.",
    Stressed: "We understand you're stressed. This career path has good work-life balance and clear progression. Take it one day at a time and focus on small wins.",
    Curious: "Your curiosity is perfect for this field! There's always something new to learn. Explore different aspects and find what fascinates you most.",
    Neutral: "This balanced approach suits your pragmatic mindset. Focus on steady skill-building and you'll see consistent progress.",
  };
  return advice[state] || advice.Neutral;
};

export const futureTrends = {
  growing: [
    { career: "AI/ML Engineer", reason: "AI revolution driving demand" },
    { career: "Data Analyst", reason: "Data-driven decision making" },
    { career: "Cybersecurity Specialist", reason: "Increasing digital threats" },
    { career: "Cloud Architect", reason: "Cloud migration boom" },
  ],
  declining: [
    { career: "Data Entry Clerk", reason: "Automation replacing manual work" },
    { career: "Travel Agent", reason: "Online booking platforms" },
  ],
};
