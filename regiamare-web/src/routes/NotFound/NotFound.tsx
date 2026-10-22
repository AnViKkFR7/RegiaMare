import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';
import { trackNotFound } from '../../lib/analytics';
import { useTranslation } from '../../utils/translations';
import type { Language } from '../../types';

interface NotFoundProps {
  language: Language;
}

export default function NotFound({ language }: NotFoundProps) {
  const t = useTranslation(language);

  useEffect(() => {
    trackNotFound();
  }, []);

  return (
    <div className="not-found-page">
      <div className="container">
        <h1>{t('notFound.title')}</h1>
        <p>{t('notFound.text')}</p>
        <Link to="/" className="not-found-link">{t('notFound.home')}</Link>
      </div>
    </div>
  );
}
