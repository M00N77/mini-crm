import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { ThemeToggle } from "@/shared/ui";

export const metadata: Metadata = {
  title: "Пользовательское соглашение — Nexus CRM",
  description: "Условия использования веб-сервиса и программного обеспечения Nexus CRM",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-canvas text-text-primary flex flex-col font-sans selection:bg-accent/20 selection:text-accent">
      {/* ── Fixed Header ── */}
      <header className="sticky top-0 w-full bg-canvas/85 backdrop-blur-md border-b border-border-subtle z-50 px-container-padding h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-text-secondary hover:text-text-primary transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>На главную</span>
          </Link>
          <span className="text-border-strong hidden sm:inline">/</span>
          <span className="font-mono text-xs text-text-tertiary hidden sm:inline">
            LEGAL / TERMS
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/register"
            className="px-3 py-1 bg-accent text-accent-contrast font-mono text-xs font-bold hover:bg-accent-hover transition-colors"
          >
            Попробовать CRM
          </Link>
        </div>
      </header>

      {/* ── Main Legal Container ── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-container-padding py-12 sm:py-16">
        {/* Document Header */}
        <div className="space-y-4 pb-8 border-b border-border-subtle">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-border-strong bg-surface font-mono text-xs text-accent">
            <FileText className="h-3.5 w-3.5" />
            <span>Публичная оферта и правила</span>
          </div>

          <h1 className="typo-display text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
            Пользовательское соглашение
          </h1>

          <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-text-tertiary">
            <span>Редакция от: 1 января 2026 г.</span>
            <span>•</span>
            <span>Сервис: Nexus CRM</span>
            <span>•</span>
            <span>Статус: Действующая</span>
          </div>
        </div>

        {/* Legal Text Content */}
        <div className="pt-8 space-y-10 text-sm leading-relaxed text-text-secondary font-sans">
          {/* Преамбула */}
          <section className="p-4 bg-subtle/50 border border-border-subtle text-xs leading-relaxed">
            <p className="text-text-primary font-medium">
              Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между Администрацией сервиса Nexus CRM (далее — «Администрация» или «Сервис») и физическим или юридическим лицом (далее — «Пользователь»), возникающие при использовании веб-приложения и сопутствующих сервисов.
            </p>
            <p className="mt-2 text-text-secondary">
              Регистрация учетной записи в Сервисе либо фактическое использование его функционала означает безоговорочное принятие (акцепт) всех условий настоящего Соглашения.
            </p>
          </section>

          {/* Раздел 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-sans text-text-primary flex items-center gap-2">
              <span className="font-mono text-accent text-sm">01.</span> Термины и определения
            </h2>
            <div className="space-y-2 text-xs sm:text-sm">
              <p>
                <strong>1.1. Сервис</strong> — программный комплекс Nexus CRM, представляющий собой облачную систему управления контактами, сделками, задачами и заметками.
              </p>
              <p>
                <strong>1.2. Пользователь</strong> — дееспособное физическое лицо либо уполномоченный представитель юридического лица, прошедший регистрацию в Сервисе.
              </p>
              <p>
                <strong>1.3. Учетная запись (Аккаунт)</strong> — персонализированный раздел Сервиса, доступ к которому осуществляется с использованием пары уникальных аутентификационных данных (email и пароль).
              </p>
              <p>
                <strong>1.4. Рабочее пространство</strong> — структурированный набор данных (контакты, задачи, заметки), создаваемый и обрабатываемый Пользователем.
              </p>
            </div>
          </section>

          {/* Раздел 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-sans text-text-primary flex items-center gap-2">
              <span className="font-mono text-accent text-sm">02.</span> Предмет Соглашения и доступ к функционалу
            </h2>
            <div className="space-y-2 text-xs sm:text-sm">
              <p>
                <strong>2.1.</strong> Администрация предоставляет Пользователю право использования Сервиса на условиях простой (неисключительной) безвозмездной или возмездной лицензии способами, предусмотренными функционалом интерфейса.
              </p>
              <p>
                <strong>2.2.</strong> Доступные базовые функции включают: ведение базы контрагентов, канбан-доску управления задачами, журнал заметок и использование клавиатурных шорткатов.
              </p>
            </div>
          </section>

          {/* Раздел 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-sans text-text-primary flex items-center gap-2">
              <span className="font-mono text-accent text-sm">03.</span> Регистрация и безопасность учетной записи
            </h2>
            <div className="space-y-2 text-xs sm:text-sm">
              <p>
                <strong>3.1.</strong> Для получения доступа к личному кабинету Пользователь обязуется предоставить достоверную информацию при регистрации и поддерживать её в актуальном состоянии.
              </p>
              <p>
                <strong>3.2.</strong> Пользователь самостоятельно несет ответственность за сохранность конфиденциальности своих аутентификационных данных (пароля) и за все действия, совершенные под его учетной записью.
              </p>
              <p>
                <strong>3.3.</strong> В случае обнаружения факта несанкционированного доступа Пользователь обязан незамедлительно уведомить Администрацию по адресу: <a href="mailto:kplatonglfc@gmail.com" className="text-accent hover:underline font-mono">kplatonglfc@gmail.com</a>.
              </p>
            </div>
          </section>

          {/* Раздел 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-sans text-text-primary flex items-center gap-2">
              <span className="font-mono text-accent text-sm">04.</span> Права и обязанности сторон
            </h2>
            <div className="space-y-2 text-xs sm:text-sm">
              <p><strong>4.1. Пользователь обязуется:</strong></p>
              <ul className="list-disc pl-5 space-y-1 marker:text-accent">
                <li>Не использовать Сервис для хранения, передачи или распространения информации, противоречащей действующему законодательству;</li>
                <li>Не предпринимать действий, направленных на дестабилизацию работы серверов, поиск уязвимостей или нарушение сетевой безопасности;</li>
                <li>Не осуществлять декомпиляцию, модификацию или создание производных продуктов на базе исходного программного кода Сервиса без предварительного согласия правообладателя.</li>
              </ul>
              <p className="pt-2"><strong>4.2. Администрация вправе:</strong></p>
              <ul className="list-disc pl-5 space-y-1 marker:text-accent">
                <li>Вносить изменения в интерфейс, логику работы и структуру Сервиса с целью улучшения его потребительских свойств;</li>
                <li>Проводить регламентные технические работы с кратковременным ограничением доступа;</li>
                <li>Блокировать или удалять учетные записи при систематическом или грубом нарушении условий настоящего Соглашения.</li>
              </ul>
            </div>
          </section>

          {/* Раздел 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-sans text-text-primary flex items-center gap-2">
              <span className="font-mono text-accent text-sm">05.</span> Интеллектуальная собственность и права на контент
            </h2>
            <div className="space-y-2 text-xs sm:text-sm">
              <p>
                <strong>5.1.</strong> Все исключительные права на программный код, дизайн, товарные знаки и графические элементы Сервиса принадлежат Администрации.
              </p>
              <p>
                <strong>5.2.</strong> Все права на информацию, загруженную или внесенную Пользователем в свое рабочее пространство (базы клиентов, текст заметок, задачи), сохраняются за Пользователем.
              </p>
            </div>
          </section>

          {/* Раздел 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-sans text-text-primary flex items-center gap-2">
              <span className="font-mono text-accent text-sm">06.</span> Ограничение ответственности («КАК ЕСТЬ»)
            </h2>
            <div className="space-y-2 text-xs sm:text-sm">
              <p>
                <strong>6.1.</strong> Сервис предоставляется на условиях «КАК ЕСТЬ» («AS IS»). Администрация не гарантирует, что Сервис будет соответствовать индивидуальным субъективным ожиданиям Пользователя либо работать непрерывно и безошибочно.
              </p>
              <p>
                <strong>6.2.</strong> Администрация не несет ответственности за возможную упущенную выгоду, косвенные убытки или утрату данных, возникшие в результате использования либо невозможности использования Сервиса.
              </p>
            </div>
          </section>

          {/* Раздел 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-sans text-text-primary flex items-center gap-2">
              <span className="font-mono text-accent text-sm">07.</span> Изменение условий и контакты
            </h2>
            <div className="space-y-2 text-xs sm:text-sm">
              <p>
                <strong>7.1.</strong> Настоящее Соглашение может быть изменено Администрацией в одностороннем порядке. Актуальная редакция публикуется по адресу: <span className="font-mono text-text-primary">/terms</span>.
              </p>
              <p>
                <strong>7.2.</strong> По вопросам, касающимся условий настоящего Соглашения, Пользователи могут обращаться по электронной почте: <a href="mailto:kplatonglfc@gmail.com" className="text-accent hover:underline font-mono">kplatonglfc@gmail.com</a>.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border-subtle py-8 px-container-padding bg-surface font-mono text-xs text-text-tertiary">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-text-primary">
            <span className="h-4 w-4 bg-accent flex items-center justify-center text-[10px] text-accent-contrast font-bold">
              N
            </span>
            <span className="font-bold">Nexus CRM</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-text-primary transition-colors">Главная</Link>
            <Link href="/privacy" className="hover:text-text-primary transition-colors">Политика конфиденциальности</Link>
            <a href="mailto:kplatonglfc@gmail.com" className="hover:text-text-primary transition-colors">kplatonglfc@gmail.com</a>
          </div>
          <div>© 2026 Nexus CRM.</div>
        </div>
      </footer>
    </div>
  );
}
