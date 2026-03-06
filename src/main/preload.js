const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Groups
    getGroups: () => ipcRenderer.invoke('get-groups'),
    saveGroup: (group) => ipcRenderer.invoke('save-group', group),
    deleteGroup: (groupId) => ipcRenderer.invoke('delete-group', groupId),

    // Items
    getItems: (groupId) => ipcRenderer.invoke('get-items', groupId),
    getAllItems: () => ipcRenderer.invoke('get-all-items'),
    saveItem: (item) => ipcRenderer.invoke('save-item', item),
    deleteItem: (itemId) => ipcRenderer.invoke('delete-item', itemId),

    // File attachments
    attachFile: (itemId) => ipcRenderer.invoke('attach-file', itemId),
    removeAttachment: (itemId, attachmentId) => ipcRenderer.invoke('remove-attachment', itemId, attachmentId),

    // Media path resolution
    getMediaUrl: (relativePath) => `media://${relativePath}`,
});
