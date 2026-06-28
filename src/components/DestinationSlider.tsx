import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Destination } from '../types';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const destinations: Destination[] = [
  { id: '1', name: 'Бали', country: 'Индонезия', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', tourCount: 24 },
  { id: '2', name: 'Париж', country: 'Франция', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', tourCount: 18 },
  { id: '3', name: 'Токио', country: 'Япония', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80', tourCount: 15 },
  { id: '4', name: 'Дубай', country: 'ОАЭ', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', tourCount: 12 },
  { id: '5', name: 'Мальдивы', country: 'Мальдивы', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80', tourCount: 20 },
  { id: '6', name: 'Нью-Йорк', country: 'США', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80', tourCount: 22 },
];

export default function DestinationSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation(0.1);

  const slideWidth = 320;
  const maxIndex = Math.max(0, destinations.length - 3);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }
  }, [currentIndex]);

  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));

  return (
    <section ref={ref} className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`flex items-end justify-between mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">Популярные направления</h2>
            <p className="text-muted-foreground">Откройте для себя самые востребованные места</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            ref={sliderRef}
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{ width: `${destinations.length * slideWidth}px` }}
          >
            {destinations.map((dest, i) => (
              <div
                key={dest.id}
                onClick={() => navigate('/tours')}
                className={`shrink-0 w-[300px] cursor-pointer group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="relative overflow-hidden rounded-xl aspect-[4/5]">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-1.5 text-emerald-400 text-sm mb-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{dest.country}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{dest.name}</h3>
                    <p className="text-sm text-white/70">{dest.tourCount} туров</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile dots */}
        <div className="flex md:hidden justify-center gap-2 mt-6">
          {destinations.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(Math.min(i, maxIndex))}
              className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-emerald-400' : 'bg-muted'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
