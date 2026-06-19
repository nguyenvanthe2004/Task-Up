import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member, Task } from "../../types/task";
import { Status } from "../../types/status";
import {
  PriorityStatus,
  QUILL_FORMATS,
  QUILL_MODULES,
  today,
} from "../../constants";
import { CreateTaskFormData, CreateTaskSchema } from "../../validations/task";
import { callCreateTask } from "../../services/task";
import { stripHtml, toISO } from "../../lib/until";
import { toastError, toastSuccess } from "../../lib/toast";
import { AssigneeDropdown } from "./AssigneeDropdown";
import ReactQuill from "react-quill-new";

export const InlineCreateCard: React.FC<{
  statusId: number;
  listId: string | undefined;
  members: Member[];
  statuses: Status[];
  onClose: () => void;
  onCreated: (newTask: Task) => void;
}> = ({ statusId, listId, members, statuses, onClose, onCreated }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      name: "",
      description: "",
      priority: PriorityStatus.NORMAL,
      assignees: [],
      isPublic: false,
    },
  });

  const startDate = watch("startDate");
  const isPublic = watch("isPublic");

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const onSubmit = async (data: CreateTaskFormData) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    try {
      const res = await callCreateTask({
        ...data,
        listId: Number(listId),
        statusId,
        startDate: toISO(data.startDate),
        dueDate: toISO(data.dueDate),
      } as any);
      toastSuccess("Task created!");
      reset();
      const createdTask: Task = res.data;
      onCreated(createdTask);
    } catch {
      toastError("Failed to create task.");
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white rounded-xl border-2 border-indigo-300 shadow-lg p-3 space-y-2.5">
        {/* Name */}
        <div>
          <input
            {...register("name")}
            ref={(el) => {
              (register("name") as any).ref(el);
              (inputRef as any).current = el;
            }}
            placeholder="Task name..."
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
            }}
            className={`w-full text-sm font-medium text-stone-700 placeholder-stone-300 bg-transparent outline-none border-b border-dashed pb-1 transition-colors ${
              errors.name
                ? "border-red-300"
                : "border-indigo-200 focus:border-indigo-400"
            }`}
          />
          {errors.name && (
            <p className="text-[10px] text-red-400 mt-0.5">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Fields */}
        <div className="flex flex-wrap gap-2">
          {/* Priority */}
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <select
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(e.target.value as PriorityStatus)
                }
                className="text-[11px] font-semibold text-stone-500 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-300"
              >
                {Object.values(PriorityStatus).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            )}
          />

          {/* Status */}
          <Controller
            control={control}
            name={"statusId" as any}
            defaultValue={statusId as any}
            render={({ field }) => (
              <select
                value={field.value ?? statusId}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="text-[11px] font-semibold text-stone-500 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-300"
              >
                {statuses.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}
          />

          {/* Start date */}
          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] font-bold uppercase tracking-wide text-stone-400">
              Start
            </label>
            <input
              type="date"
              min={today}
              {...register("startDate")}
              className={`text-[11px] text-stone-500 bg-stone-50 border rounded-lg px-2 py-1 outline-none focus:border-indigo-300 ${
                errors.startDate ? "border-red-300" : "border-stone-200"
              }`}
            />
          </div>

          {/* Due date */}
          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] font-bold uppercase tracking-wide text-stone-400">
              Due
            </label>
            <input
              type="date"
              min={startDate}
              {...register("dueDate")}
              className={`text-[11px] text-stone-500 bg-stone-50 border rounded-lg px-2 py-1 outline-none focus:border-indigo-300 ${
                errors.dueDate ? "border-red-300" : "border-stone-200"
              }`}
            />
          </div>

          {/* Tag */}
          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] font-bold uppercase tracking-wide text-stone-400">
              Tag
            </label>
            <input
              {...register("tag")}
              placeholder="tag"
              className="text-[11px] text-stone-500 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-300 w-20"
            />
          </div>
        </div>

        {/* Assignees */}
        <Controller
          control={control}
          name="assignees"
          render={({ field }) => (
            <AssigneeDropdown
              members={members}
              selected={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />

        {/* Description */}
        <div className="flex-1 min-w-0">
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <div
                className={`
                        rounded-lg overflow-hidden
                              border bg-white
                              ${
                                errors.description
                                  ? "border-red-300 ring-2 ring-red-100"
                                  : "border-stone-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-50"
                              }
                            `}
              >
                <ReactQuill
                  theme="snow"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  modules={QUILL_MODULES}
                  formats={QUILL_FORMATS}
                  className="quill-inline-v2"
                />

                <div
                  className={`
                        text-right text-[10px] px-2.5 py-1
                        border-t border-stone-100 bg-stone-50
                        ${
                          stripHtml(field.value ?? "").length > 1000
                            ? "text-red-400"
                            : stripHtml(field.value ?? "").length > 900
                              ? "text-amber-400"
                              : "text-stone-300"
                        }
                  `}
                >
                  {stripHtml(field.value ?? "").length} / 1000
                </div>
              </div>
            )}
          />

          {errors.description && (
            <p className="text-[10px] text-red-400 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        <Controller
          control={control}
          name="isPublic"
          render={({ field }) => (
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span
                className={`text-[11px] font-medium transition-colors ${isPublic ? "text-indigo-500" : "text-stone-400"}`}
              >
                {isPublic ? "Public" : "Private"}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={field.value ?? false}
                onClick={() => field.onChange(!field.value)}
                className={`
                    relative inline-flex h-[17px] w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1
                    ${field.value ? "bg-indigo-500" : "bg-stone-200"}
                  `}
              >
                <span
                  className={`
                      pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm
                      transition duration-200 ease-in-out
                      ${field.value ? "translate-x-3.5" : "translate-x-0"}
                    `}
                />
              </button>
            </label>
          )}
        />
        {/* Actions */}
        <div className="flex items-center gap-2 pt-0.5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-[11px] font-bold rounded-lg transition-colors"
          >
            {isSubmitting ? (
              <svg
                className="w-3 h-3 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            ) : (
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            Add
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-500 text-[11px] font-bold rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};
