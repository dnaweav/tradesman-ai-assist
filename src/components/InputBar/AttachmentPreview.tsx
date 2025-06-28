
import * as React from "react";
import { File, X } from "lucide-react";
import { AttachmentFile } from "./types";

interface AttachmentPreviewProps {
  attachments: AttachmentFile[];
  onRemove: (id: string) => void;
}

export function AttachmentPreview({ attachments, onRemove }: AttachmentPreviewProps) {
  if (attachments.length === 0) return null;

  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 border border-white/20 dark:border-gray-700/20"
        >
          <button
            onClick={() => onRemove(attachment.id)}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
            type="button"
          >
            <X className="w-3 h-3 text-white" />
          </button>
          
          {attachment.type === 'image' && attachment.preview ? (
            <img
              src={attachment.preview}
              alt="Preview"
              className="w-12 h-12 object-cover rounded"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
              <File className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
          )}
          
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate max-w-12">
            {attachment.file.name}
          </p>
        </div>
      ))}
    </div>
  );
}
