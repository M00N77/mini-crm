"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Kanban, 
  FileText, 
  Check, 
  ArrowRight, 
  LayoutDashboard, 
  Terminal, 
  Database,
  Search,
  Clock,
  Command,
  Zap,
  ArrowUpRight,
  Shield,
  Layers,
  Sparkles
} from "lucide-react";
import { useAuthStore } from "@/shared/store/use-auth-store";
import { Button, ThemeToggle } from "@/shared/ui";

// ── Mock Data for Live Interactive Demos ──
const MOCK_CONTACTS = [
  { id: "CNT-8041", name: "Александр Волков", company: "CyberPulse Labs", email: "a.volkov@cyberpulse.io", status: "VIP", deals: "₽2.4M" },
  { id: "CNT-8042", name: "Елена Смирнова", company: "AeroTech Systems", email: "e.smirnova@aerotech.ru", status: "LEAD", deals: "₽850K" },
  { id: "CNT-8043", name: "Дмитрий Соколов", company: "FinGrid Capital", email: "d.sokolov@fingrid.com", status: "ACTIVE", deals: "₽5.1M" },
  { id: "CNT-8044", name: "Мария Романова", company: "Quantum Logistics", email: "m.romanova@qlog.ru", status: "PARTNER", deals: "₽1.2M" },
];

const MOCK_TASKS = [
  { id: "TSK-109", title: "Согласовать SLA для CyberPulse", priority: "P0", status: "in-progress", due: "Сегодня, 18:00" },
  { id: "TSK-110", title: "Миграция схемы контактов в PostgreSQL", priority: "P1", status: "pending", due: "Завтра, 12:00" },
  { id: "TSK-111", title: "Подготовка REST API спецификации", priority: "P2", status: "completed", due: "Выполнено" },
  { id: "TSK-112", title: "Интеграция вебхуков оплаты", priority: "P1", status: "in-progress", due: "20 авг" },
];

const MOCK_NOTES = [
  { id: "NOT-401", title: "Переговоры с FinGrid Capital", date: "18 авг 2026", preview: "Обсудили расширение лицензий до 50 рабочих мест. Требуется выделенный IP.", contact: "Дмитрий Соколов" },
  { id: "NOT-402", title: "Требования к безопасности AeroTech", date: "17 авг 2026", preview: "Необходим аудит 2FA и строгая изоляция сессий по JWT refresh-токенам.", contact: "Елена Смирнова" },
];

