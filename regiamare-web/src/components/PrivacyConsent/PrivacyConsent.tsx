import { Link } from 'react-router-dom';
import './PrivacyConsent.css';
import { useTranslation } from '../../utils/translations';
import type { Language } from '../../types';

interface PrivacyConsentProps {
  language: Language;
  id: string;
}

export default function PrivacyConsent({ language, id }: PrivacyConsentProps) {
  const t = useTranslation(language);

  return (
    <div className="privacy-consent">
      <input type="checkbox" id={id} name="privacy_accepted" />
      <label htmlFor={id}>
        {t('form.privacy.prefix')}{' '}
        {/* Nueva pestaña: así no se pierde lo ya escrito en el formulario */}
        <Link to="/privacy" target="_blank" rel="noopener noreferrer">
          {t('form.privacy.link')}
        </Link>
        {t('form.privacy.suffix')}
      </label>
    </div>
  );
}
