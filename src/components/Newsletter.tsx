import { useState } from "react";
import { Mail, Send, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { api } from "../lib/api";

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
    <section ref={ref} className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/40 to-teal-950/40 border border-emerald-500/10 p-8 lg:p-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 mb-6">
              <Mail className="w-6 h-6 text-emerald-400" />
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold mb-3">
              Будьте в курсе лучших путешествий
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Подпишитесь на нашу рассылку и получайте эксклюзивные предложения,
              скидки до 50% и вдохновение для новых приключений
            </p>

            {status === "success" ? (
              <div className="flex items-center justify-center gap-3 text-emerald-400">
                <CheckCircle className="w-6 h-6" />
                <span className="font-medium">
                  Спасибо! Вы подписаны на рассылку
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ваш email адрес"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {status === "loading" ? "Отправка..." : "Подписаться"}
                </button>
              </form>
            )}

            {status === "error" && (
              <p className="mt-3 text-sm text-red-400">
                Произошла ошибка. Попробуйте позже.
              </p>
            )}

            <p className="mt-4 text-xs text-muted-foreground">
              Отписаться можно в любой момент. Мы не рассылаем спам.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
