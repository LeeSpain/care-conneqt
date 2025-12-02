import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const NotFound = () => {
  const { t } = useTranslation('auth');

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">{t('notFound.title')}</h1>
        <p className="mb-4 text-xl text-muted-foreground">{t('notFound.message')}</p>
        <Link to="/" className="text-primary underline hover:text-primary/80">
          {t('notFound.returnHome')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;