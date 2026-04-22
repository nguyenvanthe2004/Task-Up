import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Space } from "../../types/space";
import { toastError, toastSuccess } from "../../lib/toast";
import { callGetSpaceById, callRemoveSpaceMember } from "../../services/space";
import { normalizeImg } from "../../lib/until";
import { AvatarStack } from "../ui/AvatarStack";
import { UserWorkspace } from "../../types/workspace";
import dayjs from "dayjs";
import { useModal } from "../../hook/useModal";
import EllipsisMenu, { MenuAction } from "../ui/EllipsisMenu";
import { Trash2 } from "lucide-react";
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";

const SpaceMember: React.FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const navigate = useNavigate();
  const [space, setSpace] = useState<Space | null>(null);
  const [deleteId, setDeleteId] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const { isOpen, open, close } = useModal();

  const fetchSpaceById = async () => {
    try {
      const res = await callGetSpaceById(Number(spaceId));
      console.log(res.data);
      setSpace(res.data);
    } catch (error: any) {
      toastError(error.message);
    }
  };

  useEffect(() => {
    fetchSpaceById();
  }, []);

  const handleDeleteMember = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await callRemoveSpaceMember(Number(space?.id), Number(deleteId));
      setDeleteId(0);
      close();
      toastSuccess("Member deleted successfully!");
      fetchSpaceById();
    } catch (error: any) {
      toastError(error.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="pl-64 mt-10 min-h-screen">
      <section className="py-10 px-5 max-w-8xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <nav className="flex items-center gap-2 mb-2">
              <button
                onClick={() => navigate(-1)}
                className="text-[0.6875rem] font-medium text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors"
              >
                Spaces
              </button>
              <span className="material-symbols-outlined text-[0.6875rem] text-outline">
                chevron_right
              </span>
              <button
                onClick={() => navigate(-1)}
                className="text-[0.6875rem] font-medium text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors"
              >
                {space?.name || "Space Name"}
              </button>
              <span className="material-symbols-outlined text-[0.6875rem] text-outline">
                chevron_right
              </span>
              <button className="text-[0.6875rem] font-medium text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors">
                Member
              </button>
            </nav>
            <h2 className="text-[1.5rem] font-extrabold text-on-surface tracking-tight">
              {space?.name || "Space Name"}
            </h2>
            <p className="text-on-surface-variant mt-1">{space?.description}</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-white transition-colors border border-outline-variant/10">
              <span
                className="material-symbols-outlined text-[20px]"
                data-icon="filter_list"
              >
                filter_list
              </span>
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-lowest text-on-surface text-sm font-medium hover:bg-white transition-colors border border-outline-variant/10">
              <span
                className="material-symbols-outlined text-[20px]"
                data-icon="file_download"
              >
                file_download
              </span>
              Export
            </button>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10">
              <p className="text-on-surface-variant text-[0.6875rem] font-bold uppercase tracking-wider mb-4">
                Total Members
              </p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black text-indigo-600 leading-none">
                  {space?.members?.length || 0}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  +2 this month
                </span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10">
              <p className="text-on-surface-variant text-[0.6875rem] font-bold uppercase tracking-wider mb-4">
                Storage Used
              </p>
              <div className="w-full bg-surface-container h-1.5 rounded-full mb-3">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
              <p className="text-xs font-medium text-on-surface-variant">
                12.4 GB of 20 GB used
              </p>
            </div>
            <div className="glass-panel p-5 rounded-xl border border-white/40 shadow-sm">
              <p className="text-on-surface-variant text-[0.6875rem] font-bold uppercase tracking-wider mb-3">
                Active Now
              </p>
              <div className="flex -space-x-2">
                <AvatarStack members={space?.members?.slice(0, 5) || []} />
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-6 py-4 text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-widest">
                      Member Name
                    </th>
                    <th className="px-6 py-4 text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-widest">
                      Role
                    </th>
                    <th className="px-6 py-4 text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-widest">
                      Last Active
                    </th>
                    <th className="px-6 py-4 text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-widest"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {space?.members?.map((member) => {
                    const userWorkspace = space.workspace?.userWorkspaces.find(
                      (uw: UserWorkspace) => uw.userId === member.id,
                    );

                    const role = userWorkspace?.role;
                    const menuActions: MenuAction[] = [
                      {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4" />,
                        onClick: () => {
                          (open(), setDeleteId(Number(member.id)));
                        },
                        variant: "danger",
                      },
                    ];
                    return (
                      <tr
                        key={member.id}
                        className="hover:bg-surface-container-low/30 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              className="h-9 w-9 rounded-lg object-cover"
                              data-alt="Friendly male project manager wearing a casual shirt against a clean minimal office background"
                              src={normalizeImg(member.avatar)}
                            />
                            <div>
                              <p className="text-sm font-semibold text-on-surface">
                                {member.fullName}
                              </p>
                              <p className="text-[0.6875rem] text-on-surface-variant">
                                {member.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-1.5 rounded-full text-[10px] font-bold ${
                              role === "owner"
                                ? "bg-indigo-50 text-indigo-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {role === "owner" ? "Owner" : "Member"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            <span className="text-xs font-medium text-on-surface">
                              Active
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-on-surface-variant">
                          {space?.createdAt
                            ? dayjs(space.createdAt).format("MMM D, YYYY")
                            : "—"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <EllipsisMenu actions={menuActions} align="right" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="px-6 py-4 bg-surface-container-low/20 flex items-center justify-between">
                <p className="text-xs text-on-surface-variant font-medium">
                  Showing 1-4 of 24 members
                </p>
                <div className="flex gap-2">
                  <button className="p-1.5 rounded bg-surface-container text-on-surface-variant opacity-50 cursor-not-allowed">
                    <span
                      className="material-symbols-outlined text-[18px]"
                      data-icon="chevron_left"
                    >
                      chevron_left
                    </span>
                  </button>
                  <button className="p-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-variant transition-colors">
                    <span
                      className="material-symbols-outlined text-[18px]"
                      data-icon="chevron_right"
                    >
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined" data-icon="security">
                security
              </span>
            </div>
            <h3 className="text-sm font-bold text-indigo-900 mb-2">Owners</h3>
            <p className="text-xs text-indigo-700/80 leading-relaxed">
              Full control over space settings, billing, and member permissions.
              Can delete projects.
            </p>
          </div>
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined" data-icon="group">
                group
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Members</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Can create projects, tasks, and invite others. Cannot change
              global space settings.
            </p>
          </div>
        </div>
      </section>
      <ConfirmDeleteModal
        isOpen={isOpen}
        onClose={close}
        onConfirm={handleDeleteMember}
        loading={deleting}
      />
    </main>
  );
};

export default SpaceMember;
