export type ResourceCategoryId =
  | "ai-ml"
  | "web-dev"
  | "app-dev"
  | "cybersecurity"
  | "competitive-programming"
  | "ui-ux"
  | "open-source"
  | "interview-prep"
  | "resume-building"
  | "placement-prep"
  | "workshop-materials"
  | "csi-exclusive";

export type ResourceType =
  | "Roadmap"
  | "PDF"
  | "Video"
  | "Playlist"
  | "Article"
  | "Workshop Recording"
  | "Project Guide";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategoryId;
  type: ResourceType;
  difficulty: Difficulty;
  estimatedTime: string;
  url?: string;
  csiRecommended?: boolean;
  trending?: boolean;
  beginnerFriendly?: boolean;
  popular?: boolean;
}

export interface RoadmapSubstep {
  title: string;
  description: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  substeps: RoadmapSubstep[];
}

export interface Roadmap {
  id: string;
  category: ResourceCategoryId;
  title: string;
  description: string;
  steps: RoadmapStep[];
}

export const RESOURCE_CATEGORIES: {
  id: ResourceCategoryId | "saved" | "featured";
  label: string;
  icon: string;
}[] = [
  { id: "featured", label: "CSI Recommended", icon: "sparkles" },
  { id: "saved", label: "Saved Resources", icon: "bookmark" },
  { id: "ai-ml", label: "AI / ML", icon: "brain" },
  { id: "web-dev", label: "Web Development", icon: "globe" },
  { id: "app-dev", label: "App Development", icon: "smartphone" },
  { id: "cybersecurity", label: "Cybersecurity", icon: "shield" },
  { id: "competitive-programming", label: "Competitive Programming", icon: "code" },
  { id: "ui-ux", label: "UI / UX Design", icon: "palette" },
  { id: "open-source", label: "Open Source", icon: "git-branch" },
  { id: "interview-prep", label: "Interview Preparation", icon: "message-square" },
  { id: "resume-building", label: "Resume Building", icon: "file-text" },
  { id: "placement-prep", label: "Placement Preparation", icon: "briefcase" },
  { id: "workshop-materials", label: "Workshop Materials", icon: "wrench" },
  { id: "csi-exclusive", label: "CSI Exclusive Resources", icon: "star" },
];

