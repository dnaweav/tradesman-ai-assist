
import React, { useRef } from 'react';
import { Camera } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface LogoUploadSectionProps {
  logoUrl: string | null;
  isAdmin: boolean;
  onLogoUpload: (file: File) => Promise<string | null>;
  onLogoUpdate: (logoUrl: string) => void;
}

export function LogoUploadSection({ logoUrl, isAdmin, onLogoUpload, onLogoUpdate }: LogoUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

    const newLogoUrl = await onLogoUpload(file);
    if (newLogoUrl) {
      onLogoUpdate(newLogoUrl);
    }
  };

  return (
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
          {logoUrl ? (
            <img
              src={logoUrl}
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
  );
}
