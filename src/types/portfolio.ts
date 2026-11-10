/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProfileData {
  name: string;
  developerIdentity: string;
  githubUsername: string;
  githubUrl: string;
  brand: string;
  ecosystem: string;
  ecosystemTagline: string;
  headline: string;
  subheadline: string;
  bio: string;
  location: string;
  philosophy: string;
  quoteEnglish: string;
  quoteBengali: string;
  quoteContext: string;
  heroImageId: string;
  avatarImageId: string;
  socials: {
    github: string;
    email: string;
    facebook?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface ProfileImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  title: string;
  description: string;
  altText: string;
  category: 'portrait' | 'lifestyle' | 'studio' | 'quote' | 'project';
  isHero: boolean;
  isAvatar: boolean;
  isVisible: boolean;
  dateAdded: string;
  dimensions?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  repoName: string;
  description: string;
  category: 'wafa' | 'android' | 'web' | 'tools' | 'other';
  language: string;
  stars: number;
  forks: number;
  updatedAt: string;
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
  isFork?: boolean;
  archived?: boolean;
  tags: string[];
  readmeContent?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  iconName: string;
  level: string; // e.g. "Core Expertise", "Production Ready", "Active Focus"
  technologies: string[];
  description: string;
  relatedProjects: string[];
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  category: 'education' | 'milestone' | 'project' | 'learning';
  organization: string;
  description: string;
  keyTakeaways: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  deliverables: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  readTime: string;
  summary: string;
  content: string;
  tags: string[];
  published: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export type SceneQuality = 'high' | 'medium' | 'low' | '2d';
export type CameraPreset = 'workstation' | 'code' | 'globe' | 'portrait' | 'overview';
