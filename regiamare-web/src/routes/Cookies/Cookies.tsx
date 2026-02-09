import '../Privacy/Privacy.css';
import { useTranslation } from '../../utils/translations';
import type { Language } from '../../types';

interface CookiesProps {
  language: Language;
}

export default function Cookies({ language }: CookiesProps) {
  const t = useTranslation(language);
  
  const content = {
    es: {
      intro: 'En Regia Mare Properties utilizamos cookies y tecnologías similares para mejorar su experiencia de navegación, analizar el tráfico del sitio web y ofrecer contenido personalizado. Esta política explica qué son las cookies, qué tipos utilizamos y cómo puede gestionarlas.',
      sections: [
        {
          title: '1. ¿Qué son las Cookies?',
          content: 'Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (ordenador, tablet o móvil) cuando visita una página web. Las cookies permiten que el sitio web recuerde sus acciones y preferencias durante un período de tiempo, para que no tenga que volver a configurarlas cada vez que regrese al sitio o navegue de una página a otra.'
        },
        {
          title: '2. Tipos de Cookies que Utilizamos',
          content: 'COOKIES TÉCNICAS (Necesarias)\nEstas cookies son esenciales para el funcionamiento del sitio web y no pueden desactivarse. Incluyen:\n\n• Cookies de sesión: para mantener su sesión activa\n• Cookies de preferencias: para recordar sus preferencias de idioma\n• Cookies de seguridad: para proteger su información\n\nCOOKIES ANALÍTICAS\nNos ayudan a entender cómo los visitantes interactúan con nuestro sitio web:\n\n• Google Analytics: para analizar el tráfico y comportamiento de usuarios\n• Información recopilada: páginas visitadas, tiempo de permanencia, fuente de tráfico\n\nCOOKIES DE FUNCIONALIDAD\nPermiten funcionalidades mejoradas y personalizadas:\n\n• Recordar propiedades favoritas\n• Guardar criterios de búsqueda\n• Personalizar la experiencia de usuario\n\nCOOKIES PUBLICITARIAS (Con su consentimiento)\nSe utilizan para mostrar anuncios relevantes:\n\n• Google Ads: publicidad personalizada\n• Facebook Pixel: remarketing y medición de conversiones\n• Redes sociales: integración con plataformas sociales'
        },
        {
          title: '3. Finalidad de las Cookies',
          content: 'Utilizamos cookies para:\n\n• Garantizar el correcto funcionamiento del sitio web\n• Recordar sus preferencias (idioma, búsquedas guardadas)\n• Analizar el uso del sitio para mejorarlo\n• Medir la efectividad de nuestras campañas publicitarias\n• Personalizar el contenido según sus intereses\n• Ofrecer funcionalidades de redes sociales'
        },
        {
          title: '4. Cookies de Terceros',
          content: 'Algunos de nuestros socios también colocan cookies en su dispositivo cuando visita nuestro sitio:\n\n• Google Analytics: análisis estadístico\n• Google Ads: publicidad\n• Facebook: integración social y publicidad\n• YouTube: reproducción de vídeos\n\nEstas empresas tienen sus propias políticas de privacidad independientes de Regia Mare Properties.'
        },
        {
          title: '5. Duración de las Cookies',
          content: 'COOKIES DE SESIÓN\n• Se eliminan cuando cierra el navegador\n• Duración: temporal\n\nCOOKIES PERSISTENTES\n• Permanecen en su dispositivo durante un tiempo determinado\n• Duración: desde 30 días hasta 2 años, dependiendo del tipo\n• Se pueden eliminar manualmente en cualquier momento'
        },
        {
          title: '6. Cómo Gestionar las Cookies',
          content: 'PANEL DE CONFIGURACIÓN\nPuede configurar sus preferencias de cookies mediante nuestro panel de configuración que aparece al visitar el sitio por primera vez, o accediendo desde el footer de la web.\n\nCONFIGURACIÓN DEL NAVEGADOR\nPuede bloquear o eliminar cookies desde la configuración de su navegador:\n\n• Chrome: Configuración > Privacidad y seguridad > Cookies\n• Firefox: Opciones > Privacidad y seguridad > Cookies\n• Safari: Preferencias > Privacidad > Cookies\n• Edge: Configuración > Privacidad > Cookies\n\nTenga en cuenta que deshabilitar las cookies puede afectar la funcionalidad del sitio web.'
        },
        {
          title: '7. Cookies en Dispositivos Móviles',
          content: 'Los dispositivos móviles también permiten controlar las cookies:\n\n• iOS: Ajustes > Safari > Bloquear cookies\n• Android: Ajustes > Privacidad > Borrar datos de navegación\n\nTambién puede gestionar cookies desde las aplicaciones de los navegadores móviles.'
        },
        {
          title: '8. Consentimiento',
          content: 'Al acceder a nuestro sitio web, se le mostrará un banner informativo sobre el uso de cookies. Puede:\n\n• Aceptar todas las cookies\n• Rechazar cookies no esenciales\n• Configurar sus preferencias\n\nSu consentimiento es válido durante 12 meses, tras los cuales se le volverá a solicitar.'
        },
        {
          title: '9. Revocación del Consentimiento',
          content: 'Puede revocar su consentimiento en cualquier momento:\n\n• Accediendo al panel de configuración de cookies desde el footer\n• Eliminando las cookies desde su navegador\n• Contactando con info@regiamare.com'
        },
        {
          title: '10. Actualizaciones de esta Política',
          content: 'Podemos actualizar esta Política de Cookies para reflejar cambios en nuestras prácticas o por motivos legales. Le notificaremos de cualquier cambio significativo mediante un aviso destacado en nuestro sitio web.\n\nÚltima actualización: 09/02/2026'
        },
        {
          title: '11. Más Información',
          content: 'Para más información sobre cookies:\n\n• Agencia Española de Protección de Datos: www.aepd.es\n• Guía sobre el uso de cookies: www.aepd.es/guias\n• Your Online Choices: www.youronlinechoices.eu\n\nPara consultas específicas sobre nuestra Política de Cookies:\nEmail: info@regiamare.com\nTeléfono: +34 669 887 791'
        }
      ]
    },
    en: {
      intro: 'At Regia Mare Properties, we use cookies and similar technologies to improve your browsing experience, analyze website traffic and offer personalized content. This policy explains what cookies are, what types we use and how you can manage them.',
      sections: [
        {
          title: '1. What are Cookies?',
          content: 'Cookies are small text files stored on your device (computer, tablet or mobile) when you visit a website. Cookies allow the site to remember your actions and preferences over a period of time, so you don\'t have to reconfigure them each time you return to the site or browse from page to page.'
        },
        {
          title: '2. Types of Cookies We Use',
          content: 'TECHNICAL COOKIES (Necessary)\nThese cookies are essential for the website to function and cannot be disabled. They include:\n\n• Session cookies: to maintain your active session\n• Preference cookies: to remember your language preferences\n• Security cookies: to protect your information\n\nANALYTICAL COOKIES\nHelp us understand how visitors interact with our website:\n\n• Google Analytics: to analyze traffic and user behavior\n• Information collected: pages visited, time spent, traffic source\n\nFUNCTIONALITY COOKIES\nEnable enhanced and personalized functionalities:\n\n• Remember favorite properties\n• Save search criteria\n• Personalize user experience\n\nADVERTISING COOKIES (With your consent)\nUsed to display relevant ads:\n\n• Google Ads: personalized advertising\n• Facebook Pixel: remarketing and conversion measurement\n• Social networks: integration with social platforms'
        },
        {
          title: '3. Purpose of Cookies',
          content: 'We use cookies to:\n\n• Ensure proper website functioning\n• Remember your preferences (language, saved searches)\n• Analyze site usage to improve it\n• Measure effectiveness of our advertising campaigns\n• Personalize content according to your interests\n• Offer social media functionalities'
        },
        {
          title: '4. Third-Party Cookies',
          content: 'Some of our partners also place cookies on your device when you visit our site:\n\n• Google Analytics: statistical analysis\n• Google Ads: advertising\n• Facebook: social integration and advertising\n• YouTube: video playback\n\nThese companies have their own privacy policies independent of Regia Mare Properties.'
        },
        {
          title: '5. Cookie Duration',
          content: 'SESSION COOKIES\n• Deleted when you close the browser\n• Duration: temporary\n\nPERSISTENT COOKIES\n• Remain on your device for a specified time\n• Duration: from 30 days to 2 years, depending on type\n• Can be manually deleted at any time'
        },
        {
          title: '6. How to Manage Cookies',
          content: 'CONFIGURATION PANEL\nYou can configure your cookie preferences through our configuration panel that appears when you first visit the site, or by accessing it from the website footer.\n\nBROWSER SETTINGS\nYou can block or delete cookies from your browser settings:\n\n• Chrome: Settings > Privacy and security > Cookies\n• Firefox: Options > Privacy and security > Cookies\n• Safari: Preferences > Privacy > Cookies\n• Edge: Settings > Privacy > Cookies\n\nPlease note that disabling cookies may affect website functionality.'
        },
        {
          title: '7. Cookies on Mobile Devices',
          content: 'Mobile devices also allow cookie control:\n\n• iOS: Settings > Safari > Block cookies\n• Android: Settings > Privacy > Clear browsing data\n\nYou can also manage cookies from mobile browser applications.'
        },
        {
          title: '8. Consent',
          content: 'When accessing our website, you will be shown an informative banner about cookie use. You can:\n\n• Accept all cookies\n• Reject non-essential cookies\n• Configure your preferences\n\nYour consent is valid for 12 months, after which you will be asked again.'
        },
        {
          title: '9. Consent Revocation',
          content: 'You can revoke your consent at any time:\n\n• Accessing the cookie configuration panel from the footer\n• Deleting cookies from your browser\n• Contacting info@regiamare.com'
        },
        {
          title: '10. Updates to this Policy',
          content: 'We may update this Cookie Policy to reflect changes in our practices or for legal reasons. We will notify you of any significant changes through a prominent notice on our website.\n\nLast updated: 09/02/2026'
        },
        {
          title: '11. More Information',
          content: 'For more information about cookies:\n\n• Spanish Data Protection Agency: www.aepd.es\n• Cookie usage guide: www.aepd.es/guias\n• Your Online Choices: www.youronlinechoices.eu\n\nFor specific inquiries about our Cookie Policy:\nEmail: info@regiamare.com\nPhone: +34 669 887 791'
        }
      ]
    },
    fr: {
      intro: 'Chez Regia Mare Properties, nous utilisons des cookies et des technologies similaires pour améliorer votre expérience de navigation, analyser le trafic du site web et offrir du contenu personnalisé. Cette politique explique ce que sont les cookies, quels types nous utilisons et comment vous pouvez les gérer.',
      sections: [
        {
          title: '1. Que sont les Cookies?',
          content: 'Les cookies sont de petits fichiers texte stockés sur votre appareil (ordinateur, tablette ou mobile) lorsque vous visitez un site web. Les cookies permettent au site de se souvenir de vos actions et préférences pendant une période de temps, afin que vous n\'ayez pas à les reconfigurer à chaque fois que vous revenez sur le site ou naviguez d\'une page à l\'autre.'
        },
        {
          title: '2. Types de Cookies que Nous Utilisons',
          content: 'COOKIES TECHNIQUES (Nécessaires)\nCes cookies sont essentiels au fonctionnement du site et ne peuvent être désactivés. Ils incluent:\n\n• Cookies de session: pour maintenir votre session active\n• Cookies de préférences: pour mémoriser vos préférences linguistiques\n• Cookies de sécurité: pour protéger vos informations\n\nCOOKIES ANALYTIQUES\nNous aident à comprendre comment les visiteurs interagissent avec notre site:\n\n• Google Analytics: pour analyser le trafic et le comportement des utilisateurs\n• Informations collectées: pages visitées, temps passé, source du trafic\n\nCOOKIES DE FONCTIONNALITÉ\nPermettent des fonctionnalités améliorées et personnalisées:\n\n• Mémoriser les propriétés favorites\n• Enregistrer les critères de recherche\n• Personnaliser l\'expérience utilisateur\n\nCOOKIES PUBLICITAIRES (Avec votre consentement)\nUtilisés pour afficher des annonces pertinentes:\n\n• Google Ads: publicité personnalisée\n• Facebook Pixel: remarketing et mesure des conversions\n• Réseaux sociaux: intégration avec les plateformes sociales'
        },
        {
          title: '3. Finalité des Cookies',
          content: 'Nous utilisons des cookies pour:\n\n• Garantir le bon fonctionnement du site\n• Mémoriser vos préférences (langue, recherches sauvegardées)\n• Analyser l\'utilisation du site pour l\'améliorer\n• Mesurer l\'efficacité de nos campagnes publicitaires\n• Personnaliser le contenu selon vos intérêts\n• Offrir des fonctionnalités de réseaux sociaux'
        },
        {
          title: '4. Cookies de Tiers',
          content: 'Certains de nos partenaires placent également des cookies sur votre appareil lorsque vous visitez notre site:\n\n• Google Analytics: analyse statistique\n• Google Ads: publicité\n• Facebook: intégration sociale et publicité\n• YouTube: lecture de vidéos\n\nCes entreprises ont leurs propres politiques de confidentialité indépendantes de Regia Mare Properties.'
        },
        {
          title: '5. Durée des Cookies',
          content: 'COOKIES DE SESSION\n• Supprimés lorsque vous fermez le navigateur\n• Durée: temporaire\n\nCOOKIES PERSISTANTS\n• Restent sur votre appareil pendant une durée déterminée\n• Durée: de 30 jours à 2 ans, selon le type\n• Peuvent être supprimés manuellement à tout moment'
        },
        {
          title: '6. Comment Gérer les Cookies',
          content: 'PANNEAU DE CONFIGURATION\nVous pouvez configurer vos préférences de cookies via notre panneau de configuration qui apparaît lors de votre première visite du site, ou en y accédant depuis le pied de page du site.\n\nPARAMÈTRES DU NAVIGATEUR\nVous pouvez bloquer ou supprimer les cookies depuis les paramètres de votre navigateur:\n\n• Chrome: Paramètres > Confidentialité et sécurité > Cookies\n• Firefox: Options > Confidentialité et sécurité > Cookies\n• Safari: Préférences > Confidentialité > Cookies\n• Edge: Paramètres > Confidentialité > Cookies\n\nVeuillez noter que la désactivation des cookies peut affecter la fonctionnalité du site.'
        },
        {
          title: '7. Cookies sur Appareils Mobiles',
          content: 'Les appareils mobiles permettent également de contrôler les cookies:\n\n• iOS: Réglages > Safari > Bloquer les cookies\n• Android: Paramètres > Confidentialité > Effacer les données de navigation\n\nVous pouvez également gérer les cookies depuis les applications de navigateurs mobiles.'
        },
        {
          title: '8. Consentement',
          content: 'Lors de l\'accès à notre site web, une bannière informative sur l\'utilisation des cookies vous sera présentée. Vous pouvez:\n\n• Accepter tous les cookies\n• Refuser les cookies non essentiels\n• Configurer vos préférences\n\nVotre consentement est valable pendant 12 mois, après quoi il vous sera redemandé.'
        },
        {
          title: '9. Révocation du Consentement',
          content: 'Vous pouvez révoquer votre consentement à tout moment:\n\n• En accédant au panneau de configuration des cookies depuis le pied de page\n• En supprimant les cookies depuis votre navigateur\n• En contactant info@regiamare.com'
        },
        {
          title: '10. Mises à Jour de cette Politique',
          content: 'Nous pouvons mettre à jour cette Politique de Cookies pour refléter des changements dans nos pratiques ou pour des raisons légales. Nous vous informerons de tout changement significatif par un avis visible sur notre site web.\n\nDernière mise à jour: 09/02/2026'
        },
        {
          title: '11. Plus d\'Informations',
          content: 'Pour plus d\'informations sur les cookies:\n\n• Agence Espagnole de Protection des Données: www.aepd.es\n• Guide sur l\'utilisation des cookies: www.aepd.es/guias\n• Your Online Choices: www.youronlinechoices.eu\n\nPour des questions spécifiques sur notre Politique de Cookies:\nEmail: info@regiamare.com\nTéléphone: +34 669 887 791'
        }
      ]
    }
  };

  const pageContent = content[language];
  
  return (
    <div className="legal-page">
      <section className="legal-hero">
        <div className="container">
          <h1>{t('cookiesPolicy.title')}</h1>
          <p className="legal-date">{t('privacy.updated')}: 09/02/2026</p>
        </div>
      </section>

      <section className="legal-content">
        <div className="container">
          <div className="legal-text">
            <p className="legal-intro">{pageContent.intro}</p>

            {pageContent.sections.map((section, index) => (
              <div key={index} className="legal-section">
                <h2>{section.title}</h2>
                <p style={{ whiteSpace: 'pre-line' }}>{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
