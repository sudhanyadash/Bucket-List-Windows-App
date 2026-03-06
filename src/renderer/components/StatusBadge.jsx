import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Loader, CheckCircle2, Hourglass } from 'lucide-react';

const STATUS_CONFIG = {
    'todo': {
        label: 'To Be Done',
        colors: 'bg-surface-700/50 text-surface-300 border-surface-600/30',
        icon: Clock,
    },
    'for-the-future': {
        label: 'For The Future',
        colors: 'bg-purple-500/15 text-purple-300 border-purple-500/20',
        icon: Hourglass,
    },
    'in-progress': {
        label: 'In Progress',
        colors: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
        icon: Loader,
    },
    'completed': {
        label: 'Completed',
        colors: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
        icon: CheckCircle2,
    },
};

const STATUS_ORDER = ['todo', 'for-the-future', 'in-progress', 'completed'];

export default function StatusBadge({ status, onChange, size = 'sm' }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG['todo'];
    const Icon = config.icon;
    const [open, setOpen] = React.useState(false);

    const sizeClasses = size === 'lg'
        ? 'px-3.5 py-1.5 text-sm gap-2'
        : 'px-2.5 py-1 text-xs gap-1.5';

    return (
        <div className="relative">
            <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                className={`
          flex items-center rounded-lg border font-medium transition-all
          ${config.colors} ${sizeClasses}
        `}
            >
                <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} />
                {config.label}
            </motion.button>

            {open && (
                <>
                    <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 mt-1.5 z-40 glass-strong rounded-xl py-1.5 min-w-[160px] shadow-xl"
                    >
                        {STATUS_ORDER.map((key) => {
                            const cfg = STATUS_CONFIG[key];
                            const StatusIcon = cfg.icon;
                            return (
                                <button
                                    key={key}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChange(key);
                                        setOpen(false);
                                    }}
                                    className={`
                    w-full flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors
                    ${status === key ? 'text-white bg-white/5' : 'text-surface-300 hover:bg-white/5'}
                  `}
                                >
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {cfg.label}
                                </button>
                            );
                        })}
                    </motion.div>
                </>
            )}
        </div>
    );
}
