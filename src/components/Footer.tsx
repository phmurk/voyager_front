import { Link } from 'react-router-dom';
import { Compass, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <Compass className="w-6 h-6 text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
              <span className="text-lg font-bold tracking-tight">VOYAGER</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Открывайте мир вместе с нами. Мы создаем незабываемые путешествия, 
              которые остаются в памяти на всю жизнь.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-emerald-600/20 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-emerald-600/20 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-emerald-600/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Навигация</h3>
            <ul className="space-y-3">
              {[
                { label: 'Главная', href: '/' },
                { label: 'Туры', href: '/tours' },
                { label: 'Блог', href: '/blog' },
                { label: 'О нас', href: '/about' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Популярные направления</h3>
            <ul className="space-y-3">
              {['Бали', 'Париж', 'Токио', 'Дубай', 'Мальдивы'].map((dest) => (
                <li key={dest}>
                  <Link
                    to="/tours"
                    className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors"
                  >
                    {dest}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+7 (800) 555-35-35</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>info@voyager.travel</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Москва, ул. Путешественников, 42</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} VOYAGER. Все права защищены.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">
              Условия использования
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
