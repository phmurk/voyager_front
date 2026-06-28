import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Chrome, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type AuthMode = 'login' | 'register';

export default function Auth() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'register') {
        if (form.password !== form.confirmPassword) {
          setError('Пароли не совпадают');
          setIsLoading(false);
          return;
        }
        await register(form.username, form.email, form.password);
      } else {
        await login(form.username, form.password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка авторизации. Проверьте данные и попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">
              {mode === 'login' ? 'Вход в аккаунт' : 'Создать аккаунт'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === 'login'
                ? 'Войдите, чтобы получить доступ к своим бронированиям'
                : 'Зарегистрируйтесь, чтобы начать путешествовать'}
            </p>
          </div>

          <div className="p-6 lg:p-8 rounded-2xl bg-card border border-border">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Имя пользователя</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                    placeholder="john_doe"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border focus:border-emerald-500 outline-none text-sm"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border focus:border-emerald-500 outline-none text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Пароль</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Минимум 6 символов"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-muted border border-border focus:border-emerald-500 outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Подтвердите пароль</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                      placeholder="Повторите пароль"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border focus:border-emerald-500 outline-none text-sm"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium transition-colors"
              >
                {isLoading ? (
                  'Загрузка...'
                ) : (
                  <>
                    {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError('');
                }}
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {mode === 'login'
                  ? 'Нет аккаунта? Зарегистрироваться'
                  : 'Уже есть аккаунт? Войти'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
