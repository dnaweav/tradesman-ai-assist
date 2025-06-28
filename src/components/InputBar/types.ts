
export interface AttachmentFile {
  id: string;
  file: File;
  preview?: string;
  type: 'image' | 'file';
}

export interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend?: (message: string, files: File[]) => void;
  onHeightChange?: (height: number) => void;
  placeholder?: string;
  onMicClick?: () => void;
}
