"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Users,
  PlayCircle,
  Clock,
  CheckCircle2,
  StickyNote,
  ArrowRight,
  User,
  Building2,
} from "lucide-react";
import { BlurFade, Spinner } from "@/shared/ui";
import { useContacts } from "@/entities/contact";
import { useTasks, Task } from "@/entities/task";
import { useNotes } from "@/entities/note";
import { useModalStore } from "@/shared/store/modal-store";
import { CreateTaskButton } from "@/features/task-mutations";
import { CreateContactButton } from "@/features/contact-management";
import { cn } from "@/shared/lib";

export function DashboardOverview() {
  const { openModal } = useModalStore();

  const { data: contactsResponse, isLoading: isContactsLoading } = useContacts({
    limit: 100,
  });
  const { data: tasksResponse, isLoading: isTasksLoading } = useTasks({
    limit: 100,
  });
  const { data: notesResponse, isLoading: isNotesLoading } = useNotes({
    limit: 100,
  });

  const contactsList = useMemo(() => {
    if (Array.isArray(contactsResponse)) return contactsResponse;
    return contactsResponse?.data || [];
  }, [contactsResponse]);

  const tasksList: Task[] = useMemo(() => {
    if (Array.isArray(tasksResponse)) return tasksResponse;
    return tasksResponse?.data || [];
  }, [tasksResponse]);

  const notesList = useMemo(() => {
    if (Array.isArray(notesResponse)) return notesResponse;
    return notesResponse?.data || [];
  }, [notesResponse]);

  // Расчет метрик
  const totalContacts = contactsResponse?.pagination?.total ?? contactsList.length;
  const totalNotes = notesResponse?.pagination?.total ?? notesList.length;
  const totalTasks = tasksList.length;

  const pendingTasks = useMemo(
    () => tasksList.filter((t) => t.status === "pending"),
    [tasksList]
  );
  const inProgressTasks = useMemo(
    () => tasksList.filter((t) => t.status === "in_progress"),
    [tasksList]
  );
  const doneTasks = useMemo(
    () => tasksList.filter((t) => t.status === "done"),
    [tasksList]
  );

  const donePercent =
    totalTasks > 0 ? Math.round((doneTasks.length / totalTasks) * 100) : 0;
  const inProgressPercent =
    totalTasks > 0 ? Math.round((inProgressTasks.length / totalTasks) * 100) : 0;
  const pendingPercent =
    totalTasks > 0 ? Math.round((pendingTasks.length / totalTasks) * 100) : 0;

  const isLoading = isContactsLoading || isTasksLoading || isNotesLoading;

  const handleEditTask = (task: Task) => {
    openModal("editTask", {
      id: task.id,
      initialValues: task,
    });
  };

  const handleEditContact = (contact: (typeof contactsList)[0]) => {
    openModal("editContact", {
      id: contact.id,
      initialValues: contact,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Action */}
      <BlurFade delay={0.05}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="typo-display text-primary">Overview</h1>
            <p className="typo-caption text-on-surface-variant/70 mt-1">
              Сводка активности и показатели CRM в реальном времени
            </p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 typo-label-mono text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 text-xs font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
            <CreateContactButton variant="outline">
              + Контакт
            </CreateContactButton>
            <CreateTaskButton variant="header">
              Создать задачу
            </CreateTaskButton>
          </div>
        </div>
      </BlurFade>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Contacts */}
        <BlurFade delay={0.1}>
          <Link
            href="/dashboard/contacts"
            className="group block bg-surface-container-lowest border border-outline-variant p-4 rounded-lg shadow-xs hover:border-outline hover:bg-surface-container-low transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="typo-caption text-on-surface-variant font-medium">
                Контакты
              </span>
              <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="typo-display text-2xl sm:text-3xl font-bold text-primary">
                {isLoading ? <Spinner size="sm" /> : totalContacts}
              </span>
            </div>
            <p className="typo-caption text-on-surface-variant/70 text-[11px] mt-1 flex items-center gap-1">
              Вся база клиентов
              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-primary" />
            </p>
          </Link>
        </BlurFade>

        {/* Tasks in Progress */}
        <BlurFade delay={0.15}>
          <Link
            href="/dashboard/tasks"
            className="group block bg-surface-container-lowest border border-outline-variant p-4 rounded-lg shadow-xs hover:border-outline hover:bg-surface-container-low transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="typo-caption text-on-surface-variant font-medium">
                В работе
              </span>
              <div className="h-7 w-7 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <PlayCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="typo-display text-2xl sm:text-3xl font-bold text-primary">
                {isLoading ? <Spinner size="sm" /> : inProgressTasks.length}
              </span>
            </div>
            <p className="typo-caption text-on-surface-variant/70 text-[11px] mt-1 flex items-center gap-1">
              Активные задачи
              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-primary" />
            </p>
          </Link>
        </BlurFade>

        {/* Pending Tasks */}
        <BlurFade delay={0.2}>
          <Link
            href="/dashboard/tasks"
            className="group block bg-surface-container-lowest border border-outline-variant p-4 rounded-lg shadow-xs hover:border-outline hover:bg-surface-container-low transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="typo-caption text-on-surface-variant font-medium">
                В очереди
              </span>
              <div className="h-7 w-7 rounded-md bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="typo-display text-2xl sm:text-3xl font-bold text-primary">
                {isLoading ? <Spinner size="sm" /> : pendingTasks.length}
              </span>
            </div>
            <p className="typo-caption text-on-surface-variant/70 text-[11px] mt-1 flex items-center gap-1">
              Ожидают выполнения
              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-primary" />
            </p>
          </Link>
        </BlurFade>

        {/* Total Notes */}
        <BlurFade delay={0.25}>
          <Link
            href="/dashboard/notes"
            className="group block bg-surface-container-lowest border border-outline-variant p-4 rounded-lg shadow-xs hover:border-outline hover:bg-surface-container-low transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="typo-caption text-on-surface-variant font-medium">
                Заметки
              </span>
              <div className="h-7 w-7 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <StickyNote className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="typo-display text-2xl sm:text-3xl font-bold text-primary">
                {isLoading ? <Spinner size="sm" /> : totalNotes}
              </span>
            </div>
            <p className="typo-caption text-on-surface-variant/70 text-[11px] mt-1 flex items-center gap-1">
              История по клиентам
              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-primary" />
            </p>
          </Link>
        </BlurFade>
      </div>

      {/* Task Lifecycle & Progress */}
      <BlurFade delay={0.3}>
        <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-lg shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="typo-headline text-primary font-semibold text-base">
                Прогресс задач (Канбан)
              </h2>
              <p className="typo-caption text-on-surface-variant/70 text-xs">
                Всего задач: <span className="font-semibold text-primary">{totalTasks}</span> • Завершено: <span className="text-emerald-500 font-semibold">{donePercent}%</span>
              </p>
            </div>
            <Link
              href="/dashboard/tasks"
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              Открыть доску
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Segmented Progress Bar */}
          <div className="h-3 w-full rounded-full bg-surface-container overflow-hidden flex">
            {doneTasks.length > 0 && (
              <div
                style={{ width: `${donePercent}%` }}
                title={`Завершено: ${doneTasks.length} (${donePercent}%)`}
                className="bg-emerald-500 h-full transition-all duration-500"
              />
            )}
            {inProgressTasks.length > 0 && (
              <div
                style={{ width: `${inProgressPercent}%` }}
                title={`В работе: ${inProgressTasks.length} (${inProgressPercent}%)`}
                className="bg-blue-500 h-full transition-all duration-500"
              />
            )}
            {pendingTasks.length > 0 && (
              <div
                style={{ width: `${pendingPercent}%` }}
                title={`В очереди: ${pendingTasks.length} (${pendingPercent}%)`}
                className="bg-amber-500 h-full transition-all duration-500"
              />
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs flex-wrap pt-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-on-surface font-medium">Done:</span>
              <span className="text-on-surface-variant font-label-mono">{doneTasks.length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span className="text-on-surface font-medium">In Progress:</span>
              <span className="text-on-surface-variant font-label-mono">{inProgressTasks.length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="text-on-surface font-medium">Pending:</span>
              <span className="text-on-surface-variant font-label-mono">{pendingTasks.length}</span>
            </div>
          </div>
        </div>
      </BlurFade>

      {/* Two-Column Recent Activity: Recent Tasks & Recent Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Tasks */}
        <BlurFade delay={0.35}>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <h3 className="typo-body-lg font-semibold text-primary text-sm">
                  Последние задачи
                </h3>
              </div>
              <Link
                href="/dashboard/tasks"
                className="text-xs text-on-surface-variant hover:text-primary transition-colors"
              >
                Смотреть все →
              </Link>
            </div>

            <div className="space-y-2.5">
              {tasksList.length === 0 ? (
                <div className="py-8 text-center text-xs text-on-surface-variant/50">
                  Задач пока нет
                </div>
              ) : (
                tasksList.slice(0, 4).map((task) => {
                  const statusColor =
                    task.status === "done"
                      ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
                      : task.status === "in_progress"
                      ? "text-blue-600 bg-blue-500/10 border-blue-500/20"
                      : "text-amber-600 bg-amber-500/10 border-amber-500/20";

                  const statusText =
                    task.status === "done"
                      ? "Done"
                      : task.status === "in_progress"
                      ? "In Progress"
                      : "Pending";

                  return (
                    <div
                      key={task.id}
                      onClick={() => handleEditTask(task)}
                      className="group p-3 rounded-lg border border-outline-variant/60 bg-surface-container-low hover:bg-surface-container hover:border-outline transition-all cursor-pointer flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0 space-y-1">
                        <h4 className="typo-body-sm font-medium text-primary line-clamp-1 group-hover:text-primary transition-colors text-xs sm:text-sm">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="typo-caption text-on-surface-variant text-[11px] line-clamp-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-semibold border shrink-0 uppercase tracking-wide",
                          statusColor
                        )}
                      >
                        {statusText}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </BlurFade>

        {/* Recent Contacts */}
        <BlurFade delay={0.4}>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <h3 className="typo-body-lg font-semibold text-primary text-sm">
                  Новые контакты
                </h3>
              </div>
              <Link
                href="/dashboard/contacts"
                className="text-xs text-on-surface-variant hover:text-primary transition-colors"
              >
                Все контакты →
              </Link>
            </div>

            <div className="space-y-2.5">
              {contactsList.length === 0 ? (
                <div className="py-8 text-center text-xs text-on-surface-variant/50">
                  Контактов пока нет
                </div>
              ) : (
                contactsList.slice(0, 4).map((contact) => {
                  const initials = contact.name
                    ? contact.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : "—";

                  return (
                    <div
                      key={contact.id}
                      onClick={() => handleEditContact(contact)}
                      className="group p-3 rounded-lg border border-outline-variant/60 bg-surface-container-low hover:bg-surface-container hover:border-outline transition-all cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <h4 className="typo-body-sm font-medium text-primary line-clamp-1 group-hover:text-primary transition-colors text-xs sm:text-sm">
                            {contact.name}
                          </h4>
                          {contact.company && (
                            <span className="flex items-center gap-1 text-[11px] text-on-surface-variant/70 truncate">
                              <Building2 className="h-3 w-3 shrink-0" />
                              <span className="truncate">{contact.company}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {contact.phone && (
                        <span className="text-[11px] text-on-surface-variant font-label-mono shrink-0 hidden sm:inline">
                          {contact.phone}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </BlurFade>
      </div>
    </div>
  );
}
