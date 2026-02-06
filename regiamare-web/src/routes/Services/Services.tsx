import './Services.css';
import { useTranslation } from '../../utils/translations';
import type { Language } from '../../types';
import { mockServices } from '../../utils/mockData';

interface ServicesProps {
  language: Language;
}

export default function Services({ language }: ServicesProps) {
  const t = useTranslation(language);

  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="container">
          <h1>{t('services.title')}</h1>
          <p>Un servicio completo y personalizado para todas sus necesidades inmobiliarias</p>
        </div>
      </section>

      <section className="services-grid-section">
        <div className="container">
          <div className="services-grid">
            {mockServices.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="services-detail-section">
        <div className="container">
          <div className="services-detail">
            <h2>Un enfoque integral</h2>
            <p>
              En Regia Mare Properties, no solo vendemos propiedades. Ofrecemos una experiencia completa 
              que abarca desde la primera consulta hasta el seguimiento post-venta. Nuestro equipo de 
              profesionales especializados trabaja de manera coordinada para asegurar que cada transacción 
              se realice con la máxima eficiencia y transparencia.
            </p>
            <p>
              Contamos con un equipo de abogados, brokers y gestores que acompañan a nuestros clientes 
              internacionales en cada etapa del proceso, asegurando que no quede ningún cabo suelto.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
