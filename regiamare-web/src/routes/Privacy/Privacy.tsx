import './Privacy.css';
import { useTranslation } from '../../utils/translations';
import type { Language } from '../../types';

interface PrivacyProps {
  language: Language;
}

export default function Privacy({ language }: PrivacyProps) {
  const t = useTranslation(language);
  
  const content = {
    es: {
      intro: 'En Regia Mare Properties, accesible desde www.regiamare.com, nos comprometemos a proteger su privacidad y cumplir con el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica de Protección de Datos (LOPD).',
      sections: [
        {
          title: '1. Responsable del Tratamiento',
          content: 'Regia Mare Properties\nCIF: B-12345678\nDirección: Sitges, Barcelona, España\nEmail: info@regiamare.com\nTeléfono: +34 669 887 791'
        },
        {
          title: '2. Datos que Recopilamos',
          content: 'Recopilamos los siguientes tipos de datos personales:\n\n• Datos de identificación: nombre, apellidos, DNI/NIE\n• Datos de contacto: dirección de correo electrónico, teléfono, dirección postal\n• Datos de navegación: dirección IP, cookies, datos de uso del sitio web\n• Datos inmobiliarios: preferencias de búsqueda, propiedades consultadas'
        },
        {
          title: '3. Finalidad del Tratamiento',
          content: 'Sus datos son tratados con las siguientes finalidades:\n\n• Gestionar consultas y solicitudes de información\n• Presentar propiedades que coincidan con sus preferencias\n• Tramitar procesos de compra, venta o alquiler\n• Enviar comunicaciones comerciales (con su consentimiento)\n• Cumplir con obligaciones legales\n• Análisis estadísticos para mejorar nuestros servicios'
        },
        {
          title: '4. Base Legal',
          content: 'El tratamiento de sus datos se basa en:\n\n• Ejecución de un contrato o medidas precontractuales\n• Consentimiento del interesado\n• Interés legítimo de Regia Mare Properties\n• Cumplimiento de obligaciones legales'
        },
        {
          title: '5. Conservación de Datos',
          content: 'Sus datos serán conservados:\n\n• Durante la relación comercial\n• Hasta 3 años tras la última interacción (consultas y presupuestos)\n• Hasta 10 años para datos fiscales y contables\n• Mientras no solicite su supresión o revoque el consentimiento'
        },
        {
          title: '6. Destinatarios',
          content: 'Sus datos pueden ser comunicados a:\n\n• Administraciones públicas cuando exista obligación legal\n• Asesores fiscales y jurídicos\n• Entidades financieras para la tramitación de operaciones\n• Proveedores de servicios tecnológicos (hosting, CRM, email marketing)'
        },
        {
          title: '7. Derechos del Usuario',
          content: 'Usted tiene derecho a:\n\n• Acceso: obtener información sobre sus datos personales\n• Rectificación: corregir datos inexactos o incompletos\n• Supresión: solicitar la eliminación de sus datos\n• Oposición: oponerse al tratamiento de sus datos\n• Limitación: solicitar la limitación del tratamiento\n• Portabilidad: recibir sus datos en formato estructurado\n• No ser objeto de decisiones automatizadas\n\nPara ejercer estos derechos, contacte con info@regiamare.com adjuntando copia de su DNI/NIE.'
        },
        {
          title: '8. Medidas de Seguridad',
          content: 'Hemos adoptado medidas técnicas y organizativas para proteger sus datos:\n\n• Cifrado SSL/TLS en todas las comunicaciones\n• Servidores seguros con copias de seguridad\n• Control de acceso mediante contraseñas robustas\n• Formación del personal en protección de datos\n• Auditorías de seguridad periódicas'
        },
        {
          title: '9. Transferencias Internacionales',
          content: 'Algunos de nuestros proveedores pueden estar ubicados fuera de la UE. En estos casos, garantizamos que se adoptan las medidas adecuadas conforme al RGPD (cláusulas tipo, Privacy Shield, etc.).'
        },
        {
          title: '10. Reclamaciones',
          content: 'Si considera que sus derechos no han sido atendidos correctamente, puede presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD):\n\nwww.aepd.es\nC/ Jorge Juan, 6\n28001 Madrid'
        }
      ]
    },
    en: {
      intro: 'At Regia Mare Properties, accessible from www.regiamare.com, we are committed to protecting your privacy and complying with the General Data Protection Regulation (GDPR).',
      sections: [
        {
          title: '1. Data Controller',
          content: 'Regia Mare Properties\nTIN: B-12345678\nAddress: Sitges, Barcelona, Spain\nEmail: info@regiamare.com\nPhone: +34 669 887 791'
        },
        {
          title: '2. Data We Collect',
          content: 'We collect the following types of personal data:\n\n• Identification data: name, surname, ID number\n• Contact data: email address, phone, postal address\n• Browsing data: IP address, cookies, website usage data\n• Real estate data: search preferences, properties viewed'
        },
        {
          title: '3. Purpose of Processing',
          content: 'Your data is processed for the following purposes:\n\n• Manage inquiries and information requests\n• Present properties matching your preferences\n• Process buying, selling or rental transactions\n• Send commercial communications (with your consent)\n• Comply with legal obligations\n• Statistical analysis to improve our services'
        },
        {
          title: '4. Legal Basis',
          content: 'Processing of your data is based on:\n\n• Performance of a contract or pre-contractual measures\n• Consent of the data subject\n• Legitimate interest of Regia Mare Properties\n• Compliance with legal obligations'
        },
        {
          title: '5. Data Retention',
          content: 'Your data will be retained:\n\n• During the business relationship\n• Up to 3 years after last interaction (inquiries and quotes)\n• Up to 10 years for fiscal and accounting data\n• Until you request deletion or withdraw consent'
        },
        {
          title: '6. Recipients',
          content: 'Your data may be communicated to:\n\n• Public administrations when legally required\n• Tax and legal advisors\n• Financial entities for transaction processing\n• Technology service providers (hosting, CRM, email marketing)'
        },
        {
          title: '7. User Rights',
          content: 'You have the right to:\n\n• Access: obtain information about your personal data\n• Rectification: correct inaccurate or incomplete data\n• Erasure: request deletion of your data\n• Object: oppose the processing of your data\n• Restriction: request limitation of processing\n• Portability: receive your data in structured format\n• Not be subject to automated decisions\n\nTo exercise these rights, contact info@regiamare.com attaching a copy of your ID.'
        },
        {
          title: '8. Security Measures',
          content: 'We have adopted technical and organizational measures to protect your data:\n\n• SSL/TLS encryption in all communications\n• Secure servers with backups\n• Access control with strong passwords\n• Staff training in data protection\n• Periodic security audits'
        },
        {
          title: '9. International Transfers',
          content: 'Some of our providers may be located outside the EU. In these cases, we ensure appropriate measures are adopted in accordance with GDPR (standard clauses, Privacy Shield, etc.).'
        },
        {
          title: '10. Complaints',
          content: 'If you believe your rights have not been properly addressed, you can file a complaint with the Spanish Data Protection Agency (AEPD):\n\nwww.aepd.es\nC/ Jorge Juan, 6\n28001 Madrid'
        }
      ]
    },
    fr: {
      intro: 'Chez Regia Mare Properties, accessible depuis www.regiamare.com, nous nous engageons à protéger votre vie privée et à respecter le Règlement Général sur la Protection des Données (RGPD).',
      sections: [
        {
          title: '1. Responsable du Traitement',
          content: 'Regia Mare Properties\nNIF: B-12345678\nAdresse: Sitges, Barcelone, Espagne\nEmail: info@regiamare.com\nTéléphone: +34 669 887 791'
        },
        {
          title: '2. Données que Nous Collectons',
          content: 'Nous collectons les types de données personnelles suivants:\n\n• Données d\'identification: nom, prénom, numéro d\'identité\n• Données de contact: adresse e-mail, téléphone, adresse postale\n• Données de navigation: adresse IP, cookies, données d\'utilisation du site\n• Données immobilières: préférences de recherche, propriétés consultées'
        },
        {
          title: '3. Finalité du Traitement',
          content: 'Vos données sont traitées aux fins suivantes:\n\n• Gérer les demandes et les demandes d\'information\n• Présenter des propriétés correspondant à vos préférences\n• Traiter les transactions d\'achat, de vente ou de location\n• Envoyer des communications commerciales (avec votre consentement)\n• Respecter les obligations légales\n• Analyses statistiques pour améliorer nos services'
        },
        {
          title: '4. Base Légale',
          content: 'Le traitement de vos données est basé sur:\n\n• Exécution d\'un contrat ou mesures précontractuelles\n• Consentement de la personne concernée\n• Intérêt légitime de Regia Mare Properties\n• Respect des obligations légales'
        },
        {
          title: '5. Conservation des Données',
          content: 'Vos données seront conservées:\n\n• Pendant la relation commerciale\n• Jusqu\'à 3 ans après la dernière interaction (demandes et devis)\n• Jusqu\'à 10 ans pour les données fiscales et comptables\n• Jusqu\'à ce que vous demandiez leur suppression ou retiriez votre consentement'
        },
        {
          title: '6. Destinataires',
          content: 'Vos données peuvent être communiquées à:\n\n• Administrations publiques en cas d\'obligation légale\n• Conseillers fiscaux et juridiques\n• Entités financières pour le traitement des transactions\n• Fournisseurs de services technologiques (hébergement, CRM, email marketing)'
        },
        {
          title: '7. Droits de l\'Utilisateur',
          content: 'Vous avez le droit de:\n\n• Accès: obtenir des informations sur vos données personnelles\n• Rectification: corriger les données inexactes ou incomplètes\n• Effacement: demander la suppression de vos données\n• Opposition: vous opposer au traitement de vos données\n• Limitation: demander la limitation du traitement\n• Portabilité: recevoir vos données dans un format structuré\n• Ne pas faire l\'objet de décisions automatisées\n\nPour exercer ces droits, contactez info@regiamare.com en joignant une copie de votre pièce d\'identité.'
        },
        {
          title: '8. Mesures de Sécurité',
          content: 'Nous avons adopté des mesures techniques et organisationnelles pour protéger vos données:\n\n• Chiffrement SSL/TLS dans toutes les communications\n• Serveurs sécurisés avec sauvegardes\n• Contrôle d\'accès avec mots de passe robustes\n• Formation du personnel à la protection des données\n• Audits de sécurité périodiques'
        },
        {
          title: '9. Transferts Internationaux',
          content: 'Certains de nos fournisseurs peuvent être situés en dehors de l\'UE. Dans ces cas, nous garantissons que des mesures appropriées sont adoptées conformément au RGPD (clauses types, Privacy Shield, etc.).'
        },
        {
          title: '10. Réclamations',
          content: 'Si vous estimez que vos droits n\'ont pas été correctement respectés, vous pouvez déposer une plainte auprès de l\'Agence Espagnole de Protection des Données (AEPD):\n\nwww.aepd.es\nC/ Jorge Juan, 6\n28001 Madrid'
        }
      ]
    }
  };

  const pageContent = content[language];
  
  return (
    <div className="legal-page">
      <section className="legal-hero">
        <div className="container">
          <h1>{t('privacy.title')}</h1>
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
