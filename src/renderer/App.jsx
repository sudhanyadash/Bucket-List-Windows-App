import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StoreProvider, useStore } from './hooks/useStore';
import GroupBar from './components/GroupBar';
import ItemList from './components/ItemList';
import ItemDetail from './components/ItemDetail';
import CelebrationOverlay from './components/CelebrationOverlay';
import { Sparkles } from 'lucide-react';

function AppContent() {
    const { loading, selectedItemId } = useStore();
    const [celebrating, setCelebrating] = useState(false);

    const handleCelebrate = () => {
        setCelebrating(true);
        setTimeout(() => setCelebrating(false), 3500);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-surface-900">
                <div className="text-center">
                    <Sparkles className="w-12 h-12 text-brand-400 mx-auto mb-4 animate-pulse" />
                    <p className="text-surface-400 text-lg font-medium">Loading your bucket list...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-surface-900 overflow-hidden">
            {/* Header */}
            <header className="flex items-center px-6 pt-5 pb-2">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-semibold text-white tracking-tight">
                        Lony's Bucket List
                    </h1>
                </div>
            </header>

            {/* Group tabs */}
            <GroupBar />

            {/* Main content */}
            <div className="flex-1 flex overflow-hidden">
                <div className={`flex-1 overflow-hidden transition-all duration-300 ${selectedItemId ? 'w-1/2' : 'w-full'}`}>
                    <ItemList />
                </div>

                <AnimatePresence mode="wait">
                    {selectedItemId && (
                        <ItemDetail key={selectedItemId} onCelebrate={handleCelebrate} />
                    )}
                </AnimatePresence>
            </div>

            {/* Celebration overlay */}
            <AnimatePresence>
                {celebrating && <CelebrationOverlay />}
            </AnimatePresence>
        </div>
    );
}

export default function App() {
    return (
        <StoreProvider>
            <AppContent />
        </StoreProvider>
    );
}
