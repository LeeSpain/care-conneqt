import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type AppRole = 'member' | 'family_carer' | 'nurse' | 'facility_admin' | 'admin';

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  language: string;
  timezone: string;
  onboarding_completed: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  roles: AppRole[];
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      // Parallelize profile and roles fetch for better performance
      const [profileResult, rolesResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('user_roles').select('role').eq('user_id', userId)
      ]);

      const profileData = profileResult.data;
      const userRoles = rolesResult.data?.map(r => r.role as AppRole) || [];

      setProfile(profileData);
      setRoles(userRoles);
      
      // Cache auth state for faster subsequent loads
      sessionStorage.setItem('auth_cached', JSON.stringify({
        user,
        profile: profileData,
        roles: userRoles,
        timestamp: Date.now()
      }));
      
      // Apply language preference in background (non-blocking)
      if (profileData?.language) {
        setTimeout(() => {
          i18n.changeLanguage(profileData.language);
          localStorage.setItem('i18nextLng', profileData.language);
        }, 0);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Try to load cached auth state for instant loading
    const cachedAuth = sessionStorage.getItem('auth_cached');
    if (cachedAuth) {
      try {
        const { user: cachedUser, profile: cachedProfile, roles: cachedRoles, timestamp } = JSON.parse(cachedAuth);
        // Use cache if less than 1 minute old
        if (Date.now() - timestamp < 60000) {
          setUser(cachedUser);
          setProfile(cachedProfile);
          setRoles(cachedRoles);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading cached auth:', error);
        sessionStorage.removeItem('auth_cached');
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setRoles([]);
          setLoading(false);
          sessionStorage.removeItem('auth_cached');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRoles([]);
    sessionStorage.removeItem('auth_cached');
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, roles, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useRoleCheck = (requiredRole: AppRole) => {
  const { roles } = useAuth();
  return roles.includes(requiredRole) || roles.includes('admin');
};
