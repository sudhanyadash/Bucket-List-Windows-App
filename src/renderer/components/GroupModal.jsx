import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function GroupModal({ initialName = '', title, onSubmit, onClose }) {
    const [name, setName] = useState(initialName);
    const inputRef = useRef(null);

    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 100);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit(name.trim());
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                className="glass-strong rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Group name..."
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-800/80 border border-surface-600/50 
                       text-white placeholder-surface-500 text-sm focus-ring
                       focus:border-brand-500/50 transition-all"
                    />
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-sm font-medium text-surface-400 
                         hover:text-surface-200 hover:bg-surface-800/50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="px-4 py-2 rounded-xl text-sm font-medium text-white 
                         bg-brand-600 hover:bg-brand-500 disabled:opacity-40 
                         disabled:cursor-not-allowed transition-colors shadow-lg shadow-brand-600/20"
                        >
                            {initialName ? 'Save' : 'Create'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
