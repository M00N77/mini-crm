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
  Activity,
  ArrowUpRight
} from "lucide-react";
import { BlurFade, Spinner, Button } from "@/shared/ui";
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-text-primary">Панель управления</h1>
              <span className="font-mono text-[10px] text-accent px-1.5 py-0.5 rounded-none border border-accent-border bg-accent-subtle font-bold">
                [COCKPIT]
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1 font-mono">
              Оперативная сводка активности и состояние пайплайна в реальном времени
            </p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-status-success bg-status-success-bg px-2.5 py-1 rounded-none border border-status-success-border">
              <span className="h-1.5 w-1.5 rounded-none bg-status-success animate-pulse" />
              LIVE 200 OK
            </span>
            <CreateContactButton variant="outline">
              Контакт
            </CreateContactButton>
            <CreateTaskButton variant="default">
              Задача
            </CreateTaskButton>
          </div>
        </div>
      </BlurFade>

      {/* 4 Metric Cards (Industrial KPI Strip) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Contacts */}
        <BlurFade delay={0.1}>
          <Link
            href="/dashboard/contacts"
            className="group block bg-surface border border-border-subtle p-4 rounded-none hover:border-border-strong hover:bg-subtle/50 transition-all shadow-2xs"
          >
            <div className="flex items-center justify-between font-mono text-xs text-text-secondary">
              <span>//_01_КОНТАКТЫ</span>
              <Users className="h-3.5 w-3.5 text-text-tertiary group-hover:text-accent transition-colors" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-text-primary tabular-nums">
                {isLoading ? <Spinner size="sm" /> : totalContacts}
              </span>
            </div>
            <p className="text-[11px] font-mono text-text-tertiary mt-1 flex items-center justify-between">
              <span>Всего в реестре</span>
              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
            </p>
          </Link>
        </BlurFade>

        {/* Tasks in Progress */}
        <BlurFade delay={0.15}>
          <Link
            href="/dashboard/tasks"
            className="group block bg-surface border border-border-subtle p-4 rounded-none hover:border-border-strong hover:bg-subtle/50 transition-all shadow-2xs"
          >
            <div className="flex items-center justify-between font-mono text-xs text-text-secondary">
              <span>//_02_В_РАБОТЕ</span>
              <PlayCircle className="h-3.5 w-3.5 text-accent group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-accent tabular-nums">
                {isLoading ? <Spinner size="sm" /> : inProgressTasks.length}
              </span>
            </div>
            <p className="text-[11px] font-mono text-text-tertiary mt-1 flex items-center justify-between">
              <span>Активные задачи</span>
              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
            </p>
          </Link>
        </BlurFade>

        {/* Pending Tasks */}
        <BlurFade delay={0.2}>
          <Link
            href="/dashboard/tasks"
            className="group block bg-surface border border-border-subtle p-4 rounded-none hover:border-border-strong hover:bg-subtle/50 transition-all shadow-2xs"
          >
            <div className="flex items-center justify-between font-mono text-xs text-text-secondary">
              <span>//_03_В_ОЧЕРЕДИ</span>
              <Clock className="h-3.5 w-3.5 text-text-tertiary group-hover:text-text-primary transition-colors" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-text-primary tabular-nums">
                {isLoading ? <Spinner size="sm" /> : pendingTasks.length}
              </span>
            </div>
            <p className="text-[11px] font-mono text-text-tertiary mt-1 flex items-center justify-between">
              <span>Ожидают взятия</span>
              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
            </p>
          </Link>
        </BlurFade>

        {/* Total Notes */}
        <BlurFade delay={0.25}>
          <Link
            href="/dashboard/notes"
            className="group block bg-surface border border-border-subtle p-4 rounded-none hover:border-border-strong hover:bg-subtle/50 transition-all shadow-2xs"
          >
            <div className="flex items-center justify-between font-mono text-xs text-text-secondary">
              <span>//_04_ПРОТОКОЛЫ</span>
              <StickyNote className="h-3.5 w-3.5 text-text-tertiary group-hover:text-accent transition-colors" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-text-primary tabular-nums">
                {isLoading ? <Spinner size="sm" /> : totalNotes}
              </span>
            </div>
            <p className="text-[11px] font-mono text-text-tertiary mt-1 flex items-center justify-between">
              <span>Заметки и история</span>
              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
            </p>
          </Link>
        </BlurFade>
      </div>

      {/* Task Lifecycle & Progress */}
      <BlurFade delay={0.3}>
        <div className="bg-surface border border-border-subtle p-5 rounded-none space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-xs font-bold text-text-primary uppercase tracking-wide">
                  //_ПРОГРЕСС_ПАЙПЛАЙНА (КАНБАН)
                </h2>
              </div>
              <p className="text-xs text-text-secondary font-mono mt-1">
                Всего задач: <span className="font-bold text-text-primary tabular-nums">{totalTasks}</span> • Завершено: <span className="text-status-success font-bold tabular-nums">{donePercent}%</span>
              </p>
            </div>
            <Link
              href="/dashboard/tasks"
              className="text-xs font-mono text-accent hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              Открыть канбан →
            </Link>
          </div>

          {/* Segmented Precision Progress Bar */}
          <div className="h-2.5 w-full rounded-none bg-subtle overflow-hidden flex border border-border-subtle">
            {doneTasks.length > 0 && (
              <div
                style={{ width: `${donePercent}%` }}
                title={`Завершено: ${doneTasks.length} (${donePercent}%)`}
                className="bg-status-success h-full transition-all duration-500"
              />
            )}
            {inProgressTasks.length > 0 && (
              <div
                style={{ width: `${inProgressPercent}%` }}
                title={`В работе: ${inProgressTasks.length} (${inProgressPercent}%)`}
                className="bg-accent h-full transition-all duration-500"
              />
            )}
            {pendingTasks.length > 0 && (
              <div
                style={{ width: `${pendingPercent}%` }}
                title={`В очереди: ${pendingTasks.length} (${pendingPercent}%)`}
                className="bg-text-tertiary h-full transition-all duration-500"
              />
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono flex-wrap pt-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-none bg-status-success" />
              <span className="text-text-primary font-medium">Done:</span>
              <span className="text-text-secondary tabular-nums">{doneTasks.length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-none bg-accent" />
              <span className="text-text-primary font-medium">In Progress:</span>
              <span className="text-text-secondary tabular-nums">{inProgressTasks.length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-none bg-text-tertiary" />
              <span className="text-text-primary font-medium">Pending:</span>
              <span className="text-text-secondary tabular-nums">{pendingTasks.length}</span>
            </div>
          </div>
        </div>
      </BlurFade>

      {/* Two-Column Recent Activity: Recent Tasks & Recent Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Tasks */}
        <BlurFade delay={0.35}>
          <div className="bg-surface border border-border-subtle rounded-none p-4 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <h3 className="font-mono text-xs font-bold text-text-primary uppercase">
                  Последние задачи
                </h3>
              </div>
              <Link
                href="/dashboard/tasks"
                className="text-xs font-mono text-text-secondary hover:text-text-primary transition-colors"
              >
                Все задачи →
              </Link>
            </div>

            <div className="space-y-2">
              {tasksList.length === 0 ? (
                <div className="py-8 text-center text-xs font-mono text-text-tertiary">
                  // НЕТ АКТИВНЫХ ЗАДАЧ
                </div>
              ) : (
                tasksList.slice(0, 4).map((task) => {
                  const isDone = task.status === "done";
                  const isInProgress = task.status === "in_progress";

                  return (
                    <div
                      key={task.id}
                      onClick={() => handleEditTask(task)}
                      className="group p-2.5 rounded-none border border-border-subtle bg-subtle/50 hover:bg-subtle hover:border-border-strong transition-all cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-text-tertiary group-hover:text-accent">
                            TSK-{String(task.id).padStart(3, "0")}
                          </span>
                          <h4 className={`text-xs font-medium text-text-primary truncate ${isDone ? "line-through opacity-70" : ""}`}>
                            {task.title}
                          </h4>
                        </div>
                      </div>
                      <span
                        className={`font-mono px-1.5 py-0.5 rounded-none text-[10px] font-bold border shrink-0 uppercase tracking-wider ${
                          isDone
                            ? "bg-status-success-bg text-status-success border-status-success-border"
                            : isInProgress
                            ? "bg-accent-subtle text-accent border-accent-border"
                            : "bg-subtle text-text-secondary border-border-subtle"
                        }`}
                      >
                        {isDone ? "[DONE]" : isInProgress ? "[PROG]" : "[WAIT]"}
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
          <div className="bg-surface border border-border-subtle rounded-none p-4 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-accent" />
                <h3 className="font-mono text-xs font-bold text-text-primary uppercase">
                  Новые контакты
                </h3>
              </div>
              <Link
                href="/dashboard/contacts"
                className="text-xs font-mono text-text-secondary hover:text-text-primary transition-colors"
              >
                Все контакты →
              </Link>
            </div>

            <div className="space-y-2">
              {contactsList.length === 0 ? (
                <div className="py-8 text-center text-xs font-mono text-text-tertiary">
                  // НЕТ ЗАПИСЕЙ
                </div>
              ) : (
                contactsList.slice(0, 4).map((contact) => {
                  return (
                    <div
                      key={contact.id}
                      onClick={() => handleEditContact(contact)}
                      className="group p-2.5 rounded-none border border-border-subtle bg-subtle/50 hover:bg-subtle hover:border-border-strong transition-all cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-6 w-6 rounded-none bg-accent text-accent-contrast flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                          {(contact.name || "C").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-medium text-text-primary truncate group-hover:text-accent transition-colors">
                            {contact.name}
                          </h4>
                          {contact.company && (
                            <span className="flex items-center gap-1 text-[10px] text-text-tertiary truncate font-mono">
                              <Building2 className="h-3 w-3 shrink-0" />
                              <span className="truncate">{contact.company}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {contact.phone && (
                        <span className="text-[10px] text-text-tertiary font-mono shrink-0 hidden sm:inline tabular-nums">
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
