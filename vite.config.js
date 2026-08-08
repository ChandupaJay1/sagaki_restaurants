import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/js/pages/dashboard.js',
                'resources/js/pages/pos-index.js',
                'resources/js/pages/tables.js',
                'resources/js/pages/kds.js',
                'resources/js/pages/inventory.js',
                'resources/js/pages/crm.js',
                'resources/js/pages/reports.js',
            ],
            refresh: true,
        }),
    ],
});