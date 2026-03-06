import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { PartyPopper } from 'lucide-react';

export default function CelebrationOverlay() {
    const hasLaunched = useRef(false);

    useEffect(() => {
        if (hasLaunched.current) return;
        hasLaunched.current = true;

        const duration = 3000;
        const end = Date.now() + duration;

        const colors = ['#5c7cfa', '#748ffc', '#91a7ff', '#ffd43b', '#69db7c', '#ff6b6b', '#da77f2'];

        function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.7 },
                colors,
                zIndex: 9999,
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.7 },
                colors,
                zIndex: 9999,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }

        // Initial burst
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: 0.5, y: 0.5 },
            colors,
            zIndex: 9999,
        });

        frame();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="glass-strong rounded-3xl px-8 py-6 text-center shadow-2xl pointer-events-none"
            >
                <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <PartyPopper className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                </motion.div>
                <h2 className="text-xl font-bold text-white mb-1">Amazing! 🎉</h2>
                <p className="text-sm text-surface-300">You crushed it! One more dream achieved.</p>
            </motion.div>
        </motion.div>
    );
}
