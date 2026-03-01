import React, { useState } from 'react';
import { Home, ChevronRight, Moon, ChevronDown, X } from 'lucide-react';
// --- LAYOUT COMPONENTS ---

export function BlogLayout({ 
  children, 
  authorName = "Sudeep Magadum",
  navLinks = [
    { label: "Blogs", href: "/blogs" },
    { label: "Github", href: "https://github.com/SneaX-23" },
    { label: "About", href: "https://portfolio.sneax.quest" }
  ]
}: { 
  children: React.ReactNode;
  authorName?: string;
  navLinks?: { label: string; href: string }[];
}) {
  return (
    <div className="min-h-screen bg-[#161616] text-[#d4d4d4] font-mono selection:bg-[#264f78] selection:text-white pb-24">
      <header className="max-w-5xl mx-auto px-6 py-8 flex justify-between items-center font-sans">
        <div className="text-white font-bold text-xl tracking-tight">
          {authorName}
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-300">
          {navLinks.map((link, i) => (
            <a key={i} href={link.href} className="hover:text-white transition-colors">
              {link.label}
            </a>
          ))}
        </nav>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  );
}

export function Breadcrumb({ paths }: { paths: string[] }) {
  return (
    <div className="flex items-center space-x-3 text-sm text-[#858585] mb-12 flex-wrap">
      <a href="https://portfolio.sneax.quest" className="hover:text-[#d4d4d4] transition-colors"><Home size={16} /></a>
      {paths.map((path, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={14} />
          {index === paths.length - 1 ? (
            <span className="text-[#569cd6]">{path}</span>
          ) : (
            <a href="#" className="hover:text-[#d4d4d4] transition-colors">{path}</a>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export function ArticleHeader({ 
  title, 
  date, 
  views, 
  center = false 
}: { 
  title: string; 
  date?: string; 
  views?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-10 ${center ? 'text-center' : ''}`}>
      <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">{title}</h1>
      {(date || views) && (
        <div className="text-[#858585] text-sm">
          {date && <span>Date: {date}</span>}
          {views && <span>{views}</span>}
        </div>
      )}
    </div>
  );
}

// --- TYPOGRAPHY & CONTENT COMPONENTS ---

export function P({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`mb-6 leading-relaxed text-[15px] ${className}`}>
      {children}
    </p>
  );
}

export function H2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`text-3xl font-bold text-white mt-14 mb-6 underline decoration-2 underline-offset-8 ${className}`}>
      {children}
    </h2>
  );
}

export function H3({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`text-2xl font-bold text-white mt-10 mb-4 ${className}`}>
      {children}
    </h3>
  );
}

export function Strong({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`font-bold text-white ${className}`}>{children}</span>;
}

export function ItalicStrong({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`italic font-bold text-white ${className}`}>{children}</span>;
}

export function Divider() {
  return <div className="border-t border-[#333] pt-8 mb-6 mt-12"></div>;
}

export function Img({
  src,
  alt,
  caption,
  className = "",
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <figure className={`my-10 ${className}`}>
        <img
          src={src}
          alt={alt}
          onClick={() => setIsOpen(true)}
          className="w-full rounded-lg border border-[#333] bg-[#1e1e1e] cursor-zoom-in transition-opacity hover:opacity-90"
        />
        {caption && (
          <figcaption className="text-center text-sm text-[#858585] mt-3">
            {caption}
          </figcaption>
        )}
      </figure>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000e6] backdrop-blur-sm p-4 cursor-zoom-out"
          onClick={() => setIsOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 text-[#858585] hover:text-white transition-colors"
            aria-label="Close fullscreen image"
          >
            <X size={32} />
          </button>
          
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl"
          />
        </div>
      )}
    </>
  );
}

// --- CODE COMPONENTS ---

export function InlineCode({ 
  children, 
  color = "text-[#ce9178]"
}: { 
  children: React.ReactNode;
  color?: "text-[#ce9178]" | "text-[#c586c0]" | "text-[#569cd6]" | "text-[#4ec9b0]" | "text-[#dcdcaa]";
}) {
  return (
    <code className={`bg-[#2d2d2d] ${color} px-1.5 py-0.5 rounded text-sm`}>
      {children}
    </code>
  );
}

export function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#1e1e1e] rounded-lg p-6 border border-[#333] my-6">
      <pre className="text-sm leading-relaxed whitespace-pre-wrap break-words">
        <code>{children}</code>
      </pre>
    </div>
  );
}

// Syntax highlighting helpers for CodeBlock
export const Syntax = {
  Keyword: ({ children }: { children: React.ReactNode }) => <span className="text-[#c586c0]">{children}</span>,
  Type: ({ children }: { children: React.ReactNode }) => <span className="text-[#569cd6]">{children}</span>,
  Class: ({ children }: { children: React.ReactNode }) => <span className="text-[#4ec9b0]">{children}</span>,
  Function: ({ children }: { children: React.ReactNode }) => <span className="text-[#dcdcaa]">{children}</span>,
  Number: ({ children }: { children: React.ReactNode }) => <span className="text-[#b5cea8]">{children}</span>,
  String: ({ children }: { children: React.ReactNode }) => <span className="text-[#ce9178]">{children}</span>,
  Comment: ({ children }: { children: React.ReactNode }) => <span className="text-[#6a9955]">{children}</span>,
};
