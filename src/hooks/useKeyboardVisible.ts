
import { useState, useEffect } from 'react';

export function useKeyboardVisible() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    // Check if we're on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    console.log('useKeyboardVisible: iOS detected:', isIOS);

    // Store initial viewport height
    let initialViewportHeight = window.innerHeight;
    let initialVisualViewportHeight = window.visualViewport?.height || window.innerHeight;

    const handleKeyboardChange = () => {
      const currentViewportHeight = window.innerHeight;
      const currentVisualViewportHeight = window.visualViewport?.height || window.innerHeight;
      
      // Calculate height difference from initial state
      const viewportDiff = initialViewportHeight - currentViewportHeight;
      const visualViewportDiff = initialVisualViewportHeight - currentVisualViewportHeight;
      
      // On iOS, keyboard is considered visible if:
      // 1. Visual viewport height is significantly smaller than initial
      // 2. Or regular viewport height decreased significantly
      const threshold = isIOS ? 150 : 100;
      const keyboardVisible = visualViewportDiff > threshold || viewportDiff > threshold;
      
      console.log('Keyboard detection:', {
        initialViewportHeight,
        currentViewportHeight,
        initialVisualViewportHeight,
        currentVisualViewportHeight,
        viewportDiff,
        visualViewportDiff,
        threshold,
        keyboardVisible
      });
      
      setIsKeyboardVisible(keyboardVisible);
    };

    // Add multiple event listeners for better detection
    const events = ['resize', 'orientationchange'];
    
    events.forEach(event => {
      window.addEventListener(event, handleKeyboardChange);
    });

    // Visual viewport events (iOS Safari)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleKeyboardChange);
      window.visualViewport.addEventListener('scroll', handleKeyboardChange);
    }

    // Input focus/blur detection as backup
    const handleInputFocus = () => {
      console.log('Input focused');
      // Delay to allow keyboard to show
      setTimeout(handleKeyboardChange, 300);
    };

    const handleInputBlur = () => {
      console.log('Input blurred');
      // Delay to allow keyboard to hide
      setTimeout(handleKeyboardChange, 300);
    };

    // Add focus/blur listeners to all input elements
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', handleInputFocus);
      input.addEventListener('blur', handleInputBlur);
    });

    // Initial check
    handleKeyboardChange();

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleKeyboardChange);
      });
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleKeyboardChange);
        window.visualViewport.removeEventListener('scroll', handleKeyboardChange);
      }

      inputs.forEach(input => {
        input.removeEventListener('focus', handleInputFocus);
        input.removeEventListener('blur', handleInputBlur);
      });
    };
  }, []);

  return isKeyboardVisible;
}
