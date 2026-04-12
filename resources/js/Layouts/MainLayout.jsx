import { useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import Topbar from '@/Components/Topbar';

export default function MainLayout({ title, subtitle, actionLabel, onAction, children }) {
    const { auth } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const userInitials = useMemo(() => {
        const name = auth?.user?.name ?? 'U';
        return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
    }, [auth?.user?.name]);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-700">
            <Sidebar
                isOpen={isSidebarOpen}
                isCollapsed={isSidebarCollapsed}
                onClose={() => setIsSidebarOpen(false)}
                onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
            />

            <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
                <Topbar
                    title={title}
                    subtitle={subtitle}
                    actionLabel={actionLabel}
                    onAction={onAction}
                    onOpenSidebar={() => setIsSidebarOpen(true)}
                    userName={auth?.user?.name ?? 'Utilisateur'}
                    userInitials={userInitials || 'U'}
                />

                <main className="px-4 pb-8 pt-6 sm:px-6 lg:px-8">{children}</main>
            </div>
        </div>
    );
}
