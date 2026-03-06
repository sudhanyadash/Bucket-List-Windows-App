const fs = require('fs');
const path = require('path');

class DataStore {
    constructor(dataDir) {
        this.filePath = path.join(dataDir, 'store.json');
        this.data = this._load();
    }

    _load() {
        try {
            if (fs.existsSync(this.filePath)) {
                const raw = fs.readFileSync(this.filePath, 'utf-8');
                return JSON.parse(raw);
            }
        } catch (err) {
            console.error('Failed to load store.json, starting fresh:', err);
        }
        return { groups: [], items: [] };
    }

    _save() {
        try {
            const dir = path.dirname(this.filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            const tmpPath = this.filePath + '.tmp';
            fs.writeFileSync(tmpPath, JSON.stringify(this.data, null, 2), 'utf-8');
            // Ensure data is written to disk
            const fd = fs.openSync(tmpPath, 'r');
            fs.fsyncSync(fd);
            fs.closeSync(fd);

            // Atomic replace
            fs.renameSync(tmpPath, this.filePath);
        } catch (err) {
            console.error('Save failed:', err);
        }
    }

    // ---------- Groups ----------
    getGroups() {
        return this.data.groups;
    }

    saveGroup(group) {
        const idx = this.data.groups.findIndex((g) => g.id === group.id);
        if (idx >= 0) {
            this.data.groups[idx] = { ...this.data.groups[idx], ...group };
        } else {
            this.data.groups.push(group);
        }
        this._save();
        return this.data.groups;
    }

    deleteGroup(groupId) {
        this.data.groups = this.data.groups.filter((g) => g.id !== groupId);
        // Also remove all items in this group
        this.data.items = this.data.items.filter((i) => i.groupId !== groupId);
        this._save();
        return this.data.groups;
    }

    // ---------- Items ----------
    getItems(groupId) {
        if (groupId) {
            return this.data.items.filter((i) => i.groupId === groupId);
        }
        return this.data.items;
    }

    getAllItems() {
        return this.data.items;
    }

    saveItem(item) {
        const idx = this.data.items.findIndex((i) => i.id === item.id);
        if (idx >= 0) {
            this.data.items[idx] = { ...this.data.items[idx], ...item, updatedAt: new Date().toISOString() };
        } else {
            item.createdAt = new Date().toISOString();
            item.updatedAt = item.createdAt;
            this.data.items.push(item);
        }
        this._save();
        return item;
    }

    deleteItem(itemId) {
        this.data.items = this.data.items.filter((i) => i.id !== itemId);
        this._save();
        return true;
    }

    getItem(itemId) {
        return this.data.items.find((i) => i.id === itemId) || null;
    }

    addAttachment(itemId, attachment) {
        const item = this.data.items.find((i) => i.id === itemId);
        if (!item) return null;
        if (!item.attachments) item.attachments = [];
        item.attachments.push(attachment);
        item.updatedAt = new Date().toISOString();
        this._save();
        return item;
    }

    removeAttachment(itemId, attachmentId) {
        const item = this.data.items.find((i) => i.id === itemId);
        if (!item || !item.attachments) return null;
        const att = item.attachments.find((a) => a.id === attachmentId);
        item.attachments = item.attachments.filter((a) => a.id !== attachmentId);
        item.updatedAt = new Date().toISOString();
        this._save();
        return att;
    }
}

module.exports = { DataStore };
