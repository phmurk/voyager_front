import { useState } from "react";
import { Mail, Send, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { api } from "../lib/api";
import "./Newsletter.css"; // Импорт стилей
import "../index.css";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const { ref, isVisible } = useScrollAnimation(0.2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    try {
      await api.subscribeNewsletter(email);
      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error("Newsletter subscription error:", err);
      setStatus("error");
    }
  };

  return (
    <section ref={ref} className="newsletter-section">
      <div className="container">
        <div
          className={`newsletter-card scroll-reveal ${
            isVisible ? "visible" : ""
          }`}
        >
          <div className="newsletter-blob blob-1" />
          <div className="newsletter-blob blob-2" />

          <div className="newsletter-content text-center">
            <div className="newsletter-icon-box">
              <Mail className="newsletter-icon" size={24} />
            </div>

            <h2 className="fw-bold mb-3 fs-2 fs-lg-1">
              Будьте в курсе лучших путешествий
            </h2>
            <p
              className="text-muted mb-5 mx-auto"
              style={{ maxWidth: "400px" }}
            >
              Подпишитесь на нашу рассылку и получайте эксклюзивные предложения,
              скидки до 50% и вдохновение для новых приключений
            </p>

            {status === "success" ? (
              <div className="d-flex align-items-center justify-content-center gap-3 text-success">
                <CheckCircle size={24} />
                <span
                  className="fw-medium text-emerald-400"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  Спасибо! Вы подписаны на рассылку
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="newsletter-form">
                <div className="input-container">
                  <Mail className="input-icon" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ваш email адрес"
                    required
                    className="newsletter-input"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-submit"
                >
                  <Send size={16} />
                  <span>
                    {status === "loading" ? "Отправка..." : "Подписаться"}
                  </span>
                </button>
              </form>
            )}

            {status === "error" && (
              <p className="mt-3 small text-danger">
                Произошла ошибка. Попробуйте позже.
              </p>
            )}

            <p className="mt-4 small text-muted">
              Отписаться можно в любой момент. Мы не рассылаем спам.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
