import { useTheme } from '../../context/ThemeContext';
import BorderGlow from './BorderGlow';
import './TechStackCard.css';

export default function TechStackCard() {
  const { darkMode } = useTheme();

  return (
    <BorderGlow
      edgeSensitivity={30}
      glowColor={darkMode ? '40 80 80' : '220 80 75'}
      backgroundColor={darkMode ? '#120F17' : '#ffffff'}
      borderRadius={28}
      glowRadius={40}
      glowIntensity={1}
      coneSpread={25}
      animated={false}
      colors={['#c084fc', '#f472b6', '#38bdf8']}
      className="tech-glow-wrapper"
    >
      <div className="tech-card-content">
        <div className="tech-card-header">
          <span className="tech-badge">&gt;_</span>
          <h4 className="tech-card-title">TECH STACK</h4>
        </div>

        <div className="tech-card-divider" />

        {/* CORE LANGUAGES */}
        <div className="tech-group">
          <h5 className="tech-group-label">Core Languages</h5>
          <div className="tech-pills">
            {/* HTML5 */}
            <div className="tech-pill">
              <svg viewBox="0 0 24 24" className="tech-logo" aria-hidden="true">
                <path fill="#E34F26" d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0z" />
                <path fill="#EF652A" d="M12 22.2V1.9h8.7l-1.6 17.8L12 22.2z" />
                <path fill="#ECECEC" d="M6.3 5.4h5.7V8H9.3l.3 3.4h2.4v2.6H6.9l-.6-8.6zm.6 7.4h2.6l.3 3.1 2.2.6v2.7l-4.3-1.2-.8-5.2z" />
                <path fill="#FFFFFF" d="M12 5.4h5.7l-.6 6h-5.1v2.6h2.5l-.2 2.7-2.3.6v2.7l4.3-1.2.7-7.4H12V5.4z" />
              </svg>
              <span>HTML5</span>
            </div>

            {/* CSS3 */}
            <div className="tech-pill">
              <svg viewBox="0 0 24 24" className="tech-logo" aria-hidden="true">
                <path fill="#1572B6" d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0z" />
                <path fill="#33A9DC" d="M12 22.2V1.9h8.7l-1.6 17.8L12 22.2z" />
                <path fill="#ECECEC" d="M12 5.4H6.3l.3 3.4h5.4V5.4zm0 6H9.3l.3 3.4h2.4v-3.4zm0 5.4l-2.2-.6-.1-1.4H7.2l.3 3.2 4.5 1.2v-2.4z" />
                <path fill="#FFFFFF" d="M17.7 5.4H12v3.4h2.7l-.3 3h-2.4v3.4h2.5l-.2 2.7-2.3.6v2.4l4.3-1.2.7-8.1h.4l.2-2.8h-5.6V5.4z" />
              </svg>
              <span>CSS3</span>
            </div>

            {/* JavaScript */}
            <div className="tech-pill">
              <svg viewBox="0 0 24 24" className="tech-logo" aria-hidden="true">
                <rect width="24" height="24" rx="4" fill="#F7DF1E" />
                <path fill="#000000" d="M6.7 19.3c.7.4 1.6.7 2.6.7 1.4 0 2.3-.7 2.3-2V11H9.8v7c0 .5-.3.8-.8.8-.4 0-.8-.2-1.1-.4l-.8 1.3zm8.3-8.3h-1.8v8.4c.8.3 1.8.6 3 .6 2.4 0 4-1.2 4-3.5 0-2-1.3-3-3-3.8-.8-.4-1.4-.7-1.4-1.2 0-.4.3-.8 1-.8.6 0 1.2.2 1.6.5l.7-1.3c-.6-.4-1.4-.7-2.3-.7-2.1 0-3.6 1.3-3.6 3.2 0 1.8 1.1 2.8 2.8 3.5.9.4 1.5.8 1.5 1.4 0 .6-.5 1-1.3 1-.8 0-1.6-.3-2.1-.7l-.8 1.4z" />
              </svg>
              <span>JavaScript</span>
            </div>

            {/* MySQL */}
            <div className="tech-pill">
              <svg viewBox="0 0 24 24" className="tech-logo" aria-hidden="true">
                <path fill="#00758F" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 2.8c3.9 0 7.2 1.5 7.2 3.2 0 1.7-3.3 3.2-7.2 3.2S4.8 9.7 4.8 8c0-1.7 3.3-3.2 7.2-3.2zm0 6.2c3.5 0 6.6-1.1 7.2-2.5v2.8c0 1.7-3.3 3.2-7.2 3.2s-7.2-1.5-7.2-3.2V8.5c.6 1.4 3.7 2.5 7.2 2.5zm0 5.5c3.5 0 6.6-1.1 7.2-2.5v2.8c0 1.7-3.3 3.2-7.2 3.2s-7.2-1.5-7.2-3.2v-2.8c.6 1.4 3.7 2.5 7.2 2.5z" />
                <path fill="#F29111" d="M15.5 13.8c-1.1.8-2.3 1.2-3.5 1.2s-2.4-.4-3.5-1.2c1.1-.6 2.3-.9 3.5-.9s2.4.3 3.5.9z" />
              </svg>
              <span>MySQL</span>
            </div>
          </div>
        </div>

        {/* FRAMEWORKS & LIBRARIES */}
        <div className="tech-group">
          <h5 className="tech-group-label">Frameworks &amp; Libraries</h5>
          <div className="tech-pills">
            {/* React.js */}
            <div className="tech-pill">
              <svg viewBox="0 0 24 24" className="tech-logo" aria-hidden="true">
                <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#00D8FF" strokeWidth="1.5" fill="none" />
                <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#00D8FF" strokeWidth="1.5" fill="none" transform="rotate(60 12 12)" />
                <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#00D8FF" strokeWidth="1.5" fill="none" transform="rotate(120 12 12)" />
                <circle cx="12" cy="12" r="1.8" fill="#00D8FF" />
              </svg>
              <span>React.js</span>
            </div>
          </div>
        </div>

        {/* TOOLS & ECOSYSTEM */}
        <div className="tech-group">
          <h5 className="tech-group-label">Tools &amp; Ecosystem</h5>
          <div className="tech-pills">
            {/* Vite */}
            <div className="tech-pill">
              <svg viewBox="0 0 24 24" className="tech-logo" aria-hidden="true">
                <path fill="url(#viteGradTech1)" d="M22.5 3.6L12.7 21.4c-.3.5-.9.5-1.2 0L2.1 4.4c-.4-.7.1-1.5.9-1.4l9.7 1.7 8.9-2c.7-.2 1.3.5.9.9z" />
                <path fill="url(#viteGradTech2)" d="M16.8 2.2L9.4 13.8h4.2l-3.3 7.8 7.9-12.2h-4.3l2.9-7.2z" />
                <defs>
                  <linearGradient id="viteGradTech1" x1="2" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#41D1FF" />
                    <stop offset="1" stopColor="#BD34FE" />
                  </linearGradient>
                  <linearGradient id="viteGradTech2" x1="9" y1="2" x2="17" y2="21" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFEA83" />
                    <stop offset=".5" stopColor="#FFDD35" />
                    <stop offset="1" stopColor="#FFA800" />
                  </linearGradient>
                </defs>
              </svg>
              <span>Vite</span>
            </div>

            {/* Git */}
            <div className="tech-pill">
              <svg viewBox="0 0 24 24" className="tech-logo" aria-hidden="true">
                <path fill="#F05032" d="M22.7 10.9L13.1 1.3a1.9 1.9 0 00-2.7 0L8.5 3.2l3.4 3.4a2.2 2.2 0 012.8 2.8l3.3 3.3a2.3 2.3 0 11-1.3 1.3l-3.1-3.1v5.1a2.3 2.3 0 11-1.9 0V9.8a2.3 2.3 0 01-1.2-3L7.2 4.5 1.3 10.4a1.9 1.9 0 000 2.7l9.6 9.6a1.9 1.9 0 002.7 0l9.1-9.1a1.9 1.9 0 000-2.7z" />
              </svg>
              <span>Git</span>
            </div>

            {/* GitHub */}
            <div className="tech-pill">
              <svg viewBox="0 0 24 24" className="tech-logo" aria-hidden="true">
                <path className="github-icon-path" d="M12 0C5.4 0 0 5.4 0 12c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6C20.6 21.8 24 17.3 24 12c0-6.6-5.4-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </div>

            {/* Figma */}
            <div className="tech-pill">
              <svg viewBox="0 0 24 24" className="tech-logo" aria-hidden="true">
                <path fill="#F24E1E" d="M8 2h4v7H8a3.5 3.5 0 010-7z" />
                <path fill="#FF7262" d="M12 2h4a3.5 3.5 0 010 7h-4V2z" />
                <path fill="#A259FF" d="M8 9h4v7H8a3.5 3.5 0 010-7z" />
                <path fill="#1ABCFE" d="M12 9h4a3.5 3.5 0 010 7h-4V9z" />
                <path fill="#0ACF83" d="M8 16h4v3.5a3.5 3.5 0 11-4-3.5z" />
              </svg>
              <span>Figma</span>
            </div>
          </div>
        </div>
      </div>
    </BorderGlow>
  );
}
