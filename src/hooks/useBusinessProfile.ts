
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface BusinessData {
  id: string;
  business_name: string | null;
  address: string | null;
  postcode: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  vat_number: string | null;
  logo_url: string | null;
}

export interface UserProfile {
  id: string;
  user_id: string;
  business_id: string;
  is_admin: boolean;
}

export function useBusinessProfile() {
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<BusinessData | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      fetchBusinessProfile();
    }
  }, [user?.id]);

  const fetchBusinessProfile = async () => {
    try {
      setLoading(true);
      
      // First get user profile to find business and admin status
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setUserProfile(profileData);

      // Then get business data
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', profileData.business_id)
        .single();

      if (businessError) {
        console.error('Error fetching business:', businessError);
        toast({
          title: "Error",
          description: "Failed to load business profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setBusiness(businessData);
      setOriginalData(businessData);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBusiness = (field: keyof BusinessData, value: string) => {
    if (!business) return;
    
    const updatedBusiness = { ...business, [field]: value };
    setBusiness(updatedBusiness);
    
    // Check if there are changes
    const hasDataChanges = originalData && Object.keys(originalData).some(key => {
      const originalValue = originalData[key as keyof BusinessData] || '';
      const currentValue = updatedBusiness[key as keyof BusinessData] || '';
      return originalValue !== currentValue;
    });
    
    setHasChanges(!!hasDataChanges);
  };

  const uploadLogo = async (file: File): Promise<string | null> => {
    if (!business || !userProfile?.is_admin) {
      toast({
        title: "Error",
        description: "You don't have permission to upload logos.",
        variant: "destructive",
      });
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${business.id}.${fileExt}`;
      
      // Delete existing logo if any
      if (business.logo_url) {
        const existingPath = business.logo_url.split('/').pop();
        if (existingPath) {
          await supabase.storage
            .from('business_logos')
            .remove([existingPath]);
        }
      }

      // Upload new logo
      const { data, error } = await supabase.storage
        .from('business_logos')
        .upload(fileName, file, { upsert: true });

      if (error) {
        console.error('Error uploading logo:', error);
        toast({
          title: "Error",
          description: "Failed to upload logo. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('business_logos')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Unexpected error uploading logo:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during upload.",
        variant: "destructive",
      });
      return null;
    }
  };

  const saveBusiness = async () => {
    if (!business || !userProfile?.is_admin || !hasChanges) return;

    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('businesses')
        .update({
          business_name: business.business_name,
          address: business.address,
          postcode: business.postcode,
          email: business.email,
          phone: business.phone,
          website: business.website,
          vat_number: business.vat_number,
          logo_url: business.logo_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', business.id);

      if (error) {
        console.error('Error saving business:', error);
        toast({
          title: "Error",
          description: "Failed to save changes. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setOriginalData(business);
      setHasChanges(false);
      
      toast({
        title: "Success",
        description: "Business profile updated successfully.",
      });
    } catch (error) {
      console.error('Unexpected error saving business:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    business,
    userProfile,
    loading,
    saving,
    hasChanges,
    isAdmin: userProfile?.is_admin || false,
    updateBusiness,
    uploadLogo,
    saveBusiness,
  };
}
