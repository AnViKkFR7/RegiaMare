# Regia Mare Properties — Project Specification for Copilot

## 🎯 Project Goal

Create a modern, premium real estate SPA web application for a new luxury-oriented real estate company called **Regia Mare Properties**.

The target audience is middle-high purchasing power clients, therefore:

* Design must transmit professionalism, elegance, innovation and exclusivity.
* Minimalist but visually impactful.
* Large imagery of properties must be the main focus.
* Brand colors and typography must drive the UI design.

---

# 🧱 Tech Stack (MANDATORY)

Initialize a project using:

* React
* Vite
* Remix architecture (routing + loaders/actions philosophy)
* TypeScript
* SPA architecture (client-driven navigation)
* Supabase (database + API layer)

IMPORTANT:

* Structure routing following Remix conventions.
* Use modern React patterns (functional components, hooks).
* Avoid class components.

---

# 📁 External Resources

## Database

Supabase is used as backend.

Database schemas are provided:

* `DB_SCHMEA.sql` → main data model
* `RegiaMare.sql` → attribute_values model

Copilot must:

* Read schemas conceptually.
* Generate typed models/interfaces in TypeScript.
* Create Supabase client service layer.

Expected architecture:

```
/src
  /services
     supabaseClient.ts
     propertyService.ts
```

---

## 🎨 Branding

Branding assets are located in:

```
/Regiamare Branding
```

### Logos

SVG logos:

```
/Regiamare Branding/LOGOS/SVG
```

Types:

* primary
* secondary
* alternative
* favicon

Use SVG only.

---

### Brand Guide

```
/Regiamare Branding/Brand Guide_RegiaMare_2025.pdf
```

Must extract:

* brand description text
* design inspiration

---

### Color Palette

Mandatory colors:

```
#e2d6c9
#74342b
#66706d
#391212
```

Create global theme variables.

---

### Typography

Titles:

```
/Regiamare Branding/CARLA SANS
```

Body text:

```
/Regiamare Branding/BE VIETNAM
```

Configure via CSS or Tailwind (if used).

---

# 🧩 UX/UI Design Guidelines

Design principles:

* Premium real estate aesthetic.
* Minimal UI.
* High whitespace usage.
* Large property images.
* Smooth animations.
* Elegant typography hierarchy.
* Modern layout grid.

Avoid:

* clutter
* excessive colors
* small images

---

# 🗂 Application Structure

Create scalable folder architecture:

```
/src
   /components
   /pages
   /layouts
   /services
   /types
   /hooks
   /styles
```

---

# Translations:

* Spanish
* English
* French

---

# 🧭 Navigation Structure (Pages)

## 1️⃣ Landing Page

Must include:

* Brand logo.
* Brand description extracted from branding PDF.
* Featured properties section.

Featured properties:

* Query Supabase.
* Select ONLY the 2 most expensive properties.
* Display as premium cards.

Include CTA button:

"Buscar viviendas"

This navigates to:

→ Purchases page.

---

## 2️⃣ Services Page

Display service cards:

* Gestión integral de venta
* Valoración profesional
* Home staging y fotografía premium
* Gestión de alquileres
* Asesoramiento a compradores internacionales
* Tramitación documental y legal

Design:

* Elegant grid layout.
* Icon + title + short description.

---

## 3️⃣ Purchases Page (Property Portfolio)

Purpose:

Display available properties.

Initial grouping:

Properties divided by zones:

* Barcelona
* Sitges
* St Pere de Ribes
* Vilanova

Zone must be obtained from:

item_attribute inside database model.

Filters required:

* Price range
* Number of bedrooms
* Property type

Use dynamic filtering without page reload.

---

## 4️⃣ Sales Page (Sell Your Property)

Page goal:

Lead generation.

Content:

* Premium section encouraging owners to sell.
* Contact form.

Form fields:

* Name
* Email
* Phone
* Message

CTA:

"Solicitar valoración gratuita"

Submit form to Supabase or email endpoint.

---

## 5️⃣ About Us Page

Text content:

"Quienes somos :

En Regia Mare Properties apostamos por un asesoramiento a medida y cercano, porque entendemos que cada familia, cada persona y cada vivienda es un mundo, y no se puede abordar cada caso de la misma manera.

Con una sólida experiencia en gestión inmobiliaria fruto de nuestras asesorías en la costa, ofrecemos también un servicio de venta premium en portales nacionales e internacionales, garantizando un amplio abanico de compradores y la estructura profesional necesaria para gestionar cada operación con eficiencia y rigor.

Además, acompañamos y asesoramos a compradores nacionales e internacionales gracias a nuestro equipo de abogados, brokers y gestores. Junto a ellos, guiamos al cliente en la etapa de preparación, durante el proceso de compra y en todo lo relacionado con la adaptación de la vivienda y la postventa, asegurándonos de que no quede ningún cabo suelto."

---

# 🧠 Data Architecture Notes

attribute_values model:

* Used for dynamic attributes (zones, features, etc).
* Must be mapped into flexible filtering logic.

---

# 🚀 Extra Requirements

* Responsive design (mobile-first).
* Smooth transitions.
* SEO-friendly structure.
* Lazy loading images.
* Clean modern code.

---

# 🎯 Final Goal

Copilot must generate:

* Complete SPA base.
* Working navigation.
* Supabase integration.
* Branding-ready UI.
* Expandable architecture for future scaling.
