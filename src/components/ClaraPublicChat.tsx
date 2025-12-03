import { useLocation } from 'react-router-dom';
import { ClaraFixedChat } from './ai-agents/ClaraFixedChat';

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

export const ClaraPublicChat = () => {
  const location = useLocation();
  
  // Show Clara only on public frontend pages (not dashboard or auth)
  const isPublicPage = PUBLIC_ROUTES.includes(location.pathname);
  
  if (!isPublicPage) return null;
  
  return <ClaraFixedChat />;
};
