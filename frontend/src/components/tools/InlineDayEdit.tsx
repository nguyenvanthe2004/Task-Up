import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member, Task, UpdateTask } from "../../types/task";
import { Status } from "../../types/status";
import {
  PriorityStatus,
  QUILL_FORMATS,
  QUILL_MODULES,
  today,
} from "../../constants";
import { UpdateTaskFormData, UpdateTaskSchema } from "../../validations/task";
import { stripHtml, toISO } from "../../lib/until";
import { AssigneeDropdown } from "./AssigneeDropdown";
import ReactQuill from "react-quill-new";

export const InlineDayEdit: React.FC<{
  task: Task;
  statuses: Status[];
  members: Member[];
  onClose: () => void;
  onSaved: (id: number, data: UpdateTask) => Promise<void>;
}> = ({ task, statuses, members, onClose, onSaved }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateTaskFormData>({
    resolver: zodResolver(UpdateTaskSchema),
    defaultValues: {
      name: task.name,
      description: task.description ?? "",
      priority: (task.priority as PriorityStatus) ?? PriorityStatus.NORMAL,
      assignees: task.assignees?.map((a) => a.id) ?? [],
      startDate: task.startDate ? task.startDate.slice(0, 10) : undefined,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : undefined,
      tag: task.tag ?? "",
    },
  });

  const startDate = watch("startDate");

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const onSubmit = async (data: UpdateTaskFormData) => {
    await onSaved(task.id, {
      ...data,
      startDate: toISO(data.startDate),
      dueDate: toISO(data.dueDate),
    } as UpdateTask);
    onClose();
  };

  return (
    <div
      className="absolute inset-x-1 top-7 z-30 bg-white rounded-xl border-2 border-violet-300 shadow-xl p-2.5 space-y-2"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Name */}
      <div>
        <input
          {...register("name")}
          ref={(el) => {
            (register("name") as any).ref(el);
            (inputRef as any).current = el;
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
          }}
          className={`w-full text-xs font-medium text-stone-700 bg-transparent outline-none border-b border-dashed pb-1 transition-colors ${
            errors.name
              ? "border-red-300"
              : "border-violet-200 focus:border-violet-400"
          }`}
        />
        {errors.name && (
          <p className="text-[10px] text-red-400 mt-0.5">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Fields */}
      <div className="flex flex-wrap gap-1.5">
        {/* Priority */}
        <Controller
          control={control}
          name="priority"
          render={({ field }) => (
            <select
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value as PriorityStatus)}
              className="text-[10px] font-semibold text-stone-500 bg-stone-50 border border-stone-200 rounded-lg px-1.5 py-0.5 outline-none focus:border-violet-300"
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
          defaultValue={task.statusId as any}
          render={({ field }) => (
            <select
              value={field.value ?? task.statusId}
              onChange={(e) => field.onChange(Number(e.target.value))}
              className="text-[10px] font-semibold text-stone-500 bg-stone-50 border border-stone-200 rounded-lg px-1.5 py-0.5 outline-none focus:border-violet-300"
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
        <input
          type="date"
          min={today}
          {...register("startDate")}
          className="text-[10px] text-stone-500 bg-stone-50 border border-stone-200 rounded-lg px-1.5 py-0.5 outline-none focus:border-violet-300"
        />

        {/* Due date */}
        <input
          type="date"
          min={startDate}
          {...register("dueDate")}
          className="text-[10px] text-stone-500 bg-stone-50 border border-stone-200 rounded-lg px-1.5 py-0.5 outline-none focus:border-violet-300"
        />

        {/* Tag */}
        <input
          {...register("tag")}
          placeholder="Tag"
          className="text-[10px] text-stone-500 bg-stone-50 border border-stone-200 rounded-lg px-1.5 py-0.5 outline-none focus:border-violet-300 w-16"
        />
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

      {/* Actions */}
      <div className="flex gap-1.5">
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="flex items-center gap-1 px-2.5 py-1 bg-violet-500 hover:bg-violet-600 disabled:opacity-50 text-white text-[10px] font-bold rounded-lg transition-colors"
        >
          {isSubmitting ? (
            <svg
              className="w-2.5 h-2.5 animate-spin"
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
          ) : null}
          Save
        </button>
        <button
          onClick={onClose}
          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-500 text-[10px] font-bold rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
