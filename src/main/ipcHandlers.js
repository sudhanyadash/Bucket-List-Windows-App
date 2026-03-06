const { ipcMain, dialog } = require('electron');
const { v4: uuidv4 } = require('uuid');
const { DataStore } = require('./dataStore');
const { FileManager } = require('./fileManager');

function registerIpcHandlers(dataDir) {
    const store = new DataStore(dataDir);
    const fileManager = new FileManager(dataDir);

    // ---------- Groups ----------
    ipcMain.handle('get-groups', async () => {
        return store.getGroups();
    });

    ipcMain.handle('save-group', async (_event, group) => {
        if (!group.id) {
            group.id = uuidv4();
        }
        return store.saveGroup(group);
    });

    ipcMain.handle('delete-group', async (_event, groupId) => {
        // Remove media for all items in the group
        const items = store.getItems(groupId);
        for (const item of items) {
            fileManager.removeItemMediaDir(item.id);
        }
        return store.deleteGroup(groupId);
    });

    // ---------- Items ----------
    ipcMain.handle('get-items', async (_event, groupId) => {
        return store.getItems(groupId);
    });

    ipcMain.handle('get-all-items', async () => {
        return store.getAllItems();
    });

    ipcMain.handle('save-item', async (_event, item) => {
        if (!item.id) {
            item.id = uuidv4();
            item.attachments = [];
        }
        return store.saveItem(item);
    });

    ipcMain.handle('delete-item', async (_event, itemId) => {
        fileManager.removeItemMediaDir(itemId);
        return store.deleteItem(itemId);
    });

    // ---------- File Attachments ----------
    ipcMain.handle('attach-file', async (_event, itemId) => {
        const result = await dialog.showOpenDialog({
            title: 'Attach a file',
            properties: ['openFile'],
            filters: [
                { name: 'All Files', extensions: ['*'] },
                { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'] },
                { name: 'Videos', extensions: ['mp4', 'webm', 'avi', 'mov', 'mkv'] },
                { name: 'Audio', extensions: ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'] },
                { name: 'Text', extensions: ['txt', 'md', 'pdf', 'doc', 'docx'] },
            ],
        });

        if (result.canceled || result.filePaths.length === 0) {
            return null;
        }

        const sourcePath = result.filePaths[0];
        const attachmentInfo = await fileManager.copyAttachment(sourcePath, itemId);

        const attachment = {
            id: uuidv4(),
            ...attachmentInfo,
        };

        const updatedItem = store.addAttachment(itemId, attachment);
        return updatedItem;
    });

    ipcMain.handle('remove-attachment', async (_event, itemId, attachmentId) => {
        const att = store.removeAttachment(itemId, attachmentId);
        if (att) {
            fileManager.removeAttachmentFiles(att.relativePath, att.thumbPath);
        }
        return store.getItem(itemId);
    });
}

module.exports = { registerIpcHandlers };
