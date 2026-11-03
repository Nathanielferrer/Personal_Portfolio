import './Hero.css';
import ProfileCard from '../reactbits/ProfileCard';
import TextType from '../reactbits/TextType';
import portfolioPic from '../../assets/Images/Portfolio_Pic.png';
import paperAirplane from '../../assets/Images/Paper_Airplane.png';
import { useTheme } from '../../context/ThemeContext';

export default function Hero() {
  const { darkMode } = useTheme();

  return (
    <section className="hero-container" id="home">
      <div className="hero-left">
        <p className="hero-greeting">Hello, I'm</p>
        <div className="hero-name-container">
          <h1 className="hero-name">Nathaniel</h1>
          <div className="hero-name-row">
            <h1 className="hero-name">Ferrer</h1>
            <img
              src={paperAirplane}
              alt="Paper Airplane"
              className="hero-airplane"
            />
          </div>
        </div>
        <TextType
          as="h2"
          className="hero-title"
          text={[
            "React Developer",
            "Designing Intuitive & Clean UI",
            "Full-Stack Web Development"
          ]}
          typingSpeed={75}
          pauseDuration={1500}
          deletingSpeed={50}
          deleteMode="backspace"
          typeEffect="none"
          mistakes={0}
          cursorStyle="underscore"
          cursorGlide
          showCursor
          cursorColor="currentColor"
          prefixColor="currentColor"
          cursorBlinkDuration={0.5}
          cursorCharacter="_"
          prefix=""
        />
        <p className="hero-description">
          Passionate about turning creative ideas into meaningful digital experiences.
          I enjoy building clean, responsive, and user-friendly websites that bring design and functionality together.
        </p>
        <div className="hero-actions">
          <div className="hero-pills-row" aria-label="Core technologies">
            <span className="hero-pill">React.js</span>
            <span className="hero-pill">JavaScript</span>
            <span className="hero-pill">CSS3</span>
            <span className="hero-pill">Vite</span>
          </div>
        </div>
      </div>

      <div className="hero-right">
        <ProfileCard
          name="Nathaniel Ferrer"
          title="React Developer"
          handle="nathaniel"
          status="Available for work"
          contactText="Contact"
          avatarUrl={portfolioPic}
          miniAvatarUrl={portfolioPic}
          holo={0.8}
          glare={0.5}
          tiltStrength={12}
          parallax={8}
          radius={20}
          enableTilt
          intro
          showUserInfo
          enableMobileTilt={false}
          theme={darkMode ? 'dark' : 'light'}
          onContactClick={() => {
            const contact = document.getElementById('contact');
            if (contact) {
              contact.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      </div>
    </section>
  );
}
