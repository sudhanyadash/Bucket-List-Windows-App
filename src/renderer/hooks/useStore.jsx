import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const StoreContext = createContext(null);

const initialState = {
    groups: [],
    items: [],
    activeGroupId: null,
    selectedItemId: null,
    loading: true,
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_GROUPS':
            return { ...state, groups: action.payload };
        case 'SET_ITEMS':
            return { ...state, items: action.payload };
        case 'SET_ACTIVE_GROUP':
            return { ...state, activeGroupId: action.payload, selectedItemId: null };
        case 'SET_SELECTED_ITEM':
            return { ...state, selectedItemId: action.payload };
        case 'UPDATE_ITEM': {
            const updated = action.payload;
            return {
                ...state,
                items: state.items.map((i) => (i.id === updated.id ? updated : i)),
            };
        }
        case 'ADD_ITEM':
            return { ...state, items: [...state.items, action.payload] };
        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter((i) => i.id !== action.payload),
                selectedItemId: state.selectedItemId === action.payload ? null : state.selectedItemId,
            };
        case 'INIT':
            return {
                ...state,
                groups: action.payload.groups,
                items: action.payload.items,
                activeGroupId: action.payload.groups.length > 0 ? action.payload.groups[0].id : null,
                loading: false,
            };
        default:
            return state;
    }
}

export function StoreProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        async function loadData() {
            try {
                const groups = await window.api.getGroups();
                const items = await window.api.getAllItems();
                dispatch({ type: 'INIT', payload: { groups, items } });
            } catch (err) {
                console.error('Failed to load data:', err);
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        }
        loadData();
    }, []);

    // ---------- Group actions ----------
    const createGroup = useCallback(async (name) => {
        const group = { name, order: state.groups.length };
        const groups = await window.api.saveGroup(group);
        dispatch({ type: 'SET_GROUPS', payload: groups });
        // Auto-select new group
        const newGroup = groups[groups.length - 1];
        if (newGroup) dispatch({ type: 'SET_ACTIVE_GROUP', payload: newGroup.id });
        return newGroup;
    }, [state.groups.length]);

    const renameGroup = useCallback(async (groupId, name) => {
        const group = state.groups.find((g) => g.id === groupId);
        if (!group) return;
        const groups = await window.api.saveGroup({ ...group, name });
        dispatch({ type: 'SET_GROUPS', payload: groups });
    }, [state.groups]);

    const deleteGroup = useCallback(async (groupId) => {
        const groups = await window.api.deleteGroup(groupId);
        dispatch({ type: 'SET_GROUPS', payload: groups });
        // Remove items from this group from local state
        dispatch({ type: 'SET_ITEMS', payload: state.items.filter((i) => i.groupId !== groupId) });
        // If we deleted the active group, switch to first available
        if (state.activeGroupId === groupId) {
            dispatch({ type: 'SET_ACTIVE_GROUP', payload: groups.length > 0 ? groups[0].id : null });
        }
    }, [state.activeGroupId, state.items]);

    const setActiveGroup = useCallback((groupId) => {
        dispatch({ type: 'SET_ACTIVE_GROUP', payload: groupId });
    }, []);

    // ---------- Item actions ----------
    const createItem = useCallback(async (groupId) => {
        const item = {
            groupId,
            title: 'New Item',
            subtitle: '',
            description: '',
            status: 'todo',
            attachments: [],
        };
        const saved = await window.api.saveItem(item);
        dispatch({ type: 'ADD_ITEM', payload: saved });
        dispatch({ type: 'SET_SELECTED_ITEM', payload: saved.id });
        return saved;
    }, []);

    const updateItem = useCallback(async (item) => {
        const saved = await window.api.saveItem(item);
        dispatch({ type: 'UPDATE_ITEM', payload: saved });
        return saved;
    }, []);

    const deleteItem = useCallback(async (itemId) => {
        await window.api.deleteItem(itemId);
        dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    }, []);

    const selectItem = useCallback((itemId) => {
        dispatch({ type: 'SET_SELECTED_ITEM', payload: itemId });
    }, []);

    // ---------- Attachment actions ----------
    const attachFile = useCallback(async (itemId) => {
        const updatedItem = await window.api.attachFile(itemId);
        if (updatedItem) {
            dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
        }
        return updatedItem;
    }, []);

    const removeAttachment = useCallback(async (itemId, attachmentId) => {
        const updatedItem = await window.api.removeAttachment(itemId, attachmentId);
        if (updatedItem) {
            dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
        }
        return updatedItem;
    }, []);

    const value = {
        ...state,
        createGroup,
        renameGroup,
        deleteGroup,
        setActiveGroup,
        createItem,
        updateItem,
        deleteItem,
        selectItem,
        attachFile,
        removeAttachment,
    };

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
    const ctx = useContext(StoreContext);
    if (!ctx) throw new Error('useStore must be inside StoreProvider');
    return ctx;
}