export const RESOURCES: Resource[] = [
  {
    id: "ai-roadmap",
    title: "CSI AI / ML Learning Roadmap",
    description: "Structured path from Python fundamentals to production ML and LLM projects.",
    category: "ai-ml",
    type: "Roadmap",
    difficulty: "Beginner",
    estimatedTime: "6–12 months",
    csiRecommended: true,
    trending: true,
    beginnerFriendly: true,
    popular: true,
  },
  {
    id: "python-ml-foundations",
    title: "Python for Machine Learning",
    description: "NumPy, Pandas, and scikit-learn essentials curated for CSI workshop series.",
    category: "ai-ml",
    type: "Playlist",
    difficulty: "Beginner",
    estimatedTime: "20 hours",
    url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuOb_chnQmHa",
    csiRecommended: true,
    beginnerFriendly: true,
    popular: true,
  },
  {
    id: "deep-learning-specialization",
    title: "Deep Learning Specialization",
    description: "Neural networks, CNNs, RNNs, and sequence models with hands-on assignments.",
    category: "ai-ml",
    type: "Playlist",
    difficulty: "Intermediate",
    estimatedTime: "80 hours",
    trending: true,
  },
  {
    id: "llm-primer",
    title: "LLM Engineering Primer",
    description: "Prompting, RAG, fine-tuning basics, and deploying small language models.",
    category: "ai-ml",
    type: "Article",
    difficulty: "Intermediate",
    estimatedTime: "4 hours",
    csiRecommended: true,
    trending: true,
  },
  {
    id: "ml-project-guide",
    title: "End-to-End ML Project Guide",
    description: "Ship a portfolio project from problem framing to deployment on GitHub.",
    category: "ai-ml",
    type: "Project Guide",
    difficulty: "Advanced",
    estimatedTime: "2 weeks",
    popular: true,
  },
  {
    id: "web-roadmap",
    title: "Full-Stack Web Development Roadmap",
    description: "HTML → CSS → JavaScript → React → Node.js → deployment workflow.",
    category: "web-dev",
    type: "Roadmap",
    difficulty: "Beginner",
    estimatedTime: "4–8 months",
    csiRecommended: true,
    beginnerFriendly: true,
    popular: true,
  },
  {
    id: "react-masterclass",
    title: "Modern React Patterns",
    description: "Hooks, server components, state management, and performance patterns.",
    category: "web-dev",
    type: "Video",
    difficulty: "Intermediate",
    estimatedTime: "12 hours",
    trending: true,
  },
  {
    id: "nextjs-guide",
    title: "Next.js Production Guide",
    description: "Build and deploy apps like the CSI desktop site with Next.js App Router.",
    category: "web-dev",
    type: "Article",
    difficulty: "Intermediate",
    estimatedTime: "6 hours",
    csiRecommended: true,
  },
  {
    id: "css-systems",
    title: "Design Systems with CSS",
    description: "Tokens, glassmorphism, and responsive layouts for premium UIs.",
    category: "web-dev",
    type: "PDF",
    difficulty: "Intermediate",
    estimatedTime: "3 hours",
  },
  {
    id: "app-dev-roadmap",
    title: "Mobile App Development Roadmap",
    description: "Cross-platform development with React Native and native fundamentals.",
    category: "app-dev",
    type: "Roadmap",
    difficulty: "Beginner",
    estimatedTime: "5–9 months",
    beginnerFriendly: true,
  },
  {
    id: "flutter-workshop",
    title: "Flutter Workshop Recording",
    description: "CSI technical domain session on building your first Flutter app.",
    category: "app-dev",
    type: "Workshop Recording",
    difficulty: "Beginner",
    estimatedTime: "2 hours",
    csiRecommended: true,
  },
  {
    id: "react-native-guide",
    title: "React Native Project Guide",
    description: "Navigation, APIs, and app store deployment checklist.",
    category: "app-dev",
    type: "Project Guide",
    difficulty: "Intermediate",
    estimatedTime: "1 week",
  },
  {
    id: "security-roadmap",
    title: "Cybersecurity Learning Path",
    description: "Networking, Linux, cryptography, and ethical hacking foundations.",
    category: "cybersecurity",
    type: "Roadmap",
    difficulty: "Beginner",
    estimatedTime: "6–10 months",
    csiRecommended: true,
    beginnerFriendly: true,
  },
  {
    id: "owasp-top10",
    title: "OWASP Top 10 Deep Dive",
    description: "Understand and mitigate the most critical web application risks.",
    category: "cybersecurity",
    type: "Article",
    difficulty: "Intermediate",
    estimatedTime: "5 hours",
    popular: true,
  },
  {
    id: "ctf-handbook",
    title: "CTF Preparation Handbook",
    description: "Binary exploitation, forensics, and web challenge strategies.",
    category: "cybersecurity",
    type: "PDF",
    difficulty: "Advanced",
    estimatedTime: "15 hours",
    trending: true,
  },
  {
    id: "cp-roadmap",
    title: "Competitive Programming Roadmap",
    description: "Data structures, algorithms, and contest strategy from zero to Codeforces.",
    category: "competitive-programming",
    type: "Roadmap",
    difficulty: "Beginner",
    estimatedTime: "4–6 months",
    csiRecommended: true,
    popular: true,
  },
  {
    id: "stl-guide",
    title: "STL & Algorithm Patterns",
    description: "Master C++ STL and the 14 patterns that solve 80% of contest problems.",
    category: "competitive-programming",
    type: "Article",
    difficulty: "Intermediate",
    estimatedTime: "10 hours",
  },
  {
    id: "leetcode-playlist",
    title: "Curated LeetCode Playlist",
    description: "Topic-wise problem sets for placement and interview readiness.",
    category: "competitive-programming",
    type: "Playlist",
    difficulty: "Intermediate",
    estimatedTime: "40 hours",
    trending: true,
  },
  {
    id: "ux-roadmap",
    title: "UI / UX Design Roadmap",
    description: "Research, wireframing, Figma, design systems, and usability testing.",
    category: "ui-ux",
    type: "Roadmap",
    difficulty: "Beginner",
    estimatedTime: "3–6 months",
    beginnerFriendly: true,
  },
  {
    id: "figma-fundamentals",
    title: "Figma Fundamentals",
    description: "Components, auto-layout, and prototyping for product designers.",
    category: "ui-ux",
    type: "Video",
    difficulty: "Beginner",
    estimatedTime: "8 hours",
    csiRecommended: true,
  },
  {
    id: "design-critique",
    title: "Design Critique Framework",
    description: "How CSI design domain evaluates posters, apps, and brand work.",
    category: "ui-ux",
    type: "PDF",
    difficulty: "Intermediate",
    estimatedTime: "1 hour",
  },
  {
    id: "oss-guide",
    title: "First Open Source Contribution",
    description: "Find issues, write PRs, and collaborate on github.com/CSI-VITC.",
    category: "open-source",
    type: "Project Guide",
    difficulty: "Beginner",
    estimatedTime: "1 week",
    csiRecommended: true,
    beginnerFriendly: true,
  },
  {
    id: "git-workflow",
    title: "Git Workflow for Teams",
    description: "Branches, PRs, code review, and release practices used in CSI projects.",
    category: "open-source",
    type: "Article",
    difficulty: "Beginner",
    estimatedTime: "2 hours",
    popular: true,
  },
  {
    id: "interview-roadmap",
    title: "Technical Interview Roadmap",
    description: "DSA, system design basics, and behavioral prep in one structured plan.",
    category: "interview-prep",
    type: "Roadmap",
    difficulty: "Intermediate",
    estimatedTime: "2–4 months",
    csiRecommended: true,
    popular: true,
  },
  {
    id: "system-design-101",
    title: "System Design 101",
    description: "Scalability, databases, caching, and trade-offs for intern-level interviews.",
    category: "interview-prep",
    type: "Video",
    difficulty: "Advanced",
    estimatedTime: "10 hours",
    trending: true,
  },
  {
    id: "behavioral-star",
    title: "STAR Method Workbook",
    description: "Structure answers for leadership, conflict, and project impact questions.",
    category: "interview-prep",
    type: "PDF",
    difficulty: "Beginner",
    estimatedTime: "2 hours",
    beginnerFriendly: true,
  },
  {
    id: "resume-template",
    title: "CSI Resume Template",
    description: "ATS-friendly one-page template used by placed CSI alumni.",
    category: "resume-building",
    type: "PDF",
    difficulty: "Beginner",
    estimatedTime: "30 min",
    csiRecommended: true,
    beginnerFriendly: true,
    popular: true,
  },
  {
    id: "resume-review",
    title: "Resume Review Checklist",
    description: "Quantify impact, trim fluff, and tailor for tech roles.",
    category: "resume-building",
    type: "Article",
    difficulty: "Beginner",
    estimatedTime: "1 hour",
  },
  {
    id: "placement-roadmap",
    title: "Campus Placement Roadmap",
    description: "Timeline from semester start to offer — aptitude, coding, and HR rounds.",
    category: "placement-prep",
    type: "Roadmap",
    difficulty: "Beginner",
    estimatedTime: "6 months",
    csiRecommended: true,
    popular: true,
  },
  {
    id: "aptitude-pack",
    title: "Aptitude Practice Pack",
    description: "Quant, logical reasoning, and verbal sections with timed mocks.",
    category: "placement-prep",
    type: "PDF",
    difficulty: "Intermediate",
    estimatedTime: "20 hours",
  },
  {
    id: "workshop-web-2025",
    title: "Web Dev Workshop — Spring 2025",
    description: "Recording from CSI full-stack build day with live Q&A.",
    category: "workshop-materials",
    type: "Workshop Recording",
    difficulty: "Beginner",
    estimatedTime: "3 hours",
    csiRecommended: true,
  },
  {
    id: "workshop-ai-2025",
    title: "AI / ML Workshop — Spring 2025",
    description: "Hands-on notebook session covering classification and model evaluation.",
    category: "workshop-materials",
    type: "Workshop Recording",
    difficulty: "Intermediate",
    estimatedTime: "2.5 hours",
    trending: true,
  },
  {
    id: "campusos-guide",
    title: "CampusOS Architecture Guide",
    description: "Internal documentation for CSI's unified campus platform project.",
    category: "csi-exclusive",
    type: "Project Guide",
    difficulty: "Advanced",
    estimatedTime: "4 hours",
    csiRecommended: true,
  },
  {
    id: "csi-onboarding",
    title: "New Member Onboarding Kit",
    description: "Everything you need to contribute to CSI in your first 30 days.",
    category: "csi-exclusive",
    type: "PDF",
    difficulty: "Beginner",
    estimatedTime: "1 hour",
    beginnerFriendly: true,
    popular: true,
  },
  {
    id: "sentinelx-docs",
    title: "SentinelX Security Docs",
    description: "Monitoring tooling built by CSI for campus infrastructure.",
    category: "csi-exclusive",
    type: "Article",
    difficulty: "Advanced",
    estimatedTime: "3 hours",
  },
];

