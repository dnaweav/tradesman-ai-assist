
import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TopNav } from '@/components/TopNav';
import { AppBottomTabs } from '@/components/AppBottomTabs';
import { useBusinessProfile } from '@/hooks/useBusinessProfile';
import { useNavigate } from 'react-router-dom';
import { LogoUploadSection } from '@/components/BusinessProfile/LogoUploadSection';
import { BusinessDetailsCard } from '@/components/BusinessProfile/BusinessDetailsCard';
import { ContactDetailsCard } from '@/components/BusinessProfile/ContactDetailsCard';
import { VATNumberCard } from '@/components/BusinessProfile/VATNumberCard';

export default function BusinessProfile() {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();
  
  const {
    business,
    loading,
    saving,
    hasChanges,
    isAdmin,
    updateBusiness,
    uploadLogo,
    saveBusiness,
  } = useBusinessProfile();

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

  const handleLogoUpdate = (logoUrl: string) => {
    updateBusiness('logo_url', logoUrl);
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

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#eaeaea] via-white to-[#eaeaea]">
        <TopNav showBackButton={true} onBackClick={handleBackClick} />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No business profile found</h3>
            <p className="text-sm text-gray-500">Please contact support to set up your business profile.</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Business Profile</h1>
          {!isAdmin && (
            <p className="text-sm text-gray-500 mt-2">
              Contact your business admin to make changes
            </p>
          )}
        </div>

        {/* Logo Section */}
        <LogoUploadSection
          logoUrl={business.logo_url}
          isAdmin={isAdmin}
          onLogoUpload={uploadLogo}
          onLogoUpdate={handleLogoUpdate}
        />

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Business Details Card - Combined Name, Address, and Postcode */}
          <BusinessDetailsCard
            businessName={business.business_name}
            address={business.address}
            postcode={business.postcode}
            isAdmin={isAdmin}
            onUpdate={updateBusiness}
          />

          {/* Contact Details Card - Combined Email, Phone, and Website */}
          <ContactDetailsCard
            email={business.email}
            phone={business.phone}
            website={business.website}
            isAdmin={isAdmin}
            onUpdate={updateBusiness}
          />

          {/* VAT Number */}
          <VATNumberCard
            vatNumber={business.vat_number}
            isAdmin={isAdmin}
            onUpdate={updateBusiness}
          />
        </div>

        {/* Save Button - Fixed at bottom */}
        {isAdmin && hasChanges && (
          <div className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto">
            <Button
              onClick={saveBusiness}
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
