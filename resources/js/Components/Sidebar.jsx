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
            { label: 'Événements (hors cultes)', href: '/programmes', icon: Flame },
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

export default function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse, branding }) {
    const { url } = usePage();
    const containerClass = isCollapsed ? 'w-20' : 'w-72';
    const isGestionActive = gestionItems.some((item) => url.startsWith(item.href));
    const isComptaActive = comptaItems.some((item) => url.startsWith(item.href));
    const [isGestionOpen, setIsGestionOpen] = useState(isGestionActive);
    const [isComptaOpen, setIsComptaOpen] = useState(isComptaActive);

    const logoUrl = branding?.logoPath ?? '/images/church-logo.svg';
    const churchName = branding?.churchName ?? 'ERP Église';

    const renderItem = (item) => {
        const Icon = item.icon;
        const active = url === item.href || url.startsWith(`${item.href}/`);
        const linkClass = `group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${active ? 'bg-blue-600/10 font-medium text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-white hover:text-gray-900'}`;

        return item.href.startsWith('/') ? (
            <Link key={item.label} href={item.href} className={linkClass}>
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs ${active ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-700'}`}><Icon size={14} /></span>
                {!isCollapsed ? <span>{item.label}</span> : null}
            </Link>
        ) : (
            <a key={item.label} href={item.href} className={linkClass}>
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs ${active ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-700'}`}><Icon size={14} /></span>
                {!isCollapsed ? <span>{item.label}</span> : null}
            </a>
        );
    };

    return (
        <>
            <div className={`fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-sm lg:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={onClose} />
            <aside className={`fixed inset-y-0 left-0 z-40 ${containerClass} transform overflow-y-auto border-r border-white/70 bg-gradient-to-b from-[#f8f9ff] to-[#eef2ff] px-3 py-5 text-gray-700 shadow-2xl shadow-slate-900/5 transition-all duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="mb-8 flex items-start justify-between gap-2 px-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <img src={logoUrl} alt="Logo église" className="h-12 w-12 rounded-2xl border border-white/80 bg-white p-1 object-contain shadow-sm" />
                        <div className={`transition-all ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">ERP Église</p>
                            <h1 className="truncate text-sm font-semibold text-gray-900">{churchName}</h1>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <button type="button" onClick={onToggleCollapse} className="hidden rounded-lg border border-white bg-white/80 p-2 text-gray-500 transition hover:bg-white lg:block">☰</button>
                        <button type="button" onClick={onClose} className="rounded-lg border border-white bg-white/80 p-2 text-gray-500 lg:hidden">✕</button>
                    </div>
                </div>

                <nav className="space-y-5">
                    <div>
                        {!isCollapsed ? <p className="mb-2 px-2 text-xs uppercase text-gray-500">GESTION</p> : null}
                        <button type="button" onClick={() => setIsGestionOpen((v) => !v)} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${isGestionActive ? 'bg-blue-600/10 text-blue-700' : 'text-gray-600 hover:bg-white'}`}>
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs"><BookOpen size={14} /></span>
                            {!isCollapsed ? <><span className="flex-1 text-left">Gestion</span><span>{isGestionOpen ? '▾' : '▸'}</span></> : null}
                        </button>
                        {(!isCollapsed && isGestionOpen) ? <div className="mt-1 space-y-1 pl-4">{gestionItems.map(renderItem)}</div> : null}
                    </div>

                    <div>
                        <button type="button" onClick={() => setIsComptaOpen((v) => !v)} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${isComptaActive ? 'bg-blue-600/10 text-blue-700' : 'text-gray-600 hover:bg-white'}`}>
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs">💰</span>
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
