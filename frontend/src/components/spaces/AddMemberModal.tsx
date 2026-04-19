import { Loader2, Plus, X } from "lucide-react";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { UserWithWorkSpace } from "../../types/auth";
import MemberRow from "./MemberRow";

export interface AddMemberModalHandle {
  save: () => Promise<void>;
}

export interface AddMemberModalContentProps {
  allMembers: UserWithWorkSpace[];
  initialSpaceMembers: UserWithWorkSpace[];
  onSave: (toAdd: number[], toRemove: number[]) => Promise<void>;
  onSavingChange?: (saving: boolean) => void;
  loading?: boolean;
}

const AddMemberModalContent = forwardRef<AddMemberModalHandle, AddMemberModalContentProps>(
  ({ allMembers, initialSpaceMembers, onSave, onSavingChange, loading = false }, ref) => {
    const [draft, setDraft] = useState<UserWithWorkSpace[]>(initialSpaceMembers);

    useEffect(() => {
      setDraft(initialSpaceMembers);
    }, [initialSpaceMembers]);

    const available = allMembers.filter((m) => !draft.find((d) => d.id === m.id));

    useImperativeHandle(ref, () => ({
      save: async () => {
        onSavingChange?.(true);
        try {
          const initialIds = new Set(initialSpaceMembers.map((m) => m.id));
          const draftIds = new Set(draft.map((m) => m.id));
          const toAdd = draft.filter((m) => !initialIds.has(m.id)).map((m) => m.id);
          const toRemove = initialSpaceMembers.filter((m) => !draftIds.has(m.id)).map((m) => m.id);
          await onSave(toAdd, toRemove);
        } finally {
          onSavingChange?.(false);
        }
      },
    }));

    const handleDragEnd = ({ source, destination, draggableId }: DropResult) => {
      if (!destination || source.droppableId === destination.droppableId) return;
      if (source.droppableId === "available") {
        const member = allMembers.find((m) => String(m.id) === draggableId);
        if (member) setDraft((prev) => [...prev, member]);
      } else {
        setDraft((prev) => prev.filter((m) => String(m.id) !== draggableId));
      }
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center py-12 gap-2 text-sm text-on-surface-variant">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading members...
        </div>
      );
    }

    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-2 gap-4">
          <MemberColumn
            droppableId="available"
            label={`Workspace members (${available.length})`}
            members={available}
            emptyText="All members added"
            hoverClass="bg-primary-container/30"
            onAction={(m) => setDraft((prev) => [...prev, m])}
            actionIcon={<Plus className="w-3 h-3" />}
            actionClass="bg-primary/10 text-primary hover:bg-primary hover:text-on-primary"
          />
          <MemberColumn
            droppableId="space"
            label={`In this space (${draft.length})`}
            members={draft}
            emptyText="Drag members here"
            hoverClass="bg-tertiary/10"
            onAction={(m) => setDraft((prev) => prev.filter((d) => d.id !== m.id))}
            actionIcon={<X className="w-3 h-3" />}
            actionClass="bg-error/10 text-error hover:bg-error hover:text-on-error"
          />
        </div>
      </DragDropContext>
    );
  }
);

AddMemberModalContent.displayName = "AddMemberModalContent";
export default AddMemberModalContent;

interface MemberColumnProps {
  droppableId: string;
  label: string;
  members: UserWithWorkSpace[];
  emptyText: string;
  hoverClass: string;
  onAction: (member: UserWithWorkSpace) => void;
  actionIcon: React.ReactNode;
  actionClass: string;
}

const MemberColumn: React.FC<MemberColumnProps> = ({
  droppableId, label, members, emptyText, hoverClass, onAction, actionIcon, actionClass,
}) => (
  <div className="flex flex-col gap-2">
    <p className="text-[11px] font-bold uppercase tracking-wider text-outline">{label}</p>
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex flex-col gap-1.5 min-h-[200px] max-h-[300px] overflow-y-auto rounded-lg p-2 transition-colors ${
            snapshot.isDraggingOver ? hoverClass : "bg-surface-container"
          }`}
        >
          {members.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-[11px] text-outline py-8">
              {emptyText}
            </div>
          )}
          {members.map((m, i) => (
            <Draggable key={m.id} draggableId={String(m.id)} index={i}>
              {(drag, dragSnapshot) => (
                <MemberRow
                  member={m}
                  innerRef={drag.innerRef}
                  draggableProps={drag.draggableProps}
                  dragHandleProps={drag.dragHandleProps}
                  isDragging={dragSnapshot.isDragging}
                  onAction={() => onAction(m)}
                  actionIcon={actionIcon}
                  actionClass={actionClass}
                />
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);