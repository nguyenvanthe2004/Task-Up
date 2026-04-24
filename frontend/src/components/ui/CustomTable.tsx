import type React from "react";
import { CustomTableProps, TableColumn } from "../../types";

type ExtendedProps<T> = CustomTableProps<T> & {
  title?: string;
  count?: number;
  showCheckbox?: boolean;
};

const CustomTable = <T extends { id: number }>({
  data,
  columns,
  loading = false,
  emptyText = "No data found",
  className = "",
  title,
  count,
  showCheckbox = false,
}: ExtendedProps<T>) => {
  const gridCols = [
    ...(showCheckbox ? ["40px"] : []),
    ...columns.map((col) => col.width || "1fr"),
  ].join(" ");

  return (
    <div className={className}>
      {/* HEADER */}
      {title && (
        <div className="flex items-center gap-3 mb-4 group cursor-pointer">
          <span className="material-symbols-outlined text-[20px] text-primary transition-transform group-hover:rotate-90">
            expand_more
          </span>

          <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface">
            {title}
          </h3>

          {typeof count === "number" && (
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary text-[11px] font-bold">
              {count}
            </span>
          )}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_32px_-4px_rgba(83,74,194,0.06)] overflow-hidden">
        {/* HEADER ROW */}
        <div
          className="grid px-6 py-3 bg-surface-container-low text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-white"
          style={{ gridTemplateColumns: gridCols }}
        >
          {showCheckbox && (
            <div className="flex items-center justify-center">
              <input type="checkbox" className="w-4 h-4 rounded-full border-slate-300 text-primary focus:ring-primary/20" />
            </div>
          )}

          {columns.map((col) => (
            <div
              key={col.key}
              className={`${col.headerClassName ?? ""} ${
                col.hideOnMobile ? "hidden sm:block" : ""
              }`}
            >
              {col.title}
            </div>
          ))}
        </div>

        {/* BODY */}
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="grid px-6 py-4 animate-pulse"
              style={{ gridTemplateColumns: gridCols }}
            >
              {columns.map((col) => (
                <div key={col.key}>
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          ))
        ) : data.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            {emptyText}
          </div>
        ) : (
          data.map((row) => (
            <div
              key={row.id}
              className="grid items-center px-6 py-4 hover:bg-surface-bright transition-colors border-b border-slate-50 group"
              style={{ gridTemplateColumns: gridCols }}
            >
              {showCheckbox && (
                <div className="flex items-center justify-center">
                  <input type="checkbox" className="w-4 h-4 rounded-full border-slate-300 text-primary focus:ring-primary/20" />
                </div>
              )}

              {columns.map((col) => (
                <div
                  key={col.key}
                  className={`
                    ${col.cellClassName ?? ""}
                    ${col.hideOnMobile ? "hidden sm:block" : ""}
                  `}
                >
                  {col.render(row)}
                </div>
              ))}
            </div>
          ))
        )}

        {/* FOOTER */}
        <div className="px-6 py-3 bg-white/50 border-t border-slate-50">
          <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-all text-[13px] font-medium w-full">
            <span className="material-symbols-outlined text-[18px]">
              add
            </span>
            + New Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomTable;