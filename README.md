# Lony's Bucket List

A completely standalone, portable Windows Desktop Application for tracking your ultimate bucket list goals, dreams, and adventures.

## Features
- **Fully Portable:** The app requires no installation. Just run the `.exe`. 
- **Offline & Local:** All your data safely stays on your own computer. If you move the `.exe` to a new folder, everything seamlessly moves with you!
- **Groups:** Organize your bucket list logically with tabbed groups (e.g., "Travel", "Career", "Hobbies").
- **Media Attachments:** Add images, videos, audio, or text files directly to your items. Images automatically generate thumbnails.
- **Smart Tracking:** Keep track of your milestones with statuses like "To Be Done", "In Progress", "For The Future", and "Completed".
- **Dynamic Rewards:** Completing a goal triggers an exciting celebration right inside the app!

## Tech Stack
- Electron
- React 18
- Tailwind CSS v3
- Framer Motion (for buttery-smooth animations)
- `sharp` (for high-speed local thumbnail generation)
- Local filesystem (`fs`) for data storage

## Development Setup

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Run the app in development mode:**
   This will start both the Vite dev server and launch the Electron application locally.
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Build the portable executable:**
   This command bundles your React code and packages it into a single transportable `.exe` file.
   \`\`\`bash
   npm run dist
   \`\`\`
   You will find the generated standalone `.exe` inside the `dist/` directory.

## Persistent Data Note
Your application successfully stores its data in a newly created `data/` folder sitting right next to your `.exe` (or in the root folder during development). 
If you want to move the application across USB sticks or to other computers, ensure you copy BOTH the `.exe` file and the `data/` folder together!

## License
MIT