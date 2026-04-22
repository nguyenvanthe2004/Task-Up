import {
  CirclePlus,
  Loader2,
  Plus,
  FolderOpen,
  Trash2,
  Bell,
  UserPlus,
  Pencil,
  User,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  callGetSpaces,
  callCreateSpace,
  callDeleteSpace,
  callGetSpaceMembers,
  callAddSpaceMembers,
  callRemoveSpaceMember,
} from "../../services/space";
import { callGetMembers } from "../../services/workspace";
import { Space } from "../../types/space";
import { UserWithWorkSpace } from "../../types/auth";
import { useModal } from "../../hook/useModal";
import { CreateSpaceFormData } from "../../validations/space";
import CreateSpaceModal from "./CreateSpaceModal";
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";
import Modal from "../ui/Modal";
import { toastError, toastSuccess } from "../../lib/toast";
import { SpaceIcon } from "../ui/SpaceIcon";
import { AvatarStack } from "../ui/AvatarStack";
import AddMemberModalContent, { AddMemberModalHandle } from "./AddMemberModal";
import { UserWorkspace } from "../../types/workspace";
import UpdateSpaceModal from "./UpdateSpaceModal";
import EllipsisMenu, { MenuAction } from "../ui/EllipsisMenu";
import dayjs from "dayjs";

