import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
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
  const initialFetchDone = useRef(false);
  const fetchInProgress = useRef<string | null>(null); // Prevent duplicate fetches

  const fetchProfile = async (userId: string) => {
    console.log('[fetchProfile] START - userId:', userId);
    
    // Prevent duplicate concurrent fetches
    if (fetchInProgress.current === userId) {
      console.log('[fetchProfile] SKIP - already fetching for this user');
      return;
    }
    
    fetchInProgress.current = userId;
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.error('[fetchProfile] TIMEOUT - forcing loading to false');
      setLoading(false);
      setRoles([]);
      fetchInProgress.current = null;
    }, 10000); // 10 second timeout

    try {
      console.log('[fetchProfile] Fetching profile and roles...');
      const [profileResult, rolesResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('user_roles').select('role').eq('user_id', userId)
      ]);

      clearTimeout(timeoutId);

      console.log('[fetchProfile] Profile result:', profileResult);
      console.log('[fetchProfile] Roles result:', rolesResult);

      if (profileResult.error) {
        console.error('[fetchProfile] Profile fetch error:', profileResult.error);
      }
      if (rolesResult.error) {
        console.error('[fetchProfile] Roles fetch error:', rolesResult.error);
      }

      const profileData = profileResult.data;
      const userRoles = rolesResult.data?.map(r => r.role as AppRole) || [];

      console.log('[fetchProfile] Processed - userRoles:', userRoles, 'profileData:', profileData);
      
      setProfile(profileData);
      setRoles(userRoles);
      console.log('[fetchProfile] State updated - roles set to:', userRoles);
      
      // Apply language preference
      if (profileData?.language && profileData.language !== i18n.language) {
        i18n.changeLanguage(profileData.language);
        localStorage.setItem('i18nextLng', profileData.language);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('[fetchProfile] CATCH block - error:', error);
      setRoles([]);
    } finally {
      console.log('[fetchProfile] FINALLY block - setting loading to false');
      setLoading(false);
      fetchInProgress.current = null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[onAuthStateChange] Event:', event, 'User:', session?.user?.email);
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('[onAuthStateChange] Deferring profile fetch for user:', session.user.id);
          setLoading(true);
          // Use setTimeout(0) to prevent Supabase deadlock
          setTimeout(() => {
            if (mounted) {
              fetchProfile(session.user.id);
            }
          }, 0);
        } else {
          console.log('[onAuthStateChange] No user - clearing state');
          setProfile(null);
          setRoles([]);
          setLoading(false);
        }
      }
    );

    // Get initial session - onAuthStateChange will handle the fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[getSession] Initial session:', session?.user?.email);
      if (!mounted) return;
      
      if (session?.user) {
        console.log('[getSession] Session found - will be handled by onAuthStateChange');
        initialFetchDone.current = true;
      } else {
        console.log('[getSession] No user found - setting loading false');
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
