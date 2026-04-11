import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SpaceMember: React.FC = () => {
  const navigate = useNavigate();
  return (
    <main className="pl-64 mt-10 min-h-screen">
      <section className="p-8 max-w-8xl mx-auto">
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
                Marketing Q4
              </button>
              <span className="material-symbols-outlined text-[0.6875rem] text-outline">
                chevron_right
              </span>
              <button
                className="text-[0.6875rem] font-medium text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors"
              >
                Member
              </button>
            </nav>
            <h2 className="text-[1.5rem] font-extrabold text-on-surface tracking-tight">
              Marketing Q4 Launch
            </h2>
            <p className="text-on-surface-variant mt-1">
              Coordination for Q4 product releases and brand campaigns.
            </p>
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
                  24
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
                <img
                  alt="Member"
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                  data-alt="Portrait of a creative designer working in a bright sunlit studio with plants"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtGvX8JgODO50a-eAKpzDEDClUbC8yARQONrDfcWNh6K_JpR0SGE3mdFFmFFFI8ts7JgWDAohqxS1wsSSar8AUJBZ0x71mRcbDVwRH0r13ACyuzW8JUPysXDemDiOmTUVqUBD5KLHxxgn9ZtLC7p8yuWjBxN9u-SvcKtAWmBBgpXuNYoWUa_Vn3cHo9ZZJMhm1ahbZZ2HgiQtMrMSnywW0n7FKwcIYhT6ep8Z-MBqwYWHtNX6jhC2b6EbAKTQZu9WwAgBGsaPmJe0"
                />
                <img
                  alt="Member"
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                  data-alt="Close-up of a smiling software engineer wearing glasses in a professional setting"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0RhBNmySmSuQRH5RKdh0AeI7HpYgbueeWQP6A31PrH7bZrdasxGE0hQW8rockldGkhH6HsaMammgnO_or3lAvque85C17Kri-pz9nZwcy6rNl0Ae4-aYMssBRb0VAKIzq3maD-Jk-yKK9aQv3q6xpcQorLGryZ1thvsEWQ7YDWnquBWEzG_Mp8DO0XT43XmaUttZaqhV__TMcGmWycKE_Qhwp-KKq24xqihwkx83Et6pw2mQzNg6UQeUb2eEqQCYUVYBqArZSkzE"
                />
                <img
                  alt="Member"
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                  data-alt="Young professional woman in a business meeting with soft urban lighting in the background"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNRj2kOvCawLVD0mT4hqsur78-v2Wb6LlpbiYGYylR2l_m8cQzq6dNe_XIgD5HbL1eDVjLMRyPu5PiQ_wHGrz2WIkJhSgAtvGTYSMZnH8dYMIQH0ylygxLCNUH21U2hvUUi46ao3MmWCir6xXY40PTiM-egRJjneMC-HJNb-o89tTQ_9yXvqAMkFt9uiYDoyQilrIcE2Kq8xbPzHaHL1sDyjmnMasmM55v8zn_bQ573WVZ518Q1qK78n59wHcIAswsDGjPZ5a5eV4"
                />
                <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 text-[10px] font-bold">
                  +5
                </div>
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
                  <tr className="hover:bg-surface-container-low/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          alt="Alex Chen"
                          className="h-9 w-9 rounded-lg object-cover"
                          data-alt="Friendly male project manager wearing a casual shirt against a clean minimal office background"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBH3NzRaVrXSfdJUT5kEjKpkw_HB3JyTeiGSNSJEZVzV7JL8h326Yv4xihhObTUJ_zc1guqR1rS1UXGeN01pr5dAADJotLzbmeURIkVP86plq-uWG7jotfOC0DFv_G1jmJc2JiRvHqS-WKEilUBEAbhJ1FreiDcX3S-bLRvSLwfLKRdcyvZQchmHoE6DHT3KeF3BcxgqCUSQdzRihyGGyKLXeLJdsY7bmSk6w7WwwUBQAMUWI7eUZbxqilWvPvc3vMBnIlBsnX9cVU"
                        />
                        <div>
                          <p className="text-sm font-semibold text-on-surface">
                            Alex Chen
                          </p>
                          <p className="text-[0.6875rem] text-on-surface-variant">
                            alex.chen@velocity.ai
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                        ADMIN
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
                      Now
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-on-surface-variant hover:text-indigo-600 transition-colors">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          data-icon="more_vert"
                        >
                          more_vert
                        </span>
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          alt="Sarah Miller"
                          className="h-9 w-9 rounded-lg object-cover"
                          data-alt="Elegant portrait of a woman in creative work attire looking thoughtfully to the side in a modern loft"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmMSyCzf3bA_1zZMWSD4Ehh1pwrG68Vpln7L4xnmqZswnlPAzoXTDHDZsxfXP4sbO7ZPvaxHD9Kv-VYDvOdRZ2sqFGYPBXrgZmfWOvssx85xNEKCLLgx7LJpiaS0kiWxIzw1CN9BPFsVUnMi7iPm5g4D6611FZZpEvT4_JASoY5ZW0oeUExJOG-Nzz0pM7FI0rZrLahb1czZIMbP_FzouUTRUN7gNvJjoe8kXS9R0Su7yQ__IyLJ1KMg52HUjlt0ULzQKUZcLxg_8"
                        />
                        <div>
                          <p className="text-sm font-semibold text-on-surface">
                            Sarah Miller
                          </p>
                          <p className="text-[0.6875rem] text-on-surface-variant">
                            sarah.m@velocity.ai
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        MEMBER
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
                      12m ago
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-on-surface-variant hover:text-indigo-600 transition-colors">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          data-icon="more_vert"
                        >
                          more_vert
                        </span>
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                          JS
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-on-surface">
                            Jason Stark
                          </p>
                          <p className="text-[0.6875rem] text-on-surface-variant">
                            jason@contractor.com
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700">
                        GUEST
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                        <span className="text-xs font-medium">Offline</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">
                      2d ago
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-on-surface-variant hover:text-indigo-600 transition-colors">
                        <span
                          className="material-symbols-outlined text-[20px]"
                          data-icon="more_vert"
                        >
                          more_vert
                        </span>
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 opacity-60">
                        <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                          <span
                            className="material-symbols-outlined text-sm"
                            data-icon="mail"
                          >
                            mail
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-on-surface">
                            linda.v@design.co
                          </p>
                          <p className="text-[0.6875rem] text-on-surface-variant">
                            Invitation pending
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        MEMBER
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-amber-600">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">
                      Sent 4h ago
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="px-3 py-1 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 rounded transition-colors uppercase">
                        Resend
                      </button>
                    </td>
                  </tr>
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
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined" data-icon="security">
                security
              </span>
            </div>
            <h3 className="text-sm font-bold text-indigo-900 mb-2">Admins</h3>
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
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mb-4">
              <span
                className="material-symbols-outlined"
                data-icon="person_search"
              >
                person_search
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Guests</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Restricted access to specific projects only. Cannot invite new
              members or see full space history.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SpaceMember;