const MySpace: React.FC = () => {
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const [spaces, setSpaces] = useState<Space[]>([]);
  const [allMembers, setAllMembers] = useState<UserWithWorkSpace[]>([]);
  const [spaceMembersMap, setSpaceMembersMap] = useState<
    Record<number, UserWithWorkSpace[]>
  >({});
  const [activeSpace, setActiveSpace] = useState<Space | null>(null);
  const [memberLoading, setMemberLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [editingSpaceId, setEditingSpaceId] = useState<number | null>(null);

  const memberModalRef = useRef<AddMemberModalHandle>(null);

  const { isOpen, open, close } = useModal();
  const {
    isOpen: isDeleteOpen,
    open: openDelete,
    close: closeDelete,
  } = useModal();
  const {
    isOpen: isMemberOpen,
    open: openMember,
    close: closeMember,
  } = useModal();
  const {
    isOpen: isUpdateOpen,
    open: openUpdate,
    close: closeUpdate,
  } = useModal();

  const fetchSpaces = async () => {
    setLoading(true);
    try {
      const res = await callGetSpaces(Number(workspaceId));
      setSpaces(res.data);
    } catch (err: any) {
      toastError(err.message ?? "Failed to load spaces.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllMembers = async () => {
    if (!workspaceId) return;
    try {
      const res = await callGetMembers(Number(workspaceId));
      setAllMembers(res.data.users ?? []);
    } catch (_) {}
  };

  useEffect(() => {
    fetchSpaces();
    fetchAllMembers();
  }, [workspaceId]);

  const handleCreate = async (data: CreateSpaceFormData) => {
    await callCreateSpace(data, Number(workspaceId));
    await fetchSpaces();
  };

  const handleDeleteClick = (space: Space) => {
    setSelectedSpace(space);
    openDelete();
  };

  const handleEditClick = (space: Space) => {
    setEditingSpaceId(space.id);
    openUpdate();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSpace) return;
    setDeletingId(selectedSpace.id);
    try {
      await callDeleteSpace(selectedSpace.id);
      toastSuccess("Space deleted successfully!");
      await fetchSpaces();
      closeDelete();
    } catch (err: any) {
      toastError(err.message ?? "Failed to delete space.");
    } finally {
      setDeletingId(null);
      setSelectedSpace(null);
    }
  };

  const handleOpenMember = async (space: Space) => {
    setActiveSpace(space);
    openMember();
    setMemberLoading(true);
    try {
      const res = await callGetSpaceMembers(space.id);
      const members: UserWithWorkSpace[] = res.data.members ?? [];
      setSpaceMembersMap((prev) => ({ ...prev, [space.id]: members }));
    } catch (err: any) {
      toastError(err.message ?? "Failed to load members.");
    } finally {
      setMemberLoading(false);
    }
  };

  const handleSaveMembers = async (toAdd: number[], toRemove: number[]) => {
    if (!activeSpace) return;

    const results = await Promise.allSettled([
      toAdd.length
        ? callAddSpaceMembers(activeSpace.id, toAdd)
        : Promise.resolve(),
      ...toRemove.map((id) => callRemoveSpaceMember(activeSpace.id, id)),
    ]);

    const failed = results.filter((r) => r.status === "rejected").length;
    if (failed) toastError(`${failed} operation(s) failed.`);
    else toastSuccess("Member has been updated!");

    try {
      const res = await callGetSpaceMembers(activeSpace.id);
      setSpaceMembersMap((prev) => ({
        ...prev,
        [activeSpace.id]: res.data.members ?? [],
      }));
    } catch (error: any) {
      toastError(error.message ?? "Failed to load members.");
    }
    closeMember();
  };

  const renderCard = (space: Space, wide = false) => {
    const members = spaceMembersMap[space.id] ?? space.members ?? [];

    const menuActions: MenuAction[] = [
      {
        label: "Edit",
        icon: <Pencil className="w-4 h-4" />,
        onClick: () => handleEditClick(space),
      },
      {
        label: "Delete",
        icon: <Trash2 className="w-4 h-4" />,
        onClick: () => handleDeleteClick(space),
        variant: "danger",
      },
    ];

    return (
      <div
        key={space.id}
        className={`relative bg-surface-container-lowest border border-outline-variant rounded-lg p-6 flex flex-col hover:border-primary transition-colors group ${
          wide ? "lg:col-span-2" : ""
        }`}
      >
        {/* Action buttons — visible on hover */}
        <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <EllipsisMenu actions={menuActions} align="right" />
        </div>

        <div className="flex justify-between items-start mb-6">
          {/* Icon container — uses space.color if available */}
          <div
            className={`${wide ? "w-16 h-16" : "w-12 h-12"} flex-shrink-0 rounded-lg flex items-center justify-center`}
            style={{
              backgroundColor: space.color ? `${space.color}18` : undefined,
              color: space.color ?? undefined,
            }}
          >
            <SpaceIcon
              icon={space.icon}
              className={wide ? "w-8 h-8" : "w-6 h-6"}
            />
          </div>
          {space.workspaceId?.name && (
            <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md mr-16">
              {space.workspaceId.name}
            </span>
          )}
        </div>

        <h3
          className={`${wide ? "text-xl" : "text-lg"} font-bold text-on-surface mb-1`}
        >
          {space.name}
        </h3>
        <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">
          {space.description || "No description provided."}
        </p>
        <AvatarStack members={members} />

        <div className="mt-auto pt-4 border-t border-outline-variant flex items-center justify-between">
          <button
            onClick={() => handleOpenMember(space)}
            className="flex items-center gap-1 text-[11px] font-semibold text-primary border border-primary/30 rounded-md px-2 py-1 hover:bg-primary-container transition-colors"
          >
            <UserPlus className="w-3 h-3" />
            Add member
          </button>
          <button
            onClick={() =>
              navigate(`${space.id}`, { state: { spaceId: space.id } })
            }
            className="text-primary text-sm font-bold hover:underline"
          >
            {wide ? "Manage Space" : "Manage"}
          </button>
        </div>
      </div>
    );
  };

  const renderSkeletons = () =>
    [0, 1, 2].map((i) => (
      <div
        key={i}
        className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 flex flex-col animate-pulse"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-lg bg-surface-container-high" />
          <div className="w-16 h-4 rounded bg-surface-container-high" />
        </div>
        <div className="h-5 bg-surface-container-high rounded w-2/3 mb-2" />
        <div className="h-4 bg-surface-container-high rounded w-full mb-1" />
        <div className="h-4 bg-surface-container-high rounded w-4/5 mb-6" />
        <div className="mt-auto pt-4 border-t border-outline-variant flex justify-between">
          <div className="h-3 w-32 bg-surface-container-high rounded" />
          <div className="h-3 w-12 bg-surface-container-high rounded" />
        </div>
      </div>
    ));

  return (
    <main className="ml-64 pt-14 min-h-screen bg-background">
      <div className="max-w-8xl mx-auto p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">
              Space Manager
            </h1>
            <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
              Architect your productivity environment. Manage team permissions,
              visibility settings, and resource allocation across your
              organizational spaces.
            </p>
          </div>
          <button
            onClick={open}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
          >
            <CirclePlus className="w-5 h-5" />
            Create New Space
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && renderSkeletons()}
          {!loading && spaces.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 gap-4">
              <FolderOpen className="w-10 h-10 text-outline" />
              <p className="text-on-surface-variant text-sm">
                No spaces found. Create your first space to get started.
              </p>
            </div>
          )}
          {!loading && spaces.length > 0 && (
            <>
              {spaces.slice(0, 3).map((s) => renderCard(s))}
              {spaces[3] && renderCard(spaces[3], true)}
              {spaces.slice(4).map((s) => renderCard(s))}
            </>
          )}
          {!loading && (
            <div
              onClick={open}
              className="border-2 border-dashed border-outline-variant rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary-container/30 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container-high text-outline group-hover:bg-primary group-hover:text-on-primary transition-all mb-4 flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-on-surface mb-1">Add New Space</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Create a dedicated architectural
                <br />
                workspace for your team.
              </p>
            </div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-surface-container-low border border-outline-variant rounded-lg p-8">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">
                security
              </span>
              Global Privacy Controls
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: "Two-Factor Authentication",
                  desc: "Require additional validation for restricted workspace access.",
                  active: true,
                },
                {
                  title: "Automatic Visibility",
                  desc: "New spaces are private by default to ensure data security.",
                  active: false,
                },
              ].map(({ title, desc, active }) => (
                <div
                  key={title}
                  className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant rounded-lg"
                >
                  <div>
                    <p className="font-bold text-sm">{title}</p>
                    <p className="text-[11px] text-on-surface-variant">
                      {desc}
                    </p>
                  </div>
                  <div
                    className={`w-10 h-6 rounded-full relative p-1 flex items-center ${active ? "bg-primary" : "bg-surface-container-highest"}`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-all ${active ? "ml-auto" : "border border-outline-variant"}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface-container-low border border-outline-variant rounded-lg p-8">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Bell className="w-6 h-6 text-primary" />
              Recent Activity
            </h2>
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-on-surface-variant animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading activity…
              </div>
            ) : spaces.length === 0 ? (
              <p className="text-sm text-on-surface-variant">
                No recent activity yet.
              </p>
            ) : (
              <div className="space-y-4">
                {spaces.slice(0, 3).map((space, i) => (
                  <div
                    key={space.id}
                    className="flex items-start gap-4 text-xs"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${["bg-primary", "bg-tertiary", "bg-indigo-500"][i % 3]}`}
                    />
                    <div className="flex-1">
                      <p className="text-on-surface-variant">
                        <span className="font-bold text-on-surface">
                          {space.name}
                        </span>{" "}
                        was created in{" "}
                        <span className="font-bold text-on-surface">
                          {space.createdAt
                            ? dayjs(space.createdAt).format("MMM D, YYYY")
                            : "Unknown Workspace"}
                        </span>
                      </p>
                      <span className="flex items-center gap-1 space-y-4 text-[10px] text-on-surface-variant">
                        <User size={12}/>{" "}
                        {space.workspace?.userWorkspaces?.find(
                          (uw: UserWorkspace) => uw.invitedBy !== null,
                        )?.inviter?.fullName ?? ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Modals */}
      <CreateSpaceModal
        isOpen={isOpen}
        onClose={close}
        onSubmit={handleCreate}
      />

      <UpdateSpaceModal
        isOpen={isUpdateOpen}
        spaceId={editingSpaceId}
        onClose={() => {
          closeUpdate();
          setEditingSpaceId(null);
        }}
        onSuccess={fetchSpaces}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onConfirm={handleDeleteConfirm}
        loading={deletingId !== null}
        title="Delete space"
        description={`Are you sure you want to delete "${selectedSpace?.name}"? All content inside will be permanently removed.`}
      />

      <Modal
        isOpen={isMemberOpen}
        title={`Manage members — ${activeSpace?.name ?? "Space"}`}
        onClose={closeMember}
        width="max-w-2xl"
        onConfirm={() => memberModalRef.current?.save()}
        confirmText={saving ? "Saving…" : "Save changes"}
        cancelText="Cancel"
        loading={saving}
      >
        <AddMemberModalContent
          ref={memberModalRef}
          allMembers={allMembers}
          initialSpaceMembers={
            activeSpace ? (spaceMembersMap[activeSpace.id] ?? []) : []
          }
          onSave={handleSaveMembers}
          onSavingChange={setSaving}
          loading={memberLoading}
        />
      </Modal>
    </main>
  );
};

export default MySpace;