export default function LandingPage() {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuth = useAuthStore((state) => state.isAuth);
  const accessToken = useAuthStore((state) => state.accessToken);

  const loggedIn = isHydrated && Boolean(isAuth && accessToken);

  // ── Interactive Terminal State ──
  const [activeTab, setActiveTab] = React.useState<"contacts" | "kanban" | "notes">("contacts");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [demoTasks, setDemoTasks] = React.useState(MOCK_TASKS);
  const [selectedTaskFilter, setSelectedTaskFilter] = React.useState<string>("all");
  const [cmdSearch, setCmdSearch] = React.useState("");

  const filteredContacts = React.useMemo(() => {
    return MOCK_CONTACTS.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredTasks = React.useMemo(() => {
    if (selectedTaskFilter === "all") return demoTasks;
    return demoTasks.filter((t) => t.status === selectedTaskFilter);
  }, [demoTasks, selectedTaskFilter]);

  const toggleTaskStatus = (id: string) => {
    setDemoTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === "pending" ? "in-progress" : t.status === "in-progress" ? "completed" : "pending";
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  return (
    <div className="min-h-screen bg-canvas text-text-primary flex flex-col font-sans selection:bg-accent/20 selection:text-accent">
      {/* ── Precision Fixed Navigation ── */}
      <nav className="fixed top-0 w-full bg-canvas/85 backdrop-blur-md border-b border-border-subtle z-50 px-container-padding h-14 flex items-center justify-between">
        <div className="flex items-center gap-gutter">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-6 w-6 rounded-none bg-accent flex items-center justify-center font-mono font-bold text-accent-contrast text-xs tracking-tighter transition-transform group-hover:scale-105">
              N
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans font-bold text-text-primary tracking-tight text-sm">Nexus CRM</span>
              <span className="font-mono text-[10px] text-accent px-1 py-0.2 rounded-none border border-accent-border bg-accent-subtle">v2.4</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 ml-8 font-mono text-xs">
            <a href="#demo" className="text-text-secondary hover:text-text-primary transition-colors">
              Демо
            </a>
            <a href="#contacts" className="text-text-secondary hover:text-text-primary transition-colors">
              Контакты
            </a>
            <a href="#kanban" className="text-text-secondary hover:text-text-primary transition-colors">
              Канбан
            </a>
            <a href="#architecture" className="text-text-secondary hover:text-text-primary transition-colors">
              Архитектура
            </a>
            <a href="#pricing" className="text-text-secondary hover:text-text-primary transition-colors">
              Тарифы
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {loggedIn ? (
            <Link href="/dashboard">
              <Button size="sm" className="gap-1.5 rounded-none font-medium">
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Панель управления</span>
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="rounded-none">
                  Войти
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-none font-medium">
                  Регистрация
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* ── Kinetic Hero Section ── */}
      <section className="relative min-h-[820px] flex flex-col items-center justify-start pt-28 pb-20 px-container-padding overflow-hidden border-b border-border-subtle">
        {/* Coordinate Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-subtle)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-subtle)_1px,transparent_1px)] bg-[size:32px_32px] opacity-35 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/5 rounded-none blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl text-center flex flex-col items-center gap-6">
          {/* Status Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-none border border-border-strong bg-surface text-text-secondary font-mono text-xs shadow-xs"
          >
            <span className="h-1.5 w-1.5 rounded-none bg-status-success animate-pulse" />
            <span className="text-text-primary font-medium">v2.4</span>
            <span className="text-border-strong">/</span>
            <span className="text-text-secondary">Keyboard-First CRM</span>
            <span className="text-border-strong">/</span>
            <span className="text-accent font-semibold">Latency ~11ms</span>
          </motion.div>

          {/* Kinetic Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="typo-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08] text-text-primary text-balance"
          >
            Минималистичная CRM для тех, кто ценит скорость.
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-text-secondary text-base sm:text-lg max-w-2xl leading-relaxed text-pretty"
          >
            Быстрый рабочий интерфейс для управления сделками, канбаном и контактами. Мгновенный отклик, навигация через ⌘K и нулевой визуальный шум.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3.5 mt-1"
          >
            <Link href={loggedIn ? "/dashboard" : "/register"}>
              <Button size="lg" className="px-6 h-10 font-semibold gap-2 rounded-none">
                <span>{loggedIn ? "Открыть дашборд" : "Начать работу бесплатно"}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#demo">
              <Button variant="outline" size="lg" className="px-6 h-10 font-mono text-xs gap-2 rounded-none">
                <Terminal className="h-3.5 w-3.5 text-accent" />
                <span>Открыть демо-стенд</span>
              </Button>
            </a>
          </motion.div>
        </div>

        {/* ── Live Interactive CRM Cockpit (Hero Embedded Terminal) ── */}
        <motion.div 
          id="demo"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="scroll-mt-24 relative z-10 mt-12 w-full max-w-5xl rounded-none border border-border-strong bg-surface shadow-2xl overflow-hidden"
        >
          {/* Cockpit Window Header */}
          <div className="bg-subtle border-b border-border-subtle px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-text-tertiary">
                <span className="w-2.5 h-2.5 rounded-none bg-status-danger/80" />
                <span className="w-2.5 h-2.5 rounded-none bg-status-warning/80" />
                <span className="w-2.5 h-2.5 rounded-none bg-status-success/80" />
              </div>
              <span className="font-mono text-xs font-semibold text-text-primary ml-2 flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-accent" />
                app.nexus-crm.com/live-demo
              </span>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex items-center bg-surface border border-border-subtle rounded-none p-0.5 font-mono text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("contacts")}
                className={`px-3 py-1 rounded-none transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "contacts"
                    ? "bg-accent text-accent-contrast font-bold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>Контакты</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("kanban")}
                className={`px-3 py-1 rounded-none transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "kanban"
                    ? "bg-accent text-accent-contrast font-bold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Kanban className="h-3.5 w-3.5" />
                <span>Канбан</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("notes")}
                className={`px-3 py-1 rounded-none transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "notes"
                    ? "bg-accent text-accent-contrast font-bold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Заметки</span>
              </button>
            </div>
          </div>

          {/* Cockpit Interactive Content */}
          <div className="p-5 sm:p-6 bg-surface min-h-[360px]">
            <AnimatePresence mode="wait">
              {activeTab === "contacts" && (
                <motion.div
                  key="contacts-tab"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {/* Search and Action Bar */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск по имени, компании или ID (напр. Волков)..."
                        className="w-full bg-subtle border border-border-subtle rounded-none pl-9 pr-3 py-1.5 font-mono text-xs text-text-primary placeholder:text-text-tertiary focus:border-border-strong focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs text-text-secondary">
                      <span className="border border-border-subtle px-2 py-1 rounded-none bg-subtle">
                        НАЙДЕНО: {filteredContacts.length}
                      </span>
                    </div>
                  </div>

                  {/* Dense Table View */}
                  <div className="border border-border-subtle rounded-none overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead>
                        <tr className="bg-subtle text-text-secondary border-b border-border-subtle">
                          <th className="py-2.5 px-3 font-semibold">ID</th>
                          <th className="py-2.5 px-3 font-semibold">КОНТАКТ</th>
                          <th className="py-2.5 px-3 font-semibold">КОМПАНИЯ</th>
                          <th className="py-2.5 px-3 font-semibold">СТАТУС</th>
                          <th className="py-2.5 px-3 font-semibold text-right">ОБЪЕМ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle">
                        {filteredContacts.map((contact) => (
                          <tr key={contact.id} className="hover:bg-subtle/70 transition-colors group">
                            <td className="py-2.5 px-3 text-text-tertiary">{contact.id}</td>
                            <td className="py-2.5 px-3 font-sans font-medium text-text-primary">
                              {contact.name}
                              <div className="text-[11px] text-text-tertiary font-mono">{contact.email}</div>
                            </td>
                            <td className="py-2.5 px-3 text-text-secondary font-sans">{contact.company}</td>
                            <td className="py-2.5 px-3">
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-none text-[10px] font-bold tracking-wider ${
                                contact.status === "VIP" 
                                   ? "bg-accent-subtle text-accent border border-accent-border"
                                  : contact.status === "LEAD"
                                  ? "bg-status-info/10 text-status-info border border-status-info/20"
                                  : "bg-status-success/10 text-status-success border border-status-success/20"
                              }`}>
                                [{contact.status}]
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-text-primary tabular-nums">
                              {contact.deals}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-right text-[11px] font-mono text-text-tertiary">
                    💡 Мгновенная локальная фильтрация без сетевой задержки
                  </div>
                </motion.div>
              )}

              {activeTab === "kanban" && (
                <motion.div
                  key="kanban-tab"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <span className="text-text-secondary mr-2">ФИЛЬТР:</span>
                      {(["all", "pending", "in-progress", "completed"] as const).map((filter) => (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => setSelectedTaskFilter(filter)}
                          className={`px-2.5 py-1 rounded-none border transition-colors cursor-pointer ${
                            selectedTaskFilter === filter
                              ? "bg-accent text-accent-contrast border-accent font-bold"
                              : "border-border-subtle bg-subtle text-text-secondary hover:text-text-primary"
                          }`}
                        >
                          {filter.toUpperCase()}
                        </button>
                      ))}
                    </div>
                    <div className="text-xs font-mono text-text-tertiary">
                      Кликните на карточку для смены статуса (Optimistic Update)
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Columns */}
                    {(["pending", "in-progress", "completed"] as const).map((colStatus) => {
                      const colTasks = filteredTasks.filter((t) => t.status === colStatus);
                      return (
                        <div key={colStatus} className="border border-border-subtle rounded-none bg-subtle/50 p-3 flex flex-col gap-2.5">
                          <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                            <span className="font-mono text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-none ${
                                colStatus === "pending" ? "bg-text-tertiary" : colStatus === "in-progress" ? "bg-accent" : "bg-status-success"
                              }`} />
                              {colStatus === "pending" ? "В очереди" : colStatus === "in-progress" ? "В работе" : "Готово"}
                            </span>
                            <span className="font-mono text-[11px] text-text-tertiary px-1.5 py-0.2 rounded-none bg-surface border border-border-subtle">
                              {colTasks.length}
                            </span>
                          </div>

                          <div className="flex flex-col gap-2 min-h-[140px]">
                            {colTasks.map((task) => (
                              <button
                                key={task.id}
                                type="button"
                                onClick={() => toggleTaskStatus(task.id)}
                                className="text-left border border-border-subtle rounded-none bg-surface p-2.5 hover:border-border-strong transition-all cursor-pointer shadow-xs group"
                              >
                                <div className="flex items-center justify-between gap-2 mb-1.5 font-mono text-[11px]">
                                  <span className="text-text-tertiary group-hover:text-accent transition-colors">{task.id}</span>
                                  <span className="px-1 py-0.2 rounded-none text-[10px] font-bold bg-subtle border border-border-subtle text-text-secondary">
                                    [{task.priority}]
                                  </span>
                                </div>
                                <div className="font-sans text-xs font-medium text-text-primary leading-snug">
                                  {task.title}
                                </div>
                                <div className="mt-2 text-[10px] font-mono text-text-tertiary flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{task.due}</span>
                                </div>
                              </button>
                            ))}
                            {colTasks.length === 0 && (
                              <div className="h-full flex items-center justify-center text-text-tertiary font-mono text-xs border border-dashed border-border-subtle rounded-none py-6">
                                // НЕТ ЗАДАЧ
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === "notes" && (
                <motion.div
                  key="notes-tab"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {MOCK_NOTES.map((note) => (
                      <div key={note.id} className="border border-border-subtle rounded-none bg-subtle/40 p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between font-mono text-[11px] text-text-tertiary mb-2">
                            <span>{note.id}</span>
                            <span className="flex items-center gap-1 text-accent font-medium">
                              <Users className="h-3 w-3" />
                              {note.contact}
                            </span>
                          </div>
                          <h4 className="font-sans text-sm font-bold text-text-primary mb-2">{note.title}</h4>
                          <p className="font-sans text-xs text-text-secondary leading-relaxed">{note.preview}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-border-subtle font-mono text-[11px] text-text-tertiary flex items-center justify-between">
                          <span>{note.date}</span>
                          <span className="text-accent hover:underline cursor-pointer">Открыть протокол →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cockpit Status Bar */}
          <div className="bg-subtle border-t border-border-subtle px-4 py-2 flex items-center justify-between font-mono text-[11px] text-text-tertiary flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="text-status-success flex items-center gap-1 font-semibold">
                ● 200 OK
              </span>
              <span>POSTGRESQL 17</span>
              <span>UTF-8</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="border border-border-subtle bg-surface px-1.5 py-0.5 rounded-none text-text-secondary font-medium">
                НАВИГАЦИЯ ЧЕРЕЗ ⌘K
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Key Metrics Bar ── */}
      <section className="border-b border-border-subtle bg-subtle/50 py-8 px-container-padding">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-accent tabular-nums">~11ms</div>
            <div className="text-xs text-text-secondary">Время отклика REST API</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-accent tabular-nums">0ms</div>
            <div className="text-xs text-text-secondary">Задержка UI (Optimistic)</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-accent">⌘K</div>
            <div className="text-xs text-text-secondary">Управление с клавиатуры</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-accent">ACID</div>
            <div className="text-xs text-text-secondary">Реляционная БД PostgreSQL</div>
          </div>
        </div>
      </section>

      {/* ── Feature Deep-Dives (Clear UX-Driven Showcases) ── */}
      <section className="py-24 px-container-padding max-w-6xl mx-auto w-full space-y-28">
        
        {/* Showcase 1: Contacts Table */}
        <motion.div 
          id="contacts"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="scroll-mt-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          <div className="lg:col-span-5 space-y-4">
            <div className="font-mono text-xs text-accent font-bold tracking-wider uppercase">
              База контактов
            </div>
            <h2 className="typo-display text-2xl sm:text-3xl text-text-primary tracking-tight font-bold">
              Работа с базой контактов без задержек.
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Таблица с мгновенной локальной фильтрацией, серверной пагинацией и просмотром карточек без перезагрузки страниц. Никаких тяжелых интерфейсных фреймворков и визуального мусора.
            </p>
            <div className="pt-2 flex flex-col gap-2.5 font-sans text-xs text-text-secondary">
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span><strong className="text-text-primary font-semibold">Мгновенный поиск:</strong> фильтрация по префиксам, именам и компаниям прямо при вводе.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span><strong className="text-text-primary font-semibold">Связанные сущности:</strong> быстрый доступ к истории сделок, задачам и заметкам из строки контакта.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span><strong className="text-text-primary font-semibold">Плотное отображение:</strong> максимум полезных данных на одном экране без лишней прокрутки.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 border border-border-strong rounded-none bg-surface p-5 shadow-xl">
            <div className="font-mono text-xs text-text-tertiary pb-3 mb-3 border-b border-border-subtle flex items-center justify-between">
              <span>РЕЕСТР КЛИЕНТОВ И ПАРТНЕРОВ</span>
              <span className="text-accent font-semibold">4 АКТИВНЫХ</span>
            </div>
            <div className="space-y-2">
              {MOCK_CONTACTS.slice(0, 3).map((c) => (
                <div key={c.id} className="border border-border-subtle rounded-none p-3 bg-subtle/50 flex items-center justify-between font-mono text-xs">
                  <div>
                    <div className="font-sans font-bold text-text-primary">{c.name}</div>
                    <div className="text-text-tertiary text-[11px]">{c.company} • {c.email}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-accent font-bold">{c.deals}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Showcase 2: Kanban Pipeline */}
        <motion.div 
          id="kanban"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="scroll-mt-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          <div className="lg:col-span-7 order-2 lg:order-1 border border-border-strong rounded-none bg-surface p-5 shadow-xl">
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="border border-border-subtle rounded-none bg-subtle p-3 space-y-2">
                <div className="text-accent font-bold flex items-center gap-1.5 pb-2 border-b border-border-subtle">
                  <span>В РАБОТЕ</span>
                  <span className="text-[10px] text-text-tertiary">(2)</span>
                </div>
                <div className="bg-surface border border-border-subtle p-2.5 rounded-none text-xs space-y-1">
                  <span className="text-[10px] text-text-tertiary">TSK-109 • [P0]</span>
                  <div className="font-sans font-medium text-text-primary text-[12px]">Согласовать SLA контракт</div>
                </div>
                <div className="bg-surface border border-border-subtle p-2.5 rounded-none text-xs space-y-1">
                  <span className="text-[10px] text-text-tertiary">TSK-112 • [P1]</span>
                  <div className="font-sans font-medium text-text-primary text-[12px]">Подключить API платежей</div>
                </div>
              </div>

              <div className="border border-border-subtle rounded-none bg-subtle p-3 space-y-2">
                <div className="text-status-success font-bold flex items-center gap-1.5 pb-2 border-b border-border-subtle">
                  <span>ВЫПОЛНЕНО</span>
                  <span className="text-[10px] text-text-tertiary">(1)</span>
                </div>
                <div className="bg-surface border border-border-subtle p-2.5 rounded-none text-xs space-y-1 opacity-80">
                  <span className="text-[10px] text-text-tertiary">TSK-111 • [P2]</span>
                  <div className="font-sans font-medium text-text-primary text-[12px] line-through">REST API спецификация</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 space-y-4">
            <div className="font-mono text-xs text-accent font-bold tracking-wider uppercase">
              Пайплайн задач
            </div>
            <h2 className="typo-display text-2xl sm:text-3xl text-text-primary tracking-tight font-bold">
              Управление сделками и пайплайном.
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Канбан-доска с оптимистичными обновлениями: интерфейс реагирует мгновенно, не дожидаясь ответа сервера.
            </p>
            <div className="pt-2 flex flex-col gap-2.5 font-sans text-xs text-text-secondary">
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span><strong className="text-text-primary font-semibold">Приоритеты и дедлайны:</strong> четкая градация задач [P0 / P1 / P2] со строгим контролем сроков.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span><strong className="text-text-primary font-semibold">Мгновенный Drag-and-Drop:</strong> перемещение задач и смена этапов в один клик без фризов.</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Showcase 3: Command Palette ⌘K */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          <div className="lg:col-span-5 space-y-4">
            <div className="font-mono text-xs text-accent font-bold tracking-wider uppercase">
              Быстрые действия
            </div>
            <h2 className="typo-display text-2xl sm:text-3xl text-text-primary tracking-tight font-bold">
              Навигация без отрыва рук от клавиатуры.
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Вызывайте командную панель в любой точке системы через <kbd className="font-mono bg-subtle border border-border-strong px-1.5 py-0.5 rounded-none text-text-primary text-xs">⌘K</kbd> (или <kbd className="font-mono bg-subtle border border-border-strong px-1.5 py-0.5 rounded-none text-text-primary text-xs">Ctrl+K</kbd>), чтобы мгновенно создавать записи, менять статусы и перемещаться по разделам.
            </p>
            <div className="pt-2 flex flex-col gap-2 font-mono text-xs text-text-secondary">
              <div className="flex items-center justify-between border-b border-border-subtle pb-1.5">
                <span>Создать новый контакт</span>
                <kbd className="bg-subtle border border-border-subtle px-1.5 py-0.5 rounded-none text-text-primary">Alt + C</kbd>
              </div>
              <div className="flex items-center justify-between border-b border-border-subtle pb-1.5">
                <span>Добавить задачу в пайплайн</span>
                <kbd className="bg-subtle border border-border-subtle px-1.5 py-0.5 rounded-none text-text-primary">Alt + T</kbd>
              </div>
              <div className="flex items-center justify-between border-b border-border-subtle pb-1.5">
                <span>Перейти в аналитику</span>
                <kbd className="bg-subtle border border-border-subtle px-1.5 py-0.5 rounded-none text-text-primary">G + D</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Фокус на строке поиска</span>
                <kbd className="bg-subtle border border-border-subtle px-1.5 py-0.5 rounded-none text-text-primary">/</kbd>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 border border-border-strong rounded-none bg-surface p-5 shadow-xl">
            <div className="bg-subtle border border-border-subtle rounded-none p-3 flex items-center gap-2 mb-3">
              <Command className="h-4 w-4 text-accent" />
              <input
                type="text"
                value={cmdSearch}
                onChange={(e) => setCmdSearch(e.target.value)}
                placeholder="Введите команду или имя контакта..."
                className="w-full bg-transparent font-mono text-xs text-text-primary focus:outline-none"
              />
              <span className="font-mono text-[10px] text-text-tertiary border border-border-subtle px-1.5 py-0.5 rounded-none bg-surface">ESC</span>
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="p-2 rounded-none bg-accent text-accent-contrast font-bold flex items-center justify-between cursor-pointer">
                <span>&gt; Создать новый контакт (Alt+C)</span>
                <span className="text-[10px]">ENTER</span>
              </div>
              <div className="p-2 rounded-none bg-subtle text-text-primary flex items-center justify-between hover:bg-muted cursor-pointer transition-colors">
                <span>&gt; Добавить канбан-задачу (Alt+T)</span>
                <span className="text-[10px] text-text-tertiary">ENTER</span>
              </div>
              <div className="p-2 rounded-none bg-subtle text-text-primary flex items-center justify-between hover:bg-muted cursor-pointer transition-colors">
                <span>&gt; Перейти в раздел Аналитика (G+D)</span>
                <span className="text-[10px] text-text-tertiary">ENTER</span>
              </div>
            </div>
          </div>
        </motion.div>

      </section>

      {/* ── Architecture & Performance Benchmark ── */}
      <section className="scroll-mt-14 py-20 px-container-padding bg-subtle/40 border-y border-border-subtle" id="architecture">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="font-mono text-xs text-accent font-bold uppercase tracking-wider">Архитектура</div>
            <h2 className="typo-display text-2xl sm:text-3xl text-text-primary font-bold">Спроектировано для максимальной производительности</h2>
            <p className="text-text-secondary text-sm max-w-xl mx-auto">
              Никакого избыточного оверхеда. Только строгая типизация, реляционная надежность и легковесный бандл.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-border-subtle rounded-none bg-surface p-5 space-y-3">
              <div className="h-8 w-8 rounded-none bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <Database className="h-4 w-4" />
              </div>
              <h3 className="font-sans font-bold text-text-primary text-base">ACID-хранилище PostgreSQL</h3>
              <p className="font-sans text-xs text-text-secondary leading-relaxed">
                Реляционная целостность с каскадными связями, B-Tree индексами и транзакционными миграциями.
              </p>
            </div>

            <div className="border border-border-subtle rounded-none bg-surface p-5 space-y-3">
              <div className="h-8 w-8 rounded-none bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <Shield className="h-4 w-4" />
              </div>
              <h3 className="font-sans font-bold text-text-primary text-base">Strict TypeScript 5.3</h3>
              <p className="font-sans text-xs text-text-secondary leading-relaxed">
                Сквозное 100% покрытие типов от схемы базы данных и REST API до интерфейсных компонентов.
              </p>
            </div>

            <div className="border border-border-subtle rounded-none bg-surface p-5 space-y-3">
              <div className="h-8 w-8 rounded-none bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <Zap className="h-4 w-4" />
              </div>
              <h3 className="font-sans font-bold text-text-primary text-base">Легковесный бандл</h3>
              <p className="font-sans text-xs text-text-secondary leading-relaxed">
                Статический рендеринг SSG, калиброванные шрифты Zero-CLS и отсутствие раздутых UI-зависимостей.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Transparent Capabilities & Pricing ── */}
      <section className="py-16 sm:py-20 px-container-padding max-w-5xl mx-auto w-full">
        <div id="pricing" className="scroll-mt-20 text-center mb-12 space-y-3">
          <div className="font-mono text-xs text-accent font-bold uppercase tracking-wider">Тарифы</div>
          <h2 className="typo-display text-2xl sm:text-3xl text-text-primary font-bold">Прозрачные условия. Без скрытых ограничений.</h2>
          <p className="text-text-secondary text-sm">Выбирайте подходящий вариант для себя или вашей команды.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Community Workspace */}
          <div className="border border-border-subtle rounded-none bg-surface p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-text-tertiary">ТАРИФ: COMMUNITY</span>
                <span className="border border-border-subtle px-2 py-0.5 rounded-none bg-subtle text-text-secondary font-semibold">FREE</span>
              </div>
              <h3 className="typo-headline text-xl text-text-primary font-bold">Community</h3>
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-3xl font-bold text-text-primary">0 ₽</span>
                <span className="text-xs text-text-secondary">/ навсегда</span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed font-sans">
                Для индивидуального использования, разработчиков и тестирования.
              </p>

              <ul className="space-y-2.5 font-sans text-xs text-text-secondary pt-4 border-t border-border-subtle">
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent shrink-0" /> До 10 000 запросов к API в месяц</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent shrink-0" /> Канбан-доска и реляционная база контактов</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent shrink-0" /> Редактор заметок и история активности</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent shrink-0" /> Доступ к документации REST API (Swagger)</li>
              </ul>
            </div>

            <Link href={loggedIn ? "/dashboard" : "/register"} className="w-full">
              <Button variant="outline" className="w-full font-mono text-xs rounded-none font-semibold">
                {loggedIn ? "Открыть дашборд" : "Начать бесплатно"}
              </Button>
            </Link>
          </div>

          {/* Production Dedicated */}
          <div className="border border-accent rounded-none bg-surface p-7 flex flex-col justify-between space-y-6 relative shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-accent font-bold">ТАРИФ: PRODUCTION</span>
                <span className="bg-accent text-accent-contrast px-2 py-0.5 rounded-none font-bold text-[10px]">ENTERPRISE SLA</span>
              </div>
              <h3 className="typo-headline text-xl text-text-primary font-bold">Production</h3>
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-3xl font-bold text-text-primary">1 990 ₽</span>
                <span className="text-xs text-text-secondary">/ месяц</span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed font-sans">
                Для команд, которым требуется выделенная инфраструктура и гарантированный SLA.
              </p>

              <ul className="space-y-2.5 font-sans text-xs text-text-secondary pt-4 border-t border-border-subtle">
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent shrink-0" /> Неограниченное число контактов и задач</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent shrink-0" /> Выделенный инстанс PostgreSQL</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent shrink-0" /> Поддержка вебхуков и интеграций</li>
                <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent shrink-0" /> SLA доступности 99.95%</li>
              </ul>
            </div>

            <Link href={loggedIn ? "/dashboard" : "/register"} className="w-full">
              <Button className="w-full font-mono text-xs font-bold rounded-none">
                {loggedIn ? "Перейти в CRM" : "Подключить Production"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final Call to Action ── */}
      <section className="py-20 px-container-padding border-t border-border-subtle bg-subtle/30">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="typo-display text-3xl sm:text-4xl text-text-primary font-bold">
            Разверните рабочее пространство за 30 секунд.
          </h2>
          <p className="text-text-secondary text-sm max-w-xl mx-auto">
            Чистый интерфейс, готовый к работе с первого клика. Без лишних настроек.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href={loggedIn ? "/dashboard" : "/register"}>
              <Button size="lg" className="px-8 font-semibold rounded-none">
                <span>Запустить Nexus CRM</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Precision Footer ── */}
      <footer className="border-t border-border-subtle py-10 px-container-padding bg-surface font-mono text-xs text-text-tertiary">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-text-primary font-bold">
            <span className="h-4 w-4 rounded-none bg-accent flex items-center justify-center text-[10px] text-accent-contrast font-bold">N</span>
            <span>Nexus CRM // Workspace</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-text-primary transition-colors">Панель</Link>
            <Link href="/dashboard/contacts" className="hover:text-text-primary transition-colors">Контакты</Link>
            <Link href="/dashboard/tasks" className="hover:text-text-primary transition-colors">Задачи</Link>
            <Link href="/dashboard/notes" className="hover:text-text-primary transition-colors">Заметки</Link>
          </div>
          <div>© 2026 Nexus CRM. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
