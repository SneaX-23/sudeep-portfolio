export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link: string;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}