
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TopNav } from '@/components/TopNav';
import { AppBottomTabs } from '@/components/AppBottomTabs';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useNavigate } from 'react-router-dom';
import { ProfilePhotoUploadSection } from '@/components/UserProfile/ProfilePhotoUploadSection';
import { PersonalDetailsCard } from '@/components/UserProfile/PersonalDetailsCard';
import { ContactInfoCard } from '@/components/UserProfile/ContactInfoCard';
import { RoleDetailsCard } from '@/components/UserProfile/RoleDetailsCard';

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();
  
  const {
    profile,
    loading,
    saving,
    hasChanges,
    updateProfile,
    uploadProfilePhoto,
    saveProfile,
  } = useUserProfile();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') {
      navigate('/');
    }
    // Add other navigation logic here as needed
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handlePhotoUpdate = (photoUrl: string) => {
    updateProfile('profile_photo_url', photoUrl);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#eaeaea] via-white to-[#eaeaea]">
        <TopNav showBackButton={true} onBackClick={handleBackClick} />
        <div className="flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#eaeaea] via-white to-[#eaeaea]">
        <TopNav showBackButton={true} onBackClick={handleBackClick} />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No profile found</h3>
            <p className="text-sm text-gray-500">Please contact support to set up your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaeaea] via-white to-[#eaeaea]">
      <TopNav showBackButton={true} onBackClick={handleBackClick} />
      
      <div className="pt-20 pb-24 px-4 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
        </div>

        {/* Profile Photo Section */}
        <ProfilePhotoUploadSection
          profilePhotoUrl={profile.profile_photo_url}
          onPhotoUpload={uploadProfilePhoto}
          onPhotoUpdate={handlePhotoUpdate}
        />

        {/* Profile Form */}
        <div className="space-y-4">
          {/* Personal Details Card */}
          <PersonalDetailsCard
            firstName={profile.first_name}
            lastName={profile.last_name}
            onUpdate={updateProfile}
          />

          {/* Contact Info Card */}
          <ContactInfoCard
            email={profile.email}
            phoneNumber={profile.phone_number}
            onUpdate={updateProfile}
          />

          {/* Role Details Card */}
          <RoleDetailsCard
            roleTitle={profile.role_title}
            onUpdate={updateProfile}
          />
        </div>

        {/* Save Button - Fixed at bottom */}
        {hasChanges && (
          <div className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto">
            <Button
              onClick={saveProfile}
              disabled={saving || !hasChanges}
              className="w-full bg-[#3b9fe6] hover:bg-[#2176bd] text-white font-medium py-3 rounded-xl shadow-lg transition-all ease-in-out active:scale-[0.98]"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#3878eb] to-[#59a3f5] z-20">
        <AppBottomTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>
    </div>
  );
}
