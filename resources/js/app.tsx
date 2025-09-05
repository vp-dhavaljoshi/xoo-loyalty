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
import Home from './Pages/Home';
import SimpleLogin from './Pages/SimpleLogin';

// Import AdminLayout for placeholder components
import AdminLayout from './Layouts/AdminLayout';

// Create placeholder components for missing reports
const PlaceholderReport = ({ title }: { title: string }) => (
  <AdminLayout>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-gray-600">This report is coming soon...</p>
    </div>
  </AdminLayout>
);

const PointsReport = () => <PlaceholderReport title="Points Report" />;
const RedemptionReport = () => <PlaceholderReport title="Redemption Report" />;
const MembershipReport = () => <PlaceholderReport title="Membership Report" />;
const SegmentationReport = () => <PlaceholderReport title="Segmentation Report" />;
const ROIReport = () => <PlaceholderReport title="ROI Report" />;
const GrowthReport = () => <PlaceholderReport title="Growth Report" />;
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';

const appName = (import.meta as any).env?.VITE_APP_NAME || 'xoo-loyalty';

// Page component mapping
const pages = {
  Home,
  SimpleLogin,
  Dashboard,
  Customers,
  Rules,
  Campaigns,
  Rewards,
  Settings,
  'Reports/Participation': ParticipationReport,
  'Reports/Points': PointsReport,
  'Reports/Redemption': RedemptionReport,
  'Reports/Membership': MembershipReport,
  'Reports/Segmentation': SegmentationReport,
  'Reports/ROI': ROIReport,
  'Reports/Growth': GrowthReport,
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const page = pages[name as keyof typeof pages];
        if (!page) {
            console.error(`Page ${name} not found. Available pages:`, Object.keys(pages));
            // Return a 404 component instead of throwing an error
            return () => (
                <div className="p-6 text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Page Not Found</h1>
                    <p className="text-gray-600 mb-4">The page "{name}" could not be found.</p>
                    <p className="text-sm text-gray-500">Available pages: {Object.keys(pages).join(', ')}</p>
                </div>
            );
        }
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        
        // Debug logging for development
        if (process.env.NODE_ENV === 'development') {
            console.log('Inertia props:', props);
            console.log('Auth data:', props.auth);
        }
        
        // Ensure we have a fallback auth object
        const authData = props.auth || { 
            user: null, 
            permissions: []
        };
        
        root.render(
            <AuthProvider auth={authData}>
                <App {...props} />
                <Toaster />
            </AuthProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
