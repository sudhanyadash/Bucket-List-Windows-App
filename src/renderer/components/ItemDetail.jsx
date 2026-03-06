import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2, Save } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import StatusBadge from './StatusBadge';
import MediaAttachments from './MediaAttachments';
import ConfirmDialog from './ConfirmDialog';
import { AnimatePresence } from 'framer-motion';

export default function ItemDetail({ onCelebrate }) {
    const { items, selectedItemId, selectItem, updateItem, deleteItem, attachFile, removeAttachment } = useStore();
    const item = items.find((i) => i.id === selectedItemId);
    const [form, setForm] = useState({ title: '', subtitle: '', description: '' });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [dirty, setDirty] = useState(false);

    useEffect(() => {
        if (!item) return;
        setForm({
            title: item.title || '',
            subtitle: item.subtitle || '',
            description: item.description || '',
        });
        setDirty(false);
    }, [item?.id]);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setDirty(true);
    };

    // Auto-save with a debounce effect
    useEffect(() => {
        if (!dirty || !item) return;

        const saveTimer = setTimeout(() => {
            updateItem({ ...item, ...form });
            setDirty(false);
        }, 500); // 500ms debounce

        return () => clearTimeout(saveTimer);
    }, [form, dirty, item, updateItem]);

    const handleStatusChange = async (newStatus) => {
        if (!item) return;
        const prevStatus = item.status;
        await updateItem({ ...item, ...form, status: newStatus });
        setDirty(false);
        if (newStatus === 'completed' && prevStatus !== 'completed') {
            onCelebrate();
        }
    };

    const handleDelete = async () => {
        if (!item) return;
        await deleteItem(item.id);
        setShowDeleteConfirm(false);
    };

    const handleAttach = async () => {
        if (!item) return;
        await attachFile(item.id);
    };

    const handleRemoveAttachment = async (attachmentId) => {
        if (!item) return;
        await removeAttachment(item.id, attachmentId);
    };

    if (!item) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="w-[480px] min-w-[400px] h-full border-l border-surface-800 bg-surface-900/95 
                 flex flex-col overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-800/50">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-surface-400">Item Details</h3>
                    {dirty && <span className="text-[10px] text-surface-500 italic">Saving...</span>}
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-2 rounded-lg text-surface-500 hover:text-red-400 
                       hover:bg-red-500/10 transition-colors"
                        title="Delete item"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => selectItem(null)}
                        className="p-2 rounded-lg text-surface-500 hover:text-surface-200 
                       hover:bg-surface-800/50 transition-colors"
                        title="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Fields */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
                {/* Title */}
                <div>
                    <label className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-1.5 block">
                        Title
                    </label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="What do you want to do?"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-800/50 border border-surface-700/30
                       text-white placeholder-surface-600 text-sm focus-ring
                       focus:border-brand-500/50 transition-all"
                    />
                </div>

                {/* Subtitle */}
                <div>
                    <label className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-1.5 block">
                        Subtitle
                    </label>
                    <input
                        type="text"
                        value={form.subtitle}
                        onChange={(e) => handleChange('subtitle', e.target.value)}
                        placeholder="A short tagline..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-800/50 border border-surface-700/30
                       text-white placeholder-surface-600 text-sm focus-ring
                       focus:border-brand-500/50 transition-all"
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-1.5 block">
                        Status
                    </label>
                    <StatusBadge status={item.status} onChange={handleStatusChange} size="lg" />
                </div>

                {/* Description */}
                <div>
                    <label className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-1.5 block">
                        Description
                    </label>
                    <textarea
                        value={form.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Describe your dream in detail..."
                        rows={6}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-800/50 border border-surface-700/30
                       text-white placeholder-surface-600 text-sm focus-ring
                       focus:border-brand-500/50 transition-all leading-relaxed"
                    />
                </div>

                {/* Attachments */}
                <div>
                    <label className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-1.5 block">
                        Attachments
                    </label>
                    <MediaAttachments
                        attachments={item.attachments || []}
                        onAttach={handleAttach}
                        onRemove={handleRemoveAttachment}
                    />
                </div>
            </div>

            {/* Delete confirmation */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <ConfirmDialog
                        title="Delete Item"
                        message={`Delete "${item.title || 'Untitled'}"? This will also remove all attached files.`}
                        onConfirm={handleDelete}
                        onCancel={() => setShowDeleteConfirm(false)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
