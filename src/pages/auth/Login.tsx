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
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Login() {
  const { t } = useTranslation('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Removed redirect useEffect - now handled in handleLogin

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t('login.success'));
      // Navigate will happen via auth state change
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="flex items-start justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Home</span>
            </Link>
            <LanguageSwitcher />
          </div>
          <div>
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

            {/* Test Credentials Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" className="w-full">
                  <Info className="h-4 w-4 mr-2" />
                  View Test Credentials
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Test Credentials - All Roles</DialogTitle>
                  <DialogDescription>
                    Use these credentials to test different user roles. Create accounts via signup if they don't exist yet.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 mt-4">
                  <div className="bg-secondary/50 p-3 rounded-lg">
                    <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                      Admin Account
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">admin@test.com</p>
                    <p className="font-mono text-xs text-muted-foreground">Admin123!</p>
                  </div>
                  
                  <div className="bg-secondary/50 p-3 rounded-lg">
                    <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      Facility Admin
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">facility@test.com</p>
                    <p className="font-mono text-xs text-muted-foreground">Facility123!</p>
                  </div>
                  
                  <div className="bg-secondary/50 p-3 rounded-lg">
                    <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      Nurse Account
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">nurse@test.com</p>
                    <p className="font-mono text-xs text-muted-foreground">Nurse123!</p>
                  </div>
                  
                  <div className="bg-secondary/50 p-3 rounded-lg">
                    <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                      Family Carer
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">family@test.com</p>
                    <p className="font-mono text-xs text-muted-foreground">Family123!</p>
                  </div>
                  
                  <div className="bg-secondary/50 p-3 rounded-lg">
                    <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-pink-500"></span>
                      Member Account
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">member@test.com</p>
                    <p className="font-mono text-xs text-muted-foreground">Member123!</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </form>

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
