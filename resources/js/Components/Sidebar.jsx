import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { BookOpen, Building2, CalendarDays, Flame, FolderOpen, LayoutDashboard, Settings, Users } from '@/Components/Icons';

const sections = [
    {
        title: 'PRINCIPAL',
        items: [{ label: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard }],
    },
    {
        title: 'ÉGLISE',
        items: [{ label: 'Membres', href: '/membres', icon: Users }],
    },
    {
        title: 'ADMINISTRATION',
        items: [{ label: 'Documents', href: '/documents', icon: FolderOpen }],
    },
    {
        title: 'SPIRITUEL',
        items: [
            { label: 'Cultes', href: '/cultes', icon: CalendarDays },
            { label: 'Programmes de prière', href: '/programmes', icon: Flame },
        ],
    },
    { title: 'PARAMÈTRES', items: [{ label: 'Paramètres', href: '/settings', icon: Settings }] },
];

const gestionItems = [
    { label: 'Départements', href: '/departements', icon: Building2 },
    { label: 'Comités', href: '/comites', icon: BookOpen },
];

const comptaItems = [
    { label: 'Transactions', href: '/comptabilite', icon: '💰' },
    { label: 'Rapport', href: '/comptabilite', icon: '📈' },
];

export default function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }) {
    const { url } = usePage();
    const containerClass = isCollapsed ? 'w-20' : 'w-72';
    const isGestionActive = gestionItems.some((item) => url.startsWith(item.href));
    const isComptaActive = comptaItems.some((item) => url.startsWith(item.href));
    const [isGestionOpen, setIsGestionOpen] = useState(isGestionActive);
    const [isComptaOpen, setIsComptaOpen] = useState(isComptaActive);

    const renderItem = (item) => {
        const Icon = item.icon;
        const active = url === item.href || url.startsWith(`${item.href}/`);
        const linkClass = `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${active ? 'bg-[#1a56a0]/10 font-medium text-[#1a56a0]' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`;

        return item.href.startsWith('/') ? (
            <Link key={item.label} href={item.href} className={linkClass}><span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-xs"><Icon size={14} /></span>{!isCollapsed ? <span>{item.label}</span> : null}</Link>
        ) : (
            <a key={item.label} href={item.href} className={linkClass}><span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-xs"><Icon size={14} /></span>{!isCollapsed ? <span>{item.label}</span> : null}</a>
        );
    };

    return (
        <>
            <div className={`fixed inset-0 z-30 bg-gray-900/30 lg:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={onClose} />
            <aside className={`fixed inset-y-0 left-0 z-40 ${containerClass} transform overflow-y-auto border-r border-gray-200 bg-white px-3 py-5 text-gray-700 transition-all duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="mb-8 flex items-center justify-between px-2">
                    <div className={`transition-all ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}><p className="text-xs uppercase tracking-[0.2em] text-gray-500">ERP Église</p><h1 className="text-sm font-semibold text-gray-900">Gestion communautaire</h1></div>
                    <button type="button" onClick={onToggleCollapse} className="hidden rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 lg:block">☰</button>
                    <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 p-2 text-gray-500 lg:hidden">✕</button>
                </div>
                <nav className="space-y-5">
                    <div>
                        {!isCollapsed ? <p className="mb-2 px-2 text-xs uppercase text-gray-500">GESTION</p> : null}
                        <button type="button" onClick={() => setIsGestionOpen((v) => !v)} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${isGestionActive ? 'bg-[#1a56a0]/10 text-[#1a56a0]' : 'text-gray-600 hover:bg-gray-100'}`}>
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-xs"><BookOpen size={14} /></span>
                            {!isCollapsed ? <><span className="flex-1 text-left">Gestion</span><span>{isGestionOpen ? '▾' : '▸'}</span></> : null}
                        </button>
                        {(!isCollapsed && isGestionOpen) ? <div className="mt-1 space-y-1 pl-4">{gestionItems.map(renderItem)}</div> : null}
                    </div>

                    <div>
                        <button type="button" onClick={() => setIsComptaOpen((v) => !v)} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${isComptaActive ? 'bg-[#1a56a0]/10 text-[#1a56a0]' : 'text-gray-600 hover:bg-gray-100'}`}>
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-xs">💰</span>
                            {!isCollapsed ? <><span className="flex-1 text-left">Comptabilité</span><span>{isComptaOpen ? '▾' : '▸'}</span></> : null}
                        </button>
                        {(!isCollapsed && isComptaOpen) ? <div className="mt-1 space-y-1 pl-4">{comptaItems.map(renderItem)}</div> : null}
                    </div>

                    {sections.map((section) => (
                        <div key={section.title}>{!isCollapsed ? <p className="mb-2 px-2 text-xs uppercase text-gray-500">{section.title}</p> : null}<div className="space-y-1">{section.items.map(renderItem)}</div></div>
                    ))}
                </nav>
            </aside>
        </>
    );
}
