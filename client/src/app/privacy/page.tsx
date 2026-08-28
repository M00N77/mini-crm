import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { ThemeToggle } from "@/shared/ui";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Nexus CRM",
  description: "Порядок обработки и защиты персональных данных пользователей веб-сервиса Nexus CRM",
};

export default function PrivacyPolicyPage() {
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
            LEGAL / PRIVACY
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
            <Shield className="h-3.5 w-3.5" />
            <span>Юридический документ</span>
          </div>

          <h1 className="typo-display text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
            Политика конфиденциальности
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
          {/* Вводная часть */}
          <section className="p-4 bg-subtle/50 border border-border-subtle text-xs leading-relaxed">
            <p className="text-text-primary font-medium">
              Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок обработки и защиты информации о физических лицах, использующих веб-сервис Nexus CRM (далее — «Сервис»).
            </p>
            <p className="mt-2 text-text-secondary">
              Используя Сервис, регистрируя учетную запись или отправляя данные через формы на сайте, Пользователь выражает согласие с условиями настоящей Политики.
            </p>
          </section>

          {/* Раздел 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-sans text-text-primary flex items-center gap-2">
              <span className="font-mono text-accent text-sm">01.</span> Общие положения
            </h2>
            <div className="space-y-2 text-xs sm:text-sm">
              <p>
                <strong>1.1.</strong> Оператором персональных данных является Администрация сервиса Nexus CRM (далее — «Оператор»). Контактный адрес электронной почты для обращений: <a href="mailto:kplatonglfc@gmail.com" className="text-accent hover:underline font-mono">kplatonglfc@gmail.com</a>.
              </p>
              <p>
                <strong>1.2.</strong> Оператор ставит важнейшей целью соблюдение прав и свобод человека и гражданина при обработке его персональных данных, включая защиту прав на неприкосновенность частной жизни, личную и семейную тайну.
              </p>
              <p>
                <strong>1.3.</strong> Настоящая Политика применяется ко всей информации, которую Оператор может получить о посетителях и зарегистрированных пользователях Сервиса.
              </p>
            </div>
          </section>

          {/* Раздел 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-sans text-text-primary flex items-center gap-2">
              <span className="font-mono text-accent text-sm">02.</span> Состав и категории обрабатываемых данных
            </h2>
            <div className="space-y-2 text-xs sm:text-sm">
              <p>Оператор обрабатывает следующие категории данных:</p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-accent">
                <li>
                  <strong className="text-text-primary">Данные учетной записи:</strong> адрес электронной почты (email), имя пользователя (псевдоним), криптографический хэш пароля (пароли в открытом виде не сохраняются).
                </li>
                <li>
                  <strong className="text-text-primary">Данные рабочего пространства:</strong> контакты, названия организаций, email, статусы сделок, заметки и задачи, вносимые Пользователем в интерфейс CRM.
                </li>
                <li>
                  <strong className="text-text-primary">Технические и телеметрические данные:</strong> IP-адрес, тип и версия браузера, данные файлов cookie (session cookies), дата и время запросов к API для обеспечения стабильности и безопасности работы.
                </li>
              </ul>
            </div>
          </section>

          {/* Раздел 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-sans text-text-primary flex items-center gap-2">
              <span className="font-mono text-accent text-sm">03.</span> Цели обработки данных
            </h2>
            <div className="space-y-2 text-xs sm:text-sm">
              <p>Обработка персональных данных осуществляется исключительно в следующих целях:</p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-accent">
                <li>Регистрация, идентификация и авторизация Пользователя в веб-интерфейсе Сервиса;</li>
                <li>Предоставление доступа к основному функционалу CRM: учет клиентов, канбан-доска, реестр заметок;</li>
                <li>Направление сервисных уведомлений, ответов на запросы технической поддержки и сообщений о восстановлении доступа;</li>
                <li>Обеспечение стабильности, отказоустойчивости и защиты интерфейса от несанкционированного доступа.</li>
              </ul>
            </div>
          </section>

          {/* Раздел 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-sans text-text-primary flex items-center gap-2">
              <span className="font-mono text-accent text-sm">04.</span> Правовые основания обработки
            </h2>
            <div className="space-y-2 text-xs sm:text-sm">
              <p>
                <strong>4.1.</strong> Согласие Пользователя на обработку персональных данных, предоставляемое в момент регистрации или заполнения форм на сайте.
              </p>
              <p>
                <strong>4.2.</strong> Необходимость исполнения Пользовательского соглашения, стороной которого является Пользователь.
              </p>
            </div>
          </section>

          {/* Раздел 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-sans text-text-primary flex items-center gap-2">
              <span className="font-mono text-accent text-sm">05.</span> Порядок хранения и защиты данных
            </h2>
            <div className="space-y-2 text-xs sm:text-sm">
              <p>
                <strong>5.1.</strong> Безопасность данных обеспечивается применением современных организационно-технических мер: передача трафика по защищенному протоколу HTTPS/TLS, хэширование паролей алгоритмом Bcrypt, разделение сессий через пары JWT-токенов.
              </p>
              <p>
                <strong>5.2.</strong> Оператор не продает и не передает данные третьим лицам, за исключением хостинг-провайдеров инфраструктуры в объемах, технически необходимых для функционирования Сервиса, либо в случаях, прямо предусмотренных действующим законодательством.
              </p>
              <p>
                <strong>5.3.</strong> Данные хранятся до момента удаления учетной записи Пользователем или направления запроса на прекращение обработки данных.
              </p>
            </div>
          </section>

          {/* Раздел 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-sans text-text-primary flex items-center gap-2">
              <span className="font-mono text-accent text-sm">06.</span> Права Пользователя
            </h2>
            <div className="space-y-2 text-xs sm:text-sm">
              <p>Пользователь имеет право:</p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-accent">
                <li>Получать информацию об объеме и составе обрабатываемых персональных данных;</li>
                <li>Требовать уточнения, блокирования или полного удаления своих данных;</li>
                <li>Отозвать согласие на обработку, направив обращение на email: <a href="mailto:kplatonglfc@gmail.com" className="text-accent hover:underline font-mono">kplatonglfc@gmail.com</a>.</li>
              </ul>
            </div>
          </section>

          {/* Раздел 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-sans text-text-primary flex items-center gap-2">
              <span className="font-mono text-accent text-sm">07.</span> Файлы Cookie
            </h2>
            <div className="space-y-2 text-xs sm:text-sm">
              <p>
                <strong>7.1.</strong> Сервис использует технические cookie-файлы исключительно для поддержания активной сессии аутентификации и сохранения настроек интерфейса (включая выбор цветовой темы).
              </p>
              <p>
                <strong>7.2.</strong> Пользователь может отключить сохранение cookie в настройках браузера, однако это приведет к невозможности авторизации в системе.
              </p>
            </div>
          </section>

          {/* Раздел 8 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold font-sans text-text-primary flex items-center gap-2">
              <span className="font-mono text-accent text-sm">08.</span> Заключительные положения
            </h2>
            <div className="space-y-2 text-xs sm:text-sm">
              <p>
                <strong>8.1.</strong> Оператор оставляет за собой право вносить изменения в настоящую Политику. Новая редакция вступает в силу с момента ее публикации на данной странице.
              </p>
              <p>
                <strong>8.2.</strong> Вопросы и запросы по обработке персональных данных направляются по адресу: <a href="mailto:kplatonglfc@gmail.com" className="text-accent hover:underline font-mono">kplatonglfc@gmail.com</a>.
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
            <Link href="/terms" className="hover:text-text-primary transition-colors">Пользовательское соглашение</Link>
            <a href="mailto:kplatonglfc@gmail.com" className="hover:text-text-primary transition-colors">kplatonglfc@gmail.com</a>
          </div>
          <div>© 2026 Nexus CRM.</div>
        </div>
      </footer>
    </div>
  );
}
