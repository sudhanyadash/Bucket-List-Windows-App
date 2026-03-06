import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, X, FileText, Music, Film, Image as ImageIcon } from 'lucide-react';

const TYPE_ICONS = {
    image: ImageIcon,
    video: Film,
    audio: Music,
    text: FileText,
};

const TYPE_COLORS = {
    image: 'text-blue-400 bg-blue-500/10',
    video: 'text-purple-400 bg-purple-500/10',
    audio: 'text-amber-400 bg-amber-500/10',
    text: 'text-emerald-400 bg-emerald-500/10',
};

export default function MediaAttachments({ attachments, onAttach, onRemove }) {
    return (
        <div className="space-y-3">
            {/* Attachment list */}
            <AnimatePresence mode="popLayout">
                {attachments.map((att) => {
                    const Icon = TYPE_ICONS[att.type] || FileText;
                    const colorClass = TYPE_COLORS[att.type] || TYPE_COLORS.text;

                    return (
                        <motion.div
                            key={att.id}
                            layout
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="group flex items-center gap-3 p-2.5 rounded-xl bg-surface-800/30 
                         border border-surface-700/20 hover:border-surface-600/30 transition-all"
                        >
                            {/* Preview or icon */}
                            {att.type === 'image' && att.thumbPath ? (
                                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-surface-800">
                                    <img
                                        src={window.api.getMediaUrl(att.thumbPath)}
                                        alt={att.originalName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${colorClass}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                            )}

                            {/* Name */}
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-surface-200 truncate">
                                    {att.originalName}
                                </p>
                                <p className="text-[10px] text-surface-500 uppercase tracking-wider mt-0.5">
                                    {att.type}
                                </p>
                            </div>

                            {/* Remove button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); onRemove(att.id); }}
                                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 
                           text-surface-500 hover:text-red-400 hover:bg-red-500/10 
                           transition-all"
                                title="Remove attachment"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {/* Add button */}
            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={onAttach}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl 
                   border border-dashed border-surface-600/40 text-surface-400
                   hover:border-brand-500/30 hover:text-brand-400 hover:bg-brand-500/5
                   transition-all text-sm"
            >
                <Paperclip className="w-4 h-4" />
                Attach File
            </motion.button>
        </div>
    );
}
