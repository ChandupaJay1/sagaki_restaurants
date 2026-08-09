import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import fs from 'fs';
import path from 'path';

// Helper to recursively find all JSX files in a directory
function getFiles(dir, ext = /\.jsx$/) {
    let files = [];
    if (!fs.existsSync(dir)) return files;
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
        const fullPath = path.join(dir, item.name).replace(/\\/g, '/');
        if (item.isDirectory()) {
            files = [...files, ...getFiles(fullPath, ext)];
        } else if (ext.test(item.name)) {
            files.push(fullPath);
        }
    }
    return files;
}

const pageFiles = getFiles('resources/js/Pages');

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/js/app.jsx',
                ...pageFiles,
            ],
            refresh: true,
        }),
    ],
});