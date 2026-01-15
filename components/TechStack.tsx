import React from 'react';
import { Code, Code2, Database, Layout, Server, Settings, Terminal } from 'lucide-react';

const skills = [
  { name: 'TypeScript', icon: <Code2 className="w-4 h-4" /> },
  { name: 'JavaScript', icon: <Code className="w-4 h-4" /> },
  { name: 'Kafka', icon: <Server className="w-4 h-4" /> },
  { name: 'Node.js', icon: <Terminal className="w-4 h-4" /> },
  { name: 'PostgreSQL', icon: <Database className="w-4 h-4" /> },
  { name: 'Docker', icon: <Settings className="w-4 h-4" /> },
  { name: 'REST API', icon: <Code2 className="w-4 h-4" /> },
  { name: 'CI/CD', icon: <Layout className="w-4 h-4" /> },
  { name: 'Git', icon: <Terminal className="w-4 h-4" /> },
  { name: 'Prisma', icon: <Database className="w-4 h-4" /> },
  { name: 'Redis', icon: <Database className="w-4 h-4" /> },
  { name: 'JWT', icon: <Settings className="w-4 h-4" /> },
  { name: "Go", icon: <Server className="w-4 h-4" /> },
];

const TechStack: React.FC = () => {
  return (
    <section className="py-10 max-w-4xl mx-auto px-6">
      <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <span className="w-8 h-1 bg-blue-500 rounded-full"></span>
        Skills
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {skills.map((skill) => (
          <div 
            key={skill.name}
            className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-[#1e1e1e] border border-transparent hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-default select-none group"
          >
            <span className="text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors">
              {skill.icon}
            </span>
            <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechStack;
