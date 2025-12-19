import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="py-12 mt-12 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f0f0f]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Let's Work Together</h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-8">
          Currently open for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </p>
        <a 
          href="mailto:sneax23rd@gmail.com"
          aria-label="Send an email" 
          className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/25"
        >
          Say Hello
        </a>
        <div className="mt-12 text-sm text-gray-500 dark:text-gray-600">
          © {new Date().getFullYear()} Sudeep Magadum. Built with React & Tailwind.
        </div>
      </div>
    </footer>
  );
};

export default Footer;