import { ChatHeader } from "./ChatHeader";

interface ChatErrorStateProps {
  error: string;
  onBack: () => void;
  isAutoReadEnabled: boolean;
  onAutoReadToggle: (enabled: boolean) => void;
}

export function ChatErrorState({ 
  error, 
  onBack, 
  isAutoReadEnabled, 
  onAutoReadToggle 
}: ChatErrorStateProps) {
  console.log('Error state:', error);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ChatHeader
        title="Chat Error"
        onBack={onBack}
        isAutoReadEnabled={isAutoReadEnabled}
        onAutoReadToggle={onAutoReadToggle}
      />
      
      <div className="flex-1 flex items-center justify-center pt-16 pb-32">
        <div className="text-center px-4">
          <div className="text-red-500 text-lg font-semibold mb-2">
            Unable to load chat
          </div>
          <div className="text-gray-600 mb-4">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}