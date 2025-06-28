
import React, { useRef } from 'react';
import { Camera, Edit, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { AspectRatio } from '@/components/ui/aspect-ratio';
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

  const handleDeleteLogo = () => {
    if (isAdmin && logoUrl) {
      onLogoUpdate('');
      toast({
        title: "Success",
        description: "Logo removed successfully.",
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
      <div className="text-center">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Business Logo
        </Label>
        
        {logoUrl ? (
          // Display uploaded logo with action buttons positioned at bottom-right
          <div className="relative mx-auto w-24 rounded-2xl overflow-hidden bg-gray-50">
            <AspectRatio ratio={1} className="bg-gray-50">
              <img
                src={logoUrl}
                alt="Business Logo"
                className="w-full h-full object-contain p-2"
              />
            </AspectRatio>
            {isAdmin && (
              <div className="absolute bottom-1 right-1 flex gap-1">
                <button
                  onClick={handleLogoClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-lg transition-colors"
                  title="Change logo"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={handleDeleteLogo}
                  className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-colors"
                  title="Delete logo"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        ) : (
          // Upload placeholder
          <div
            className={`relative mx-auto w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center ${
              isAdmin ? 'cursor-pointer hover:border-blue-400 transition-colors' : 'cursor-not-allowed opacity-60'
            }`}
            onClick={handleLogoClick}
          >
            <div className="text-center">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-xs text-gray-500">Add Logo</span>
            </div>
          </div>
        )}
        
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
