import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";

import { Category } from "../../types/category";
import {
  callGetCategories,
  callCreateCategory,
  callUpdateCategory,
  callDeleteCategory,
} from "../../services/category";
import {
  CreateCategoryFormData,
  UpdateCategoryFormData,
} from "../../validations/category";
import { toastError, toastSuccess } from "../../lib/toast";
import { useModal } from "../../hook/useModal";
import CreateCategoryModal from "./CreateCategoryModal";
import UpdateCategoryModal from "./UpdateCategoryModal";
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";
import { useNavigate, useParams } from "react-router-dom";
import EllipsisMenu, { MenuAction } from "../ui/EllipsisMenu";
import { List } from "../../types/list";
import {
  callCreateList,
  callGetLists,
  callUpdateList,
  callDeleteList,
} from "../../services/list";
import CreateListModal from "../lists/CreateListModal";
import UpdateListModal from "../lists/UpdateListModal";
import { Icon } from "../ui/Icon";

const Categories: React.FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null,
  );

  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [editingListId, setEditingListId] = useState<number | null>(null);
  const [categoryIdForList, setCategoryIdForList] = useState<number | null>(
    null,
  );
  const [deletingListId, setDeletingListId] = useState<number | null>(null);

  const { isOpen, open, close } = useModal();
  const {
    isOpen: isDeleteOpen,
    open: openDelete,
    close: closeDelete,
  } = useModal();
  const {
    isOpen: isUpdateOpen,
    open: openUpdate,
    close: closeUpdate,
  } = useModal();

  const { isOpen: isOpenList, open: openList, close: closeList } = useModal();
  const {
    isOpen: isDeleteOpenList,
    open: openDeleteList,
    close: closeDeleteList,
  } = useModal();
  const {
    isOpen: isUpdateOpenList,
    open: openUpdateList,
    close: closeUpdateList,
  } = useModal();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await callGetCategories(Number(spaceId));
      setCategories(res.data ?? []);
    } catch (error: any) {
      toastError(error.message ?? "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [spaceId]);
  // ── Category handlers ─────────────────────────────────────────────────────

  const handleCreate = async (data: CreateCategoryFormData) => {
    await callCreateCategory(data, Number(spaceId));
    await fetchCategories();
  };

  const handleUpdate = async (id: number, data: UpdateCategoryFormData) => {
    await callUpdateCategory(id, data);
    await fetchCategories();
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    openDelete();
  };

  const handleEditClick = (category: Category) => {
    setEditingCategoryId(category.id);
    openUpdate();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;
    setDeletingId(selectedCategory.id);
    try {
      await callDeleteCategory(selectedCategory.id);
      toastSuccess("Category deleted successfully!");
      if (activeCategory === selectedCategory.id) setActiveCategory(null);
      await fetchCategories();
      closeDelete();
    } catch (err: any) {
      toastError(err.message ?? "Failed to delete category.");
    } finally {
      setDeletingId(null);
      setSelectedCategory(null);
    }
  };

  const handleCreateList = async (data: any) => {
    if (!categoryIdForList) return;
    await callCreateList(data, categoryIdForList);
    await fetchCategories();
  };

  const handleUpdateList = async (id: number, data: any) => {
    await callUpdateList(id, data);
    await fetchCategories();
  };

  const handleNewListClick = (categoryId: number) => {
    setCategoryIdForList(categoryId);
    openList();
  };

  const handleEditListClick = (list: List) => {
    setEditingListId(list.id);
    openUpdateList();
  };

  const handleDeleteListClick = (list: List) => {
    setSelectedList(list);
    openDeleteList();
  };

  const handleDeleteListConfirm = async () => {
    if (!selectedList) return;
    setDeletingListId(selectedList.id);
    try {
      await callDeleteList(selectedList.id);
      toastSuccess("List deleted successfully!");
      await fetchCategories();
      closeDeleteList();
    } catch (err: any) {
      toastError(err.message ?? "Failed to delete list.");
    } finally {
      setDeletingListId(null);
      setSelectedList(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="col-span-12">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-white/50 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
            <span
              className="material-symbols-outlined text-lg text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              folder_open
            </span>
            Categories
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={open}
              className="flex items-center gap-1.5 text-[0.6875rem] font-bold text-on-surface-variant hover:text-primary px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              New Category
            </button>
          </div>
        </div>

        {/* Category folder grid */}
        <div className="p-6 border-b border-slate-50">
          <p className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-wider mb-4">
            Folders
          </p>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant animate-pulse"
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-surface-container-high rounded w-3/4" />
                    <div className="h-2 bg-surface-container-high rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-on-surface-variant">
              <span
                className="material-symbols-outlined text-4xl text-outline"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                folder_open
              </span>
              <p className="text-xs">
                No categories yet. Create your first one!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((category) => {
                const menuActions: MenuAction[] = [
                  {
                    label: "Edit",
                    icon: <Pencil className="w-4 h-4" />,
                    onClick: () => handleEditClick(category),
                  },
                  {
                    label: "Delete",
                    icon: <Trash2 className="w-4 h-4" />,
                    onClick: () => handleDeleteClick(category),
                    variant: "danger",
                  },
                ];

                return (
                  <div
                    key={category.id}
                    onClick={() =>
                      setActiveCategory(
                        activeCategory === category.id ? null : category.id,
                      )
                    }
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group relative cursor-pointer ${
                      activeCategory === category.id
                        ? "border-primary bg-primary-container/20"
                        : "border-outline-variant hover:border-primary hover:bg-slate-50"
                    }`}
                  >
                    {/* EllipsisMenu on hover */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <EllipsisMenu actions={menuActions} align="right" />
                    </div>

                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: category.color
                          ? `${category.color}18`
                          : "#f5f5f4",
                        color: category.color ?? "#78716c",
                      }}
                    >
                      <Icon
                        icon={category.icon}
                        className="w-5 h-5"
                        style={{ color: category.color ?? "#78716c" }}
                      />
                    </div>

                    <div className="flex-1 min-w-0 pr-6">
                      <p className="text-[0.6875rem] font-bold text-on-surface truncate">
                        {category.name}
                      </p>
                      <p className="text-[0.625rem] text-on-surface-variant truncate">
                        {category.description || "No description"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Expanded category detail panel */}
        {activeCategory &&
          (() => {
            const cat = categories.find((c) => c.id === activeCategory);
            if (!cat) return null;
            const catLists = cat.lists ?? [];
            return (
              <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-primary">
                      subdirectory_arrow_right
                    </span>
                    <p className="text-[0.6875rem] font-bold text-primary uppercase tracking-wider">
                      {cat.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNewListClick(cat.id);
                      }}
                      className="flex items-center gap-1.5 text-[0.6875rem] font-bold text-on-surface-variant hover:text-primary px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        add
                      </span>
                      New List
                    </button>
                  </div>
                </div>

                {catLists.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 gap-2 text-on-surface-variant">
                    <span
                      className="material-symbols-outlined text-3xl text-outline"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      list
                    </span>
                    <p className="text-xs">No lists in this category yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {catLists.map((list: List) => {
                      const listMenuActions: MenuAction[] = [
                        {
                          label: "Edit",
                          icon: <Pencil className="w-4 h-4" />,
                          onClick: () => handleEditListClick(list),
                        },
                        {
                          label: "Delete",
                          icon: <Trash2 className="w-4 h-4" />,
                          onClick: () => handleDeleteListClick(list),
                          variant: "danger",
                        },
                      ];

                      return (
                        <div
                          key={list.id}
                          onClick={() =>
                            navigate(`${cat.id}/${list.id}`, {
                              state: { categoryId: cat.id },
                            })
                          }
                          className="flex items-center gap-5 p-2.5 hover:bg-white rounded-lg transition-colors cursor-pointer group relative"
                        >
                          <Icon
                            icon={list.icon}
                            style={{ color: list.color ?? "#78716c" }}
                            size={20}
                          />
                          <div className="flex-1 min-w-0 pr-8">
                            <p className="text-[0.6875rem] font-bold text-on-surface truncate">
                              {list.name}
                            </p>
                            {list.description && (
                              <p className="text-[0.625rem] text-on-surface-variant truncate uppercase">
                                {list.description}
                              </p>
                            )}
                          </div>
                          {/* EllipsisMenu on hover */}
                          <div className="absolute top-1.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <EllipsisMenu
                              actions={listMenuActions}
                              align="right"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

        {/* Recently Modified */}
        <div className="p-6">
          <p className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-wider mb-4">
            Recently Modified
          </p>

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-on-surface-variant animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading…
            </div>
          ) : categories.length === 0 ? (
            <p className="text-xs text-on-surface-variant">
              No categories yet.
            </p>
          ) : (
            <div className="divide-y divide-slate-50">
              {[...categories]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )
                .slice(0, 5)
                .map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-4 py-3 hover:bg-slate-50 px-2 rounded-lg -mx-2 transition-colors cursor-pointer group"
                    onClick={() =>
                      setActiveCategory(
                        activeCategory === cat.id ? null : cat.id,
                      )
                    }
                  >
                    <div
                      className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0"
                      style={{
                        backgroundColor: cat.color
                          ? `${cat.color}18`
                          : "#f5f5f4",
                        color: cat.color ?? "#78716c",
                      }}
                    >
                      <Icon
                        icon={cat.icon}
                        className="w-4 h-4"
                        style={{ color: cat.color ?? "#78716c" }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[0.6875rem] font-bold text-on-surface truncate">
                        {cat.name}
                      </p>
                      <p className="text-[0.625rem] text-on-surface-variant uppercase truncate">
                        {cat.description || "No description"}
                      </p>
                    </div>

                    <span className="text-[0.625rem] text-outline whitespace-nowrap">
                      {cat.createdAt
                        ? new Date(cat.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Category Modals ── */}
      <CreateCategoryModal
        isOpen={isOpen}
        onClose={close}
        onSubmit={handleCreate}
      />

      <UpdateCategoryModal
        isOpen={isUpdateOpen}
        categoryId={editingCategoryId}
        onClose={() => {
          closeUpdate();
          setEditingCategoryId(null);
        }}
        onSubmit={handleUpdate}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onConfirm={handleDeleteConfirm}
        loading={deletingId !== null}
        title="Delete category"
        description={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
      />

      {/* ── List Modals ── */}
      <CreateListModal
        isOpen={isOpenList}
        onClose={() => {
          closeList();
          setCategoryIdForList(null);
        }}
        onSubmit={handleCreateList}
      />

      <UpdateListModal
        isOpen={isUpdateOpenList}
        listId={editingListId}
        onClose={() => {
          closeUpdateList();
          setEditingListId(null);
        }}
        onSubmit={handleUpdateList}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpenList}
        onClose={() => {
          closeDeleteList();
          setSelectedList(null);
        }}
        onConfirm={handleDeleteListConfirm}
        loading={deletingListId !== null}
        title="Delete list"
        description={`Are you sure you want to delete "${selectedList?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Categories;
