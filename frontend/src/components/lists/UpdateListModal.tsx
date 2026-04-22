import { Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  List,
  ListChecks,
  ListOrdered,
  ListTodo,
  ListTree,
  ListFilter,
  ListVideo,
  ListMusic,
  ListCollapse,
  ListEnd,
  ListMinus,
  ListPlus,
  ListRestart,
  ListStart,
  ListX,
} from "lucide-react";
import { UpdateListFormData, UpdateListSchema } from "../../validations/list";
import { callGetListById } from "../../services/list";
import { toastError, toastSuccess } from "../../lib/toast";

const ICONS = [
  { icon: List, label: "List" },
  { icon: ListChecks, label: "ListChecks" },
  { icon: ListOrdered, label: "ListOrdered" },
  { icon: ListTodo, label: "ListTodo" },
  { icon: ListTree, label: "ListTree" },
  { icon: ListFilter, label: "ListFilter" },
  { icon: ListVideo, label: "ListVideo" },
  { icon: ListMusic, label: "ListMusic" },
  { icon: ListCollapse, label: "ListCollapse" },
  { icon: ListEnd, label: "ListEnd" },
  { icon: ListMinus, label: "ListMinus" },
  { icon: ListPlus, label: "ListPlus" },
  { icon: ListRestart, label: "ListRestart" },
  { icon: ListStart, label: "ListStart" },
  { icon: ListX, label: "ListX" },
];

const COLORS = [
  { hex: "#6366F1", label: "Indigo" },
  { hex: "#0EA5E9", label: "Sky" },
  { hex: "#10B981", label: "Emerald" },
  { hex: "#F59E0B", label: "Amber" },
  { hex: "#EF4444", label: "Red" },
  { hex: "#EC4899", label: "Pink" },
  { hex: "#8B5CF6", label: "Violet" },
  { hex: "#64748B", label: "Slate" },
];

interface UpdateListModalProps {
  isOpen: boolean;
  listId: number | null;
  onClose: () => void;
  onSubmit: (id: number, data: UpdateListFormData) => Promise<void>;
}

