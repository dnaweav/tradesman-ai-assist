
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function DevSetup() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createTestUserProfile = async () => {
    setLoading(true);
    console.log('Starting user profile setup...');

    try {
      // Get the current user ID dynamically
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting current user:', userError);
        throw userError;
      }

      if (!user) {
        console.error('No user logged in');
        throw new Error('No user logged in');
      }

      const userId = user.id;
      const businessId = 'bb217af3-0bc4-441b-b37c-8a25c0d5b915';

      console.log('Using current user ID:', userId);

      // Check if user profile already exists
      console.log('Checking for existing user profile...');
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing profile:', checkError);
        throw checkError;
      }

      if (existingProfile) {
        console.log('User profile already exists:', existingProfile);
        toast({
          title: "Profile Already Exists",
          description: `User profile already exists for business: ${existingProfile.business_id}`,
        });
        return;
      }

      // Insert new user profile
      console.log('Creating new user profile...');
      const { data: newProfile, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          business_id: businessId,
          is_admin: false
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user profile:', insertError);
        throw insertError;
      }

      console.log('✅ SUCCESS: User profile created:', newProfile);
      toast({
        title: "Success",
        description: "Test user profile created successfully!",
      });

      // Verify the setup by fetching the complete profile
      console.log('Verifying setup by fetching complete profile...');
      const { data: verifyData, error: verifyError } = await supabase
        .from('user_profiles')
        .select('*, businesses:business_id(*)')
        .eq('user_id', userId)
        .single();

      if (verifyError) {
        console.error('Error verifying setup:', verifyError);
        throw verifyError;
      }

      console.log('✅ VERIFICATION SUCCESS: Complete profile data:', verifyData);
      
    } catch (error) {
      console.error('❌ SETUP FAILED:', error);
      toast({
        title: "Setup Failed",
        description: "Check console for details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg border">
        <h3 className="text-sm font-medium mb-2">Dev Setup</h3>
        <Button
          onClick={createTestUserProfile}
          disabled={loading}
          className="text-xs"
        >
          {loading ? "Setting up..." : "Create Test User Profile"}
        </Button>
      </div>
    </div>
  );
}
