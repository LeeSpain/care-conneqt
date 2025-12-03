import { useLocation } from 'react-router-dom';
import { ClaraWidget } from './ai-agents/ClaraWidget';

// Public routes where Clara should appear
const PUBLIC_ROUTES = [
  '/',
  '/pricing',
  '/personal-care',
  '/institutional-care',
  '/devices',
  '/our-nurses',
  '/guide',
  '/conneqtivity',
  '/order-confirmation',
];

export const FloatingClara = () => {
  const location = useLocation();
  
  // Show Clara only on public frontend pages (not dashboard or auth)
  const isPublicPage = PUBLIC_ROUTES.includes(location.pathname) || 
    PUBLIC_ROUTES.some(route => location.pathname === route);
  
  if (!isPublicPage) return null;
  
  return <ClaraWidget />;
};
