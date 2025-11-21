import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Info, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function Login() {
  const { t } = useTranslation('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Only redirect once we have user AND roles are loaded
    if (user && !authLoading) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t('login.success'));
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Home</span>
            </Link>
            <div className="mb-6">
              <Logo className="h-12" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">{t('login.title')}</h2>
            <p className="mt-2 text-muted-foreground">{t('login.subtitle')}</p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">{t('login.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="password">{t('login.password')}</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline">
                {t('login.forgotPassword')}
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('login.signingIn') : t('login.signIn')}
            </Button>
          </form>

          {/* Test Credentials Panel */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-2 mb-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-2">
                  Test Credentials
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="bg-white dark:bg-blue-900 p-2 rounded">
                    <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Member Account:</p>
                    <p className="font-mono text-xs text-blue-800 dark:text-blue-200">member@test.com</p>
                    <p className="font-mono text-xs text-blue-800 dark:text-blue-200">Member123!</p>
                  </div>
                  <div className="bg-white dark:bg-blue-900 p-2 rounded">
                    <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Nurse Account:</p>
                    <p className="font-mono text-xs text-blue-800 dark:text-blue-200">nurse@test.com</p>
                    <p className="font-mono text-xs text-blue-800 dark:text-blue-200">Nurse123!</p>
                  </div>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                  Create these accounts via signup if they don't exist yet
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {t('login.noAccount')}{' '}
            <Link to="/auth/signup" className="font-medium text-primary hover:underline">
              {t('login.signUp')}
            </Link>
          </p>
        </div>
      </div>
      
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary/20 to-primary/5">
        <div className="h-full flex items-center justify-center p-12">
          <div className="max-w-md">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {t('login.sidebarTitle')}
            </h3>
            <p className="text-muted-foreground">
              {t('login.sidebarDescription')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
