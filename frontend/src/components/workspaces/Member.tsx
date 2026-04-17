import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  callGetMembers,
  callInviteMember,
  callRemoveMember,
} from "../../services/workspace";
import { toastError, toastSuccess } from "../../lib/toast";
import { User } from "../../types/auth";
import { CLOUDINARY_URL, WorkspaceRole } from "../../constants";
import Modal from "../ui/Modal";
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";
import { Trash } from "lucide-react";
import { useModal } from "../../hook/useModal";
import { set } from "zod";
import { UserWorkspace } from "../../types/workspace";

const Member: React.FC = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteBy, setInviteBy] = useState("");
  const { workspaceId } = useParams();
  const [deleting, setDeleting] = useState(false);
  const { isOpen, open, close } = useModal();

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.fullName.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    );
  });
  const fetchMembers = async () => {
    try {
      const res = await callGetMembers(Number(workspaceId));
      setInviteBy(res.data.userWorkspaces.find((uw: UserWorkspace) => uw.invitedBy !== null).inviter.email ?? "");
      setMembers(res.data.users);
    } catch (error: any) {
      toastError(error.message);
    }
  };

  useEffect(() => {
    if (!workspaceId) return;
    fetchMembers();
  }, [workspaceId]);

  console.log(inviteBy)

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !workspaceId) return;
    setInviteLoading(true);
    try {
      await callInviteMember(Number(workspaceId), inviteEmail);
      toastSuccess("Invite sent successfully");
      setInviteEmail("");
      setShowInviteModal(false);
    } catch (error: any) {
      toastError(error.message);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemoveConfirm = async () => {
    if (!selectedMember || !workspaceId) return;
    setDeleting(true);
    try {
      await callRemoveMember(Number(workspaceId), selectedMember.id);
      setMembers((prev) => prev.filter((m) => m.id !== selectedMember.id));
      toastSuccess("Removed member");
      close();
      setSelectedMember(null);
    } catch (error: any) {
      toastError(error.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="lg:ml-64 mt-10 pt-5 pb-16 min-h-screen bg-slate-50">
      <div className="flex flex-col max-w-8xl">
        {/* Top bar */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Manage people
            </h1>
            <a
              href="#"
              className="text-xs text-indigo-500 hover:underline mt-1 inline-block"
            >
              Learn more
            </a>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Invite people
          </button>
        </div>

        <div className="px-6 py-4 flex-1">
          {/* Filters & Search */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <svg
                className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search or invite by email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            <div className="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer">
              <span>All Users ({members.length})</span>
            </div>
            <div className="ml-auto">
              <button className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded-md px-2.5 py-1.5 bg-white hover:bg-gray-50 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4"
                  />
                </svg>
                Export
              </button>
            </div>
          </div>

          {/* Invite people row */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <span className="w-6 h-6 rounded-full border-2 border-dashed border-indigo-400 flex items-center justify-center text-indigo-500">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </span>
              Invite people
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-[11px] text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-4 py-2 font-medium">Name</th>
                  <th className="text-left px-4 py-2 font-medium">Email</th>
                  <th className="text-left px-4 py-2 font-medium">Role</th>
                  <th className="text-left px-4 py-2 font-medium">
                    Accepted At
                  </th>
                  <th className="text-left px-4 py-2 font-medium">
                    Invited By
                  </th>
                  <th className="text-left px-4 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((member, idx) => (
                  <tr
                    key={member.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx === filtered.length - 1 ? "border-none" : ""}`}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <img
                          className="w-7 h-7 rounded-full ring-2 ring-indigo-100 cursor-pointer flex-shrink-0 hover:ring-indigo-300 transition-all"
                          src={
                            member?.avatar
                              ? member.avatar.startsWith("http")
                                ? member.avatar
                                : `${CLOUDINARY_URL}${member.avatar}`
                              : "/images/avatar.png"
                          }
                          alt=""
                        />
                        <span className="font-medium text-gray-800 truncate max-w-[120px]">
                          {member.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-gray-500 truncate max-w-[160px]">
                      {member.email}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[11px] border border-gray-200 rounded px-1.5 py-0.5 bg-white text-gray-700">
                        {member.UserWorkspace.role
                          ?.toLowerCase()
                          .replace(/^./, (c) => c.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-400">
                      {member.UserWorkspace.role === "owner"
                        ? "_"
                        : member.UserWorkspace.acceptedAt
                          ? new Date(
                              member.UserWorkspace.acceptedAt,
                            ).toLocaleDateString()
                          : "Never"}
                    </td>

                    <td className="px-4 py-2.5 text-gray-400">
                      {member.UserWorkspace.role === "owner"
                        ? "_"
                        : (inviteBy ?? "_")}
                    </td>
                    <td className="px-4 py-2.5">
                      {member.role !== "Owner" && (
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            open();
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove member"
                        >
                          <Trash size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">
                No members found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        title="Invite people to workspace"
        onClose={() => {
          setShowInviteModal(false);
          setInviteEmail("");
        }}
        onConfirm={handleInvite}
        confirmText="Send invite"
        loading={inviteLoading}
        disabled={!inviteEmail.trim()}
      >
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Email address
          </label>
          <input
            type="email"
            placeholder="Enter email address..."
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInvite()}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            autoFocus
          />
        </div>
      </Modal>

      <ConfirmDeleteModal
        isOpen={isOpen}
        title="Remove member"
        description={`Are you sure you want to remove ${selectedMember?.fullName ?? "this member"} from this workspace?`}
        confirmText="Remove"
        loading={deleting}
        onConfirm={handleRemoveConfirm}
        onClose={() => {
          close();
          setSelectedMember(null);
        }}
      />
    </main>
  );
};

export default Member;
