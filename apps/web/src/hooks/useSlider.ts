import { useState } from 'react';

const useSlider = (totalSlides: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalSlides - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === totalSlides - 1 ? 0 : prevIndex + 1));
  };

  return {
    currentIndex,
    prevSlide,
    nextSlide,
  };
};

export { useSlider };
