import {
  Award,
  Users,
  Globe,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Plus,
  Minus,
  Send,
  CheckCircle,
} from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import "./About.css"; // Импорт стилей
import { useState } from "react"; // Добавьте useState
import Newsletter from "../components/Newsletter";

const stats = [
  { icon: Globe, value: "50+", label: "Стран" },
  { icon: Users, value: "50K+", label: "Клиентов" },
  { icon: Award, value: "500+", label: "Туров" },
  { icon: TrendingUp, value: "98%", label: "Довольных" },
];

const faqData = [
  {
    question: "Как забронировать тур?",
    answer:
      "Выберите направление в каталоге, добавьте в корзину и оформите заказ. После этого с вами свяжется персональный менеджер для уточнения деталей и подписи электронного договора.",
  },
  {
    question: "Могу ли я изменить даты или отменить поездку?",
    answer:
      "Да, для премиум-клиентов у нас гибкая политика. Бесплатная отмена за 30 дней до вылета, за 14 дней — возврат 80%.",
  },
  {
    question: "Вы помогаете с визой и страховкой?",
    answer:
      "Конечно. Мы берем на себя подготовку документов, запись в консульство и оформление расширенной страховки.",
  },
  {
    question: "Есть ли рассрочка или кредит?",
    answer:
      "Для туров от 300 000 ₽ доступна беспроцентная рассрочка на 3 или 6 месяцев через наш партнёрский банк.",
  },
];

