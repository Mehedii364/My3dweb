/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ProfileData,
  ProfileImage,
  ProjectItem,
  SkillItem,
  TimelineItem,
  BlogPost,
  ContactMessage,
} from '../types/portfolio';
import {
  INITIAL_PROFILE,
  INITIAL_IMAGES,
  INITIAL_PROJECTS,
  INITIAL_SKILLS,
  INITIAL_TIMELINE,
  INITIAL_BLOG,
} from '../data/initialData';

const STORAGE_PREFIX = 'mehedi3d_';

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.warn('Storage save failed:', err);
  }
}

export const StorageService = {
  getProfile(): ProfileData {
    return getStored<ProfileData>('profile', INITIAL_PROFILE);
  },
  saveProfile(profile: ProfileData): void {
    setStored('profile', profile);
  },

  getImages(): ProfileImage[] {
    return getStored<ProfileImage[]>('images', INITIAL_IMAGES);
  },
  saveImages(images: ProfileImage[]): void {
    setStored('images', images);
  },
  addImage(image: Omit<ProfileImage, 'id' | 'dateAdded'>): ProfileImage {
    const images = this.getImages();
    const newImage: ProfileImage = {
      ...image,
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    if (newImage.isHero) {
      images.forEach((img) => (img.isHero = false));
    }
    if (newImage.isAvatar) {
      images.forEach((img) => (img.isAvatar = false));
    }
    const updated = [newImage, ...images];
    this.saveImages(updated);
    return newImage;
  },
  setHeroImage(id: string): void {
    const images = this.getImages();
    images.forEach((img) => {
      img.isHero = img.id === id;
    });
    this.saveImages(images);

    const profile = this.getProfile();
    profile.heroImageId = id;
    this.saveProfile(profile);
  },
  setAvatarImage(id: string): void {
    const images = this.getImages();
    images.forEach((img) => {
      img.isAvatar = img.id === id;
    });
    this.saveImages(images);

    const profile = this.getProfile();
    profile.avatarImageId = id;
    this.saveProfile(profile);
  },
  deleteImage(id: string): void {
    const images = this.getImages().filter((img) => img.id !== id);
    this.saveImages(images);
  },
  toggleImageVisibility(id: string): void {
    const images = this.getImages().map((img) =>
      img.id === id ? { ...img, isVisible: !img.isVisible } : img
    );
    this.saveImages(images);
  },

  getProjects(): ProjectItem[] {
    return getStored<ProjectItem[]>('projects', INITIAL_PROJECTS);
  },
  saveProjects(projects: ProjectItem[]): void {
    setStored('projects', projects);
  },
  toggleProjectFeatured(id: string): void {
    const projects = this.getProjects().map((p) =>
      p.id === id ? { ...p, featured: !p.featured } : p
    );
    this.saveProjects(projects);
  },

  getSkills(): SkillItem[] {
    return getStored<SkillItem[]>('skills', INITIAL_SKILLS);
  },
  saveSkills(skills: SkillItem[]): void {
    setStored('skills', skills);
  },

  getTimeline(): TimelineItem[] {
    return getStored<TimelineItem[]>('timeline', INITIAL_TIMELINE);
  },
  saveTimeline(timeline: TimelineItem[]): void {
    setStored('timeline', timeline);
  },

  getBlog(): BlogPost[] {
    return getStored<BlogPost[]>('blog', INITIAL_BLOG);
  },
  saveBlog(blog: BlogPost[]): void {
    setStored('blog', blog);
  },

  getMessages(): ContactMessage[] {
    return getStored<ContactMessage[]>('messages', []);
  },
  saveMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>): ContactMessage {
    const messages = this.getMessages();
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setStored('messages', [newMsg, ...messages]);
    return newMsg;
  },
  markMessageRead(id: string): void {
    const messages = this.getMessages().map((m) =>
      m.id === id ? { ...m, isRead: true } : m
    );
    setStored('messages', messages);
  },
  deleteMessage(id: string): void {
    const messages = this.getMessages().filter((m) => m.id !== id);
    setStored('messages', messages);
  },

  // Owner Authentication Session (Client + PHP Proxy Simulation)
  isAdminAuthenticated(): boolean {
    return sessionStorage.getItem(STORAGE_PREFIX + 'admin_session') === 'active';
  },
  setAdminAuthenticated(status: boolean): void {
    if (status) {
      sessionStorage.setItem(STORAGE_PREFIX + 'admin_session', 'active');
    } else {
      sessionStorage.removeItem(STORAGE_PREFIX + 'admin_session');
    }
  },
};
