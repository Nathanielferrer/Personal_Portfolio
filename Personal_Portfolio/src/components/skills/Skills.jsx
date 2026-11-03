import { useTheme } from '../../context/ThemeContext';
import BorderGlow from '../reactbits/BorderGlow';
import AnimatedContent from '../reactbits/AnimatedContent';
import './Skills.css';

// Languages
import pythonImg from '../../assets/Images/python.svg';
import jsImg from '../../assets/Images/js.jpg';
import phpImg from '../../assets/Images/php.jpg';

// Frameworks & Libraries
import reactImg from '../../assets/Images/react.svg';

// Frontend
import htmlImg from '../../assets/Images/html.jpg';
import css3Img from '../../assets/Images/css3.jpg';

// Database
import mysqlImg from '../../assets/Images/mysql.svg';
import firebaseImg from '../../assets/Images/firebase.jpg';

// Tools & Dev Environment
import gitImg from '../../assets/Images/git.svg';
import githubImg from '../../assets/Images/github.svg';
import antigravityImg from '../../assets/Images/antigravity.jpg';
import vscodeImg from '../../assets/Images/vscode.svg';

// AI Tools Used
import geminiImg from '../../assets/Images/gemini.svg';
import claudeImg from '../../assets/Images/claaude.jpg';
import chatgptImg from '../../assets/Images/chatgpt.jpg';
import deepseekImg from '../../assets/Images/deepseek.jpg';

const SKILL_CATEGORIES = [
  {
    id: 'languages',
    title: 'LANGUAGES',
    skills: [
      { name: 'Python', image: pythonImg },
      { name: 'JavaScript', image: jsImg },
      { name: 'PHP', image: phpImg }
    ]
  },
  {
    id: 'frameworks',
    title: 'FRAMEWORKS & LIBRARIES',
    skills: [
      { name: 'React', image: reactImg }
    ]
  },
  {
    id: 'frontend',
    title: 'FRONTEND',
    skills: [
      { name: 'HTML5', image: htmlImg },
      { name: 'CSS3', image: css3Img }
    ]
  },
  {
    id: 'database',
    title: 'DATABASE',
    skills: [
      { name: 'MySQL', image: mysqlImg },
      { name: 'Firebase', image: firebaseImg }
    ]
  },
  {
    id: 'tools',
    title: 'TOOLS & DEV ENVIRONMENT',
    skills: [
      { name: 'Git', image: gitImg },
      { name: 'GitHub', image: githubImg },
      { name: 'Antigravity', image: antigravityImg },
      { name: 'VS Code', image: vscodeImg }
    ]
  },
  {
    id: 'ai-tools',
    title: 'AI-ASSISTED DEVELOPMENT',
    skills: [
      { name: 'Gemini', image: geminiImg },
      { name: 'Claude', image: claudeImg },
      { name: 'ChatGPT', image: chatgptImg },
      { name: 'DeepSeek', image: deepseekImg }
    ]
  }
];

export default function Skills() {
  const { darkMode } = useTheme();

  return (
    <section className="skills-section" id="skills">
      <AnimatedContent distance={40} direction="vertical" duration={0.8} ease="power3.out" threshold={0.15}>
        <div className="skills-header">
          <span className="skills-eyebrow">TECH STACK &amp; TOOLS</span>
          <h2 className="skills-title">Skills &amp; Technologies</h2>
        </div>
      </AnimatedContent>

      <AnimatedContent
        distance={60}
        direction="vertical"
        duration={0.8}
        stagger={0.08}
        ease="power3.out"
        threshold={0.1}
        className="skills-grid"
      >
        {SKILL_CATEGORIES.map(category => (
          <BorderGlow
            key={category.id}
            edgeSensitivity={24}
            glowColor={darkMode ? '40 80 80' : '230 92 50'}
            backgroundColor={darkMode ? '#13111a' : '#ffffff'}
            borderRadius={24}
            glowRadius={42}
            glowIntensity={darkMode ? 1 : 1.3}
            coneSpread={32}
            animated={false}
            colors={
              darkMode
                ? ['#c084fc', '#f472b6', '#38bdf8']
                : ['#2563eb', '#7c3aed', '#ec4899', '#06b6d4', '#f59e0b']
            }
            fillOpacity={darkMode ? 0.45 : 0.75}
            className={`skills-glow-card skills-card--${category.id}`}
          >
            <div className="skills-card-content">
              <div className="skills-card-header">
                <h3 className="skills-card-title">{category.title}</h3>
                <span className="skills-card-line" />
              </div>

              <div className="skills-card-pills">
                {category.skills.map(skill => (
                  <div key={skill.name} className="skills-pill">
                    <img
                      src={skill.image}
                      alt={skill.name}
                      className="skill-img"
                      loading="lazy"
                    />
                    <span className="skills-pill-name">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </BorderGlow>
        ))}
      </AnimatedContent>
    </section>
  );
}
