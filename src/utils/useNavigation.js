import { useState, useEffect } from 'react';

export default function useNavigation() {
  const [activeItem, setActiveItem] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROUTES);
    return saved || 'dashboard';
  });
  const [forceRender, setForceRender] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => {
      // Sync activeItem with URL if needed
    };
    window.addEventListener('routeChange', handleRouteChange);
    return () => window.removeEventListener('routeChange', handleRouteChange);
  }, []);

  const setActiveItem = (id) => {
    setActive(id);
    localStorage.setItem(STORAGE_KEYS.ROUTES, id);
    setForceRender(prev => !prev);
  };

  return { activeItem, setActiveItem, forceRender };
}