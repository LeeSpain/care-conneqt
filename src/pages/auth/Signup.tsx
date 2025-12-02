import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Logo } from '@/components/Logo';

export default function Signup() {
  const { t, i18n } = useTranslation('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error(t('signup.passwordMismatch'));
      return;
    }

    if (password.length < 6) {
      toast.error(t('signup.passwordLength'));
      return;
    }

    setLoading(true);

    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
          language: i18n.language,
        },
      },
    });

    if (error) {
      toast.error(error.message);
    } else if (data.user) {
      // Assign member role
      await supabase.from('user_roles').insert({
        user_id: data.user.id,
        role: 'member',
      });

      toast.success(t('signup.success'));
      navigate('/onboarding');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="flex items-start justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">{t('backToHome')}</span>
            </Link>
            <LanguageSwitcher />
          </div>
          <div>
            <div className="mb-6">
              <Logo className="h-12" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">{t('signup.title')}</h2>
            <p className="mt-2 text-muted-foreground">{t('signup.subtitle')}</p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">{t('signup.firstName')}</Label>
                  <Input
                    id="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">{t('signup.lastName')}</Label>
                  <Input
                    id="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">{t('signup.email')}</Label>
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
                <Label htmlFor="password">{t('signup.password')}</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
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

              <div>
                <Label htmlFor="confirmPassword">{t('signup.confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('signup.creating') : t('signup.createAccount')}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {t('signup.haveAccount')}{' '}
            <Link to="/auth/login" className="font-medium text-primary hover:underline">
              {t('signup.signIn')}
            </Link>
          </p>
        </div>
      </div>
      
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary/20 to-primary/5">
        <div className="h-full flex items-center justify-center p-12">
          <div className="max-w-md">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {t('signup.sidebarTitle')}
            </h3>
            <p className="text-muted-foreground">
              {t('signup.sidebarDescription')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
