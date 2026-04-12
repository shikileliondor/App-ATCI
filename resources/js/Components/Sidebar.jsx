import { Link, usePage } from '@inertiajs/react';

const sections = [
    {
        title: 'PRINCIPAL',
        items: [
            { label: 'Tableau de bord', href: '/dashboard' },
            { label: 'Notifications', href: '#' },
        ],
    },
    {
        title: 'ÉGLISE',
        items: [
            { label: 'Membres', href: '/membres' },
            { label: 'Visiteurs', href: '#' },
            { label: 'Départements', href: '#' },
            { label: 'Comités', href: '#' },
        ],
    },
    {
        title: 'ADMINISTRATION',
        items: [
            { label: 'Comptabilité', href: '#' },
            { label: 'Documents', href: '#' },
        ],
    },
    {
        title: 'SPIRITUEL',
        items: [{ label: 'Cultes', href: '#' }],
    },
    {
        title: 'PARAMÈTRES',
        items: [{ label: 'Paramètres', href: '#' }],
    },
];

export default function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }) {
    const { url } = usePage();
    const containerClass = isCollapsed ? 'w-20' : 'w-72';

    return (
        <>
            <div className={`fixed inset-0 z-30 bg-gray-900/30 lg:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={onClose} />

            <aside
                className={`fixed inset-y-0 left-0 z-40 ${containerClass} transform overflow-y-auto border-r border-gray-200 bg-white px-3 py-5 text-gray-700 transition-all duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="mb-8 flex items-center justify-between px-2">
                    <div className={`transition-all ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">ERP Église</p>
                        <h1 className="text-sm font-semibold text-gray-900">Gestion communautaire</h1>
                    </div>
                    <button type="button" onClick={onToggleCollapse} className="hidden rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 lg:block">☰</button>
                    <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 p-2 text-gray-500 lg:hidden">✕</button>
                </div>

                <nav className="space-y-5">
                    {sections.map((section) => (
                        <div key={section.title}>
                            {!isCollapsed ? <p className="mb-2 px-2 text-xs uppercase text-gray-500">{section.title}</p> : null}
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const active = url === item.href;
                                    const linkClass = `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${active ? 'bg-[#1a56a0]/10 font-medium text-[#1a56a0]' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`;

                                    return item.href.startsWith('/') ? (
                                        <Link key={item.label} href={item.href} className={linkClass}>
                                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-xs">•</span>
                                            {!isCollapsed ? <span>{item.label}</span> : null}
                                        </Link>
                                    ) : (
                                        <a key={item.label} href={item.href} className={linkClass}>
                                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-xs">•</span>
                                            {!isCollapsed ? <span>{item.label}</span> : null}
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
