import { useEffect, useRef, useState } from "react";
import { Member } from "../../types/task";
import { normalizeImg } from "../../lib/until";

interface AssigneeDropdownProps {
  members: Member[];
  selected: number[];
  onChange: (ids: number[]) => void;
}

export const AssigneeDropdown: React.FC<AssigneeDropdownProps> = ({
  members,
  selected,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (id: number) =>
    onChange(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id],
    );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 hover:opacity-80 transition-opacity"
      >
        {selected.length === 0 ? (
          <span className="flex items-center gap-1 text-[11px] text-stone-300 hover:text-indigo-400 transition-colors">
            <span className="material-symbols-outlined text-[14px]">
              person_add
            </span>
            Assign
          </span>
        ) : (
          <div className="flex -space-x-1.5">
            {selected.slice(0, 3).map((id) => {
              const m = members.find((x) => x.id === id);
              return m ? (
                <img
                  key={id}
                  src={normalizeImg(m.avatar)}
                  alt={m.fullName}
                  className="w-6 h-6 rounded-full border-2 border-white object-cover shadow-sm"
                />
              ) : null;
            })}
            {selected.length > 3 && (
              <span className="w-6 h-6 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center text-[9px] font-bold text-stone-500">
                +{selected.length - 3}
              </span>
            )}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 z-50 w-52 rounded-xl border border-stone-100 bg-white shadow-2xl py-1 overflow-hidden">
          <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400">
            Assign members
          </p>
          {members.length === 0 ? (
            <p className="px-3 py-2 text-xs text-stone-400">No members found</p>
          ) : (
            members.map((m) => {
              const checked = selected.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggle(m.id)}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 transition-colors ${
                    checked ? "bg-indigo-50" : "hover:bg-stone-50"
                  }`}
                >
                  <img
                    src={normalizeImg(m.avatar)}
                    alt={m.fullName}
                    className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[12px] font-medium text-stone-700 truncate">
                      {m.fullName}
                    </p>
                    <p className="text-[10px] text-stone-400 truncate">
                      {m.email}
                    </p>
                  </div>
                  {checked && (
                    <span className="material-symbols-outlined text-[14px] text-indigo-500 flex-shrink-0">
                      check
                    </span>
                  )}
                </button>
              );
            })
          )}
          <div className="border-t border-stone-50 mt-1 px-3 py-1.5">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full text-[11px] font-semibold text-indigo-500 hover:text-indigo-600 py-0.5"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};