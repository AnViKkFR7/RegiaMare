import '../Privacy/Privacy.css';
import { useTranslation } from '../../utils/translations';
import type { Language } from '../../types';

interface LegalProps {
  language: Language;
}

export default function Legal({ language }: LegalProps) {
  const t = useTranslation(language);
  
  const content = {
    es: {
      intro: 'En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), Regia Mare Properties informa a los usuarios del presente sitio web de los siguientes datos:',
      sections: [
        {
          title: '1. Datos Identificativos',
          content: 'Titular: Regia Mare Properties\nNIF: B-12345678\nDomicilio Social: Sitges, Barcelona, España\nCorreo electrónico: info@regiamare.com\nTeléfono: +34 669 887 791\nInscrita en el Registro Mercantil de Barcelona'
        },
        {
          title: '2. Objeto',
          content: 'El presente aviso legal regula el uso del sitio web www.regiamare.com. La navegación por el sitio web atribuye la condición de usuario del mismo e implica la aceptación plena y sin reservas de todas las disposiciones incluidas en este Aviso Legal.\n\nRegia Mare Properties se reserva el derecho de modificar cualquier tipo de información que pudiera aparecer en el sitio web, sin que exista obligación de preavisar o poner en conocimiento de los usuarios dichas obligaciones.'
        },
        {
          title: '3. Servicios',
          content: 'A través de la web www.regiamare.com, Regia Mare Properties ofrece los siguientes servicios:\n\n• Intermediación en la compra, venta y alquiler de inmuebles\n• Asesoramiento inmobiliario personalizado\n• Valoración de propiedades\n• Gestión integral de propiedades\n• Servicios de home staging y fotografía\n• Tramitación documental y legal'
        },
        {
          title: '4. Responsabilidad',
          content: 'Regia Mare Properties no se hace responsable de:\n\n• La continuidad y disponibilidad de los contenidos\n• La ausencia de errores en dichos contenidos\n• La ausencia de virus y/o componentes dañinos\n• Los daños causados por el acceso y/o uso del sitio web\n• Los contenidos de sitios web de terceros enlazados\n\nRegia Mare Properties se reserva el derecho a suspender temporalmente el acceso al sitio web, sin previo aviso, para realizar operaciones de mantenimiento, reparación o mejora.'
        },
        {
          title: '5. Propiedad Intelectual e Industrial',
          content: 'Todos los contenidos del sitio web www.regiamare.com, incluyendo pero no limitándose a textos, fotografías, gráficos, imágenes, iconos, tecnología, software, diseño gráfico y códigos fuente, constituyen una obra cuya propiedad pertenece a Regia Mare Properties.\n\nQueda prohibida la reproducción, distribución, comunicación pública y transformación de estos elementos sin autorización expresa de Regia Mare Properties.\n\nEl uso no autorizado de la información contenida en esta web, así como la vulneración de los derechos de propiedad intelectual o industrial, dará lugar a las responsabilidades legalmente establecidas.'
        },
        {
          title: '6. Enlaces Externos',
          content: 'El sitio web puede contener enlaces a páginas web de terceros. Regia Mare Properties no asume ninguna responsabilidad por el contenido, información o servicios que pudieran aparecer en dichos sitios.\n\nLos enlaces tienen como finalidad únicamente informar al usuario sobre la existencia de otras fuentes de información sobre un tema concreto.'
        },
        {
          title: '7. Protección de Datos',
          content: 'Para más información sobre el tratamiento de datos personales, consulte nuestra Política de Privacidad.\n\nRegia Mare Properties cumple con el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, y la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales.'
        },
        {
          title: '8. Cookies',
          content: 'Este sitio web utiliza cookies. Para más información sobre su uso, consulte nuestra Política de Cookies.'
        },
        {
          title: '9. Legislación Aplicable y Jurisdicción',
          content: 'Las presentes condiciones se rigen por la legislación española. Para la resolución de cualquier controversia derivada del acceso o uso del sitio web, Regia Mare Properties y el usuario se someten expresamente a los Juzgados y Tribunales de Barcelona, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.'
        },
        {
          title: '10. Contacto',
          content: 'Para cualquier consulta relacionada con este Aviso Legal, puede contactar con nosotros a través de:\n\nEmail: info@regiamare.com\nTeléfono: +34 669 887 791\nDirección: Sitges, Barcelona, España'
        }
      ]
    },
    en: {
      intro: 'In compliance with Law 34/2002, of July 11, on Information Society Services and Electronic Commerce (LSSI-CE), Regia Mare Properties informs users of this website of the following data:',
      sections: [
        {
          title: '1. Identification Data',
          content: 'Owner: Regia Mare Properties\nTIN: B-12345678\nRegistered Office: Sitges, Barcelona, Spain\nEmail: info@regiamare.com\nPhone: +34 669 887 791\nRegistered in the Commercial Registry of Barcelona'
        },
        {
          title: '2. Purpose',
          content: 'This legal notice regulates the use of the website www.regiamare.com. Browsing the website grants the status of user and implies full and unreserved acceptance of all provisions included in this Legal Notice.\n\nRegia Mare Properties reserves the right to modify any type of information that may appear on the website, without any obligation to give prior notice or inform users of such obligations.'
        },
        {
          title: '3. Services',
          content: 'Through the website www.regiamare.com, Regia Mare Properties offers the following services:\n\n• Real estate brokerage for buying, selling and renting\n• Personalized real estate advice\n• Property valuation\n• Comprehensive property management\n• Home staging and photography services\n• Document and legal processing'
        },
        {
          title: '4. Liability',
          content: 'Regia Mare Properties is not responsible for:\n\n• Continuity and availability of content\n• Absence of errors in such content\n• Absence of viruses and/or harmful components\n• Damage caused by access and/or use of the website\n• Content of linked third-party websites\n\nRegia Mare Properties reserves the right to temporarily suspend access to the website, without prior notice, to perform maintenance, repair or improvement operations.'
        },
        {
          title: '5. Intellectual and Industrial Property',
          content: 'All contents of the website www.regiamare.com, including but not limited to texts, photographs, graphics, images, icons, technology, software, graphic design and source codes, constitute a work whose property belongs to Regia Mare Properties.\n\nReproduction, distribution, public communication and transformation of these elements without express authorization from Regia Mare Properties is prohibited.\n\nUnauthorized use of information contained on this website, as well as violation of intellectual or industrial property rights, will result in legally established responsibilities.'
        },
        {
          title: '6. External Links',
          content: 'The website may contain links to third-party web pages. Regia Mare Properties assumes no responsibility for the content, information or services that may appear on such sites.\n\nLinks are solely intended to inform users about the existence of other sources of information on a specific topic.'
        },
        {
          title: '7. Data Protection',
          content: 'For more information about personal data processing, see our Privacy Policy.\n\nRegia Mare Properties complies with Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016, and Organic Law 3/2018, of 5 December, on Personal Data Protection and guarantee of digital rights.'
        },
        {
          title: '8. Cookies',
          content: 'This website uses cookies. For more information about their use, see our Cookie Policy.'
        },
        {
          title: '9. Applicable Law and Jurisdiction',
          content: 'These conditions are governed by Spanish law. For the resolution of any dispute arising from access to or use of the website, Regia Mare Properties and the user expressly submit to the Courts and Tribunals of Barcelona, with express waiver of any other jurisdiction that may correspond to them.'
        },
        {
          title: '10. Contact',
          content: 'For any inquiries related to this Legal Notice, you can contact us through:\n\nEmail: info@regiamare.com\nPhone: +34 669 887 791\nAddress: Sitges, Barcelona, Spain'
        }
      ]
    },
    fr: {
      intro: 'Conformément à la loi 34/2002 du 11 juillet sur les services de la société de l\'information et le commerce électronique (LSSI-CE), Regia Mare Properties informe les utilisateurs de ce site web des données suivantes:',
      sections: [
        {
          title: '1. Données d\'Identification',
          content: 'Propriétaire: Regia Mare Properties\nNIF: B-12345678\nSiège social: Sitges, Barcelone, Espagne\nEmail: info@regiamare.com\nTéléphone: +34 669 887 791\nInscrit au Registre du Commerce de Barcelone'
        },
        {
          title: '2. Objet',
          content: 'La présente mention légale régit l\'utilisation du site web www.regiamare.com. La navigation sur le site web confère le statut d\'utilisateur et implique l\'acceptation pleine et entière de toutes les dispositions incluses dans cette Mention Légale.\n\nRegia Mare Properties se réserve le droit de modifier tout type d\'information pouvant apparaître sur le site web, sans obligation de préavis ou d\'informer les utilisateurs de ces obligations.'
        },
        {
          title: '3. Services',
          content: 'Via le site web www.regiamare.com, Regia Mare Properties offre les services suivants:\n\n• Intermédiation immobilière pour l\'achat, la vente et la location\n• Conseil immobilier personnalisé\n• Évaluation de propriétés\n• Gestion intégrale de propriétés\n• Services de home staging et photographie\n• Traitement documentaire et juridique'
        },
        {
          title: '4. Responsabilité',
          content: 'Regia Mare Properties n\'est pas responsable de:\n\n• La continuité et la disponibilité du contenu\n• L\'absence d\'erreurs dans ce contenu\n• L\'absence de virus et/ou composants nuisibles\n• Les dommages causés par l\'accès et/ou l\'utilisation du site web\n• Le contenu des sites web tiers liés\n\nRegia Mare Properties se réserve le droit de suspendre temporairement l\'accès au site web, sans préavis, pour effectuer des opérations de maintenance, de réparation ou d\'amélioration.'
        },
        {
          title: '5. Propriété Intellectuelle et Industrielle',
          content: 'Tous les contenus du site web www.regiamare.com, y compris mais sans s\'y limiter, textes, photographies, graphiques, images, icônes, technologie, logiciels, conception graphique et codes sources, constituent une œuvre dont la propriété appartient à Regia Mare Properties.\n\nLa reproduction, la distribution, la communication publique et la transformation de ces éléments sans autorisation expresse de Regia Mare Properties sont interdites.\n\nL\'utilisation non autorisée des informations contenues sur ce site web, ainsi que la violation des droits de propriété intellectuelle ou industrielle, donnera lieu aux responsabilités légalement établies.'
        },
        {
          title: '6. Liens Externes',
          content: 'Le site web peut contenir des liens vers des pages web tierces. Regia Mare Properties n\'assume aucune responsabilité pour le contenu, les informations ou les services pouvant apparaître sur ces sites.\n\nLes liens ont uniquement pour but d\'informer l\'utilisateur de l\'existence d\'autres sources d\'information sur un sujet spécifique.'
        },
        {
          title: '7. Protection des Données',
          content: 'Pour plus d\'informations sur le traitement des données personnelles, consultez notre Politique de Confidentialité.\n\nRegia Mare Properties se conforme au Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016, et à la Loi Organique 3/2018, du 5 décembre, sur la Protection des Données Personnelles et la garantie des droits numériques.'
        },
        {
          title: '8. Cookies',
          content: 'Ce site web utilise des cookies. Pour plus d\'informations sur leur utilisation, consultez notre Politique de Cookies.'
        },
        {
          title: '9. Législation Applicable et Juridiction',
          content: 'Ces conditions sont régies par la législation espagnole. Pour la résolution de tout litige découlant de l\'accès ou de l\'utilisation du site web, Regia Mare Properties et l\'utilisateur se soumettent expressément aux Tribunaux de Barcelone, avec renonciation expresse à toute autre juridiction pouvant leur correspondre.'
        },
        {
          title: '10. Contact',
          content: 'Pour toute question relative à cette Mention Légale, vous pouvez nous contacter via:\n\nEmail: info@regiamare.com\nTéléphone: +34 669 887 791\nAdresse: Sitges, Barcelone, Espagne'
        }
      ]
    }
  };

  const pageContent = content[language];
  
  return (
    <div className="legal-page">
      <section className="legal-hero">
        <div className="container">
          <h1>{t('legal.title')}</h1>
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