export default function About() {
  const heroRef = useScrollAnimation(1);
  const statsRef = useScrollAnimation(0.2);
  const missionRef = useScrollAnimation(0.2);
  const valuesRef = useScrollAnimation(0.1);
  const contactRef = useScrollAnimation(0.2);
  const mapRef = useScrollAnimation(0.1);
  const contactFormRef = useScrollAnimation(0.2);

  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const faqRef = useScrollAnimation(0.2); // Если хотите анимацию появления

  // Логика формы
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    phone?: string;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (!val) {
      setFormData({ ...formData, phone: "" });
      return;
    }
    if (val.length < 3) val = "375";
    else if (!val.startsWith("375")) val = "375" + val;

    let formatted = "+375";
    if (val.length > 3) formatted += " " + val.substring(3, 5);
    if (val.length > 5) formatted += " " + val.substring(5, 8);
    if (val.length > 8) formatted += " " + val.substring(8, 12);

    setFormData({ ...formData, phone: formatted });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;
    let newErrors: { email?: string; phone?: string } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Введите корректный email";
      isValid = false;
    }
    const phoneRegex = /^\+375 \d{2} \d{3} \d{4}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Формат: +375 XX XXX XXXX";
      isValid = false;
    }

    if (!isValid) {
      setFormErrors(newErrors);
      return;
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 4000);
  };

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container text-center">
          <div
            ref={heroRef.ref}
            className={`scroll-reveal ${heroRef.isVisible ? "visible" : ""}`}
            style={{ transitionDuration: "1s" }}
          >
            <h2 className="fw-bold mb-3">О VOYAGER</h2>

            <p className="about-text mx-auto">
              Более 10 лет мы помогаем путешественникам открывать мир и
              создавать незабываемые воспоминания
            </p>

            <div className="about-badge">
              <Users
                size={18}
                className="text-emerald-400"
                style={{ color: "hsl(var(--primary))" }}
              />
              Более 10 000 счастливых путешественников по всему миру
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div ref={statsRef.ref} className="row g-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`col-6 col-md-3 text-center scroll-reveal ${statsRef.isVisible ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="stat-icon-box">
                  <stat.icon
                    size={24}
                    style={{ color: "hsl(var(--primary))" }}
                  />
                </div>
                <div
                  className="fw-bold fs-2 mb-1"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {stat.value}
                </div>
                <div className="small text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-5 py-lg-7">
        <div className="container">
          <div ref={missionRef.ref} className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <h2 className="fw-bold mb-4 fs-2">Наша миссия</h2>
              <p className="text-muted mb-4">
                Мы верим, что путешествия меняют жизнь. Каждый новый город,
                каждая встреча с другой культурой, каждый закат на чужом берегу
                — это шаг к более широкому пониманию мира и себя.
              </p>
              <p className="text-muted mb-4">
                Наша миссия — сделать путешествия доступными, безопасными и
                по-настоящему запоминающимися. Мы не просто продаем туры — мы
                создаем истории, которыми хочется делиться.
              </p>
              <div className="d-flex align-items-center gap-4 mt-4">
                <div>
                  <div
                    className="fw-bold fs-3 text-emerald-400"
                    style={{ color: "hsl(var(--primary))" }}
                  >
                    10+
                  </div>
                  <div className="small text-muted">Лет на рынке</div>
                </div>
                <div
                  style={{
                    width: "1px",
                    height: "40px",
                    backgroundColor: "hsl(var(--border))",
                  }}
                />
                <div>
                  <div
                    className="fw-bold fs-3 text-emerald-400"
                    style={{ color: "hsl(var(--primary))" }}
                  >
                    4.9
                  </div>
                  <div className="small text-muted">Средний рейтинг</div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="position-relative">
                <div className="mission-img-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80"
                    alt="Travel"
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
                <div className="mission-deco deco-1" />
                <div className="mission-deco deco-2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-wrapper">
        <div className="container">
          <div
            ref={valuesRef.ref}
            className={`text-center mb-5 scroll-reveal ${valuesRef.isVisible ? "visible" : ""}`}
          >
            <h2 className="section-values-title">Наши ценности</h2>
            <div className="title-separator"></div>
          </div>

          <div className="row g-4 justify-content-center">
            {[
              {
                id: "01",
                title: "Исключительность",
                text: "Ни одного шаблонного тура. Каждое путешествие проектируется под вас, как платье от кутюр.",
              },
              {
                id: "02",
                title: "Экспертность",
                text: "Наши менеджеры сами объездили более 50 стран. Мы делимся только личным опытом, а не рекламными буклетами.",
              },
              {
                id: "03",
                title: "Прозрачность",
                text: "Цена финальная, без сюрпризов. Вы платите ровно столько, сколько видите в корзине, включая страховку и скрытые сборы.",
              },
              {
                id: "04",
                title: "Забота 24/7",
                text: "Координатор на связи в любой точке мира. Потому что премиум — это когда о вас думают, даже когда вы спите.",
              },
            ].map((item, index) => (
              <div
                className={`col-12 col-md-6 col-xl-3 scroll-reveal ${valuesRef.isVisible ? "visible" : ""}`}
                key={index}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="value-card h-100">
                  <div className="value-number-wrapper">
                    <span className="value-number">{item.id}</span>
                  </div>
                  <h3 className="value-title">{item.title}</h3>
                  <p className="value-text">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-wrapper">
        <div className="container">
          <div
            ref={faqRef.ref}
            className={`text-center mb-5 scroll-reveal ${faqRef.isVisible ? "visible" : ""}`}
          >
            <span className="faq-subtitle">Ответы на вопросы</span>
            <h2 className="section-contact-title">Часто задаваемые вопросы</h2>
            <div className="title-separator"></div>
          </div>

          <div className="row justify-content-center">
            <div className="col-12 col-lg-9">
              <div className="faq-accordion">
                {faqData.map((item, index) => (
                  <div
                    key={index}
                    className={`faq-item ${activeFaq === index ? "active" : ""} scroll-reveal ${faqRef.isVisible ? "visible" : ""}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <button
                      className="faq-question-btn"
                      onClick={() =>
                        setActiveFaq(activeFaq === index ? null : index)
                      }
                    >
                      <span className="question-text">{item.question}</span>
                      <div className="icon-wrapper">
                        {activeFaq === index ? (
                          <Minus size={18} />
                        ) : (
                          <Plus size={18} />
                        )}
                      </div>
                    </button>

                    <div
                      className="faq-answer-wrapper"
                      style={{ maxHeight: activeFaq === index ? "200px" : "0" }}
                    >
                      <div className="faq-answer-content">
                        <p className="text-muted mb-0">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contacts-wrapper">
        <div className="container">
          <div
            ref={contactRef.ref}
            className={`text-center mb-5 scroll-reveal ${contactRef.isVisible ? "visible" : ""}`}
          >
            <span className="contacts-subtitle">VOYAGER Premium Travel</span>
            <h2 className="section-contact-title">Связаться с нами</h2>
            <div className="title-separator"></div>
          </div>

          <div className="row g-4 justify-content-center">
            {/* Phone */}
            <div
              className={`col-12 col-md-6 col-lg-4 scroll-reveal ${contactRef.isVisible ? "visible" : ""}`}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="contact-card">
                <div className="contact-icon-wrapper">
                  <Phone size={32} />
                </div>
                <h3 className="contact-title">Телефон</h3>
                <p className="contact-desc">Звоните нам в рабочее время</p>
                <a href="tel:+375257479405" className="contact-main-link">
                  +375 (25) 747 9405
                </a>
                <div className="contact-footer">
                  <span>ПН-ПТ: 09:00 - 21:00</span>
                  <span>СБ-ВС: 10:00 - 18:00</span>
                </div>
              </div>
            </div>

            {/* Email */}
            <div
              className={`col-12 col-md-6 col-lg-4 scroll-reveal ${contactRef.isVisible ? "visible" : ""}`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="contact-card">
                <div className="contact-icon-wrapper">
                  <Mail size={32} />
                </div>
                <h3 className="contact-title">Почта</h3>
                <p className="contact-desc">
                  Напишите нам для подробных вопросов
                </p>
                <a
                  href="mailto:poly.vahmurka@gmail.com"
                  className="contact-main-link"
                >
                  poly.vahmurka@gmail.com
                </a>
                <div className="contact-footer">
                  <span className="highlight-text">
                    Ответим в течение 1 часа
                  </span>
                </div>
              </div>
            </div>

            {/* Office */}
            <div
              className={`col-12 col-md-6 col-lg-4 scroll-reveal ${contactRef.isVisible ? "visible" : ""}`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="contact-card">
                <div className="contact-icon-wrapper">
                  <MapPin size={32} />
                </div>
                <h3 className="contact-title">Офис</h3>
                <p className="contact-desc">Посетите наш офис в Минске</p>
                <a
                  href="https://yandex.by/maps/-/CBrYF0u8~A"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-main-link"
                >
                  Ул. Петруся Бровки, 14
                </a>
                <div className="contact-footer">
                  <span>Минск, 220013</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section-wrapper">
        <div className="container">
          <div
            ref={mapRef.ref}
            className={`text-center mb-5 scroll-reveal ${mapRef.isVisible ? "visible" : ""}`}
          >
            <span className="map-subtitle">Ждем вас в гости</span>
            <h2 className="section-contact-title">Мы на карте</h2>
            <div className="title-separator"></div>
          </div>

          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <div className="map-outer-container">
                <div className="map-corner top-left"></div>
                <div className="map-corner top-right"></div>
                <div className="map-corner bottom-left"></div>
                <div className="map-corner bottom-right"></div>

                <div className="map-iframe-holder">
                  <iframe
                    title="Офис VOYAGER на карте"
                    src="https://maps.google.com/maps?q=Минск,+ул.+Петруся+Бровки,+14&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <div ref={contactFormRef.ref} className="form-outer-card">
            <h2 className="section-contact-title text-center mb-5">
              Остались вопросы?
            </h2>

            {isSubmitted ? (
              <div className="form-success-state">
                <CheckCircle
                  size={64}
                  className="text-emerald-400 mb-4"
                  style={{ color: "hsl(var(--primary))" }}
                />
                <h3 className="h4 fw-bold text-white mb-2">
                  Сообщение отправлено!
                </h3>
                <p className="text-muted">
                  Наш менеджер свяжется с вами в течение часа.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="custom-travel-form">
                <div className="row g-4">
                  <div className="col-12">
                    <label className="custom-form-label">Имя</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="custom-form-input"
                      placeholder="Ваше имя"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="custom-form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className={`custom-form-input ${formErrors.email ? "is-invalid" : ""}`}
                      placeholder="email@example.com"
                      required
                    />
                    {formErrors.email && (
                      <span className="error-msg">{formErrors.email}</span>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="custom-form-label">Телефон</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className={`custom-form-input ${formErrors.phone ? "is-invalid" : ""}`}
                      placeholder="+375 25 123 4567"
                      required
                    />
                    {formErrors.phone && (
                      <span className="error-msg">{formErrors.phone}</span>
                    )}
                  </div>

                  <div className="col-12">
                    <label className="custom-form-label">Тема</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleFormChange}
                      className="custom-form-input"
                      placeholder="Что вас интересует?"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="custom-form-label">Сообщение</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      className="custom-form-input"
                      placeholder="Ваше сообщение..."
                      rows={4}
                      required
                    ></textarea>
                  </div>

                  <div className="col-12 mt-4">
                    <button type="submit" className="form-submit-btn">
                      <Send size={18} />
                      <span>Отправить сообщение</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
      <Newsletter />
    </div>
  );
}
