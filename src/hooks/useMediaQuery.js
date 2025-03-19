import { useState, useEffect } from 'react';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Update the state with the current value
    const updateMatches = () => {
      setMatches(media.matches);
    };
    
    // Call once to set the initial value
    updateMatches();
    
    // Set up the listener to track changes
    media.addEventListener('change', updateMatches);
    
    // Clean up the listener
    return () => {
      media.removeEventListener('change', updateMatches);
    };
  }, [query]);

  return matches;
}
