import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Landing from './routes/Landing/Landing';
import Services from './routes/Services/Services';
import Purchases from './routes/Purchases/Purchases';
import Sales from './routes/Sales/Sales';
import About from './routes/About/About';
import PropertyDetail from './routes/PropertyDetail/PropertyDetail';
import type { Language } from './types';
import './styles/globals.css';
import './App.css';

function App() {
  const [language, setLanguage] = useState<Language>('es');

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <Router>
      <div className="app">
        <Header language={language} onLanguageChange={handleLanguageChange} />
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Landing language={language} />} />
            <Route path="/services" element={<Services language={language} />} />
            <Route path="/purchases" element={<Purchases language={language} />} />
            <Route path="/property/:id" element={<PropertyDetail language={language} />} />
            <Route path="/sales" element={<Sales language={language} />} />
            <Route path="/about" element={<About language={language} />} />
          </Routes>
        </main>

        <Footer language={language} />
      </div>
    </Router>
  );
}

export default App;
