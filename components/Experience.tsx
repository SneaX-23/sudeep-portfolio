import React from 'react';
import { Experience as ExperienceType } from '../types';

const experiences: ExperienceType[] = [
  {
    id: 1,
    company: "",
    role: "",
    period: "",
    location: "",
    description: [
      "",
      "",
      ""
    ]
  },
];

const Experience: React.FC = () => {
  return (
    <section className="py-16 max-w-4xl mx-auto px-6">
      <h3 className="text-2xl font-bold mb-10 flex items-center gap-2">
        <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
        Experience
      </h3>

      <div className="space-y-12">
        {experiences.map((exp) => (
          <div key={exp.id} className="relative pl-8 md:pl-0">
            {/* Timeline Line for mobile */}
            <div className="md:hidden absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800"></div>
            <div className="md:hidden absolute left-[-4px] top-2 w-2.5 h-2.5 rounded-full bg-blue-500"></div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">{exp.company}</h4>
                <div className="text-blue-600 dark:text-blue-400 font-medium mb-1">{exp.role}</div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-mono whitespace-nowrap bg-gray-100 dark:bg-[#1e1e1e] px-2 py-1 rounded inline-block w-fit">
                {exp.period}
              </div>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">{exp.location}</p>
            
            <ul className="list-disc list-outside ml-4 space-y-2 text-gray-600 dark:text-gray-300">
              {exp.description.map((item, idx) => (
                <li key={idx} className="leading-relaxed text-sm md:text-base">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;