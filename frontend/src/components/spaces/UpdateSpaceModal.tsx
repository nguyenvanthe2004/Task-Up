import { Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FolderKanban,
  LayoutDashboard,
  Code2,
  Megaphone,
  FlaskConical,
  FileText,
  Globe,
  ShieldCheck,
  Layers,
  MonitorPlay,
  Database,
  PenTool,
  Inbox,
  BookMarked,
  Telescope,
} from "lucide-react";
import {
  CreateSpaceFormData,
  CreateSpaceSchema,
} from "../../validations/space";
import { callGetSpaceById, callUpdateSpace } from "../../services/space";
import { toastError, toastSuccess } from "../../lib/toast";

const ICONS = [
  { icon: FolderKanban, label: "Kanban" },
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Code2, label: "Code" },
  { icon: Megaphone, label: "Campaign" },
  { icon: FlaskConical, label: "Research" },
  { icon: FileText, label: "Docs" },
  { icon: Globe, label: "Web" },
  { icon: ShieldCheck, label: "Security" },
  { icon: Layers, label: "Layers" },
  { icon: MonitorPlay, label: "Media" },
  { icon: Database, label: "Data" },
  { icon: PenTool, label: "Design" },
  { icon: Inbox, label: "Inbox" },
  { icon: BookMarked, label: "Wiki" },
  { icon: Telescope, label: "Explore" },
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

interface UpdateSpaceModalProps {
  isOpen: boolean;
  spaceId: number | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function UpdateSpaceModal({
  isOpen,
  spaceId,
  onClose,
  onSuccess,
}: UpdateSpaceModalProps) {
  const [iconIdx, setIconIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].hex);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);

  const isLoading = fetching || saving;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateSpaceFormData>({
    resolver: zodResolver(CreateSpaceSchema),
    defaultValues: { name: "", description: "" },
  });

  const nameValue = watch("name") ?? "";
  const descValue = watch("description") ?? "";

  useEffect(() => {
    if (!isOpen || !spaceId) return;

    const fetchSpace = async () => {
      setFetching(true);
      try {
        const res = await callGetSpaceById(spaceId);
        const space = res.data;

        setValue("name", space.name ?? "");
        setValue("description", space.description ?? "");

        const iconIndex = ICONS.findIndex((i) => i.label === space.icon);
        setIconIdx(iconIndex >= 0 ? iconIndex : 0);

        const colorMatch = COLORS.find((c) => c.hex === space.color);
        setSelectedColor(colorMatch ? colorMatch.hex : COLORS[0].hex);
      } catch (err: any) {
        toastError(err.message ?? "Failed to load space.");
        handleClose();
      } finally {
        setFetching(false);
      }
    };

    fetchSpace();
  }, [isOpen, spaceId]);

  const handleClose = () => {
    if (isLoading) return;
    reset();
    setIconIdx(0);
    setSelectedColor(COLORS[0].hex);
    onClose();
  };

  const onValid = async (data: CreateSpaceFormData) => {
    if (!spaceId) return;
    try {
      setSaving(true);
      await callUpdateSpace(spaceId, {
        name: data.name,
        description: data.description ?? "",
        icon: ICONS[iconIdx].label,
        color: selectedColor,
      });
      toastSuccess("Space updated successfully!");
      onSuccess?.();
      handleClose();
    } catch (error: any) {
      toastError(error.message ?? "Failed to update space.");
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
            {/* Icon preview — reflects selected color */}
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
                Update space
              </h2>
              <p className="text-sm text-neutral-400 mt-0.5">
                Edit the details of your workspace
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="ml-4 flex-shrink-0 rounded-lg p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
              Space name <span className="text-red-400">*</span>
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="e.g. Engineering Backend, Design System…"
              maxLength={255}
              disabled={isLoading}
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
              placeholder="What is this space for?"
              rows={3}
              maxLength={1000}
              disabled={isLoading}
              className="w-full resize-none rounded-xl border border-neutral-200 hover:border-neutral-300 px-4 py-3 text-sm text-neutral-900 placeholder-neutral-300 bg-white outline-none transition-all focus:border-neutral-400 focus:ring-1 focus:ring-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={isLoading}
                  onClick={() => setIconIdx(idx)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-150 disabled:opacity-40
                    ${
                      iconIdx === idx
                        ? "border-transparent shadow-sm"
                        : "border-neutral-200 hover:border-neutral-300 bg-white text-neutral-400 hover:text-neutral-600"
                    }`}
                  style={
                    iconIdx === idx
                      ? {
                          backgroundColor: `${selectedColor}18`,
                          color: selectedColor,
                        }
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
                  disabled={isLoading}
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-7 py-5 bg-neutral-50 border-t border-neutral-100">
          <p className="text-xs text-neutral-400">
            <span className="text-red-400">*</span> Required fields
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit(onValid)}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: selectedColor }}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : fetching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading…
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
