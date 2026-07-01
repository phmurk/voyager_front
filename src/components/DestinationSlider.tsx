import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Destination } from "../types";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import "./DestinationSlider.css";

const destinations: Destination[] = [
  {
    id: "1",
    name: "Бали",
    country: "Индонезия",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
    tour_count: 24,
  },
  {
    id: "2",
    name: "Париж",
    country: "Франция",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
    tour_count: 18,
  },
  {
    id: "3",
    name: "Токио",
    country: "Япония",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
    tour_count: 15,
  },
  {
    id: "4",
    name: "Дубай",
    country: "ОАЭ",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
    tour_count: 12,
  },
  {
    id: "5",
    name: "Мальдивы",
    country: "Мальдивы",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80",
    tour_count: 20,
  },
  {
    id: "6",
    name: "Нью-Йорк",
    country: "США",
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80",
    tour_count: 22,
  },
];

export default function DestinationSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation(0.1);

  // Определяем количество видимых слайдов в зависимости от ширины экрана
  const [maxIndex, setMaxIndex] = useState(destinations.length - 3);
  const slideWidth = 324;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setMaxIndex(destinations.length - 1); // На мобилках листаем до конца
      } else if (window.innerWidth < 1200) {
        setMaxIndex(destinations.length - 2); // На планшетах
      } else {
        setMaxIndex(destinations.length - 3); // На десктопах
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }
  }, [currentIndex]);

  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));

  return (
    <section ref={ref} className="dest-section">
      <div className="container">
        {/* Header */}
        <div
          className={`d-flex align-items-end justify-content-between mb-5 scroll-reveal ${isVisible ? "visible" : ""}`}
        >
          <div>
            <h2 className="fw-bold mb-2 fs-2 fs-lg-1">
              Популярные направления
            </h2>
            <p className="text-muted mb-0">
              Откройте для себя самые востребованные места
            </p>
          </div>

          {/* ИСПРАВЛЕНО: Убран d-none d-md-flex, теперь кнопки видны всегда */}
          <div className="d-flex gap-2 ms-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="nav-btn"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="nav-btn"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Viewport */}
        <div className="dest-slider-viewport">
          <div
            ref={sliderRef}
            className="dest-slider-track"
            style={{ width: `${destinations.length * slideWidth}px` }}
          >
            {destinations.map((dest, i) => (
              <div
                key={dest.id}
                onClick={() => navigate("/tours")}
                className={`dest-card scroll-reveal ${isVisible ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="dest-card-image-wrapper">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="dest-card-img"
                    loading="lazy"
                  />
                  <div className="dest-card-overlay" />
                  <div className="dest-card-content">
                    <div className="dest-country-info">
                      <MapPin size={14} />
                      <span>{dest.country}</span>
                    </div>
                    <h3 className="h4 fw-bold mb-1 text-white">{dest.name}</h3>
                    <p className="small text-white-50 mb-0">
                      {dest.tour_count} туров
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile dots */}
        <div className="mobile-dots d-md-none">
          {destinations.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(Math.min(i, maxIndex))}
              className={`dot ${i === currentIndex ? "active" : ""}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
