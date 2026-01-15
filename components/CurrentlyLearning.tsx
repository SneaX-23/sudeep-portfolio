import React from "react";
import { BookOpen, Cloud, Server } from "lucide-react";

const learning = [
  { name: "Kubernetes", icon: <BookOpen className="w-4 h-4" /> },
  { name: "AWS", icon: <Cloud className="w-4 h-4" /> },
];

const CurrentlyLearning: React.FC = () => {
  return (
    <section className="py-10 max-w-4xl mx-auto px-6">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="w-8 h-1 bg-yellow-500 rounded-full"></span>
        Currently Learning
      </h3>

      <div className="flex flex-wrap gap-4">
        {learning.map(item => (
          <div
            key={item.name}
            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#1e1e1e] text-sm text-gray-700 dark:text-gray-300"
          >
            <span className="text-gray-500 dark:text-gray-400">
              {item.icon}
            </span>
            {item.name}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CurrentlyLearning;
