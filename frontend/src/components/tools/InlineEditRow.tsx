import React from "react";
import ReactQuill from "react-quill-new";
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
import {
  CreateTaskFormData,
  CreateTaskSchema,
  UpdateTaskFormData,
  UpdateTaskSchema,
} from "../../validations/task";
import { stripHtml, toISO } from "../../lib/until";
import { AssigneeDropdown } from "./AssigneeDropdown";

const GRID_COLS = "1fr 120px 130px 95px 115px 115px 80px";

interface InlineEditRowProps {
  task: Task;
  statuses: Status[];
  members: Member[];
  onClose: () => void;
  onSaved: (id: number, data: UpdateTask) => Promise<void>;
}

const InlineEditRow: React.FC<InlineEditRowProps> = ({
  task,
  statuses,
  members,
  onClose,
  onSaved,
}) => {
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

  const onSubmit = async (data: UpdateTaskFormData) => {
    await onSaved(task.id, {
      ...data,
      startDate: toISO(data.startDate),
      dueDate: toISO(data.dueDate),
    } as UpdateTask);
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-1 my-1 rounded-xl border-2 border-indigo-200 bg-indigo-50/40 overflow-visible"
    >
      <div
        className="grid items-center gap-0 px-2 py-2.5"
        style={{ gridTemplateColumns: GRID_COLS }}
      >
        {/* name */}
        <div className="mr-10 min-w-0 ml-3">
          <input
            {...register("name")}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
            }}
            className={`w-full rounded-lg bg-white text-[13px] font-medium text-stone-700 outline-none border px-2 py-1 ${
              errors.name
                ? "border-red-300"
                : "border-indigo-300 focus:border-indigo-500"
            }`}
          />
          {errors.name && (
            <p className="text-[10px] text-red-400 mt-0.5">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* assignees */}
        <div className="px-1 overflow-visible">
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
        </div>

        {/* status */}
        <div className="px-1">
          <Controller
            control={control}
            name={"statusId" as any}
            defaultValue={task.statusId as any}
            render={({ field }) => (
              <select
                value={field.value ?? task.statusId}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="text-[11px] font-semibold bg-white border border-stone-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-300 cursor-pointer w-full"
              >
                {statuses.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        {/* priority */}
        <div className="px-1">
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <select
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(e.target.value as PriorityStatus)
                }
                className="text-[11px] font-semibold text-stone-500 bg-white border border-stone-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-300 cursor-pointer w-full"
              >
                {Object.values(PriorityStatus).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        {/* start date */}
        <div className="px-1">
          <input
            type="date"
            min={today}
            {...register("startDate")}
            className="text-[11px] text-stone-500 bg-white border border-stone-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-300 w-full"
          />
        </div>

        {/* due date */}
        <div className="px-1">
          <input
            type="date"
            min={startDate}
            {...register("dueDate")}
            className="text-[11px] text-stone-500 bg-white border border-stone-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-300 w-full"
          />
        </div>

        {/* tag */}
        <div className="px-1">
          <input
            {...register("tag")}
            placeholder="Tag"
            className="w-full rounded-lg bg-white text-[12px] font-medium text-stone-700 outline-none border border-stone-200 focus:border-indigo-300 px-2 py-1"
          />
        </div>
      </div>

      {/* description + actions */}
      <div className="flex-1 min-w-0 p-3">
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
                placeholder="Description (optional)..."
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
      {/* Actions */}
      <div className="flex gap-1.5 mt-2 p-3">
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
    </form>
  );
};

export default InlineEditRow;
