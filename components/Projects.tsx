import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Project } from '../types';

const projects: Project[] = [
  {
    id: 1,
    title: "GradNet",
    description: "GradNet is a full-stack web application designed to bring together current students, faculty, and alumni of AITM.",
    tags: ["React", "JS", "PostgreSQL", "Socketio"],
    imageUrl: "/gradnet_ph.jpg",
    link: "https://github.com/SneaX-23/GradNet"
  },
  {
    id: 2,
    title: "Microservices backend (E-Commerce)",
    description: "A robust, event-driven E-Commerce Backend built on a Microservices Architecture.",
    tags: ["TS", "Ngnix", "Kafka", "Docker", "Redis", "JWT"],
    imageUrl: "/microservices_ph.jpg",
    link: "https://github.com/SneaX-23/Microservices-project"
  },
  {
    id: 3,
    title: "Task Queue System",
    description: "A Dockerized Node.js email task queue using BullMQ and Redis with built-in rate limiting.",
    tags: ["TS", "BullMQ", "Nodejs", "Docker", "Redis"],
    imageUrl: "/task_queue.png",
    link: "https://github.com/SneaX-23/Task_queue_system"
  },
  {
    id: 4,
    title: "WebCrawTS",
    description: "A concurrent web crawler built with TypeScript and Node.js that extracts page metadata and exports results to a CSV report.",
    tags: ["TS", "jsdom", "Nodejs", "p-limit", "Vitest"],
    imageUrl: "/web_crawler.png",
    link: "https://github.com/SneaX-23/WebCrawlTS"
  },
];

const Projects: React.FC = () => {
  return (
    <section className="py-16 max-w-4xl mx-auto px-6">
      <h3 className="text-2xl font-bold mb-10 flex items-center gap-2">
        <span className="w-8 h-1 bg-green-500 rounded-full"></span>
        Projects
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="group bg-white dark:bg-[#1e1e1e] rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-lg"
          >
            <div className="aspect-video w-full overflow-hidden relative">
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                <a href={project.link} className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-200 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href={project.link} className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-200 transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="p-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {project.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 h-20 overflow-hidden text-ellipsis">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs font-medium px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;