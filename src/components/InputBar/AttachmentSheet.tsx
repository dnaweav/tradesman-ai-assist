
import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Camera, Image, File } from "lucide-react";

interface AttachmentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileSelect: (files: FileList | null, type: 'camera' | 'gallery' | 'file') => void;
}

export function AttachmentSheet({ open, onOpenChange, onFileSelect }: AttachmentSheetProps) {
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const galleryInputRef = React.useRef<HTMLInputElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Add Attachment</SheetTitle>
          </SheetHeader>
          
          <div className="grid grid-cols-3 gap-4 py-6">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              type="button"
            >
              <Camera className="w-8 h-8 text-blue-500" />
              <span className="text-sm font-medium">Camera</span>
            </button>

            <button
              onClick={() => galleryInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              type="button"
            >
              <Image className="w-8 h-8 text-green-500" />
              <span className="text-sm font-medium">Gallery</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              type="button"
            >
              <File className="w-8 h-8 text-purple-500" />
              <span className="text-sm font-medium">File</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Hidden File Inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => onFileSelect(e.target.files, 'camera')}
      />
      
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => onFileSelect(e.target.files, 'gallery')}
      />
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => onFileSelect(e.target.files, 'file')}
      />
    </>
  );
}
