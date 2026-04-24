import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member, Task, UpdateTask } from "../../types/task";
import { Status } from "../../types/status";
import { PriorityStatus } from "../../constants";
import { CreateTaskFormData, CreateTaskSchema, UpdateTaskFormData, UpdateTaskSchema } from "../../validations/task";
import { toISO } from "../../lib/until";
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
            onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
            className={`w-full rounded-lg bg-white text-[13px] font-medium text-stone-700 outline-none border px-2 py-1 ${
              errors.name ? "border-red-300" : "border-indigo-300 focus:border-indigo-500"
            }`}
          />
          {errors.name && (
            <p className="text-[10px] text-red-400 mt-0.5">{errors.name.message}</p>
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
                  <option key={s.id} value={s.id}>{s.name}</option>
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
                onChange={(e) => field.onChange(e.target.value as PriorityStatus)}
                className="text-[11px] font-semibold text-stone-500 bg-white border border-stone-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-300 cursor-pointer w-full"
              >
                {Object.values(PriorityStatus).map((p) => (
                  <option key={p} value={p}>{p}</option>
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
            className="text-[11px] text-stone-500 bg-white border border-stone-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-300 w-full"
          />
        </div>

        {/* due date */}
        <div className="px-1">
          <input
            type="date"
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
      <div className="flex items-center justify-between gap-5 px-5 pb-2.5">
        <input
          {...register("description")}
          placeholder="Description..."
          className="flex-1 rounded-full bg-transparent text-[12px] text-stone-500 placeholder:text-stone-300 outline-none border-b border-dashed border-indigo-200 focus:border-indigo-400 py-0.5"
        />
        <div className="flex items-center gap-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-7 px-3 rounded-lg bg-indigo-500 text-white text-[11px] font-semibold hover:bg-indigo-600 disabled:opacity-40 transition-colors"
          >
            {isSubmitting ? "…" : "Save"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">close</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default InlineEditRow;