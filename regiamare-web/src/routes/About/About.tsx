import './About.css';
import type { Language } from '../../types';

interface AboutProps {
  language: Language;
}

export default function About(_props: AboutProps) {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1>Quiénes somos</h1>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-text">
            <p className="about-lead">
              En Regia Mare Properties apostamos por un asesoramiento a medida y cercano, porque entendemos 
              que cada familia, cada persona y cada vivienda es un mundo, y no se puede abordar cada caso 
              de la misma manera.
            </p>

            <p>
              Con una sólida experiencia en gestión inmobiliaria fruto de nuestras asesorías en la costa, 
              ofrecemos también un servicio de venta premium en portales nacionales e internacionales, 
              garantizando un amplio abanico de compradores y la estructura profesional necesaria para 
              gestionar cada operación con eficiencia y rigor.
            </p>

            <p>
              Además, acompañamos y asesoramos a compradores nacionales e internacionales gracias a nuestro 
              equipo de abogados, brokers y gestores. Junto a ellos, guiamos al cliente en la etapa de 
              preparación, durante el proceso de compra y en todo lo relacionado con la adaptación de la 
              vivienda y la postventa, asegurándonos de que no quede ningún cabo suelto.
            </p>
          </div>

          <div className="about-values">
            <h2>Nuestros valores</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <h3>Cercanía</h3>
                <p>Trato personalizado y humano en cada interacción</p>
              </div>

              <div className="value-card">
                <div className="value-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3>Profesionalidad</h3>
                <p>Experiencia y estructura para garantizar el éxito</p>
              </div>

              <div className="value-card">
                <div className="value-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                </div>
                <h3>Compromiso</h3>
                <p>Dedicación total hasta alcanzar sus objetivos</p>
              </div>

              <div className="value-card">
                <div className="value-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <h3>Transparencia</h3>
                <p>Información clara en todo momento</p>
              </div>
            </div>
          </div>

          <div className="about-cta">
            <h2>¿Hablamos?</h2>
            <p>
              Estamos aquí para ayudarle a encontrar la propiedad de sus sueños o vender su inmueble 
              al mejor precio. Contáctenos y descubra la diferencia del servicio Regia Mare.
            </p>
            <div className="about-contact">
              <a href="mailto:info@regiamare.com" className="contact-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                info@regiamare.com
              </a>
              <a href="tel:+34900000000" className="contact-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                +34 900 000 000
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
