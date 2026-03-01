import React from 'react';
import { Link } from 'react-router-dom';
import { blogsData } from '../data/blogs';
import { BlogLayout, Breadcrumb } from '../components/BlogTemplate';

const BlogsList: React.FC = () => {
  return (
    <BlogLayout>
      <Breadcrumb paths={['Blogs']} />
      
      <section className="font-mono mt-8">
        <h2 className="text-[#d4d4d4] font-bold mb-6 tracking-wide uppercase">
          My Blogs:
        </h2>
        
        <div className="space-y-3">
          {blogsData.map((blog) => (
            <div key={blog.id} className="leading-relaxed text-[15px]">
              <span className="text-[#d4d4d4] mr-2">-</span>
              <Link 
                to={`/blogs/${blog.id}`}
                className="text-[#569cd6] underline underline-offset-2 hover:text-[#d4d4d4] transition-colors"
              >
                {blog.title}
              </Link>
              <span className="text-[#858585] ml-2">
                {blog.date}
              </span>
            </div>
          ))}
        </div>
      </section>
    </BlogLayout>
  );
};

export default BlogsList;
