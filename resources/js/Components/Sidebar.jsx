import { Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { BookOpen, Building2, CalendarDays, Flame, FolderOpen, LayoutDashboard, Settings, Users } from '@/Components/Icons';

const sections = [
    {
        title: 'Principal',
        items: [{ label: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard }],
    },
    {
        title: 'Église',
        items: [{ label: 'Membres', href: '/membres', icon: Users }],
    },
    {
        title: 'Administration',
        items: [{ label: 'Documents', href: '/documents', icon: FolderOpen }],
    },
    {
        title: 'Spirituel',
        items: [
            { label: 'Cultes', href: '/cultes', icon: CalendarDays },
            { label: 'Événements (hors cultes)', href: '/programmes', icon: Flame },
        ],
    },
    { title: 'Paramètres', items: [{ label: 'Paramètres', href: '/settings', icon: Settings }] },
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
    const containerClass = isCollapsed ? 'w-24' : 'w-80';
    const isGestionActive = gestionItems.some((item) => url.startsWith(item.href));
    const isComptaActive = comptaItems.some((item) => url.startsWith(item.href));
    const [isGestionOpen, setIsGestionOpen] = useState(isGestionActive);
    const [isComptaOpen, setIsComptaOpen] = useState(isComptaActive);

    const logoUrl = useMemo(() => branding?.logoPath || '/images/church-logo.svg', [branding?.logoPath]);
    const churchName = branding?.churchName ?? 'ERP Église';

    const renderIcon = (Icon, active) => {
        if (typeof Icon === 'string') {
            return <span className="text-base">{Icon}</span>;
        }

        return <Icon size={15} />;
    };

    const renderItem = (item) => {
        const Icon = item.icon;
        const active = url === item.href || url.startsWith(`${item.href}/`);
        const linkClass = `group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${active ? 'bg-[#1a56a0]/10 font-semibold text-[#1a56a0] shadow-sm' : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'}`;

        return (
            <Link key={item.label} href={item.href} className={linkClass}>
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs ${active ? 'border-[#1a56a0] bg-[#1a56a0] text-white' : 'border-slate-200 bg-white text-slate-500 group-hover:border-[#1a56a0]/20 group-hover:bg-[#1a56a0]/10 group-hover:text-[#1a56a0]'}`}>
                    {renderIcon(Icon, active)}
                </span>
                {!isCollapsed ? <span className="truncate">{item.label}</span> : null}
            </Link>
        );
    };

    return (
        <>
            <div className={`fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={onClose} />
            <aside className={`fixed inset-y-0 left-0 z-40 ${containerClass} transform overflow-y-auto border-r border-white/70 bg-gradient-to-b from-[#f4f8ff] via-[#edf3ff] to-[#e9f0ff] px-4 py-5 font-sans text-gray-700 shadow-2xl shadow-slate-900/10 transition-all duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="mb-8 flex items-start justify-between gap-3 px-1">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <img
                            src={logoUrl}
                            alt="Logo église"
                            className="h-16 w-16 rounded-2xl border border-white/90 bg-white p-1.5 object-contain shadow-md"
                            loading="eager"
                            decoding="async"
                            onError={(event) => {
                                event.currentTarget.onerror = null;
                                event.currentTarget.src = '/images/church-logo.svg';
                            }}
                        />
                        <div className={`min-w-0 transition-all ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Portail église</p>
                            <h1 className="truncate text-base font-bold text-slate-900">{churchName}</h1>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <button type="button" onClick={onToggleCollapse} className="hidden rounded-lg border border-white bg-white/80 p-2 text-gray-500 transition hover:bg-white lg:block">☰</button>
                        <button type="button" onClick={onClose} className="rounded-lg border border-white bg-white/80 p-2 text-gray-500 lg:hidden">✕</button>
                    </div>
                </div>

                <nav className="space-y-5">
                    <div>
                        {!isCollapsed ? <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Gestion</p> : null}
                        <button type="button" onClick={() => setIsGestionOpen((v) => !v)} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${isGestionActive ? 'bg-[#1a56a0]/10 text-[#1a56a0]' : 'text-slate-600 hover:bg-white/80'}`}>
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs"><BookOpen size={14} /></span>
                            {!isCollapsed ? <><span className="flex-1 text-left font-medium">Gestion</span><span>{isGestionOpen ? '▾' : '▸'}</span></> : null}
                        </button>
                        {(!isCollapsed && isGestionOpen) ? <div className="mt-1 space-y-1 pl-4">{gestionItems.map(renderItem)}</div> : null}
                    </div>

                    <div>
                        <button type="button" onClick={() => setIsComptaOpen((v) => !v)} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${isComptaActive ? 'bg-[#1a56a0]/10 text-[#1a56a0]' : 'text-slate-600 hover:bg-white/80'}`}>
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs">💰</span>
                            {!isCollapsed ? <><span className="flex-1 text-left font-medium">Comptabilité</span><span>{isComptaOpen ? '▾' : '▸'}</span></> : null}
                        </button>
                        {(!isCollapsed && isComptaOpen) ? <div className="mt-1 space-y-1 pl-4">{comptaItems.map(renderItem)}</div> : null}
                    </div>

                    {sections.map((section) => (
                        <div key={section.title}>
                            {!isCollapsed ? <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{section.title}</p> : null}
                            <div className="space-y-1">{section.items.map(renderItem)}</div>
                        </div>
                    ))}
                </nav>
            </aside>
        </>
    );
}
