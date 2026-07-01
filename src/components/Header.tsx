import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Compass } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import "./Header.css"; // Импортируем стили

const navLinks = [
  { label: "Главная", href: "/" },
  { label: "Туры", href: "/tours" },
  { label: "Блог", href: "/blog" },
  { label: "О нас", href: "/about" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`header-main ${isScrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="header-container">
          {/* Logo */}
          <Link to="/" className="logo-link">
            <Compass className="logo-icon" size={28} color="#34d399" />
            <span className="logo-text">VOYAGER</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="nav-list">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`nav-link-custom ${
                  location.pathname === link.href ? "active" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={() => navigate("/cart")}
              className="action-btn"
              aria-label="Корзина"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>

            {user ? (
              <div className="d-none d-lg-flex align-items-center gap-3">
                <Link to="/profile" className="auth-profile-link">
                  <User size={16} color="#34d399" />
                  <span className="fw-medium">{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="btn btn-link btn-sm text-decoration-none text-muted p-0"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="btn-emerald d-none d-lg-flex"
              >
                <User size={16} />
                Войти
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="action-btn d-lg-none"
              aria-label="Меню"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-dropdown d-lg-none">
          <div className="container py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`mobile-nav-link ${
                  location.pathname === link.href ? "active" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-top border-secondary">
              {user ? (
                <div className="d-flex align-items-center justify-content-between px-2">
                  <Link to="/profile" className="logo-link fs-6">
                    <User size={16} color="#34d399" />
                    {user.name}
                  </Link>
                  <button
                    onClick={logout}
                    className="btn btn-link text-emerald-400 p-0 text-decoration-none"
                    style={{ color: "hsl(var(--primary))" }}
                  >
                    Выйти
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/auth")}
                  className="btn-emerald w-100 justify-content-center py-3"
                >
                  <User size={16} />
                  Войти
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
