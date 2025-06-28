

import React, { useRef, useState } from 'react';
import { Camera, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TopNav } from '@/components/TopNav';
import { AppBottomTabs } from '@/components/AppBottomTabs';
import { useBusinessProfile } from '@/hooks/useBusinessProfile';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleLogoClick = () => {
    if (isAdmin && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size must be less than 5MB.",
        variant: "destructive",
      });
      return;
    }

    const logoUrl = await uploadLogo(file);
    if (logoUrl) {
      updateBusiness('logo_url', logoUrl);
    }
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
        <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
          <div className="text-center">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Business Logo
            </Label>
            <div
              className={`relative mx-auto w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden ${
                isAdmin ? 'cursor-pointer hover:border-blue-400 transition-all ease-in-out' : 'cursor-not-allowed opacity-60'
              }`}
              onClick={handleLogoClick}
            >
              {business.logo_url ? (
                <img
                  src={business.logo_url}
                  alt="Business Logo"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-500">Add Logo</span>
                </div>
              )}
              {isAdmin && (
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all ease-in-out rounded-xl flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-all ease-in-out" />
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              disabled={!isAdmin}
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Business Details Card - Combined Name, Address, and Postcode */}
          <div className="bg-white rounded-2xl p-4 shadow-md space-y-4">
            {/* Business Name */}
            <div>
              <Label htmlFor="business_name" className="text-sm font-medium text-gray-700 mb-2 block">
                Business Name
              </Label>
              <Input
                id="business_name"
                value={business.business_name || ''}
                onChange={(e) => updateBusiness('business_name', e.target.value)}
                disabled={!isAdmin}
                className="rounded-xl shadow-md px-4 py-2 text-sm transition-all ease-in-out"
                placeholder="Enter business name"
              />
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 block">
                Address
              </Label>
              <Textarea
                id="address"
                value={business.address || ''}
                onChange={(e) => updateBusiness('address', e.target.value)}
                disabled={!isAdmin}
                className="rounded-xl shadow-md px-4 py-2 text-sm transition-all ease-in-out min-h-[80px]"
                placeholder="Enter business address"
              />
            </div>

            {/* Postcode */}
            <div>
              <Label htmlFor="postcode" className="text-sm font-medium text-gray-700 mb-2 block">
                Postcode
              </Label>
              <Input
                id="postcode"
                value={business.postcode || ''}
                onChange={(e) => updateBusiness('postcode', e.target.value)}
                disabled={!isAdmin}
                className="rounded-xl shadow-md px-4 py-2 text-sm transition-all ease-in-out"
                placeholder="Enter postcode"
              />
            </div>
          </div>

          {/* Contact Details Card - Combined Email, Phone, and Website */}
          <div className="bg-white rounded-2xl p-4 shadow-md space-y-4">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={business.email || ''}
                onChange={(e) => updateBusiness('email', e.target.value)}
                disabled={!isAdmin}
                className="rounded-xl shadow-md px-4 py-2 text-sm transition-all ease-in-out"
                placeholder="Enter email address"
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={business.phone || ''}
                onChange={(e) => updateBusiness('phone', e.target.value)}
                disabled={!isAdmin}
                className="rounded-xl shadow-md px-4 py-2 text-sm transition-all ease-in-out"
                placeholder="Enter phone number"
              />
            </div>

            {/* Website */}
            <div>
              <Label htmlFor="website" className="text-sm font-medium text-gray-700 mb-2 block">
                Website
              </Label>
              <Input
                id="website"
                type="url"
                value={business.website || ''}
                onChange={(e) => updateBusiness('website', e.target.value)}
                disabled={!isAdmin}
                className="rounded-xl shadow-md px-4 py-2 text-sm transition-all ease-in-out"
                placeholder="Enter website URL"
              />
            </div>
          </div>

          {/* VAT Number */}
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <Label htmlFor="vat_number" className="text-sm font-medium text-gray-700 mb-2 block">
              VAT Number
            </Label>
            <Input
              id="vat_number"
              value={business.vat_number || ''}
              onChange={(e) => updateBusiness('vat_number', e.target.value)}
              disabled={!isAdmin}
              className="rounded-xl shadow-md px-4 py-2 text-sm transition-all ease-in-out"
              placeholder="Enter VAT number"
            />
          </div>
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
