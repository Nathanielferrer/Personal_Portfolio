import { useState, useEffect } from 'react';
import LatticeLoader from '../reactbits/LatticeLoader';
import logoImg from '../../assets/Images/Logo.png';
import bgWhiteGirlVideo from '../../assets/Images/BG_WHITE_GIRL.mp4';
import bgBlackGirlVideo from '../../assets/Images/BG_BLACK_Girl.mp4';
import { useTheme } from '../../context/ThemeContext';
import './LoadingScreen.css';

export default function LoadingScreen({ onComplete, duration = 3800 }) {
  const { darkMode } = useTheme();
  const [loaderStatus, setLoaderStatus] = useState('working');
  const [videoVisible, setVideoVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  // Dynamic video source: white curtain for light mode, black curtain for dark mode
  const activeVideo = darkMode ? bgBlackGirlVideo : bgWhiteGirlVideo;

  useEffect(() => {
    // 1. Reveal the character video before vanishing (~45% of duration)
    const videoTimer = setTimeout(() => {
      setVideoVisible(true);
    }, Math.max(1200, duration * 0.45));

    // 2. Mark the loader as "done" (~82% of duration)
    const doneTimer = setTimeout(() => {
      setLoaderStatus('done');
    }, Math.max(2400, duration * 0.82));

    // 3. Begin smooth fade-out of the loading screen
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, duration);

    // 4. Fully unmount after fade-out transition finishes
    const unmountTimer = setTimeout(() => {
      setIsMounted(false);
      onComplete?.();
    }, duration + 600);

    return () => {
      clearTimeout(videoTimer);
      clearTimeout(doneTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(unmountTimer);
    };
  }, [duration, onComplete]);

  if (!isMounted) return null;

  return (
    <div
      className={`loading-screen${darkMode ? ' dark' : ''}${
        isFadingOut ? ' loading-screen--fade-out' : ''
      }`}
      aria-label="Loading portfolio"
    >
      {/* Background Video: Natural colors preserved, dynamic by theme */}
      <div className="loading-screen__video-wrapper">
        <video
          key={darkMode ? 'dark-video' : 'light-video'}
          className={`loading-screen__video${videoVisible ? ' loading-screen__video--visible' : ''}`}
          src={activeVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="loading-screen__overlay" />
      </div>

      {/* Centered Content: Logo at center with animation underneath */}
      <div className="loading-screen__content">
        <img
          src={logoImg}
          alt="Nathaniel Ferrer Logo"
          className="loading-screen__logo"
        />
        <div className="loading-screen__badge">
          <LatticeLoader
            status={loaderStatus}
            label="Crafting the experience..."
            doneLabel="Done in"
            errorLabel="Failed after"
            pattern="orbit"
            grid={3}
            shape="round"
            doneColor={darkMode ? '#4ade80' : '#16a34a'}
            errorColor="#ef4444"
            cellSize={6}
            gap={2.5}
            fontSize={14}
            step={90}
            idleOpacity={darkMode ? 0.28 : 0.18}
            glow={darkMode}
            glowColor={darkMode ? '#38bdf8' : ''}
            showTimer
            color={darkMode ? '#f8fafc' : '#0f172a'}
          />
        </div>
      </div>
    </div>
  );
}