export default function UpdateListModal({
  isOpen,
  listId,
  onClose,
  onSubmit,
}: UpdateListModalProps) {
  const [iconIdx, setIconIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].hex);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateListFormData>({
    resolver: zodResolver(UpdateListSchema),
    defaultValues: { name: "", description: "", isPublic: true },
  });

  const nameValue = watch("name") ?? "";
  const descValue = watch("description") ?? "";
  const isPublic = watch("isPublic");

  useEffect(() => {
    if (!isOpen || !listId) return;

    const fetchList = async () => {
      setFetching(true);
      try {
        const res = await callGetListById(listId);
        const list = res.data.dataValues ?? res.data;

        setValue("name", list.name ?? "");
        setValue("description", list.description ?? "");
        setValue("isPublic", list.isPublic ?? true);

        const foundIconIdx = ICONS.findIndex((i) => i.label === list.icon);
        setIconIdx(foundIconIdx >= 0 ? foundIconIdx : 0);

        const foundColor = COLORS.find((c) => c.hex === list.color);
        setSelectedColor(foundColor ? foundColor.hex : COLORS[0].hex);
      } catch (err: any) {
        toastError(err.message ?? "Failed to load list.");
        onClose();
      } finally {
        setFetching(false);
      }
    };

    fetchList();
  }, [isOpen, listId]);

  const handleClose = () => {
    if (saving) return;
    reset({ name: "", description: "", icon: "", color: "", isPublic: true });
    setIconIdx(0);
    setSelectedColor(COLORS[0].hex);
    onClose();
  };

  const onValid = async (data: UpdateListFormData) => {
    if (!listId) return;
    try {
      setSaving(true);
      await onSubmit(listId, {
        ...data,
        icon: ICONS[iconIdx].label,
        color: selectedColor,
      });
      toastSuccess("List updated successfully!");
      handleClose();
    } catch (error: any) {
      toastError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const ActiveIcon = ICONS[iconIdx].icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Colored top accent bar */}
        <div
          className="h-1 w-full transition-colors duration-300"
          style={{ backgroundColor: selectedColor }}
        />

        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-6 pb-5 border-b border-neutral-100">
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl shadow-sm transition-colors duration-300 flex-shrink-0"
              style={{ backgroundColor: `${selectedColor}18` }}
            >
              {fetching ? (
                <Loader2
                  className="h-6 w-6 animate-spin"
                  style={{ color: selectedColor }}
                />
              ) : (
                <ActiveIcon
                  className="h-6 w-6 transition-colors duration-300"
                  style={{ color: selectedColor }}
                  strokeWidth={1.75}
                />
              )}
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-900 tracking-tight">
                Edit list
              </h2>
              <p className="text-sm text-neutral-400 mt-0.5">
                Update list name, icon, color and visibility
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="ml-4 flex-shrink-0 rounded-lg p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        {fetching ? (
          <div className="flex items-center justify-center py-16 gap-3 text-neutral-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading list…</span>
          </div>
        ) : (
          <div className="px-7 py-6 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
                List name <span className="text-red-400">*</span>
              </label>
              <input
                {...register("name")}
                type="text"
                placeholder="e.g. Backlog, Sprint 1, Bug Reports…"
                maxLength={255}
                disabled={saving}
                className={`w-full rounded-xl border px-4 py-3 text-sm text-neutral-900 placeholder-neutral-300 bg-white outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    errors.name
                      ? "border-red-300 ring-1 ring-red-200 focus:border-red-400 focus:ring-red-200"
                      : "border-neutral-200 hover:border-neutral-300 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-ring)]"
                  }`}
                style={
                  {
                    "--accent": selectedColor,
                    "--accent-ring": `${selectedColor}33`,
                  } as React.CSSProperties
                }
              />
              <div className="mt-1.5 flex items-center justify-between">
                <p className="text-xs text-red-400 min-h-[1rem]">
                  {errors.name?.message ?? ""}
                </p>
                <span className="text-xs text-neutral-300 ml-auto">
                  {nameValue.length}/255
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
                Description
                <span className="ml-1.5 font-normal normal-case tracking-normal text-neutral-300">
                  — optional
                </span>
              </label>
              <textarea
                {...register("description")}
                placeholder="What is this list for?"
                rows={3}
                maxLength={1000}
                disabled={saving}
                className={`w-full rounded-xl border px-4 py-3 text-sm text-neutral-900 placeholder-neutral-300 bg-white outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    errors.description
                      ? "border-red-300 ring-1 ring-red-200 focus:border-red-400 focus:ring-red-200"
                      : "border-neutral-200 hover:border-neutral-300 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-ring)]"
                  }`}
                style={
                  {
                    "--accent": selectedColor,
                    "--accent-ring": `${selectedColor}33`,
                  } as React.CSSProperties
                }
              />
              <div className="mt-1 flex justify-between">
                <p className="text-xs text-red-400 min-h-[1rem]">
                  {errors.description?.message ?? ""}
                </p>
                <span className="text-xs text-neutral-300 ml-auto">
                  {descValue.length}/1000
                </span>
              </div>
            </div>

            {/* Icon picker */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">
                Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map(({ icon: Icon, label }, idx) => (
                  <button
                    key={label}
                    type="button"
                    title={label}
                    disabled={saving}
                    onClick={() => setIconIdx(idx)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-150 disabled:opacity-40
                      ${
                        iconIdx === idx
                          ? "border-transparent shadow-sm"
                          : "border-neutral-200 hover:border-neutral-300 bg-white text-neutral-400 hover:text-neutral-600"
                      }`}
                    style={
                      iconIdx === idx
                        ? { backgroundColor: `${selectedColor}18`, color: selectedColor }
                        : {}
                    }
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">
                Color
              </label>
              <div className="flex gap-2.5 flex-wrap">
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    title={c.label}
                    disabled={saving}
                    onClick={() => setSelectedColor(c.hex)}
                    className="relative h-7 w-7 rounded-full transition-all duration-150 focus:outline-none disabled:opacity-40 hover:scale-110 active:scale-95"
                    style={{ backgroundColor: c.hex }}
                  >
                    {selectedColor === c.hex && (
                      <span
                        className="absolute inset-0 rounded-full ring-2 ring-offset-2 ring-[var(--c)]"
                        style={{ "--c": c.hex } as React.CSSProperties}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Visibility toggle */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">
                Visibility
              </label>
              <button
                type="button"
                disabled={saving}
                onClick={() => setValue("isPublic", !isPublic, { shouldValidate: true })}
                className="w-full flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 hover:border-neutral-300 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 transition-colors duration-300"
                    style={{
                      backgroundColor: isPublic ? `${selectedColor}18` : "#f5f5f4",
                      color: isPublic ? selectedColor : "#78716c",
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {isPublic ? "public" : "lock"}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-neutral-900">
                      {isPublic ? "Public" : "Private"}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {isPublic
                        ? "Everyone in the space can see this list"
                        : "Only invited members can access this list"}
                    </p>
                  </div>
                </div>
                {/* Toggle switch */}
                <div
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 flex-shrink-0 ml-4"
                  style={{ backgroundColor: isPublic ? selectedColor : "#d1d5db" }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${
                      isPublic ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-7 py-5 bg-neutral-50 border-t border-neutral-100">
          <p className="text-xs text-neutral-400">
            <span className="text-red-400">*</span> Required fields
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit(onValid)}
              disabled={saving || fetching}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: selectedColor }}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" strokeWidth={2.5} />
                  Save changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}