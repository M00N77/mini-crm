"use client";

import Link from "next/link";
import { 
  ShieldCheck, 
  Kanban, 
  FileText, 
  Check, 
  ArrowRight, 
  LayoutDashboard, 
  Terminal, 
  Database,
  Lock,
  Sparkles
} from "lucide-react";
import { useAuthStore } from "@/shared/store/use-auth-store";

export default function LandingPage() {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuth = useAuthStore((state) => state.isAuth);
  const accessToken = useAuthStore((state) => state.accessToken);


  const loggedIn = isHydrated && Boolean(isAuth && accessToken);

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-body-sm selection:bg-surface-container-high selection:text-primary">
      {/* ── Fixed Navigation ── */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-outline-variant z-50 px-container-padding h-14 flex items-center justify-between">
        <div className="flex items-center gap-gutter">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <span className="text-[13px] font-bold text-on-primary">N</span>
            </div>
            <span className="typo-headline text-primary font-bold tracking-tight">Nexus CRM</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 ml-8">
            <a href="#features" className="typo-body-sm text-on-surface-variant hover:text-primary transition-colors">
              Возможности
            </a>
            <a href="#pricing" className="typo-body-sm text-on-surface-variant hover:text-primary transition-colors">
              Тарифы
            </a>
            <a href="#contact" className="typo-body-sm text-on-surface-variant hover:text-primary transition-colors">
              Контакты
            </a>
          </div>
        </div>

        <div className="flex items-center gap-item-gap">
          {loggedIn ? (
            <Link
              href="/dashboard"
              className="typo-body-sm font-medium bg-primary text-on-primary hover:opacity-90 transition-opacity px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-sm"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Панель управления</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="typo-body-sm text-on-surface-variant hover:text-primary transition-colors px-3 py-1.5 rounded"
              >
                Войти
              </Link>
              <Link
                href="/register"
                className="typo-body-sm font-medium text-on-primary bg-primary hover:opacity-90 transition-opacity px-3.5 py-1.5 rounded shadow-sm"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-[750px] flex items-center justify-center pt-20 px-container-padding overflow-hidden border-b border-outline-variant/60">
        {/* Subtle grid background accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#2a2a2c_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl flex flex-col items-center gap-6 py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-outline-variant bg-surface-container-low typo-label-mono text-[11px] text-on-surface-variant">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Engineering-grade CRM • Clean & Lightning Fast</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-primary tracking-tight leading-[1.1]">
            CRM инженерного уровня.<br />Ничего лишнего.
          </h1>

          <p className="typo-body-lg text-on-surface-variant max-w-xl text-base sm:text-lg leading-relaxed">
            Построена на базе PostgreSQL и REST API. Идеальное рабочее пространство для управления клиентами, канбан-задачами и реляционными заметками.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            {loggedIn ? (
              <Link
                href="/dashboard"
                className="bg-primary text-on-primary font-medium typo-body-sm px-6 py-2.5 rounded hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
              >
                <span>Открыть CRM</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/register"
                className="bg-primary text-on-primary font-medium typo-body-sm px-6 py-2.5 rounded hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
              >
                <span>Начать бесплатно</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}

            <Link
              href={loggedIn ? "/dashboard/tasks" : "/login"}
              className="bg-surface-container-low border border-outline-variant text-primary typo-body-sm px-6 py-2.5 rounded hover:bg-surface-container transition-colors"
            >
              {loggedIn ? "К задачам" : "Вход в аккаунт"}
            </Link>
          </div>

          {/* Code pill / Tech info */}
          <div className="mt-8 flex items-center gap-4 text-xs font-label-mono text-on-surface-variant/80 border border-outline-variant rounded-md px-4 py-2 bg-surface-container-lowest">
            <span className="flex items-center gap-1.5"><Database className="h-3.5 w-3.5 text-primary" /> PostgreSQL</span>
            <span className="text-outline-variant">•</span>
            <span className="flex items-center gap-1.5"><Terminal className="h-3.5 w-3.5 text-primary" /> REST API</span>
            <span className="text-outline-variant">•</span>
            <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-primary" /> JWT Sessions</span>
          </div>
        </div>
      </section>

      {/* ── Features Bento Grid ── */}
      <section className="py-24 px-container-padding max-w-6xl mx-auto w-full" id="features">
        <div className="mb-12 text-center sm:text-left">
          <h2 className="typo-display text-primary text-2xl sm:text-3xl">Ключевые возможности</h2>
          <p className="typo-body-sm text-on-surface-variant mt-2">Разработано для максимальной производительности и надежности данных.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {/* Card 1 */}
          <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6 flex flex-col h-full min-h-[220px] hover:border-outline transition-colors">
            <div className="h-10 w-10 rounded-md bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="typo-headline text-primary mb-2">Безопасная авторизация</h3>
            <p className="typo-body-sm text-on-surface-variant mt-auto">
              Надежная защита данных: хеширование паролей bcrypt, JWT Access/Refresh токены с ротацией и строгая изоляция сессий.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6 flex flex-col h-full min-h-[220px] hover:border-outline transition-colors">
            <div className="h-10 w-10 rounded-md bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary mb-4">
              <Kanban className="h-5 w-5" />
            </div>
            <h3 className="typo-headline text-primary mb-2">Интерактивный Канбан</h3>
            <p className="typo-body-sm text-on-surface-variant mt-auto">
              Удобные колонки статусов (Pending, In Progress, Done), сортировка по позициям и мгновенный отклик интерфейса.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6 flex flex-col h-full min-h-[220px] hover:border-outline transition-colors">
            <div className="h-10 w-10 rounded-md bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary mb-4">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="typo-headline text-primary mb-2">Реляционные заметки</h3>
            <p className="typo-body-sm text-on-surface-variant mt-auto">
              Прямая привязка заметок и истории переговоров к контактам и сделкам. Полная хронология в одном месте.
            </p>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-24 px-container-padding max-w-5xl mx-auto w-full border-t border-outline-variant/60" id="pricing">
        <div className="text-center mb-16">
          <h2 className="typo-display text-primary text-2xl sm:text-3xl">Прозрачные тарифы</h2>
          <p className="typo-body-sm text-on-surface-variant mt-2">Выберите план для вашей команды</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Developer Tier */}
          <div className="border border-outline-variant rounded-lg p-8 flex flex-col bg-surface-container-lowest">
            <div className="mb-6">
              <h3 className="typo-headline text-primary">Developer</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="typo-display text-3xl sm:text-4xl font-bold text-primary">Бесплатно</span>
              </div>
              <p className="typo-body-sm text-on-surface-variant mt-2">Для индивидуального использования и тестирования.</p>
            </div>

            <ul className="flex flex-col gap-3.5 mb-8 typo-label-mono text-on-surface-variant">
              <li className="flex items-center gap-2.5"><Check className="h-4 w-4 text-primary shrink-0" /> До 10,000 запросов к API/мес</li>
              <li className="flex items-center gap-2.5"><Check className="h-4 w-4 text-primary shrink-0" /> PostgreSQL хранилище</li>
              <li className="flex items-center gap-2.5"><Check className="h-4 w-4 text-primary shrink-0" /> Канбан-доска и контакты</li>
            </ul>

            <Link
              href={loggedIn ? "/dashboard" : "/register"}
              className="mt-auto w-full text-center bg-transparent border border-outline-variant text-primary typo-body-sm font-medium py-2.5 rounded hover:bg-surface-container transition-colors"
            >
              {loggedIn ? "Открыть дашборд" : "Начать бесплатно"}
            </Link>
          </div>

          {/* Production Tier */}
          <div className="border border-primary rounded-lg p-8 flex flex-col bg-surface-container-low relative">
            <div className="absolute -top-3 right-6 bg-primary text-on-primary typo-label-mono text-[10px] font-semibold px-2 py-0.5 rounded">
              РЕКОМЕНДУЕМЫЙ
            </div>

            <div className="mb-6">
              <h3 className="typo-headline text-primary">Production</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="typo-display text-3xl sm:text-4xl font-bold text-primary">₽1,990</span>
                <span className="typo-body-sm text-on-surface-variant">/мес</span>
              </div>
              <p className="typo-body-sm text-on-surface-variant mt-2">Для растущих команд и продакшн-нагрузок.</p>
            </div>

            <ul className="flex flex-col gap-3.5 mb-8 typo-label-mono text-on-surface-variant">
              <li className="flex items-center gap-2.5"><Check className="h-4 w-4 text-primary shrink-0" /> Неограниченное число контактов</li>
              <li className="flex items-center gap-2.5"><Check className="h-4 w-4 text-primary shrink-0" /> Приоритетный SLA 99.9%</li>
              <li className="flex items-center gap-2.5"><Check className="h-4 w-4 text-primary shrink-0" /> Полный доступ к Swagger API</li>
              <li className="flex items-center gap-2.5"><Check className="h-4 w-4 text-primary shrink-0" /> Выделенная поддержка</li>
            </ul>

            <Link
              href={loggedIn ? "/dashboard" : "/register"}
              className="mt-auto w-full text-center bg-primary text-on-primary typo-body-sm font-medium py-2.5 rounded hover:opacity-90 transition-opacity shadow-sm"
            >
              {loggedIn ? "Перейти в CRM" : "Подключить тариф"}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section className="py-24 px-container-padding max-w-xl mx-auto w-full border-t border-outline-variant/60" id="contact">
        <div className="mb-8 text-center sm:text-left">
          <h2 className="typo-display text-primary text-2xl">Связаться с нами</h2>
          <p className="typo-body-sm text-on-surface-variant mt-1">Отправьте запрос для подключения корпоративного тарифа.</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <input 
              className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 typo-label-mono text-primary focus:border-outline focus:outline-none transition-colors" 
              placeholder="Имя" 
              type="text"
            />
            <input 
              className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 typo-label-mono text-primary focus:border-outline focus:outline-none transition-colors" 
              placeholder="Фамилия" 
              type="text"
            />
          </div>
          <input 
            className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 typo-label-mono text-primary focus:border-outline focus:outline-none transition-colors" 
            placeholder="Email (напр. user@company.com)" 
            type="email"
          />
          <textarea 
            className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 typo-label-mono text-primary focus:border-outline focus:outline-none transition-colors resize-none" 
            placeholder="Сообщение или требования к интеграции..." 
            rows={4}
          />
          <button 
            type="button" 
            className="self-start bg-primary text-on-primary typo-body-sm font-medium px-6 py-2 rounded hover:opacity-90 transition-opacity mt-2 cursor-pointer shadow-sm"
          >
            Отправить сообщение
          </button>
        </form>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto border-t border-outline-variant py-12 px-container-padding bg-surface-container-lowest">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-primary flex items-center justify-center">
                <span className="text-[11px] font-bold text-on-primary">N</span>
              </div>
              <span className="typo-headline text-primary font-bold text-sm">Nexus CRM</span>
            </div>
            <p className="typo-label-mono text-xs text-on-surface-variant/70">v2.4.1 (Stable)</p>
          </div>

          <div className="flex flex-col gap-2 typo-body-sm">
            <span className="text-primary font-medium mb-1">Платформа</span>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="/dashboard/contacts">Контакты</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="/dashboard/tasks">Задачи</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="/dashboard/notes">Заметки</a>
          </div>

          <div className="flex flex-col gap-2 typo-body-sm">
            <span className="text-primary font-medium mb-1">Ресурсы</span>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Документация</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Swagger API</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Статус системы</a>
          </div>

          <div className="flex flex-col gap-2 typo-body-sm">
            <span className="text-primary font-medium mb-1">Аккаунт</span>
            {loggedIn ? (
              <Link className="text-on-surface-variant hover:text-primary transition-colors" href="/dashboard">Панель управления</Link>
            ) : (
              <>
                <Link className="text-on-surface-variant hover:text-primary transition-colors" href="/login">Вход</Link>
                <Link className="text-on-surface-variant hover:text-primary transition-colors" href="/register">Регистрация</Link>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
