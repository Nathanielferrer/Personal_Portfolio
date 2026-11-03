import { useEffect, useState } from 'react';
import './App.css';
import LoadingScreen from './components/loader/LoadingScreen';
import ShapeGrid from './components/reactbits/ShapeGrid';
import Navbar from './components/navbar/Navbar';
import Hero from './components/hero/Hero';
import CurvedLoop from './components/reactbits/CurvedLoop';
import About from './components/about/About';
import Skills from './components/skills/Skills';
import Projects from './components/projects/Projects';
import Contact from './components/contact/Contact';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { darkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  // Always start at the top (Hero / Home page) on first visit or refresh
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  return (
    <div className={`app-layout${darkMode ? ' dark' : ''}`}>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} duration={3800} />}

      {/* Background ShapeGrid */}
      <div className="shapegrid-background">
        <ShapeGrid
          shape="dot"
          direction="diagonal"
          lineColor={darkMode ? 'rgba(56, 189, 248, 0.35)' : '#579fe6'}
          hoverColor={darkMode ? '#38bdf8' : '#000000'}
          hoverFillColor={darkMode ? '#38bdf8' : '#000000'}
          fillOpacity={darkMode ? 0.3 : 0.2}
          cellSize={40}
          dpr={1}
          glow={0}
          twinkle={0}
          speed={0.1}
          tiltX={0}
          tiltY={0}
          rainbow={false}
          radius={2.5}
          trail={0.8}
        />
      </div>

      {/* Structured Components */}
      <main className="app-content">
        <Navbar />
        <Hero />
        <div className="curved-loop-divider">
          <CurvedLoop
            marqueeText="CLEAN DESIGN ✦ MODERN STRUCTURE ✦ USER EXPERIENCE ✦ DEVELOPMENT"
            shape="arc"
            speed={1.6}
            curveAmount={48}
            direction="left"
            fontSize={32}
            fontWeight={800}
            letterSpacing={3}
            separator="✦"
            outline={false}
            scrollBoost={0}
            edgeFade={0}
            interactive={true}
            pauseOnHover={false}
          />
        </div>
        <About />
        <div className="section-divider" aria-hidden="true" />
        <Skills />
        <div className="section-divider" aria-hidden="true" />
        <Projects />
        <div className="section-divider" aria-hidden="true" />
        <Contact />
      </main>
    </div>
  );
}
