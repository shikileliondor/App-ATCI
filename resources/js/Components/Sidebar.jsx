import { Link } from '@inertiajs/react';

const sections = [
    {
        title: 'PRINCIPAL',
        items: [
            { label: 'Tableau de bord', href: '/dashboard', count: null },
            { label: 'Notifications', href: '#', count: 4 },
        ],
    },
    {
        title: 'GESTION ÉGLISE',
        items: [
            { label: 'Membres', href: '#' },
            { label: 'Visiteurs', href: '#' },
            { label: 'Départements', href: '#' },
            { label: 'Comités', href: '#' },
        ],
    },
    {
        title: 'FINANCES',
        items: [{ label: 'Comptabilité', href: '#' }],
    },
    {
        title: 'DOCUMENTS',
        items: [{ label: 'Documents', href: '#' }],
    },
    {
        title: 'CULTES',
        items: [{ label: 'Cultes', href: '#' }],
    },
    {
        title: 'PARAMÈTRES',
        items: [{ label: 'Paramètres', href: '#' }],
    },
];

function ItemIcon() {
    return (
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/25 bg-white/10">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />
            </svg>
        </span>
    );
}

export default function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }) {
    const containerClass = isCollapsed ? 'w-24' : 'w-72';

    return (
        <>
            <div
                className={`fixed inset-0 z-30 bg-slate-900/50 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
                onClick={onClose}
            />

            <aside
                className={`fixed inset-y-0 left-0 z-40 ${containerClass} transform overflow-y-auto border-r border-blue-500/30 bg-gradient-to-b from-blue-700 via-blue-700 to-blue-900 px-3 py-5 text-blue-50 shadow-2xl transition-all duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="mb-6 flex items-center justify-between px-2">
                    <div className={`overflow-hidden transition-all ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                        <p className="text-xs uppercase tracking-[0.22em] text-blue-200">ERP Église</p>
                        <h1 className="text-sm font-semibold">Gestion communautaire</h1>
                    </div>

                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        className="hidden rounded-lg border border-white/25 bg-white/10 p-2 text-white transition hover:bg-white/20 lg:block"
                    >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-white/25 bg-white/10 p-2 text-white lg:hidden"
                    >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <nav className="space-y-4">
                    {sections.map((section) => (
                        <div key={section.title}>
                            <p
                                className={`mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-200 ${
                                    isCollapsed ? 'hidden' : 'block'
                                }`}
                            >
                                {section.title}
                            </p>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const active = item.href === '/dashboard';
                                    const baseClass = `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                                        active
                                            ? 'bg-white/20 font-semibold text-white'
                                            : 'text-blue-100 hover:bg-white/10 hover:text-white'
                                    }`;

                                    return item.href.startsWith('/') ? (
                                        <Link key={item.label} href={item.href} className={baseClass}>
                                            <ItemIcon />
                                            {!isCollapsed && <span className="flex-1">{item.label}</span>}
                                            {!isCollapsed && item.count ? (
                                                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">
                                                    {item.count}
                                                </span>
                                            ) : null}
                                        </Link>
                                    ) : (
                                        <a key={item.label} href={item.href} className={baseClass}>
                                            <ItemIcon />
                                            {!isCollapsed && <span className="flex-1">{item.label}</span>}
                                            {!isCollapsed && item.count ? (
                                                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">
                                                    {item.count}
                                                </span>
                                            ) : null}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>
        </>
    );
}
