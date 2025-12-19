import React, { useEffect, useState } from 'react';
import Hero from './components/Hero';
import TechStack from './components/TechStack';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';
import { Theme } from './types';
import CurrentlyLearning from './components/CurrentlyLearning';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme as Theme;
      }
      if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        return Theme.LIGHT;
      }
    }
    return Theme.DARK;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === Theme.DARK) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === Theme.DARK ? Theme.LIGHT : Theme.DARK);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-500/30">
      <header className="fixed top-0 w-full backdrop-blur-md bg-white/70 dark:bg-[#111111]/70 border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
            Sudeep<span className="text-blue-500">.</span>
          </div>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </header>

      <main className="flex-grow pt-16">
        <Hero />
        <TechStack />
        <CurrentlyLearning />
        {/* <Experience /> */}
        <Projects />
      </main>

      <Footer />
    </div>
  );
};

export default App;