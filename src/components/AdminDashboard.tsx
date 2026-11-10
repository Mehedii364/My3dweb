/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ProfileData,
  ProfileImage,
  ProjectItem,
  ContactMessage,
} from '../types/portfolio';
import { StorageService } from '../services/storageService';
import {
  ShieldCheck,
  X,
  Upload,
  Image as ImageIcon,
  Check,
  Star,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  Mail,
  Server,
  FileCode,
  KeyRound,
  LogOut,
  Save,
  Download,
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  onUpdateProfile: (profile: ProfileData) => void;
  images: ProfileImage[];
  onUpdateImages: (images: ProfileImage[]) => void;
  projects: ProjectItem[];
  onUpdateProjects: (projects: ProjectItem[]) => void;
  onTriggerGhSync: () => void;
  isGhSyncing: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  images,
  onUpdateImages,
  projects,
  onUpdateProjects,
  onTriggerGhSync,
  isGhSyncing,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    StorageService.isAdminAuthenticated()
  );
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<
    'overview' | 'profile' | 'photos' | 'projects' | 'messages' | 'profreehost'
  >('overview');

  // Profile Form State
  const [profileForm, setProfileForm] = useState<ProfileData>(profile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Messages State
  const [messages, setMessages] = useState<ContactMessage[]>(() => StorageService.getMessages());

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadCategory, setUploadCategory] = useState<ProfileImage['category']>('portrait');
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');

  if (!isOpen) return null;

  // Handle Owner Sign-in
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default owner key for Md. Mehedi Hasan session access
    if (passwordInput === 'mehedi364' || passwordInput === 'wafa2026') {
      StorageService.setAdminAuthenticated(true);
      setIsAuthenticated(true);
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError('Incorrect passphrase. Access restricted to Md. Mehedi Hasan.');
    }
  };

  const handleLogout = () => {
    StorageService.setAdminAuthenticated(false);
    setIsAuthenticated(false);
  };

  // Profile Save
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveProfile(profileForm);
    onUpdateProfile(profileForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Image Upload Handler with MIME validation and 8MB restriction
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // MIME verification
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMime.includes(file.type)) {
      setUploadError('Invalid format. Only JPEG, PNG, and WebP are allowed.');
      return;
    }

    // 8MB limit
    if (file.size > 8 * 1024 * 1024) {
      setUploadError('Image exceeds the maximum 8MB file size limit.');
      return;
    }

    setUploadError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePublishPhoto = () => {
    if (!uploadPreview) {
      setUploadError('Please select an image file first.');
      return;
    }

    const newImg = StorageService.addImage({
      url: uploadPreview,
      title: uploadTitle.trim() || 'Personal Photograph',
      description: uploadDesc.trim() || 'Uploaded photograph by Md. Mehedi Hasan.',
      altText: uploadTitle.trim() || 'Md. Mehedi Hasan photograph',
      category: uploadCategory,
      isHero: false,
      isAvatar: false,
      isVisible: true,
    });

    onUpdateImages(StorageService.getImages());
    setUploadPreview(null);
    setUploadTitle('');
    setUploadDesc('');
    setUploadError('');
  };

  // Set Hero Portrait
  const handleSetHero = (id: string) => {
    StorageService.setHeroImage(id);
    onUpdateImages(StorageService.getImages());
    onUpdateProfile(StorageService.getProfile());
  };

  // Set Profile Avatar
  const handleSetAvatar = (id: string) => {
    StorageService.setAvatarImage(id);
    onUpdateImages(StorageService.getImages());
    onUpdateProfile(StorageService.getProfile());
  };

  // Toggle Image Visibility
  const handleToggleVisibility = (id: string) => {
    StorageService.toggleImageVisibility(id);
    onUpdateImages(StorageService.getImages());
  };

  // Delete Image
  const handleDeleteImage = (id: string) => {
    if (confirm('Are you sure you want to delete this photograph from your gallery?')) {
      StorageService.deleteImage(id);
      onUpdateImages(StorageService.getImages());
    }
  };

  // Toggle Project Featured
  const handleToggleProject = (id: string) => {
    StorageService.toggleProjectFeatured(id);
    onUpdateProjects(StorageService.getProjects());
  };

  // Delete Message
  const handleDeleteMessage = (id: string) => {
    StorageService.deleteMessage(id);
    setMessages(StorageService.getMessages());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-[#0B1430] border border-[#1B254B] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-left">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#070B18] border-b border-[#1B254B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#16BFFF] to-[#8B45FF] flex items-center justify-center text-[#070B18]">
              <ShieldCheck className="w-5 h-5 font-bold" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Owner Admin Portal</span>
                <span className="text-[11px] font-mono px-2 py-0.5 bg-[#16BFFF]/20 text-[#00E5FF] rounded">
                  MEHEDI 3D v2.0
                </span>
              </h2>
              <p className="text-xs text-[#AAB7D4] font-mono">
                Md. Mehedi Hasan (@Mehedii364) · ProFreeHost Controller
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B1430] hover:bg-[#111C44] text-xs font-mono text-red-400 border border-red-500/30 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-[#AAB7D4] hover:text-white bg-[#0B1430] hover:bg-[#111C44] rounded-lg border border-[#1B254B]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Barrier Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-16 flex flex-col items-center justify-center space-y-6 my-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#070B18] border border-[#16BFFF]/40 flex items-center justify-center text-[#16BFFF] shadow-xl">
              <KeyRound className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-sm">
              <h3 className="text-xl font-bold text-white">Owner Authorization Required</h3>
              <p className="text-xs text-[#AAB7D4]">
                This control center manages live photography, GitHub synchronizations, and ProFreeHost production packages.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-3">
              <input
                type="password"
                placeholder="Owner Passphrase (mehedi364 / wafa2026)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#070B18] border border-[#1B254B] focus:border-[#16BFFF] text-white text-xs px-4 py-3 rounded-xl outline-none text-center font-mono placeholder-[#AAB7D4]/40"
              />

              {authError && <div className="text-xs text-red-400 font-mono">{authError}</div>}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#16BFFF] to-[#00E5FF] text-[#070B18] font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                Unlock Dashboard
              </button>
            </form>

            <p className="text-[11px] font-mono text-[#AAB7D4]">
              Initial Setup Passphrase: <code className="text-[#00E5FF]">mehedi364</code>
            </p>
          </div>
        ) : (
          /* Main Authenticated Dashboard */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-56 bg-[#070B18] border-r border-[#1B254B] p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'overview'
                    ? 'bg-[#16BFFF]/20 text-[#00E5FF] font-semibold border border-[#16BFFF]/40'
                    : 'text-[#AAB7D4] hover:text-white hover:bg-[#0B1430]'
                }`}
              >
                <Server className="w-4 h-4" />
                <span>Overview &amp; Stats</span>
              </button>

              <button
                onClick={() => setActiveTab('photos')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'photos'
                    ? 'bg-[#16BFFF]/20 text-[#00E5FF] font-semibold border border-[#16BFFF]/40'
                    : 'text-[#AAB7D4] hover:text-white hover:bg-[#0B1430]'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Photo Manager ({images.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'profile'
                    ? 'bg-[#16BFFF]/20 text-[#00E5FF] font-semibold border border-[#16BFFF]/40'
                    : 'text-[#AAB7D4] hover:text-white hover:bg-[#0B1430]'
                }`}
              >
                <FileCode className="w-4 h-4" />
                <span>Profile &amp; Biography</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'projects'
                    ? 'bg-[#16BFFF]/20 text-[#00E5FF] font-semibold border border-[#16BFFF]/40'
                    : 'text-[#AAB7D4] hover:text-white hover:bg-[#0B1430]'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Projects &amp; GitHub</span>
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'messages'
                    ? 'bg-[#16BFFF]/20 text-[#00E5FF] font-semibold border border-[#16BFFF]/40'
                    : 'text-[#AAB7D4] hover:text-white hover:bg-[#0B1430]'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Messages ({messages.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('profreehost')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'profreehost'
                    ? 'bg-[#16BFFF]/20 text-[#00E5FF] font-semibold border border-[#16BFFF]/40'
                    : 'text-[#AAB7D4] hover:text-white hover:bg-[#0B1430]'
                }`}
              >
                <Server className="w-4 h-4 text-emerald-400" />
                <span>ProFreeHost Engine</span>
              </button>
            </div>

            {/* Main Panel Content */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">Executive Control Overview</h3>
                    <p className="text-xs text-[#AAB7D4]">
                      System status, image asset count, and GitHub synchronization health.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-[#070B18] rounded-xl border border-[#1B254B] space-y-1">
                      <span className="text-xs font-mono text-[#AAB7D4]">Photos Managed</span>
                      <div className="text-2xl font-bold text-white">{images.length}</div>
                    </div>
                    <div className="p-4 bg-[#070B18] rounded-xl border border-[#1B254B] space-y-1">
                      <span className="text-xs font-mono text-[#AAB7D4]">Total Projects</span>
                      <div className="text-2xl font-bold text-white">{projects.length}</div>
                    </div>
                    <div className="p-4 bg-[#070B18] rounded-xl border border-[#1B254B] space-y-1">
                      <span className="text-xs font-mono text-[#AAB7D4]">Messages Received</span>
                      <div className="text-2xl font-bold text-white">{messages.length}</div>
                    </div>
                    <div className="p-4 bg-[#070B18] rounded-xl border border-[#1B254B] space-y-1">
                      <span className="text-xs font-mono text-[#AAB7D4]">Hosting Platform</span>
                      <div className="text-sm font-bold text-[#16BFFF]">ProFreeHost PHP 8.2</div>
                    </div>
                  </div>

                  <div className="p-5 bg-[#070B18] border border-[#1B254B] rounded-xl space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#00E5FF]">
                      Quick Actions
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setActiveTab('photos')}
                        className="px-4 py-2 bg-[#16BFFF] text-[#070B18] font-semibold text-xs rounded-lg"
                      >
                        Upload New Photo
                      </button>
                      <button
                        onClick={onTriggerGhSync}
                        disabled={isGhSyncing}
                        className="px-4 py-2 bg-[#111C44] border border-[#1B254B] text-white text-xs rounded-lg"
                      >
                        {isGhSyncing ? 'Syncing GitHub...' : 'Sync GitHub Repos'}
                      </button>
                      <button
                        onClick={() => setActiveTab('profreehost')}
                        className="px-4 py-2 bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg"
                      >
                        View PHP &amp; MySQL Export Files
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PERSONAL PHOTO MANAGER */}
              {activeTab === 'photos' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">Personal Photograph System</h3>
                      <p className="text-xs text-[#AAB7D4]">
                        Set official hero portrait, configure profile avatar, manage visibility, and upload new images.
                      </p>
                    </div>
                  </div>

                  {/* Upload Container */}
                  <div className="p-5 bg-[#070B18] border border-[#1B254B] rounded-2xl space-y-4">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#16BFFF] flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      <span>Upload New Image Asset (Max 8MB · JPEG/PNG/WebP)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      <div className="sm:col-span-4">
                        <label className="block border-2 border-dashed border-[#1B254B] hover:border-[#16BFFF] rounded-xl p-4 text-center cursor-pointer transition-colors">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          {uploadPreview ? (
                            <img
                              src={uploadPreview}
                              alt="Preview"
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="space-y-2 py-4">
                              <Upload className="w-6 h-6 text-[#AAB7D4] mx-auto" />
                              <span className="text-xs text-[#AAB7D4] block">Click to select photo</span>
                            </div>
                          )}
                        </label>
                      </div>

                      <div className="sm:col-span-8 space-y-3">
                        <input
                          type="text"
                          placeholder="Photo Title (e.g. Executive Studio Portrait)"
                          value={uploadTitle}
                          onChange={(e) => setUploadTitle(e.target.value)}
                          className="w-full bg-[#0B1430] border border-[#1B254B] text-white text-xs px-3.5 py-2 rounded-xl outline-none"
                        />

                        <input
                          type="text"
                          placeholder="Description / Context"
                          value={uploadDesc}
                          onChange={(e) => setUploadDesc(e.target.value)}
                          className="w-full bg-[#0B1430] border border-[#1B254B] text-white text-xs px-3.5 py-2 rounded-xl outline-none"
                        />

                        <div className="flex gap-4 items-center">
                          <select
                            value={uploadCategory}
                            onChange={(e) => setUploadCategory(e.target.value as any)}
                            className="bg-[#0B1430] border border-[#1B254B] text-white text-xs px-3 py-2 rounded-xl outline-none"
                          >
                            <option value="portrait">Category: Portrait</option>
                            <option value="studio">Category: Studio</option>
                            <option value="lifestyle">Category: Lifestyle</option>
                            <option value="quote">Category: Quote Card</option>
                          </select>

                          <button
                            onClick={handlePublishPhoto}
                            className="px-4 py-2 bg-[#16BFFF] hover:bg-[#00E5FF] text-[#070B18] font-bold text-xs rounded-xl"
                          >
                            Add to Gallery
                          </button>
                        </div>

                        {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Photo List Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((img) => (
                      <div
                        key={img.id}
                        className={`p-3 bg-[#070B18] border rounded-xl space-y-3 flex flex-col justify-between ${
                          img.isHero ? 'border-[#16BFFF] shadow-md shadow-[#16BFFF]/10' : 'border-[#1B254B]'
                        }`}
                      >
                        <div className="relative aspect-[3/4] bg-[#0B1430] rounded-lg overflow-hidden">
                          <img
                            src={img.url}
                            alt={img.altText}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {img.isHero && (
                              <span className="px-2 py-0.5 bg-[#16BFFF] text-[#070B18] font-mono text-[9px] font-bold rounded">
                                HERO PORTRAIT
                              </span>
                            )}
                            {img.isAvatar && (
                              <span className="px-2 py-0.5 bg-[#8B45FF] text-white font-mono text-[9px] font-bold rounded">
                                AVATAR
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="font-semibold text-xs text-white truncate">{img.title}</div>
                          <div className="text-[11px] font-mono text-[#AAB7D4] uppercase">
                            {img.category}
                          </div>
                        </div>

                        {/* Owner Controls */}
                        <div className="pt-2 border-t border-[#1B254B] flex items-center justify-between text-xs">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSetHero(img.id)}
                              disabled={img.isHero}
                              className={`p-1.5 rounded text-[11px] font-mono flex items-center gap-1 ${
                                img.isHero
                                  ? 'text-[#16BFFF]'
                                  : 'text-[#AAB7D4] hover:text-white bg-[#0B1430]'
                              }`}
                              title="Set as 3D Scene & Hero Portrait"
                            >
                              <Star className="w-3.5 h-3.5" />
                              <span>Hero</span>
                            </button>

                            <button
                              onClick={() => handleSetAvatar(img.id)}
                              disabled={img.isAvatar}
                              className={`p-1.5 rounded text-[11px] font-mono flex items-center gap-1 ${
                                img.isAvatar
                                  ? 'text-[#8B45FF]'
                                  : 'text-[#AAB7D4] hover:text-white bg-[#0B1430]'
                              }`}
                              title="Set as Avatar"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Avatar</span>
                            </button>
                          </div>

                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleToggleVisibility(img.id)}
                              className="p-1.5 text-[#AAB7D4] hover:text-white bg-[#0B1430] rounded"
                              title={img.isVisible ? 'Hide from public gallery' : 'Show in public gallery'}
                            >
                              {img.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-amber-400" />}
                            </button>

                            <button
                              onClick={() => handleDeleteImage(img.id)}
                              className="p-1.5 text-[#AAB7D4] hover:text-red-400 bg-[#0B1430] rounded"
                              title="Delete photograph"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PROFILE MANAGER */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSave} className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">Profile &amp; Central Identity</h3>
                      <p className="text-xs text-[#AAB7D4]">
                        Editable identity parameters synced across the entire website and 3D workstation.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#16BFFF] hover:bg-[#00E5FF] text-[#070B18] font-bold text-xs rounded-xl transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saveSuccess ? 'Changes Saved!' : 'Save Profile'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-[#AAB7D4]">Full Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full bg-[#070B18] border border-[#1B254B] text-white text-xs px-3.5 py-2 rounded-xl outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-[#AAB7D4]">Headline / Titles</label>
                      <input
                        type="text"
                        value={profileForm.headline}
                        onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                        className="w-full bg-[#070B18] border border-[#1B254B] text-white text-xs px-3.5 py-2 rounded-xl outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-[#AAB7D4]">Ecosystem Brand</label>
                      <input
                        type="text"
                        value={profileForm.ecosystem}
                        onChange={(e) => setProfileForm({ ...profileForm, ecosystem: e.target.value })}
                        className="w-full bg-[#070B18] border border-[#1B254B] text-white text-xs px-3.5 py-2 rounded-xl outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-[#AAB7D4]">Ecosystem Motto</label>
                      <input
                        type="text"
                        value={profileForm.ecosystemTagline}
                        onChange={(e) => setProfileForm({ ...profileForm, ecosystemTagline: e.target.value })}
                        className="w-full bg-[#070B18] border border-[#1B254B] text-white text-xs px-3.5 py-2 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[#AAB7D4]">
                      Development Philosophy
                    </label>
                    <input
                      type="text"
                      value={profileForm.philosophy}
                      onChange={(e) => setProfileForm({ ...profileForm, philosophy: e.target.value })}
                      className="w-full bg-[#070B18] border border-[#1B254B] text-white text-xs px-3.5 py-2 rounded-xl outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[#AAB7D4]">
                      Biography (About Me text)
                    </label>
                    <textarea
                      rows={4}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="w-full bg-[#070B18] border border-[#1B254B] text-white text-xs p-3.5 rounded-xl outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-[#AAB7D4]">
                        Motto (English)
                      </label>
                      <input
                        type="text"
                        value={profileForm.quoteEnglish}
                        onChange={(e) => setProfileForm({ ...profileForm, quoteEnglish: e.target.value })}
                        className="w-full bg-[#070B18] border border-[#1B254B] text-white text-xs px-3.5 py-2 rounded-xl outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-[#AAB7D4]">
                        Motto (Bengali)
                      </label>
                      <input
                        type="text"
                        value={profileForm.quoteBengali}
                        onChange={(e) => setProfileForm({ ...profileForm, quoteBengali: e.target.value })}
                        className="w-full bg-[#070B18] border border-[#1B254B] text-white text-xs px-3.5 py-2 rounded-xl outline-none"
                      />
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 4: PROJECTS & GITHUB */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">Project &amp; Repository Manager</h3>
                      <p className="text-xs text-[#AAB7D4]">
                        Toggle featured repositories and trigger on-demand GitHub synchronization.
                      </p>
                    </div>

                    <button
                      onClick={onTriggerGhSync}
                      disabled={isGhSyncing}
                      className="flex items-center gap-2 px-4 py-2 bg-[#16BFFF] text-[#070B18] font-bold text-xs rounded-xl disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isGhSyncing ? 'animate-spin' : ''}`} />
                      <span>{isGhSyncing ? 'Synchronizing...' : 'Sync GitHub API'}</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-3.5 bg-[#070B18] border border-[#1B254B] rounded-xl flex items-center justify-between gap-4"
                      >
                        <div className="space-y-0.5 truncate">
                          <div className="text-sm font-semibold text-white truncate">{proj.name}</div>
                          <div className="text-xs font-mono text-[#AAB7D4]">
                            @{proj.repoName} · {proj.language} · {proj.stars} stars
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            onClick={() => handleToggleProject(proj.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                              proj.featured
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                : 'bg-[#0B1430] text-[#AAB7D4] border border-[#1B254B]'
                            }`}
                          >
                            {proj.featured ? '★ Featured' : '☆ Make Featured'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: MESSAGES */}
              {activeTab === 'messages' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">Visitor Messages Inbox</h3>
                    <p className="text-xs text-[#AAB7D4]">
                      Messages received through the Contact portal.
                    </p>
                  </div>

                  {messages.length === 0 ? (
                    <div className="p-8 text-center bg-[#070B18] rounded-xl border border-[#1B254B] text-xs text-[#AAB7D4]">
                      No messages received yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((m) => (
                        <div
                          key={m.id}
                          className="p-4 bg-[#070B18] border border-[#1B254B] rounded-xl space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-white">{m.name}</span>
                            <span className="text-[11px] font-mono text-[#AAB7D4]">
                              {new Date(m.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-xs font-mono text-[#16BFFF]">{m.email}</div>
                          <div className="text-xs font-semibold text-white">{m.subject}</div>
                          <p className="text-xs text-[#AAB7D4] leading-relaxed bg-[#0B1430] p-3 rounded-lg border border-[#1B254B]">
                            {m.message}
                          </p>
                          <div className="flex justify-end pt-2">
                            <button
                              onClick={() => handleDeleteMessage(m.id)}
                              className="text-xs text-red-400 hover:underline flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete Message</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: PROFREEHOST ENGINE & PRODUCTION EXPORT */}
              {activeTab === 'profreehost' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Server className="w-5 h-5 text-emerald-400" />
                      <span>ProFreeHost Production Architecture</span>
                    </h3>
                    <p className="text-xs text-[#AAB7D4]">
                      Everything required to host MEHEDI 3D on ProFreeHost Apache, PHP 8.2 &amp; MySQL 5.7 without Node.js runtime.
                    </p>
                  </div>

                  {/* Architecture Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                    <div className="p-4 bg-[#070B18] border border-[#1B254B] rounded-xl space-y-1">
                      <span className="text-emerald-400 font-bold">✓ PHP 8.2 Ready</span>
                      <p className="text-[#AAB7D4] text-[11px]">Pure PDO prepared SQL queries, zero composer runtime overhead.</p>
                    </div>
                    <div className="p-4 bg-[#070B18] border border-[#1B254B] rounded-xl space-y-1">
                      <span className="text-emerald-400 font-bold">✓ MySQL 5.7 Compatible</span>
                      <p className="text-[#AAB7D4] text-[11px]">utf8mb4 encoding, strict foreign key constraints, phpMyAdmin ready.</p>
                    </div>
                    <div className="p-4 bg-[#070B18] border border-[#1B254B] rounded-xl space-y-1">
                      <span className="text-emerald-400 font-bold">✓ Under 10MB Files</span>
                      <p className="text-[#AAB7D4] text-[11px]">Every static chunk and PHP script strictly complies with the 10MB file limit.</p>
                    </div>
                  </div>

                  {/* ProFreeHost Folder Structure Display */}
                  <div className="p-5 bg-[#070B18] border border-[#1B254B] rounded-xl space-y-3 font-mono text-xs">
                    <div className="text-[#16BFFF] font-bold">Production public_html File Tree:</div>
                    <pre className="text-[#AAB7D4] overflow-x-auto p-3 bg-[#0B1430] rounded-lg">
{`htdocs/ (or public_html/)
├── index.html               # Compiled static frontend with Three.js
├── assets/                  # Compact JS & CSS bundles (< 2MB each)
├── api/                     # PHP 8.2 REST Endpoints
│   ├── profile.php          # GET profile & public identity
│   ├── projects.php         # GET projects & featured repos
│   ├── contact.php          # POST contact submission + anti-spam
│   ├── github.php           # Cached GitHub proxy
│   └── gallery.php          # Image registry
├── config/
│   └── db.php               # PDO database credentials (protected)
├── database/
│   ├── schema.sql           # Complete MySQL 5.7 schema (16 tables)
│   └── seed.sql             # Structural seed data
├── uploads/                 # Uploaded photography (PHP execution blocked)
└── .htaccess                # SPA rewrite, security headers, upload protection`}
                    </pre>
                  </div>

                  {/* Step by step deployment summary */}
                  <div className="p-5 bg-[#070B18] border border-emerald-500/30 rounded-xl space-y-3 text-xs">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>ProFreeHost 3-Step Setup Guide</span>
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-[#AAB7D4] leading-relaxed">
                      <li>
                        <strong className="text-white">Create MySQL Database</strong> in the ProFreeHost Control Panel (cPanel). Note the MySQL hostname (e.g. <code className="text-[#00E5FF]">sqlXXX.epizy.com</code>), database name, and user.
                      </li>
                      <li>
                        <strong className="text-white">Import schema.sql</strong> via phpMyAdmin to create all tables (admin_users, profile, projects, etc.).
                      </li>
                      <li>
                        <strong className="text-white">Upload Files via FTP / File Manager</strong> directly into <code className="text-[#00E5FF]">htdocs/</code>. Update <code className="text-[#00E5FF]">config/db.php</code> with your database credentials.
                      </li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
