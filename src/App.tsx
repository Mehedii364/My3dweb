/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  ProfileData,
  ProfileImage,
  ProjectItem,
  SkillItem,
  TimelineItem,
  ServiceItem,
  BlogPost,
  SceneQuality,
  CameraPreset,
} from './types/portfolio';
import { StorageService } from './services/storageService';
import {
  fetchGitHubUser,
  fetchGitHubRepos,
  GitHubUserProfile,
  GitHubSyncStatus,
} from './services/githubService';
import { INITIAL_SERVICES } from './data/initialData';

// Components & 3D Scene
import { Navbar } from './components/Navbar';
import { Workstation3DScene } from './scenes/Workstation3DScene';
import { BottomControlDock } from './components/BottomControlDock';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { PersonalPhotoGallery } from './components/PersonalPhotoGallery';
import { SkillsUniverse } from './components/SkillsUniverse';
import { ProjectUniverse } from './components/ProjectUniverse';
import { GitHubCommandCenter } from './components/GitHubCommandCenter';
import { TimelineSection } from './components/TimelineSection';
import { ServicesSection } from './components/ServicesSection';
import { BlogSection } from './components/BlogSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

// Modals
import { CvModal } from './components/CvModal';
import { ImageZoomModal } from './components/ImageZoomModal';
import { ReadmeModal } from './components/ReadmeModal';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  // Core Portfolio State
  const [profile, setProfile] = useState<ProfileData>(() => StorageService.getProfile());
  const [images, setImages] = useState<ProfileImage[]>(() => StorageService.getImages());
  const [projects, setProjects] = useState<ProjectItem[]>(() => StorageService.getProjects());
  const [skills] = useState<SkillItem[]>(() => StorageService.getSkills());
  const [timeline] = useState<TimelineItem[]>(() => StorageService.getTimeline());
  const [services] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [blogPosts] = useState<BlogPost[]>(() => StorageService.getBlog());

  // 3D Scene & Graphics State
  const [quality, setQuality] = useState<SceneQuality>('high');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('workstation');

  // Navigation & Modals State
  const [activeSection, setActiveSection] = useState('hero');
  const [isCvOpen, setIsCvOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedZoomImage, setSelectedZoomImage] = useState<ProfileImage | null>(null);
  const [selectedReadmeProject, setSelectedReadmeProject] = useState<ProjectItem | null>(null);

  // GitHub Telemetry State
  const [ghUser, setGhUser] = useState<GitHubUserProfile | null>(null);
  const [ghStatus, setGhStatus] = useState<GitHubSyncStatus>({
    lastSynced: null,
    rateLimitRemaining: null,
    rateLimitTotal: 60,
    rateLimitReset: null,
    source: 'fallback',
  });
  const [isGhSyncing, setIsGhSyncing] = useState(false);

  // Active Hero & Avatar Images
  const heroImage = images.find((i) => i.isHero) || images[0];

  // Fetch GitHub data on load
  const loadGitHub = useCallback(async (force = false) => {
    setIsGhSyncing(true);
    try {
      const [userResult, reposResult] = await Promise.all([
        fetchGitHubUser(force),
        fetchGitHubRepos(force),
      ]);

      if (userResult.user) setGhUser(userResult.user);
      setGhStatus(reposResult.status);

      if (reposResult.projects && reposResult.projects.length > 0) {
        setProjects(reposResult.projects);
        StorageService.saveProjects(reposResult.projects);
      }
    } catch (err) {
      console.warn('GitHub synchronization note:', err);
    } finally {
      setIsGhSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadGitHub();

    // Check WebGL availability for automatic 2D fallback
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setQuality('2d');
      }
    } catch {
      setQuality('2d');
    }

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setQuality('2d');
    }
  }, [loadGitHub]);

  // Section Observer for Navbar Active Link
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['projects', 'about', 'gallery', 'skills', 'github', 'contact'];
      const scrollY = window.scrollY;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop - 120;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Raycasting Click Router from 3D Scene
  const handle3DObjectClick = useCallback((objectId: string) => {
    if (objectId === 'monitor') {
      setCameraPreset('code');
    } else if (objectId === 'globe') {
      const el = document.getElementById('github');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (objectId === 'portrait') {
      const el = document.getElementById('about');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (objectId === 'projects-holo') {
      const el = document.getElementById('projects');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#070B18] text-[#F4F7FF] selection:bg-[#16BFFF]/30 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        quality={quality}
        onQualityChange={setQuality}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeSection={activeSection}
      />

      {/* Hero & 3D Workstation Experience */}
      <div className="relative w-full">
        {/* If 3D is active, render Three.js scene behind hero */}
        {quality !== '2d' && (
          <div className="absolute inset-0 w-full h-full pointer-events-auto">
            <Workstation3DScene
              quality={quality}
              cameraPreset={cameraPreset}
              heroImageUrl={heroImage?.url || '/assets/aistudio/1000204899_c07348c7.webp'}
              onObjectClick={handle3DObjectClick}
              onPresetChange={setCameraPreset}
            />

            {/* Gradient fog scrim to blend 3D canvas seamlessly into subsequent sections */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#070B18] via-[#070B18]/70 to-transparent pointer-events-none" />

            {/* Unobstructed Collapsible Bottom Dock (Three.js Skill compliant) */}
            <BottomControlDock
              cameraPreset={cameraPreset}
              quality={quality}
              onPresetChange={setCameraPreset}
              onQualityChange={setQuality}
            />
          </div>
        )}

        {/* Hero Section Content (Overlaid cleanly on 3D or responsive in 2D) */}
        <div className={`relative z-10 ${quality !== '2d' ? 'pointer-events-none' : ''}`}>
          <div className="pointer-events-auto">
            <HeroSection
              profile={profile}
              heroImage={heroImage}
              quality={quality}
              onOpenCv={() => setIsCvOpen(true)}
              onOpenImageZoom={setSelectedZoomImage}
              onExploreWorkstation={() => setCameraPreset('overview')}
            />
          </div>
        </div>
      </div>

      {/* All Structured Content Sections */}
      <main className="relative z-20 space-y-0">
        {/* About Me & Developer Philosophy */}
        <AboutSection
          profile={profile}
          images={images}
          onOpenImageZoom={setSelectedZoomImage}
        />

        {/* Authentic Personal Image Gallery */}
        <PersonalPhotoGallery
          images={images}
          onOpenImageZoom={setSelectedZoomImage}
          onSetHero={(id) => {
            StorageService.setHeroImage(id);
            setImages(StorageService.getImages());
            setProfile(StorageService.getProfile());
          }}
          isOwner={StorageService.isAdminAuthenticated()}
        />

        {/* 10-Category Skills Universe */}
        <SkillsUniverse skills={skills} />

        {/* Projects Universe (Wafa Zone & GitHub) */}
        <ProjectUniverse
          projects={projects}
          onOpenReadme={setSelectedReadmeProject}
        />

        {/* GitHub Command Center */}
        <GitHubCommandCenter
          user={ghUser}
          status={ghStatus}
          projects={projects}
          onRefresh={() => loadGitHub(true)}
          isLoading={isGhSyncing}
        />

        {/* Timeline & Milestones */}
        <TimelineSection timeline={timeline} />

        {/* Engineering Services */}
        <ServicesSection services={services} />

        {/* Developer Journals & Articles */}
        <BlogSection posts={blogPosts} />

        {/* Contact Form with Anti-Spam & Persistence */}
        <ContactSection />
      </main>

      {/* Global Footer */}
      <Footer
        profile={profile}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* CV Modal */}
      <CvModal
        profile={profile}
        isOpen={isCvOpen}
        onClose={() => setIsCvOpen(false)}
      />

      {/* Lightbox Image Zoom Modal */}
      <ImageZoomModal
        image={selectedZoomImage}
        onClose={() => setSelectedZoomImage(null)}
        onSetHero={(id) => {
          StorageService.setHeroImage(id);
          setImages(StorageService.getImages());
          setProfile(StorageService.getProfile());
        }}
        isOwner={StorageService.isAdminAuthenticated()}
      />

      {/* Project Readme Modal */}
      <ReadmeModal
        project={selectedReadmeProject}
        onClose={() => setSelectedReadmeProject(null)}
      />

      {/* Owner Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        profile={profile}
        onUpdateProfile={setProfile}
        images={images}
        onUpdateImages={setImages}
        projects={projects}
        onUpdateProjects={setProjects}
        onTriggerGhSync={() => loadGitHub(true)}
        isGhSyncing={isGhSyncing}
      />
    </div>
  );
}
