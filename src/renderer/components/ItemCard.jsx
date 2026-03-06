import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import StatusBadge from './StatusBadge';

export default function ItemCard({ item }) {
    const { selectItem, updateItem } = useStore();

    const thumbnail = item.attachments?.find((a) => a.type === 'image' && a.thumbPath);

    const handleStatusChange = async (newStatus) => {
        await updateItem({ ...item, status: newStatus });
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            whileHover={{ y: -2 }}
            onClick={() => selectItem(item.id)}
            className="group glass rounded-2xl overflow-hidden cursor-pointer
                 hover:border-surface-600/50 transition-all duration-200"
        >
            {/* Thumbnail area */}
            {thumbnail ? (
                <div className="h-36 w-full overflow-hidden bg-surface-800">
                    <img
                        src={window.api.getMediaUrl(thumbnail.thumbPath)}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            ) : (
                <div className="h-24 w-full bg-gradient-to-br from-surface-800 to-surface-800/50 
                        flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-surface-700" />
                </div>
            )}

            {/* Content */}
            <div className="p-4">
                <h3 className="text-sm font-semibold text-white truncate mb-0.5">
                    {item.title || 'Untitled'}
                </h3>
                {item.subtitle && (
                    <p className="text-xs text-surface-400 truncate mb-2">{item.subtitle}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                    <StatusBadge status={item.status} onChange={handleStatusChange} />
                    {item.attachments?.length > 0 && (
                        <span className="text-xs text-surface-500">
                            {item.attachments.length} file{item.attachments.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
