import hiringSystemImg from '../assets/Images/Hiring System/Hiring System.png';
import hiringSystemVideo from '../assets/Images/Hiring System/Demo Video.mp4';
import orderingSystemImg from '../assets/Images/Ordering System.png';

export const PROJECTS_DATA = [
  {
    id: 'hiring-system',
    title: 'Airship Express — AI Hiring & Recruitment System',
    year: '2026',
    role: 'Full-Stack Developer',
    status: 'Featured Capstone',
    previewImage: hiringSystemImg,
    demoVideo: hiringSystemVideo,
    hasVideoDemo: true,
    shortDescription:
      'A full-stack hiring platform powered by Google Gemini AI that automates resume screening, scores candidate-job match, and provides a 24/7 applicant support chatbot.',
    about:
      "Airship Express is an AI-powered Hiring Management System designed to streamline and improve the company's recruitment process. The platform allows applicants to explore job vacancies, submit digital applications, upload resumes, and track their application status. Using AI-powered resume parsing through the Gemini API, the system automatically extracts and organizes applicant information, including personal details, education, work experience, and skills, then generates a weighted compatibility score based on job requirements to assist HR personnel in evaluating candidates. It also features an intelligent chatbot powered by Natural Language Processing (NLP) that provides real-time responses to hiring-related inquiries, guides applicants throughout the recruitment process, and handles follow-up questions in English and Filipino. Unanswered inquiries are forwarded to administrators for review. On the administrative side, HR personnel can manage job postings, review and evaluate applicants, schedule interviews, monitor application progress, track contract signing and onboarding, and manage recruitment records and reports. By integrating automation, AI-assisted resume screening, and intelligent applicant communication, Airship Express aims to make recruitment more organized, efficient, and accessible for both applicants and hiring personnel.",
    keyFeatures: [
      'AI Resume Parser & Match Scoring powered by Google Gemini API',
      '24/7 Real-Time HR AI Chatbot for applicant status inquiries and company FAQs',
      'Zero-code HR Control Panel for dynamic policy and knowledge base updates',
      'Live job slot counters and visual step-by-step application progress tracker',
      'Automated email notifications and confirmations via PHPMailer & PDF Parser',
      'Role-Based Access Control (RBAC) with secure candidate ranking dashboards'
    ],
    technologies: {
      'Frontend': ['React.js', 'Vite', 'Tailwind CSS'],
      'Backend': ['PHP (REST API)', 'MySQL'],
      'AI & Services': ['Google Gemini API', 'PHPMailer', 'PDF Parser'],
      'Testing & Security': ['Vitest', 'Role-Based Access Control (RBAC)']
    },
    liveDemoUrl: '',
    githubUrl: 'https://github.com/Nathanielferrer/Nathanielferrer-airship-hiring-system'
  },
  {
    id: 'ordering-system',
    title: 'Ordering System with Inventory Management',
    year: '2024',
    role: 'Frontend Developer',
    status: 'Coffee Shop POS & Inventory',
    previewImage: orderingSystemImg,
    demoVideo: null,
    hasVideoDemo: false,
    shortDescription:
      'A responsive coffee shop POS and inventory management system that deducts recipe ingredients in real time and alerts owners before supplies run low.',
    about:
      'A responsive web-based point-of-sale (POS) and inventory platform designed for coffee shops to process customer orders swiftly while keeping back-of-house stock synchronized. Every time a beverage or food item is ordered, the system automatically subtracts the exact recipe ingredients—such as coffee beans, milk, syrups, and cups—preventing unexpected shortages and minimizing waste. Store managers can monitor business health through an interactive sales dashboard displaying daily revenue, top-selling items, and profit margins, backed by automated email notifications that alert owners immediately when stock falls below threshold levels.',
    keyFeatures: [
      'Responsive Web POS interface optimized for fast cash and digital order entry',
      'Real-time automated ingredient deduction with every recipe and beverage ordered',
      'Automated low-stock threshold email alerts powered by PHPMailer to prevent shortages',
      'Live sales dashboard tracking daily revenue, top-selling items, and profit margins',
      'Interactive inventory audit log tracking ingredient expiration and delivery restocks'
    ],
    technologies: {
      'Frontend Development': ['HTML5', 'CSS3', 'JavaScript'],
      'Backend & Logic': ['PHP'],
      'Services & Notifications': ['PHPMailer']
    },
    liveDemoUrl: '',
    githubUrl: 'https://github.com/Nathanielferrer/Ordering_System.git'
  }
];
