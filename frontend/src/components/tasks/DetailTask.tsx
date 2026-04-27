import React, { useState } from "react";
import dayjs from "dayjs";
import { DetailTaskProps, Member } from "../../types/task";
import { priorityBadge, priorityColor } from "../../constants";
import { AvatarStack } from "../ui/AvatarStack";

const DetailTask: React.FC<DetailTaskProps> = ({
  task,
  statuses = [],
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "comments" | "history">(
    "all",
  );
  const [comment, setComment] = useState("");
  const [isStarred, setIsStarred] = useState(false);

  const status =
    statuses.find((s) => s.id === task.statusId) ?? task.status?.[0] ?? null;
  const priority = task.priority ?? null;

  const comments = [
    {
      name: "Marcus Chen",
      time: "2 hours ago",
      text: 'Hey team, I\'ve updated the iconography set to match the new weight specs. Let me know if the "Task" icon feels too thin in the sidebar context.',
      avatar: "https://i.pravatar.cc/100?img=5",
    },
    {
      name: "Sarah Jenkins",
      time: "45 mins ago",
      text: "The icons look great, Marcus. Alex will review the mobile responsiveness by EOD tomorrow.",
      avatar: "https://i.pravatar.cc/100?img=9",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 flex h-full w-full max-w-2xl flex-col border-l border-stone-200 bg-stone-50 shadow-2xl animate-slide-in-right">
        {/* ── Header ── */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-stone-200 bg-white px-5">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
            >
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>
            <div className="h-4 w-px bg-stone-200" />
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-xs text-stone-400">
              {task.list?.category?.space?.name && (
                <>
                  <span className="cursor-pointer transition-colors hover:text-stone-700">
                    {task.list.category.space.name}
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-stone-300">
                    chevron_right
                  </span>
                </>
              )}
              {task.list?.category?.name && (
                <>
                  <span className="cursor-pointer transition-colors hover:text-stone-700">
                    {task.list.category.name}
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-stone-300">
                    chevron_right
                  </span>
                </>
              )}
              {task.list?.name && (
                <span className="cursor-pointer font-medium text-stone-700 transition-colors hover:text-indigo-600">
                  {task.list.name}
                </span>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setIsStarred(!isStarred)}
              className={`flex items-center justify-center rounded-lg p-1.5 transition-colors hover:bg-stone-100 ${isStarred ? "text-amber-400" : "text-stone-400"}`}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{
                  fontVariationSettings: isStarred ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                star
              </span>
            </button>
            <button className="flex items-center justify-center rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700">
              <span className="material-symbols-outlined text-[18px]">
                ios_share
              </span>
            </button>
            {onDelete && (
              <button
                onClick={onDelete}
                className="flex items-center justify-center rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <span className="material-symbols-outlined text-[18px]">
                  delete
                </span>
              </button>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-7 pt-7">
          {/* Title */}
          <div className="mb-6">
            <h1 className="-tracking-wide text-xl font-semibold leading-snug text-stone-800">
              {task.name}
            </h1>
            {task.createdAt && (
              <p className="mt-1.5 text-[11px] text-stone-400">
                Created {dayjs(task.createdAt).format("MMM D, YYYY")}
              </p>
            )}
          </div>

          {/* Meta grid */}
          <div className="mb-7 grid grid-cols-2 gap-4 rounded-xl border border-stone-200 bg-white p-5 sm:grid-cols-3">
            {/* Assignees */}
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                Assignees
              </label>
              {task.assignees && task.assignees.length > 0 ? (
                <AvatarStack members={task.assignees} />
              ) : (
                <span className="text-[12px] text-stone-400">Unassigned</span>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                Due Date
              </label>
              {task.dueDate ? (
                <div
                  className={`flex items-center gap-1.5 ${dayjs(task.dueDate).isBefore(dayjs()) ? "text-red-500" : "text-stone-600"}`}
                >
                  <span className="material-symbols-outlined text-[15px]">
                    calendar_today
                  </span>
                  <span className="text-[13px] font-medium">
                    {dayjs(task.dueDate).format("MMM D, YYYY")}
                  </span>
                </div>
              ) : (
                <span className="text-[12px] text-stone-400">No due date</span>
              )}
            </div>

            {/* Start Date */}
            {task.startDate && (
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                  Start Date
                </label>
                <div className="flex items-center gap-1.5 text-stone-600">
                  <span className="material-symbols-outlined text-[15px]">
                    calendar_today
                  </span>
                  <span className="text-[13px] font-medium">
                    {dayjs(task.startDate).format("MMM D, YYYY")}
                  </span>
                </div>
              </div>
            )}

            {/* Priority */}
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                Priority
              </label>
              {priority ? (
                <div
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 ${priorityBadge[priority] ?? "bg-stone-50 text-stone-500"}`}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: priorityColor[priority] ?? "#78716c",
                    }}
                  />
                  <span className="text-[12px] font-semibold capitalize">
                    {priority}
                  </span>
                </div>
              ) : (
                <span className="text-[12px] text-stone-400">No priority</span>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                Status
              </label>
              {status ? (
                <div
                  className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1"
                  style={{
                    backgroundColor: `${status.color}18`,
                    borderColor: `${status.color}30`,
                    color: status.color,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-[12px] font-semibold">
                    {status.name}
                  </span>
                </div>
              ) : (
                <span className="text-[12px] text-stone-400">No status</span>
              )}
            </div>

            {/* Tag */}
            {task.tag && (
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                  Tag
                </label>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-500 text-[11px] font-semibold">
                  #{task.tag}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <section className="mb-7">
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                Description
              </h3>

              <div
                className="text-[13px] leading-relaxed text-stone-600 break-words [&_*]:break-words"
                dangerouslySetInnerHTML={{ __html: task.description }}
              />
            </section>
          )}

          {/* Attachments */}
          <section className="mb-7">
            <div className="mb-3.5 flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                Attachments{" "}
                <span className="font-normal text-stone-300">(4)</span>
              </h3>
              <button className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-500 transition-colors hover:bg-indigo-50">
                <span className="material-symbols-outlined text-[13px]">
                  add
                </span>
                Add
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {[
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDnDCRfqEjazffln1iVinE4lFu7ACzVJmx38KwLLF5ogLb3ByO9RhJ6VWvf-8mKGOvaedaVmcEoX8vw8lOTetsSxAmZwC7uDpUwzf6xQU05RspGKvaOWH7EZM2weYehc-eNUoTRhxkwgu0FC7dko3B2B5gr6zT0UnGUFl9ufesYLA3cLxlvP1Qi-Km65eAH7QeB1Uc2gtsJvWUoyhD_pKijuT_bTM7yygbk_t6ohfxn08y6hR98E2aSz9F5gVBonvdndy3wY4r5224",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBhA7LMY0TIbq6q5sSikMdUiDE1VdniXnHGGETpBxLvi4eAVcIaZMU7bK6PDl6I8ARn-FWWOuzKqLEwPurtedzmMHvL3XiWCMynwkWBCWTKqxsxuIWKZ3r3d6MSIQ0CV4KI3TZRcQ6Z961vvKfrnfcExE5yqRUybuHM1mc77Q8V_2JXd4SYtpnS_Ewam-kGqVvn0VMWNJPGjkBZbOhuTNIllwbfVGBLonXvPshUd5DNJsU-Ia7_fWrVmez0JB_KFubkGtu5r66tgEE",
              ].map((src, i) => (
                <div
                  key={i}
                  className="group aspect-video cursor-pointer overflow-hidden rounded-xl border border-stone-200 transition-all hover:border-stone-400 hover:shadow-md"
                >
                  <img
                    src={src}
                    alt={`Design ${i + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ))}
              <div className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-red-50 transition-all hover:border-red-300 hover:shadow-md">
                <span className="material-symbols-outlined text-[22px] text-red-400">
                  description
                </span>
                <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-red-500">
                  Specs.pdf
                </span>
              </div>
              <div className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-emerald-50 transition-all hover:border-emerald-300 hover:shadow-md">
                <span className="material-symbols-outlined text-[22px] text-emerald-500">
                  table_chart
                </span>
                <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-emerald-600">
                  Budget.csv
                </span>
              </div>
            </div>
          </section>

          {/* Activity */}
          <section className="mb-0">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                Activity
              </h3>
              <div className="flex gap-1">
                {(["all", "comments", "history"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-md px-3 py-1.5 text-[11px] font-medium capitalize transition-all ${
                      activeTab === tab
                        ? "bg-stone-800 text-white"
                        : "text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* History pill */}
            <div className="mb-4 flex justify-center">
              <div className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-[11px] font-medium text-stone-400">
                <span className="material-symbols-outlined text-[12px]">
                  info
                </span>
                Alex Thompson changed status to{" "}
                <strong className="font-semibold text-stone-600">
                  In Progress
                </strong>
                &nbsp;· 3 days ago
              </div>
            </div>

            {/* Comments */}
            <div className="flex flex-col gap-1">
              {comments.map((c, i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-xl p-2.5 transition-colors hover:bg-stone-100"
                >
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="h-8 w-8 shrink-0 rounded-full border border-stone-200 object-cover"
                  />
                  <div className="flex-1">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-stone-700">
                        {c.name}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {c.time}
                      </span>
                    </div>
                    <p className="mb-2 rounded-tr-xl rounded-b-xl border border-stone-200 bg-white px-3.5 py-2.5 text-[13px] leading-relaxed text-stone-500">
                      {c.text}
                    </p>
                    <div className="flex gap-0.5">
                      <button className="rounded px-2 py-0.5 text-[11px] font-medium text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700">
                        Reply
                      </button>
                      <button className="rounded px-2 py-0.5 text-[11px] font-medium text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700">
                        👍 Like
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-7" />
          </section>
        </div>

        {/* ── Comment Input ── */}
        <div className="shrink-0 border-t border-stone-200 bg-white px-7 py-4">
          <div className="flex items-end gap-2.5">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment…"
              rows={1}
              className="flex-1 resize-none rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-[13px] text-stone-700 placeholder:text-stone-400 transition-all focus:border-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-800/10"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  setComment("");
                }
              }}
            />
            <button
              onClick={() => setComment("")}
              className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-800 text-white transition-all hover:scale-105 hover:bg-stone-700 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">
                send
              </span>
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-stone-400">
            Press{" "}
            <kbd className="rounded border border-stone-200 bg-stone-100 px-1 py-0.5 font-mono text-[10px]">
              Enter
            </kbd>{" "}
            to send ·{" "}
            <kbd className="rounded border border-stone-200 bg-stone-100 px-1 py-0.5 font-mono text-[10px]">
              Shift+Enter
            </kbd>{" "}
            for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailTask;
