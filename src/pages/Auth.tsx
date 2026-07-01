import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import "./Auth.css"; // Импорт стилей

type AuthMode = "login" | "register";

export default function Auth() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mode === "register") {
        if (form.password !== form.confirmPassword) {
          setError("Пароли не совпадают");
          setIsLoading(false);
          return;
        }
        await register(form.username, form.email, form.password);
      } else {
        await login(form.username, form.password);
      }
      navigate("/");
    } catch (err: any) {
      setError(
        err.message ||
          "Ошибка авторизации. Проверьте данные и попробуйте снова.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
            <div className="auth-header text-center mb-4">
              <h1>{mode === "login" ? "Вход в аккаунт" : "Создать аккаунт"}</h1>
              <p className="text-muted small">
                {mode === "login"
                  ? "Войдите, чтобы получить доступ к своим бронированиям"
                  : "Зарегистрируйтесь, чтобы начать путешествовать"}
              </p>
            </div>

            <div className="auth-card">
              <form onSubmit={handleSubmit}>
                {/* Username */}
                <div className="auth-input-group">
                  <label className="auth-label">Имя пользователя</label>
                  <div className="auth-input-wrapper">
                    <User className="auth-icon-left" size={16} />
                    <input
                      type="text"
                      value={form.username}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, username: e.target.value }))
                      }
                      placeholder="john_doe"
                      required
                      className="auth-input"
                    />
                  </div>
                </div>

                {/* Email (only for register) */}
                {mode === "register" && (
                  <div className="auth-input-group">
                    <label className="auth-label">Email</label>
                    <div className="auth-input-wrapper">
                      <Mail className="auth-icon-left" size={16} />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        placeholder="your@email.com"
                        required
                        className="auth-input"
                      />
                    </div>
                  </div>
                )}

                {/* Password */}
                <div className="auth-input-group">
                  <label className="auth-label">Пароль</label>
                  <div className="auth-input-wrapper">
                    <Lock className="auth-icon-left" size={16} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, password: e.target.value }))
                      }
                      placeholder="Минимум 6 символов"
                      required
                      minLength={6}
                      className="auth-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="auth-toggle-password"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (only for register) */}
                {mode === "register" && (
                  <div className="auth-input-group">
                    <label className="auth-label">Подтвердите пароль</label>
                    <div className="auth-input-wrapper">
                      <Lock className="auth-icon-left" size={16} />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            confirmPassword: e.target.value,
                          }))
                        }
                        placeholder="Повторите пароль"
                        required
                        className="auth-input"
                      />
                    </div>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="auth-error-alert">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-auth-submit mt-2"
                >
                  {isLoading ? (
                    "Загрузка..."
                  ) : (
                    <>
                      <span>
                        {mode === "login" ? "Войти" : "Зарегистрироваться"}
                      </span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setMode(mode === "login" ? "register" : "login");
                    setError("");
                  }}
                  className="auth-switch-mode"
                >
                  {mode === "login"
                    ? "Нет аккаунта? Зарегистрироваться"
                    : "Уже есть аккаунт? Войти"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
