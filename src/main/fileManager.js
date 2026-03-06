const fs = require('fs');
const path = require('path');

class FileManager {
    constructor(dataDir) {
        this.dataDir = dataDir;
        this.mediaDir = path.join(dataDir, 'media');
    }

    getFileType(ext) {
        const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
        const videoExts = ['.mp4', '.webm', '.avi', '.mov', '.mkv'];
        const audioExts = ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a'];
        const lower = ext.toLowerCase();
        if (imageExts.includes(lower)) return 'image';
        if (videoExts.includes(lower)) return 'video';
        if (audioExts.includes(lower)) return 'audio';
        return 'text';
    }

    async copyAttachment(sourcePath, itemId) {
        const itemMediaDir = path.join(this.mediaDir, itemId);
        if (!fs.existsSync(itemMediaDir)) {
            fs.mkdirSync(itemMediaDir, { recursive: true });
        }

        const basename = path.basename(sourcePath);
        const ext = path.extname(basename);
        const destPath = path.join(itemMediaDir, basename);

        // Copy the file
        fs.copyFileSync(sourcePath, destPath);

        const fileType = this.getFileType(ext);
        const relativePath = path.join('media', itemId, basename).replace(/\\/g, '/');
        let thumbPath = null;

        // Generate thumbnail for images
        if (fileType === 'image') {
            try {
                const sharp = require('sharp');
                const thumbName = `thumb_${path.basename(basename, ext)}.jpg`;
                const thumbFullPath = path.join(itemMediaDir, thumbName);
                await sharp(destPath)
                    .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
                    .jpeg({ quality: 80 })
                    .toFile(thumbFullPath);
                thumbPath = path.join('media', itemId, thumbName).replace(/\\/g, '/');
            } catch (err) {
                console.error('Thumbnail generation failed:', err);
                // Fall back: use original as thumb
                thumbPath = relativePath;
            }
        }

        return {
            originalName: basename,
            relativePath,
            thumbPath,
            type: fileType,
        };
    }

    removeAttachmentFiles(relativePath, thumbPath) {
        try {
            const absPath = path.join(this.dataDir, relativePath);
            if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
            if (thumbPath) {
                const absThumb = path.join(this.dataDir, thumbPath);
                if (fs.existsSync(absThumb)) fs.unlinkSync(absThumb);
            }
        } catch (err) {
            console.error('Failed to remove attachment files:', err);
        }
    }

    removeItemMediaDir(itemId) {
        try {
            const dir = path.join(this.mediaDir, itemId);
            if (fs.existsSync(dir)) {
                fs.rmSync(dir, { recursive: true, force: true });
            }
        } catch (err) {
            console.error('Failed to remove item media dir:', err);
        }
    }
}

module.exports = { FileManager };
