import { Link } from 'react-router-dom'
import { BRAND } from '../../lib/seo'
import type { Language } from '../../types'
import './LocalInfo.css'
export default function LocalInfo({ language }: { language: Language }) {
  const copy = {
    es: { title: 'Tu inmobiliaria en Sitges y Coma-ruga', intro: 'Regia Mare Properties acompaña a compradores y propietarios en la compra, venta y alquiler de inmuebles en Barcelona y la Costa Dorada.', offices: 'Nuestras oficinas', questions: 'Antes de comprar o vender', services: 'Conoce nuestros servicios',
      faq: [['¿Dónde puedo hablar con Regia Mare Properties?', 'Puedes visitarnos en nuestras oficinas de Sitges y Coma-ruga, llamarnos al +34 669 887 791 o escribir a info@regiamare.com.'], ['¿Cómo puedo consultar una vivienda?', 'Abre la ficha del inmueble para ver fotografías y características. Su formulario de contacto permite indicar al equipo qué propiedad te interesa.'], ['¿Cómo puedo solicitar ayuda para vender mi vivienda?', 'En la página Vender puedes enviar los datos de tu inmueble y solicitar asesoramiento para su valoración y comercialización.']], cta: 'Consultar la venta de mi vivienda' },
    en: { title: 'Your estate agency in Sitges and Coma-ruga', intro: 'Regia Mare Properties supports buyers and owners with buying, selling and renting property in Barcelona and Costa Dorada.', offices: 'Our offices', questions: 'Before buying or selling', services: 'Explore our services',
      faq: [['How can I contact Regia Mare Properties?', 'Visit our offices in Sitges and Coma-ruga, call +34 669 887 791 or email info@regiamare.com.'], ['How can I enquire about a property?', 'Open the property page to view its photos and features, then use its contact form to tell the team which property interests you.'], ['How can I get help selling my home?', 'The Sell page lets you send your property details and request advice about valuation and marketing.']], cta: 'Ask about selling my home' },
    fr: { title: 'Votre agence immobilière à Sitges et Coma-ruga', intro: 'Regia Mare Properties accompagne acheteurs et propriétaires dans l’achat, la vente et la location à Barcelone et sur la Costa Dorada.', offices: 'Nos bureaux', questions: 'Avant d’acheter ou de vendre', services: 'Découvrir nos services',
      faq: [['Comment contacter Regia Mare Properties ?', 'Rendez-vous dans nos bureaux de Sitges et Coma-ruga, appelez le +34 669 887 791 ou écrivez à info@regiamare.com.'], ['Comment demander des renseignements sur un bien ?', 'Ouvrez sa fiche pour consulter les photos et caractéristiques, puis utilisez le formulaire pour indiquer le bien qui vous intéresse.'], ['Comment demander de l’aide pour vendre mon logement ?', 'La page Vendre permet de transmettre les informations de votre bien et de demander conseil pour son estimation et sa commercialisation.']], cta: 'Parler de la vente de mon logement' },
  }[language]
  return <section className="local-info container">
    <h2>{copy.title}</h2><p>{copy.intro}</p><Link to="/services">{copy.services}</Link>
    <h3>{copy.offices}</h3><div className="local-offices">{BRAND.offices.map(office => <address key={office.name}>
      <strong>{office.name}</strong><br />{office.street}<br />{office.postcode} {office.locality} ({office.region})<br />
      <a href={`tel:${BRAND.phone.replaceAll(' ', '')}`}>{BRAND.phone}</a><br /><a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
    </address>)}</div>
    <h3>{copy.questions}</h3>{copy.faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
    <Link to="/sales">{copy.cta}</Link>
  </section>
}
