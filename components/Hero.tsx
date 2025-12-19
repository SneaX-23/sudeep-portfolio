import React from 'react';
import { Mail, FileText, Github, Linkedin, Twitter } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="py-20 md:py-32 max-w-4xl mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center gap-10">
        <div className="relative shrink-0">
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-800 shadow-xl">
            <img 
              src="/penguin_gintama.jpg" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-[#111111]"></div>
        </div>

        <div className="text-center md:text-left space-y-5">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Hi, I'm <span className="text-blue-600 dark:text-blue-400">Sudeep</span>.
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-medium">
            Backend Engineer specializing in Node.js, TypeScript, and event-driven systems
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg">
            I build scalable, reliable, and high-performance backend systems. 
            Focused on designing clean, maintainable code and robust APIs using Node.js, TypeScript, and modern backend architectures.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
            <a href="#contact" className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 transition-opacity">
              <Mail className="w-4 h-4" />
              Get in touch
            </a>
            <a href="/resume.pdf" download="Sudeep_Magadum_Resume.pdf" className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
              <FileText className="w-4 h-4" />
              Resume
            </a>
          </div>

          <div className="flex gap-4 justify-center md:justify-start text-gray-500 dark:text-gray-400 pt-4">
            <a href="https://github.com/SneaX-23" className="hover:text-gray-900 dark:hover:text-white transition-colors"><Github className="w-6 h-6"/></a>
            <a href="https://www.linkedin.com/in/sudeep-magadum-a20b48364" className="hover:text-gray-900 dark:hover:text-white transition-colors"><Linkedin className="w-6 h-6"/></a>
            {/* <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors"><Twitter className="w-6 h-6"/></a> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;