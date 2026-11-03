import { useEffect, useState } from 'react';
import './About.css';
import Lanyard from '../reactbits/Lanyard';
import { createIdCardFront, createIdCardBack, createLanyardStrap } from '../../utils/cardTextures';
import BounceCards from '../reactbits/BounceCards';
import AnimatedContent from '../reactbits/AnimatedContent';
import resumePdf from '../../assets/resume.pdf';

const TRAITS = [
  'Problem-solver',
  'Adaptable',
  'Exploring',
  'Collaboration',
  'Organized'
];

export default function About() {
  const [textures, setTextures] = useState({
    front: null,
    back: null,
    strap: null
  });

  useEffect(() => {
    let isMounted = true;

    async function loadTextures() {
      try {
        const [front, back, strap] = await Promise.all([
          createIdCardFront(),
          createIdCardBack(),
          createLanyardStrap()
        ]);

        if (isMounted) {
          setTextures({ front, back, strap });
        }
      } catch (err) {
        console.error('Error loading ID card textures:', err);
      }
    }

    loadTextures();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="about-section" id="about">
      <AnimatedContent distance={40} direction="vertical" duration={0.8} ease="power3.out" threshold={0.15}>
        <div className="about-header">
          <span className="about-eyebrow">ABOUT ME</span>
          <h2 className="about-title">Web Developer</h2>
        </div>
      </AnimatedContent>

      <div className="about-content">
        <div className="about-left">
          <div className="about-lanyard-container">
            <Lanyard
              frontImage={textures.front}
              backImage={textures.back}
              strapImage={textures.strap}
              imageFit="cover"
              cardColor="#ffffff"
              orientation="portrait"
              finish="glossy"
              cornerRadius={0.3}
              size={0.6}
              anchor="center"
              strapLength={0.45}
              strapColor="#991b1b"
              strapWidth={0.65}
              metal="silver"
              gravity={1}
              damping={0.5}
              elasticity={0.5}
              breeze={0.5}
              interactive
              intro
            />
          </div>
        </div>

        <AnimatedContent
          distance={50}
          direction="vertical"
          duration={0.8}
          delay={0.1}
          ease="power3.out"
          threshold={0.15}
          className="about-right"
        >
          <div className="about-profile-header">
            <div className="about-name-row">
              <h3 className="about-profile-name">NATHANIEL D. FERRER</h3>
              <svg
                className="about-verified-badge"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                aria-label="Verified"
              >
                <circle cx="12" cy="12" r="10" fill="#38bdf8" />
                <path
                  d="M8.5 12.2l2.3 2.3 4.7-4.7"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="about-stats-row">
              <div className="about-stat-item">
                <span className="about-stat-label">REPOSITORIES</span>
                <span className="about-stat-value">20+</span>
              </div>
              <div className="about-stat-item">
                <span className="about-stat-label">CERTIFICATES</span>
                <span className="about-stat-value">2</span>
              </div>
              <div className="about-stat-item">
                <span className="about-stat-label">EXPECTED GRADUATION</span>
                <span className="about-stat-value">2027</span>
              </div>
            </div>
          </div>

          <p className="about-paragraph">
            I am a fourth-year Bachelor of Science in Information Technology (BSIT) student at Global Reciprocal Colleges with a strong focus on React and modern web development. I enjoy bringing ideas to life by creating responsive, high-performance web applications that merge intuitive UI design with robust backend logic.
          </p>
          <p className="about-paragraph">
            I am always eager to master new technologies, explore creative ideas, and continuously refine my engineering craft. Currently, I am seeking an internship opportunity where I can contribute to real-world projects, collaborate with a high-impact engineering team, and continue growing as a professional React developer.
          </p>

          <p className="about-resume-line">
            Want to know more about my experience?{' '}
            <a
              href={resumePdf}
              download="Nathaniel_Ferrer_Resume.pdf"
              className="about-resume-link"
              target="_blank"
              rel="noopener noreferrer"
              title="Download Resume (PDF)"
            >
              Download my resume.
            </a>
          </p>

          <div className="about-bottom-row">
            <div className="about-currently-section">
              <span className="about-currently-label">CURRENTLY</span>
              <div className="about-currently-items">
                {/* 1. Building - Web Development */}
                <div className="about-currently-item">
                  <div className="about-currently-icon">
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  </div>
                  <div className="about-currently-text">
                    <span className="about-currently-title">Building</span>
                    <span className="about-currently-desc">Web Development</span>
                  </div>
                </div>

                {/* 2. Learning - Frontend Development */}
                <div className="about-currently-item">
                  <div className="about-currently-icon">
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="about-currently-text">
                    <span className="about-currently-title">Learning</span>
                    <span className="about-currently-desc">Frontend Development</span>
                  </div>
                </div>

                {/* 3. Exploring - UI Design & Organization */}
                <div className="about-currently-item">
                  <div className="about-currently-icon">
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                  </div>
                  <div className="about-currently-text">
                    <span className="about-currently-title">Exploring</span>
                    <span className="about-currently-desc">UI Design & Organization</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-bounce-section">
              <BounceCards
                traits={TRAITS}
                containerWidth={380}
                containerHeight={230}
                cardSize={175}
                aspectRatio="1.35 / 1"
                spread={65}
                rotation={9}
                arc={0}
                pushDistance={135}
                hoverScale={1.06}
                bounciness={0.6}
                animationDelay={0.4}
                animationStagger={0.06}
                borderWidth={1}
                radius={20}
                shadow
                enableHover
              />
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
