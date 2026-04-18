import { useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import Topbar from '@/Components/Topbar';

export default function MainLayout({ title, subtitle, actionLabel, onAction, children }) {
    const { auth, app } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const userInitials = useMemo(() => {
        const name = auth?.user?.name ?? 'U';
        return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
    }, [auth?.user?.name]);

    const branding = useMemo(() => ({
        churchName: app?.branding?.church_name,
        logoPath: app?.branding?.logo_path ? `/storage/${app.branding.logo_path}` : null,
    }), [app?.branding?.church_name, app?.branding?.logo_path]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#f8fbff] to-indigo-50 text-gray-700">
            <Sidebar
                isOpen={isSidebarOpen}
                isCollapsed={isSidebarCollapsed}
                onClose={() => setIsSidebarOpen(false)}
                onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
                branding={branding}
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
                    branding={branding}
                />

                <main className="px-4 pb-8 pt-6 sm:px-6 lg:px-8">{children}</main>
            </div>
        </div>
    );
}
