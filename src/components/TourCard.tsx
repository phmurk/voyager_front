import { useNavigate } from "react-router-dom";
import { Clock, Star, MapPin, Users, Flame } from "lucide-react";
import type { Tour } from "../types";
import "./TourCard.css";

interface TourCardProps {
  tour: Tour;
  index?: number;
  isVisible?: boolean;
}

export default function TourCard({
  tour,
  index = 0,
  isVisible = true,
}: TourCardProps) {
  const navigate = useNavigate();
  const discountedPrice =
    (tour.discount ?? 0) > 0
      ? Math.round(tour.price * (1 - (tour.discount ?? 0) / 100))
      : tour.price;

  return (
    <div
      onClick={() => navigate(`/tours/${tour.id}`)}
      className={`tour-card scroll-reveal ${isVisible ? "visible" : ""}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Image Container */}
      <div className="tour-card-image-box">
        <img
          src={tour.image}
          alt={tour.title}
          className="tour-card-img"
          loading="lazy"
        />
        <div className="tour-card-overlay" />

        {tour.is_hot && (
          <div className="badge-hot">
            <Flame size={12} />
            <span>Горячий тур</span>
          </div>
        )}

        {(tour.discount ?? 0) > 0 && (
          <div className="badge-discount">-{tour.discount}%</div>
        )}

        <div className="badge-location">
          <MapPin size={12} />
          <span>{tour.location}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="tour-card-content">
        <h3 className="tour-card-title">{tour.title}</h3>

        <p className="tour-card-description text-muted">{tour.description}</p>

        <div className="tour-card-info-row text-muted">
          <div className="d-flex align-items-center gap-1">
            <Clock size={14} />
            <span>{tour.duration} дн.</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <Users size={14} />
            <span>до {tour.max_people} чел.</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <Star size={14} className="text-warning fill-warning" />
            <span className="text-foreground">{tour.rating}</span>
          </div>
        </div>

        <div className="mt-auto d-flex align-items-end justify-content-between">
          <div>
            {(tour.discount ?? 0) > 0 && (
              <span className="price-old text-muted">${tour.price}</span>
            )}
            <span className="price-current">${discountedPrice}</span>
          </div>
          <span className="small text-muted">за человека</span>
        </div>
      </div>
    </div>
  );
}
