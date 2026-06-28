import { useNavigate } from 'react-router-dom';
import { Clock, Star, MapPin, Users, Flame } from 'lucide-react';
import type { Tour } from '../types';

interface TourCardProps {
  tour: Tour;
  index?: number;
  isVisible?: boolean;
}

export default function TourCard({ tour, index = 0, isVisible = true }: TourCardProps) {
  const navigate = useNavigate();
  const discountedPrice = (tour.discount ?? 0) > 0
    ? Math.round(tour.price * (1 - (tour.discount ?? 0) / 100))
    : tour.price;

  return (
    <div
      onClick={() => navigate(`/tours/${tour.id}`)}
      className={`group cursor-pointer bg-card rounded-xl overflow-hidden border border-border hover:border-emerald-500/30 transition-all duration-500 hover:shadow-lg hover:shadow-emerald-500/5 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {tour.isHot && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-red-500/90 text-white text-xs font-medium rounded-full">
            <Flame className="w-3 h-3" />
            Горячий тур
          </div>
        )}
        {(tour.discount ?? 0) > 0 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-500/90 text-white text-xs font-medium rounded-full">
            -{tour.discount}%
          </div>
        )}
        
        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
          <MapPin className="w-3 h-3" />
          {tour.location}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-5">
        <h3 className="font-semibold text-base lg:text-lg mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1">
          {tour.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {tour.description}
        </p>

        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{tour.duration} дн.</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>до {tour.maxPeople} чел.</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{tour.rating}</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            {(tour.discount ?? 0) > 0 && (
              <span className="text-sm text-muted-foreground line-through mr-2">
                ${tour.price}
              </span>
            )}
            <span className="text-xl font-bold text-emerald-400">
              ${discountedPrice}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">за человека</span>
        </div>
      </div>
    </div>
  );
}
