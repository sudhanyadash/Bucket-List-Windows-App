import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreHorizontal, Pencil, Trash2, FolderHeart } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import GroupModal from './GroupModal';
import ConfirmDialog from './ConfirmDialog';

export default function GroupBar() {
    const { groups, activeGroupId, setActiveGroup, createGroup, renameGroup, deleteGroup } = useStore();
    const [showModal, setShowModal] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [contextMenu, setContextMenu] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const handleCreate = async (name) => {
        await createGroup(name);
        setShowModal(false);
    };

    const handleRename = async (name) => {
        if (editingGroup) {
            await renameGroup(editingGroup.id, name);
            setEditingGroup(null);
        }
    };

    const handleDelete = async () => {
        if (deleteConfirm) {
            await deleteGroup(deleteConfirm.id);
            setDeleteConfirm(null);
        }
    };

    const handleContextMenu = (e, group) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY, group });
    };

    return (
        <>
            <div className="px-6 py-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                    {groups.map((group) => (
                        <motion.button
                            key={group.id}
                            layoutId={`group-${group.id}`}
                            onClick={() => setActiveGroup(group.id)}
                            onContextMenu={(e) => handleContextMenu(e, group)}
                            className={`
                relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
                transition-all duration-200 group
                ${activeGroupId === group.id
                                    ? 'text-white'
                                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
                                }
              `}
                        >
                            {activeGroupId === group.id && (
                                <motion.div
                                    layoutId="activeGroupBg"
                                    className="absolute inset-0 rounded-xl bg-surface-800 border border-surface-700/50"
                                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <FolderHeart className="w-4 h-4" />
                                {group.name}
                            </span>
                            <span
                                className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => handleContextMenu(e, group)}
                            >
                                <MoreHorizontal className="w-3.5 h-3.5" />
                            </span>
                        </motion.button>
                    ))}

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium 
                       text-brand-400 hover:bg-brand-500/10 transition-colors whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" />
                        New Group
                    </motion.button>
                </div>
            </div>

            {/* Context menu */}
            <AnimatePresence>
                {contextMenu && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setContextMenu(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.1 }}
                            className="fixed z-50 glass-strong rounded-xl shadow-xl py-1.5 min-w-[160px]"
                            style={{ left: contextMenu.x, top: contextMenu.y }}
                        >
                            <button
                                onClick={() => {
                                    setEditingGroup(contextMenu.group);
                                    setContextMenu(null);
                                }}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-surface-200 hover:bg-white/10 transition-colors"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                                Rename
                            </button>
                            <button
                                onClick={() => {
                                    setDeleteConfirm(contextMenu.group);
                                    setContextMenu(null);
                                }}
                                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Create / Rename modal */}
            <AnimatePresence>
                {(showModal || editingGroup) && (
                    <GroupModal
                        initialName={editingGroup?.name || ''}
                        title={editingGroup ? 'Rename Group' : 'Create Group'}
                        onSubmit={editingGroup ? handleRename : handleCreate}
                        onClose={() => { setShowModal(false); setEditingGroup(null); }}
                    />
                )}
            </AnimatePresence>

            {/* Delete confirmation */}
            <AnimatePresence>
                {deleteConfirm && (
                    <ConfirmDialog
                        title="Delete Group"
                        message={`Delete "${deleteConfirm.name}" and all its items? This cannot be undone.`}
                        onConfirm={handleDelete}
                        onCancel={() => setDeleteConfirm(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
