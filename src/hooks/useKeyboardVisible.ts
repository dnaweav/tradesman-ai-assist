
import { useState, useEffect } from 'react';

export function useKeyboardVisible() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    if (!window.visualViewport) {
      return;
    }

    const handleResize = () => {
      // Compare the visual viewport height with the window height
      // If there's a significant difference (>100px), keyboard is likely open
      const heightDifference = window.innerHeight - window.visualViewport.height;
      const keyboardThreshold = 100;
      
      setIsKeyboardVisible(heightDifference > keyboardThreshold);
    };

    // Listen for viewport changes
    window.visualViewport.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, []);

  return isKeyboardVisible;
}
