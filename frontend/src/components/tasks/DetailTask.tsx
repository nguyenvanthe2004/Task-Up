import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { DetailTaskProps } from "../../types/task";
import { priorityBadge, priorityColor } from "../../constants";
import { AvatarStack } from "../ui/AvatarStack";
import { Comment } from "../../types/comment";
import { Attachment } from "../../types/attachment";
import { toastError, toastSuccess } from "../../lib/toast";
import {
  callCreateComment,
  callDeleteComment,
  callGetComments,
  callUpdateComment,
} from "../../services/comment";
import {
  callGetAttachments,
  callUploadAttachments,
  callDeleteAttachment,
} from "../../services/attachment";
import { useForm } from "react-hook-form";
import {
  CreateCommentFormData,
  CreateCommentSchema,
  UpdateCommentFormData,
  UpdateCommentSchema,
} from "../../validations/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { normalizeImg } from "../../lib/until";
import EllipsisMenu from "../ui/EllipsisMenu";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Pencil, Trash2 } from "lucide-react";
import { Activity } from "../../types/activity";
import { callGetActivities } from "../../services/activity";

const DetailTask: React.FC<DetailTaskProps> = ({
  task,
  statuses = [],
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "comments" | "activity">(
    "all",
  );
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [deletingAttachmentId, setDeletingAttachmentId] = useState<
    number | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isStarred, setIsStarred] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(
    null,
  );
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  const status =
    statuses.find((s) => s.id === task.statusId) ?? task.status?.[0] ?? null;
  const priority = task.priority ?? null;

  const currentUser = useSelector((state: RootState) => state?.auth.currentUser);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<CreateCommentFormData>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: { content: "", taskId: task.id },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { errors: editErrors },
  } = useForm<UpdateCommentFormData>({
    resolver: zodResolver(UpdateCommentSchema),
    defaultValues: { content: "" },
  });

  const fetchComments = async () => {
    try {
      const res = await callGetComments(task.id);
      setComments(res.data);
    } catch (error: any) {
      toastError(error.message);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await callGetActivities(task.id);
      setActivities(res.data);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const fetchAttachments = async () => {
    try {
      const res = await callGetAttachments(task.id);
      setAttachments(res.data);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleUploadAttachments = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    try {
      setUploadingAttachment(true);
      await callUploadAttachments(task.id, files);
      await fetchAttachments();
      toastSuccess("Uploaded successfully");
    } catch (error: any) {
      toastError(error.message);
    } finally {
      setUploadingAttachment(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteAttachment = async (id: number) => {
    try {
      setDeletingAttachmentId(id);
      await callDeleteAttachment(id);
      setAttachments((prev) => prev.filter((a) => a.id !== id));
    } catch (error: any) {
      toastError(error.message);
    } finally {
      setDeletingAttachmentId(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchComments(),
          fetchActivities(),
          fetchAttachments(),
        ]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [task.id]);

  useEffect(() => {
    if (editingCommentId !== null && editTextareaRef.current) {
      editTextareaRef.current.focus();
      const len = editTextareaRef.current.value.length;
      editTextareaRef.current.setSelectionRange(len, len);
    }
  }, [editingCommentId]);

  const onSubmitCreate = async (data: CreateCommentFormData) => {
    try {
      setLoading(true);
      const res = await callCreateComment({ ...data, taskId: task.id });
      const newComment: Comment = {
        ...res.data.dataValues,
        user: currentUser,
      };
      setComments((prev) => [...prev, newComment]);
      resetCreate({ content: "", taskId: task.id });
    } catch (error: any) {
      toastError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditValue("content", comment.content);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    resetEdit();
  };

  const onSubmitEdit = async (data: UpdateCommentFormData) => {
    if (editingCommentId === null) return;
    try {
      setLoading(true);
      const res = await callUpdateComment(editingCommentId, data);
      const updatedComment: Comment = {
        ...res.data.dataValues,
        user: currentUser,
      };
      setComments((prev) =>
        prev.map((c) => (c.id === editingCommentId ? updatedComment : c)),
      );
      setEditingCommentId(null);
      resetEdit();
    } catch (error: any) {
      toastError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (id: number) => {
    try {
      setDeletingCommentId(id);
      await callDeleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (error: any) {
      toastError(error.message);
    } finally {
      setDeletingCommentId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

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

        <div className="flex-1 overflow-y-auto px-7 pt-7">
          {/* ── Title ── */}
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

          {/* ── Meta Grid ── */}
          <div className="mb-7 grid grid-cols-2 gap-4 rounded-xl border border-stone-200 bg-white p-5 sm:grid-cols-3">
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

          {/* ── Description ── */}
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

          {/* ── Attachments ── */}
          <section className="mb-7">
            <div className="mb-3.5 flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                Attachments{" "}
                <span className="font-normal text-stone-300">
                  ({attachments.length})
                </span>
              </h3>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAttachment}
                className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-500 transition-colors hover:bg-indigo-50 disabled:opacity-50"
              >
                {uploadingAttachment ? (
                  <span className="material-symbols-outlined animate-spin text-[13px]">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[13px]">
                    add
                  </span>
                )}
                Add
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleUploadAttachments}
              />
            </div>

            {attachments.length === 0 ? (
              <p className="py-4 text-center text-[12px] text-stone-400">
                No attachments yet.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {attachments.map((att) => {
                  const isImage = att.type.startsWith("image/");
                  const isDeleting = deletingAttachmentId === att.id;
                  return (
                    <div
                      key={att.id}
                      className="group flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-3 py-2.5 transition-all hover:border-stone-300 hover:shadow-sm"
                    >
                      <a
                        href={att.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0"
                      >
                        {isImage ? (
                          <img
                            src={att.fileUrl}
                            alt={att.fileName}
                            className="h-10 w-10 rounded-lg object-cover border border-stone-200"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100">
                            <span className="material-symbols-outlined text-[20px] text-stone-400">
                              description
                            </span>
                          </div>
                        )}
                      </a>

                      <a
                        href={att.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="min-w-0 flex-1"
                      >
                        <p className="truncate text-[13px] font-medium text-stone-700 hover:text-indigo-600">
                          {att.fileName}
                        </p>
                        <p className="text-[11px] text-stone-400">{att.type}</p>
                      </a>

                      <button
                        onClick={() => handleDeleteAttachment(att.id)}
                        disabled={isDeleting}
                        className="shrink-0 rounded-full p-1 text-stone-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <span className="material-symbols-outlined animate-spin text-[16px]">
                            progress_activity
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-[16px]">
                            close
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── Activity ── */}
          <section className="mb-0">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                Activity
              </h3>
              <div className="flex gap-1">
                {(["all", "comments", "activity"] as const).map((tab) => (
                  <button
                    key={`tab-${tab}`}
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
            {(activeTab === "all" || activeTab === "comments") && (
              <div className="flex flex-col gap-1">
                {comments.length === 0 && (
                  <p className="py-6 text-center text-[12px] text-stone-400">
                    No comments yet. Be the first to comment!
                  </p>
                )}

                {comments.map((c) => {
                  const isOwn = currentUser?.id === c.user?.id;
                  return (
                    <div
                      key={`comment-${c.id}`}
                      className={`group flex gap-3 p-2.5 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <img
                        src={normalizeImg(c.user?.avatar)}
                        alt={c.user?.fullName}
                        className="h-8 w-8 shrink-0 rounded-full border border-stone-200 object-cover"
                      />
                      <div
                        className={`flex flex-col max-w-[75%] min-w-0 ${isOwn ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`mb-1 flex items-center gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
                        >
                          <span className="text-[13px] font-semibold text-stone-700">
                            {isOwn ? "You" : c.user?.fullName}
                          </span>
                          {c.createdAt && (
                            <span className="text-[11px] text-stone-400">
                              {dayjs(c.createdAt).format("MMM D, YYYY · HH:mm")}
                            </span>
                          )}
                          {isOwn && (
                            <div className="opacity-0 transition-opacity group-hover:opacity-100">
                              <EllipsisMenu
                                actions={[
                                  {
                                    label: "Edit",
                                    icon: <Pencil className="w-4 h-4" />,
                                    onClick: () => startEdit(c),
                                  },
                                  {
                                    label: "Delete",
                                    icon: <Trash2 className="w-4 h-4" />,
                                    onClick: () => handleDeleteComment(c.id),
                                    variant: "danger",
                                  },
                                ]}
                                align={isOwn ? "right" : "left"}
                              />
                            </div>
                          )}
                        </div>

                        {editingCommentId === c.id ? (
                          <form
                            onSubmit={handleSubmitEdit(onSubmitEdit)}
                            className="w-full"
                          >
                            <textarea
                              {...registerEdit("content")}
                              ref={(el) => {
                                registerEdit("content").ref(el);
                                (
                                  editTextareaRef as React.MutableRefObject<HTMLTextAreaElement | null>
                                ).current = el;
                              }}
                              rows={3}
                              className="w-full resize-none rounded-xl border border-indigo-300 bg-white px-3.5 py-2.5 text-[13px] text-stone-700 placeholder:text-stone-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                            {editErrors.content && (
                              <p className="mt-1 text-[11px] text-red-500">
                                {editErrors.content.message}
                              </p>
                            )}
                            <div className="mt-2 flex gap-1.5">
                              <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-1 rounded-lg bg-stone-800 px-3 py-1.5 text-[11px] font-semibold text-white transition-all hover:bg-stone-700 disabled:opacity-50"
                              >
                                {loading ? (
                                  <span className="material-symbols-outlined animate-spin text-[13px]">
                                    progress_activity
                                  </span>
                                ) : (
                                  <span className="material-symbols-outlined text-[13px]">
                                    check
                                  </span>
                                )}
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-stone-500 transition-all hover:bg-stone-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <p
                            className={`rounded-b-xl px-3.5 py-2.5 text-[13px] leading-relaxed border border-stone-200
                              ${
                                isOwn
                                  ? "rounded-tl-xl bg-stone-800 text-white border-stone-700"
                                  : "rounded-tr-xl bg-white text-stone-500"
                              }`}
                          >
                            {c.content}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {(activeTab === "all" || activeTab === "activity") && (
              <div className="mb-4 flex flex-col gap-2">
                {activities.length === 0 ? (
                  <p className="py-4 text-center text-[12px] text-stone-400">
                    No activity yet.
                  </p>
                ) : (
                  activities.map((activity) => (
                    <div
                      key={`activity-${activity.id}`}
                      className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-[11px] font-medium text-stone-400 self-center"
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        info
                      </span>
                      <span>{activity.action}</span>
                      <span>·</span>
                      <span>{dayjs(activity.createdAt).fromNow()}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            <div className="h-7" />
          </section>
        </div>

        {/* ── Comment Input ── */}
        <div className="shrink-0 border-t border-stone-200 bg-white px-7 py-4">
          <form onSubmit={handleSubmitCreate(onSubmitCreate)}>
            <div className="flex items-end gap-2.5">
              <div className="flex-1">
                <textarea
                  {...registerCreate("content")}
                  placeholder="Add a comment…"
                  rows={1}
                  className={`w-full resize-none rounded-xl border bg-stone-50 px-3.5 py-2.5 text-[13px] text-stone-700 placeholder:text-stone-400 transition-all focus:outline-none focus:ring-2 ${
                    createErrors.content
                      ? "border-red-300 focus:border-red-400 focus:ring-red-400/10"
                      : "border-stone-200 focus:border-stone-800 focus:ring-stone-800/10"
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitCreate(onSubmitCreate)();
                    }
                  }}
                />
                {createErrors.content && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {createErrors.content.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-800 text-white transition-all hover:scale-105 hover:bg-stone-700 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">
                    send
                  </span>
                )}
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default DetailTask;
