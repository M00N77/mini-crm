"use client";

import { 
  Users, 
  PlayCircle, 
  StickyNote, 
  AlertCircle, 
  MoreHorizontal 
} from "lucide-react";
import { BlurFade } from "@/shared/ui";

const METRICS = [
  { label: "Total Contacts", value: "1,248", icon: Users, desc: "12% this week", color: "text-on-primary-container" },
  { label: "Pending Tasks", value: "42", icon: AlertCircle, desc: "5 overdue", color: "text-error" },
  { label: "In Progress", value: "18", icon: PlayCircle, desc: "60% completed", color: "text-primary-fixed" },
  { label: "Notes", value: "356", icon: StickyNote, desc: "Last active 2h ago", color: "text-on-surface-variant" },
];

export function DashboardOverview() {
  return (
    <div className="space-y-container-padding">
      {/* Page Title */}
      <BlurFade delay={0.05}>
        <div className="flex justify-between items-end">
          <h1 className="typo-display text-primary">Overview</h1>
          <span className="typo-label-mono text-on-surface-variant bg-surface-container px-2 py-1 rounded border border-outline-variant">
            Live
          </span>
        </div>
      </BlurFade>

      {/* 2×2 metric grid */}
      <div className="grid grid-cols-2 gap-gutter">
        {METRICS.map((m, idx) => {
          const Icon = m.icon;
          return (
            <BlurFade key={m.label} delay={0.1 + idx * 0.05}>
              <div className="bg-surface-container-low border border-outline-variant p-gutter flex flex-col gap-stack-sm hover:bg-surface-container transition-colors rounded">
                <span className="typo-caption text-on-surface-variant">{m.label}</span>
                <span className="typo-label-mono text-[20px] leading-6 font-medium text-primary">
                  {m.value}
                </span>
                <div className={`flex items-center gap-unit ${m.color} typo-caption`}>
                  <Icon className="h-3.5 w-3.5" />
                  <span>{m.desc}</span>
                </div>
              </div>
            </BlurFade>
          );
        })}
      </div>

      {/* Task Lifecycle chart placeholder */}
      <BlurFade delay={0.3}>
        <div className="bg-surface-container-low border border-outline-variant p-gutter flex flex-col gap-gutter rounded">
          <div className="flex justify-between items-center">
            <h2 className="typo-headline text-primary">Task Lifecycle</h2>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="h-[120px] w-full flex items-center justify-center text-on-surface-variant/50 typo-body-sm border border-dashed border-outline-variant rounded">
            График активности задач
          </div>
        </div>
      </BlurFade>

      {/* Recent Activities */}
      <BlurFade delay={0.35}>
        <div className="flex flex-col gap-stack-sm">
          <h2 className="typo-headline text-primary mb-2">Recent Activities</h2>
          <div className="border border-outline-variant bg-surface-container-lowest rounded p-6 text-center text-on-surface-variant/50 typo-body-sm">
            Нет недавних действий
          </div>
        </div>
      </BlurFade>
    </div>
  );
}
