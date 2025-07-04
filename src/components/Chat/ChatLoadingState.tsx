export function ChatLoadingState() {
  console.log('Loading state - showing loading UI');
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">Loading chat...</div>
    </div>
  );
}