import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const { t } = useTranslation('auth');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t('forgotPassword.emailSent'));
      setSent(true);
    }
    
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">{t('forgotPassword.checkEmail')}</h2>
          <p className="text-muted-foreground">
            {t('forgotPassword.sentTo')} <strong>{email}</strong>
          </p>
          <Link to="/auth/login">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('forgotPassword.backToLogin')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link to="/auth/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('forgotPassword.backToLogin')}
          </Link>
          <h2 className="text-3xl font-bold text-foreground">{t('forgotPassword.title')}</h2>
          <p className="mt-2 text-muted-foreground">
            {t('forgotPassword.subtitle')}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleReset}>
          <div>
            <Label htmlFor="email">{t('forgotPassword.email')}</Label>
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('forgotPassword.sending') : t('forgotPassword.sendButton')}
          </Button>
        </form>
      </div>
    </div>
  );
}
