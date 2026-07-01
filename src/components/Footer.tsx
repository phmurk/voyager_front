import { Link } from "react-router-dom";
import {
  Compass,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import "./Footer.css"; // Импортируем созданные стили

export default function Footer() {
  return (
    <footer className="footer-main">
      <div className="container">
        <div className="row g-4 lg-g-5 justify-content-between">
          <div className="col-12 col-md-6 col-lg-3">
            <Link to="/" className="footer-logo">
              <Compass className="footer-logo-icon" size={24} />
              <span className="fw-bold fs-5 tracking-tight">VOYAGER</span>
            </Link>
            <p className="footer-description">
              Открывайте мир вместе с нами. Мы создаем незабываемые путешествия,
              которые остаются в памяти на всю жизнь.
            </p>
            <div className="social-links-wrapper">
              <a href="#" className="social-icon-btn">
                <Instagram size={16} />
              </a>
              <a href="#" className="social-icon-btn">
                <Facebook size={16} />
              </a>
              <a href="#" className="social-icon-btn">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          <div className="col-6 col-md-6 col-lg-3">
            <h3 className="footer-heading">Навигация</h3>
            <ul className="footer-list">
              {[
                { label: "Главная", href: "/" },
                { label: "Туры", href: "/tours" },
                { label: "Блог", href: "/blog" },
                { label: "О нас", href: "/about" },
              ].map((link) => (
                <li key={link.href} className="footer-list-item">
                  <Link to={link.href} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* <div className="col-6 col-md-6 col-lg-3">
            <h3 className="footer-heading">Популярные направления</h3>
            <ul className="footer-list">
              {["Бали", "Париж", "Токио", "Дубай", "Мальдивы"].map((dest) => (
                <li key={dest} className="footer-list-item">
                  <Link to="/tours" className="footer-link">
                    {dest}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          <div className="col-12 col-md-6 col-lg-3">
            <h3 className="footer-heading">Контакты</h3>
            <div className="footer-list">
              <div className="contact-item">
                <Phone size={16} className="contact-icon" />
                <span>+375 (25) 747 9405</span>
              </div>
              <div className="contact-item">
                <Mail size={16} className="contact-icon" />
                <span>poly.vahmurka@gmail.com</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} className="contact-icon mt-1" />
                <span>Минск, ул. Петруся Бровки, 14</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p className="footer-bottom-text mb-0">
            &copy; {new Date().getFullYear()} VOYAGER. Все права защищены.
          </p>
          <div className="footer-legal-links">
            <a href="#" className="footer-link">
              Политика конфиденциальности
            </a>
            <a href="#" className="footer-link">
              Условия использования
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
