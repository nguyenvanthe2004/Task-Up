import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
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
import { useParams } from "react-router-dom";
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

interface CreateSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSpaceFormData) => Promise<void>;
}

export default function CreateSpaceModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateSpaceModalProps) {
  const [iconIdx, setIconIdx] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateSpaceFormData>({
    resolver: zodResolver(CreateSpaceSchema),
    defaultValues: { name: "", description: "" },
  });
  const nameValue = watch("name") ?? "";
  const descValue = watch("description") ?? "";

  const handleClose = () => {
    if (isSubmitting) return;
    reset();
    setIconIdx(0);
    onClose();
  };

  const onValid = async (data: CreateSpaceFormData) => {
    try {
      await onSubmit({
        ...data,
        icon: ICONS[iconIdx].label,
      });
      reset();
      setIconIdx(0);
      onClose();
      toastSuccess("Space created successfully!");
    } catch (error: any) {
      toastError(error.message);
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
        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-6 pb-5 border-b border-neutral-100">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container flex-shrink-0">
              <ActiveIcon className="h-6 w-6 text-primary" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-900 tracking-tight">
                Create space
              </h2>
              <p className="text-sm text-neutral-400 mt-0.5">
                Set up a dedicated workspace for your team
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="ml-4 flex-shrink-0 rounded-lg p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onValid)}>
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
                disabled={isSubmitting}
                className={`w-full rounded-xl border px-4 py-3 text-sm text-neutral-900 placeholder-neutral-300 bg-white outline-none transition-all disabled:opacity-50
                  ${
                    errors.name
                      ? "border-red-300 ring-1 ring-red-200"
                      : "border-neutral-200 hover:border-neutral-300 focus:border-primary focus:ring-1 focus:ring-primary/20"
                  }`}
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
                disabled={isSubmitting}
                className="w-full resize-none rounded-xl border border-neutral-200 hover:border-neutral-300 px-4 py-3 text-sm text-neutral-900 placeholder-neutral-300 bg-white outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:opacity-50"
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
                    disabled={isSubmitting}
                    onClick={() => setIconIdx(idx)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-150 disabled:opacity-40
                      ${
                        iconIdx === idx
                          ? "border-transparent bg-primary-container text-primary shadow-sm"
                          : "border-neutral-200 hover:border-neutral-300 bg-white text-neutral-400 hover:text-neutral-600"
                      }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
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
                disabled={isSubmitting}
                className="rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition-colors disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-on-primary bg-primary shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                    Create space
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