export const ROADMAPS: Roadmap[] = [
  {
    id: "ai-ml-roadmap",
    category: "ai-ml",
    title: "AI / ML Roadmap",
    description: "From Python basics to shipping ML and LLM projects.",
    steps: [
      {
        id: "python",
        title: "Python",
        description: "Core syntax, OOP, and scientific computing libraries.",
        substeps: [
          { title: "Python fundamentals", description: "Variables, control flow, functions, and modules." },
          { title: "NumPy & Pandas", description: "Arrays, DataFrames, and data wrangling." },
        ],
      },
      {
        id: "statistics",
        title: "Statistics",
        description: "Probability, distributions, and hypothesis testing.",
        substeps: [
          { title: "Descriptive stats", description: "Mean, variance, correlation, and visualization." },
          { title: "Inferential stats", description: "Confidence intervals and A/B testing basics." },
        ],
      },
      {
        id: "ml",
        title: "Machine Learning",
        description: "Supervised and unsupervised learning with scikit-learn.",
        substeps: [
          { title: "Regression & classification", description: "Linear models, trees, and ensembles." },
          { title: "Model evaluation", description: "Cross-validation, metrics, and bias-variance." },
        ],
      },
      {
        id: "dl",
        title: "Deep Learning",
        description: "Neural networks with PyTorch or TensorFlow.",
        substeps: [
          { title: "CNNs & computer vision", description: "Image classification and transfer learning." },
          { title: "Sequence models", description: "RNNs, attention, and transformers intro." },
        ],
      },
      {
        id: "llms",
        title: "LLMs",
        description: "Large language models and modern AI applications.",
        substeps: [
          { title: "Prompt engineering", description: "Few-shot, chain-of-thought, and tool use." },
          { title: "RAG & fine-tuning", description: "Retrieval pipelines and domain adaptation." },
        ],
      },
      {
        id: "projects",
        title: "Projects",
        description: "Portfolio-ready capstone work.",
        substeps: [
          { title: "Kaggle or CSI hackathon", description: "Compete or collaborate on a real dataset." },
          { title: "Deploy a model", description: "API, Gradio, or edge deployment on GitHub." },
        ],
      },
    ],
  },
  {
    id: "web-dev-roadmap",
    category: "web-dev",
    title: "Web Development Roadmap",
    description: "Build production-grade web applications.",
    steps: [
      { id: "html-css", title: "HTML & CSS", description: "Semantic markup and modern layout.", substeps: [{ title: "Flexbox & Grid", description: "Responsive layouts without frameworks." }, { title: "Accessibility", description: "ARIA, contrast, and keyboard navigation." }] },
      { id: "javascript", title: "JavaScript", description: "Language fundamentals and DOM APIs.", substeps: [{ title: "ES6+", description: "Arrow functions, destructuring, async/await." }, { title: "Fetch & APIs", description: "REST clients and error handling." }] },
      { id: "react", title: "React", description: "Component architecture and state.", substeps: [{ title: "Hooks & context", description: "useState, useEffect, and shared state." }, { title: "Performance", description: "Memoization and code splitting." }] },
      { id: "backend", title: "Node.js", description: "APIs, auth, and databases.", substeps: [{ title: "Express / Next API", description: "Routes, middleware, validation." }, { title: "Database basics", description: "SQL vs NoSQL trade-offs." }] },
      { id: "deploy", title: "Deployment", description: "Ship to production.", substeps: [{ title: "CI/CD", description: "GitHub Actions and preview deploys." }, { title: "Monitoring", description: "Logs, errors, and uptime." }] },
    ],
  },
  {
    id: "cp-roadmap",
    category: "competitive-programming",
    title: "Competitive Programming Roadmap",
    description: "From first problem to contest-ready.",
    steps: [
      { id: "basics", title: "Language & I/O", description: "Pick C++ or Python and master fast I/O.", substeps: [{ title: "STL / collections", description: "Vectors, maps, sets, and priority queues." }] },
      { id: "ds", title: "Data Structures", description: "Arrays through segment trees.", substeps: [{ title: "Trees & graphs", description: "BFS, DFS, shortest paths." }] },
      { id: "algo", title: "Algorithms", description: "Sorting, DP, greedy, and binary search.", substeps: [{ title: "Dynamic programming", description: "State design and tabulation." }] },
      { id: "contest", title: "Contests", description: "Codeforces, LeetCode weekly, CSI internal contests.", substeps: [{ title: "Upsolving", description: "Review editorial after every contest." }] },
    ],
  },
];

export function getRoadmapForCategory(category: ResourceCategoryId): Roadmap | undefined {
  return ROADMAPS.find((r) => r.category === category);
}

export function getResourceById(id: string): Resource | undefined {
  return RESOURCES.find((r) => r.id === id);
}

export function getFeaturedResources(): Resource[] {
  return RESOURCES.filter((r) => r.csiRecommended || r.trending || r.beginnerFriendly || r.popular);
}

export const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

export const RESOURCE_TYPES: ResourceType[] = [
  "Roadmap",
  "PDF",
  "Video",
  "Playlist",
  "Article",
  "Workshop Recording",
  "Project Guide",
];
