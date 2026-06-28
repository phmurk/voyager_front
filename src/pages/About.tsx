import { Award, Users, Globe, TrendingUp, MapPin, Phone, Mail } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const stats = [
  { icon: Globe, value: '50+', label: 'Стран' },
  { icon: Users, value: '50K+', label: 'Клиентов' },
  { icon: Award, value: '500+', label: 'Туров' },
  { icon: TrendingUp, value: '98%', label: 'Довольных' },
];

const values = [
  {
    number: '01',
    title: 'Качество',
    desc: 'Мы тщательно отбираем каждый тур, отель и экскурсию, чтобы гарантировать незабываемые впечатления.',
  },
  {
    number: '02',
    title: 'Надежность',
    desc: 'Прозрачные цены, честные условия и полная поддержка на каждом этапе путешествия.',
  },
  {
    number: '03',
    title: 'Индивидуальность',
    desc: 'Каждый клиент уникален. Мы подбираем маршруты, которые идеально соответствуют вашим желаниям.',
  },
  {
    number: '04',
    title: 'Страсть',
    desc: 'Мы любим путешествовать не меньше, чем вы. Эта страсть вдохновляет нас создавать лучшие туры.',
  },
];

const team = [
  {
    name: 'Александр Петров',
    role: 'Основатель и CEO',
    image: 'https://ui-avatars.com/api/?name=Alexander+Petrov&background=047857&color=fff&size=200',
  },
  {
    name: 'Елена Смирнова',
    role: 'Директор по маркетингу',
    image: 'https://ui-avatars.com/api/?name=Elena+Smirnova&background=059669&color=fff&size=200',
  },
  {
    name: 'Дмитрий Козлов',
    role: 'Главный эксперт по турам',
    image: 'https://ui-avatars.com/api/?name=Dmitry+Kozlov&background=065f46&color=fff&size=200',
  },
  {
    name: 'Анна Волкова',
    role: 'Руководитель поддержки',
    image: 'https://ui-avatars.com/api/?name=Anna+Volkova&background=10b981&color=fff&size=200',
  },
];

export default function About() {
  const heroRef = useScrollAnimation(1);
  const statsRef = useScrollAnimation(0.2);
  const valuesRef = useScrollAnimation(1);
  const teamRef = useScrollAnimation(0.1);
  const contactRef = useScrollAnimation(0.2);

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-1">
          <img
            src="https://images.unsplash.com/photo-1488085062187-097c15df6c96?w=1920&q=80"
            alt="About"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div ref={heroRef.ref} className={`max-w-2xl transition-all duration-1000 ${heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-3xl lg:text-5xl font-bold mb-6">О компании VOYAGER</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Мы — команда увлеченных путешественников, которая уже более 10 лет создает 
              незабываемые впечатления для тысяч клиентов по всему миру.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 lg:py-20 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div ref={statsRef.ref} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`text-center transition-all duration-700 ${statsRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 mb-4">
                  <stat.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-6">Наша миссия</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Мы верим, что путешествия меняют жизнь. Каждый новый город, каждая встреча с другой 
                культурой, каждый закат на чужом берегу — это шаг к более широкому пониманию мира и себя.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Наша миссия — сделать путешествия доступными, безопасными и по-настоящему 
                запоминающимися. Мы не просто продаем туры — мы создаем истории, которыми 
                хочется делиться.
              </p>
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-2xl font-bold text-emerald-400">10+</div>
                  <div className="text-sm text-muted-foreground">Лет на рынке</div>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <div className="text-2xl font-bold text-emerald-400">4.9</div>
                  <div className="text-sm text-muted-foreground">Средний рейтинг</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80"
                  alt="Travel"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-500/10 rounded-xl -z-10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-teal-500/10 rounded-xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div ref={valuesRef.ref} className={`text-center mb-12 transition-all duration-700 ${valuesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-2xl lg:text-3xl font-bold mb-3">Наши ценности</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Принципы, которые определяют каждое наше действие
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div
                key={value.number}
                className={`p-6 rounded-xl bg-card border border-border transition-all duration-700 ${valuesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl font-bold text-emerald-400/30 mb-4">{value.number}</div>
                <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div ref={teamRef.ref} className={`text-center mb-12 transition-all duration-700 ${teamRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-2xl lg:text-3xl font-bold mb-3">Наша команда</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Люди, которые делают ваши путешествия особенными
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div
                key={member.name}
                className={`text-center transition-all duration-700 ${teamRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden mx-auto mb-4 border-2 border-emerald-500/20">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div ref={contactRef.ref} className={`max-w-2xl mx-auto text-center transition-all duration-700 ${contactRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-2xl lg:text-3xl font-bold mb-3">Свяжитесь с нами</h2>
            <p className="text-muted-foreground mb-8">
              Есть вопросы? Мы всегда рады помочь!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-card border border-border">
                <Phone className="w-6 h-6 text-emerald-400 mx-auto mb-3" />
                <div className="text-sm font-medium mb-1">Телефон</div>
                <div className="text-sm text-muted-foreground">+7 (800) 555-35-35</div>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <Mail className="w-6 h-6 text-emerald-400 mx-auto mb-3" />
                <div className="text-sm font-medium mb-1">Email</div>
                <div className="text-sm text-muted-foreground">info@voyager.travel</div>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <MapPin className="w-6 h-6 text-emerald-400 mx-auto mb-3" />
                <div className="text-sm font-medium mb-1">Адрес</div>
                <div className="text-sm text-muted-foreground">Москва, ул. Путешественников, 42</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
