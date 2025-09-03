import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

// Import all pages directly
import Dashboard from './Pages/Dashboard';
import Customers from './Pages/Customers';
import Rules from './Pages/Rules';
import Campaigns from './Pages/Campaigns';
import Rewards from './Pages/Rewards';
import Settings from './Pages/Settings';
import ParticipationReport from './Pages/Reports/Participation';

const appName = (import.meta as any).env?.VITE_APP_NAME || 'Laravel';

// Page component mapping
const pages = {
  Dashboard,
  Customers,
  Rules,
  Campaigns,
  Rewards,
  Settings,
  'Reports/Participation': ParticipationReport,
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const page = pages[name as keyof typeof pages];
        if (!page) {
            throw new Error(`Page ${name} not found. Available pages: ${Object.keys(pages).join(', ')}`);
        }
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
