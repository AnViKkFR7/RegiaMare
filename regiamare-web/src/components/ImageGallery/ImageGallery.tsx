import { useState } from 'react';
import './ImageGallery.css';
import type { ItemMedia, Language } from '../../types';
import { useTranslation } from '../../utils/translations';

interface ImageGalleryProps {
  images: ItemMedia[];
  propertyTitle: string;
  language: Language;
}

export default function ImageGallery({ images, propertyTitle, language }: ImageGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const t = useTranslation(language);

  if (images.length === 0) {
    return null;
  }

  const mainImage = images[0];
  const sideImages = images.slice(1, 4); // Show up to 3 side images
  const hasMoreImages = images.length > 4;

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="image-gallery">
        {/* Main Image - Left side (2/3) */}
        <div className="gallery-main-image" onClick={() => openModal(0)}>
          <img src={mainImage.url} alt={mainImage.alt_text || propertyTitle} />
        </div>

        {/* Side Images - Right side (1/3) */}
        <div className="gallery-side-images">
          {sideImages.map((image, index) => {
            const isLast = index === sideImages.length - 1;
            const imageIndex = index + 1;
            
            return (
              <div
                key={image.id}
                className={`gallery-side-image ${isLast ? 'last-image' : ''}`}
                onClick={() => openModal(imageIndex)}
              >
                <img src={image.url} alt={image.alt_text || `${propertyTitle} ${imageIndex + 1}`} />
                
                {/* Overlay on last image if there are more */}
                {isLast && hasMoreImages && (
                  <div className="view-more-overlay">
                    <span className="view-more-text">{t('gallery.viewMore')}</span>
                    <span className="view-more-count">+{images.length - 4}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal with Carousel */}
      {isModalOpen && (
        <div className="image-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>

            {/* Main Image Display */}
            <div className="modal-image-container">
              <button className="modal-nav modal-prev" onClick={prevImage}>
                ‹
              </button>
              
              <img
                src={images[selectedImageIndex].url}
                alt={images[selectedImageIndex].alt_text || propertyTitle}
                className="modal-main-image"
              />
              
              <button className="modal-nav modal-next" onClick={nextImage}>
                ›
              </button>
            </div>

            {/* Image Counter */}
            <div className="modal-counter">
              {selectedImageIndex + 1} / {images.length}
            </div>

            {/* Thumbnails */}
            <div className="modal-thumbnails">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`modal-thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={image.url} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>

            <div className='modal-bottom-spacing'></div>
          </div>
        </div>
      )}
    </>
  );
}
