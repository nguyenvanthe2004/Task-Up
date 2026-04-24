import { useEffect, useRef } from "react";
import { Member } from "../../types/task";
import { CreateTaskFormData, CreateTaskSchema } from "../../validations/task";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PriorityStatus } from "../../constants";
import { callCreateTask } from "../../services/task";
import { toISO } from "../../lib/until";
import { toastError, toastSuccess } from "../../lib/toast";
import { AssigneeDropdown } from "./AssigneeDropdown";

interface InlineCreateRowProps {
  statusId: number;
  statusColor: string;
  statusName: string;
  members: Member[];
  listId: string | undefined;
  onClose: () => void;
  onCreated: () => void;
}

export const GRID_COLS = "1fr 120px 130px 95px 115px 115px 80px";

export const InlineCreateRow: React.FC<InlineCreateRowProps> = ({
  statusId,
  statusColor,
  statusName,
  members,
  listId,
  onClose,
  onCreated,
}) => {
  const nameRef = useRef<HTMLInputElement>(null);

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
    },
  });

  useEffect(() => {
    setTimeout(() => nameRef.current?.focus(), 50);
  }, []);

  const onSubmit = async (data: CreateTaskFormData) => {
    try {
      await callCreateTask({
        ...data,
        listId: Number(listId),
        statusId,
        startDate: toISO(data.startDate),
        dueDate: toISO(data.dueDate),
      } as any);
      toastSuccess("Task created successfully!");
      reset();
      onCreated();
    } catch {
      toastError("Failed to create task.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-1 my-1 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/60 to-white overflow-visible"
    >
      {/* main row */}
      <div
        className="grid items-center gap-0 px-2 py-2.5"
        style={{ gridTemplateColumns: GRID_COLS }}
      >
        {/* name */}
        <div className="mr-10 min-w-0">
          <div className="flex items-center gap-2">
            <div className="ml-3 flex-1 min-w-0">
              <input
                {...register("name")}
                ref={(el) => {
                  (register("name") as any).ref(el);
                  (nameRef as any).current = el;
                }}
                placeholder="Task name..."
                onKeyDown={(e) => {
                  if (e.key === "Escape") onClose();
                }}
                className={`w-full rounded-full bg-transparent text-[13px] font-medium text-stone-700 placeholder:text-stone-300 outline-none border-b border-dashed py-0.5 transition-colors ${
                  errors.name
                    ? "border-red-300 focus:border-red-400"
                    : "border-indigo-200 focus:border-indigo-400"
                }`}
              />
              {errors.name && (
                <p className="text-[10px] text-red-400 mt-0.5 leading-tight">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
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

        {/* status badge (read-only) */}
        <div className="px-1">
          <span
            className="inline-flex items-center ml-1 gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap"
            style={{
              backgroundColor: `${statusColor}18`,
              color: statusColor,
              border: `1px solid ${statusColor}30`,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: statusColor }}
            />
            {statusName}
          </span>
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
            {...register("startDate")}
            className={`text-[11px] text-stone-500 bg-white border rounded-lg px-2 py-1 outline-none focus:border-indigo-300 w-full ${
              errors.startDate ? "border-red-300" : "border-stone-200"
            }`}
          />
        </div>

        {/* due date */}
        <div className="px-1">
          <input
            type="date"
            {...register("dueDate")}
            className={`text-[11px] text-stone-500 bg-white border rounded-lg px-2 py-1 outline-none focus:border-indigo-300 w-full ${
              errors.dueDate ? "border-red-300" : "border-stone-200"
            }`}
          />
        </div>

        <div className="px-1">
          <input
            {...register("tag")}
            placeholder="Tag"
            className={`w-20 rounded-full bg-transparent text-[13px] font-medium text-stone-700 placeholder:text-stone-300 outline-none border-b border-dashed py-0.5 transition-colors ${
              errors.tag ? "border-red-300" : "border-stone-200"
            }`}
          />
          {errors.tag && (
            <p className="text-[10px] text-red-400 mt-0.5">
              {errors.tag.message}
            </p>
          )}
        </div>
      </div>

      {/* description row */}
      <div className="flex item-center justify-between gap-5 px-5 pb-2.5">
        <div className="flex-1">
          <input
            {...register("description")}
            placeholder="Description (optional)..."
            className={`w-full rounded-full bg-transparent text-[12px] text-stone-500 placeholder:text-stone-300 outline-none border-b border-dashed py-0.5 transition-colors ${
              errors.description
                ? "border-red-300 focus:border-red-400"
                : "border-stone-100 focus:border-indigo-200"
            }`}
          />
          {errors.description && (
            <p className="text-[10px] text-red-400 mt-0.5">
              {errors.description.message}
            </p>
          )}
        </div>
        <div className="px-1 flex items-center gap-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-7 px-3 rounded-lg bg-indigo-500 text-white text-[11px] font-semibold hover:bg-indigo-600 disabled:opacity-40 transition-colors flex-shrink-0"
          >
            {isSubmitting ? "…" : "Add"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[15px]">close</span>
          </button>
        </div>
      </div>
    </form>
  );
};
