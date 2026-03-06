import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Inbox } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import ItemCard from './ItemCard';

export default function ItemList() {
    const { items, activeGroupId, groups, createItem } = useStore();

    const filteredItems = activeGroupId
        ? items.filter((i) => i.groupId === activeGroupId)
        : [];

    const activeGroup = groups.find((g) => g.id === activeGroupId);

    if (!activeGroupId) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center mb-4">
                    <Inbox className="w-8 h-8 text-surface-500" />
                </div>
                <h2 className="text-lg font-medium text-surface-300 mb-2">No Group Selected</h2>
                <p className="text-sm text-surface-500 max-w-xs">
                    Create a group to get started with your bucket list!
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Group title & add button */}
            <div className="flex items-center justify-between px-6 py-4">
                <div>
                    <h2 className="text-lg font-semibold text-white">{activeGroup?.name}</h2>
                    <p className="text-xs text-surface-500 mt-0.5">
                        {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => createItem(activeGroupId)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                     bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/20
                     transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Item
                </motion.button>
            </div>

            {/* Item grid */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
                {filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-14 h-14 rounded-2xl bg-surface-800/50 flex items-center justify-center mb-3">
                            <Inbox className="w-7 h-7 text-surface-600" />
                        </div>
                        <p className="text-sm text-surface-500">
                            This group is empty. Add your first bucket list item!
                        </p>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredItems.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
