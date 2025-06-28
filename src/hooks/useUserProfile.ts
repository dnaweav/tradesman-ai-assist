
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id?: string;
  user_id: string;
  business_id: string;
  is_admin: boolean;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
  profile_photo_url: string | null;
  role_title: string | null;
}

export function useUserProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load user profile
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading user profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setProfile(data);
        setOriginalProfile(data);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (field: string, value: string) => {
    if (!profile) return;

    setProfile(prev => prev ? {
      ...prev,
      [field]: value
    } : null);
  };

  const uploadProfilePhoto = async (file: File): Promise<string | null> => {
    if (!user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('user_avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        console.error('Error uploading photo:', uploadError);
        toast({
          title: "Error",
          description: "Failed to upload profile photo.",
          variant: "destructive",
        });
        return null;
      }

      const { data } = supabase.storage
        .from('user_avatars')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      return null;
    }
  };

  const saveProfile = async () => {
    if (!profile || !user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          phone_number: profile.phone_number,
          profile_photo_url: profile.profile_photo_url,
          role_title: profile.role_title,
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error saving profile:', error);
        toast({
          title: "Error",
          description: "Failed to save profile changes.",
          variant: "destructive",
        });
        return;
      }

      setOriginalProfile(profile);
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = profile && originalProfile ? 
    JSON.stringify(profile) !== JSON.stringify(originalProfile) : false;

  return {
    profile,
    loading,
    saving,
    hasChanges,
    updateProfile,
    uploadProfilePhoto,
    saveProfile,
  };
}
