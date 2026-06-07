import React, { useState, useRef, useEffect } from "react";
import { ListFilter, ArrowUpDown, X, ChevronDown } from "lucide-react";
import { Space } from "../../types/space";

export type DateFilter = "all" | "today" | "overdue" | "this_week";
export type PrioritySort = "none" | "asc" | "desc";

export interface FilterState {
  spaceId: number | null;
  date: DateFilter;
  prioritySort: PrioritySort;
}

const PRIORITY_ORDER: Record<string, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
};

export const applyFiltersAndSort = <T extends {
  dueDate?: string;
  priority?: string;
  list?: { category?: { space?: { id: number } } };
}>(tasks: T[], filters: FilterState): T[] => {
  let result = [...tasks];

  if (filters.spaceId !== null) {
    result = result.filter(
      (t) => t.list?.category?.space?.id === filters.spaceId,
    );
  }

  if (filters.date === "today") {
    const today = new Date().toISOString().split("T")[0];
    result = result.filter((t) => t.dueDate?.slice(0, 10) === today);
  } else if (filters.date === "overdue") {
    const now = new Date();
    result = result.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now,
    );
  } else if (filters.date === "this_week") {
    const now = new Date();
    const weekEnd = new Date();
    weekEnd.setDate(now.getDate() + 7);
    result = result.filter(
      (t) => t.dueDate && new Date(t.dueDate) >= now && new Date(t.dueDate) <= weekEnd,
    );
  }

  if (filters.prioritySort !== "none") {
    result.sort((a, b) => {
      const pa = PRIORITY_ORDER[a.priority ?? "normal"] ?? 2;
      const pb = PRIORITY_ORDER[b.priority ?? "normal"] ?? 2;
      return filters.prioritySort === "asc" ? pa - pb : pb - pa;
    });
  }

  return result;
};

export const DEFAULT_FILTERS: FilterState = {
  spaceId: null,
  date: "all",
  prioritySort: "none",
};

const DATE_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "All dates" },
  { value: "today", label: "Due today" },
  { value: "overdue", label: "Overdue" },
  { value: "this_week", label: "This week" },
];

const SORT_OPTIONS: { value: PrioritySort; label: string }[] = [
  { value: "none", label: "Default" },
  { value: "asc", label: "Priority: High → Low" },
  { value: "desc", label: "Priority: Low → High" },
];

interface Props {
  spaces: Space[];
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

const FilterSortBar: React.FC<Props> = ({ spaces, filters, onChange }) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node))
        setFilterOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target as Node))
        setSortOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeCount =
    (filters.spaceId !== null ? 1 : 0) +
    (filters.date !== "all" ? 1 : 0);

  const isSortActive = filters.prioritySort !== "none";

  const reset = () => onChange(DEFAULT_FILTERS);

  return (
    <div className="flex items-center gap-2 mb-4">
      {/* Filter dropdown */}
      <div className="relative" ref={filterRef}>
        <button
          onClick={() => { setFilterOpen((v) => !v); setSortOpen(false); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
            activeCount > 0
              ? "bg-indigo-50 border-indigo-200 text-indigo-600"
              : "bg-white border-stone-200 text-stone-600 hover:border-indigo-300"
          }`}
        >
          <ListFilter size={13} />
          Filter
          {activeCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-bold text-white">
              {activeCount}
            </span>
          )}
          <ChevronDown size={12} />
        </button>

        {filterOpen && (
          <div className="absolute top-full left-0 mt-1.5 z-50 w-56 rounded-xl border border-stone-200 bg-white shadow-xl p-3 space-y-3">
            {/* Space filter */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5">
                Space
              </p>
              <div className="space-y-0.5">
                <button
                  onClick={() => onChange({ ...filters, spaceId: null })}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filters.spaceId === null
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  All spaces
                </button>
                {spaces.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onChange({ ...filters, spaceId: s.id })}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
                      filters.spaceId === s.id
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    {s.color && (
                      <span
                        className="w-2 h-2 rounded-full flex-none"
                        style={{ backgroundColor: s.color }}
                      />
                    )}
                    <span className="truncate">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date filter */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5">
                Due Date
              </p>
              <div className="space-y-0.5">
                {DATE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onChange({ ...filters, date: opt.value })}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      filters.date === opt.value
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sort dropdown */}
      <div className="relative" ref={sortRef}>
        <button
          onClick={() => { setSortOpen((v) => !v); setFilterOpen(false); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
            isSortActive
              ? "bg-indigo-50 border-indigo-200 text-indigo-600"
              : "bg-white border-stone-200 text-stone-600 hover:border-indigo-300"
          }`}
        >
          <ArrowUpDown size={13} />
          Sort
          <ChevronDown size={12} />
        </button>

        {sortOpen && (
          <div className="absolute top-full left-0 mt-1.5 z-50 w-52 rounded-xl border border-stone-200 bg-white shadow-xl p-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-2 pt-1 pb-2">
              Priority
            </p>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange({ ...filters, prioritySort: opt.value }); setSortOpen(false); }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filters.prioritySort === opt.value
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-stone-600 hover:bg-stone-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reset */}
      {(activeCount > 0 || isSortActive) && (
        <button
          onClick={reset}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-stone-400 hover:text-red-400 hover:bg-red-50 transition-colors"
        >
          <X size={12} />
          Clear
        </button>
      )}
    </div>
  );
};

export default FilterSortBar;
