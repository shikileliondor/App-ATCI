import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';

const sectionItems = [
    { id: 'general', label: 'Informations générales' },
    { id: 'users', label: 'Gestion utilisateurs' },
    { id: 'org', label: 'Départements & comités' },
    { id: 'events', label: 'Types d’événements' },
    { id: 'financial', label: 'Paramètres financiers' },
    { id: 'stats', label: 'Statistiques' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Sécurité' },
    { id: 'appearance', label: 'Apparence' },
];

function Card({ title, description, children }) {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
            <div className="mt-5">{children}</div>
        </section>
    );
}

function Label({ children }) { return <label className="mb-1 block text-sm font-medium text-gray-700">{children}</label>; }

export default function SettingsIndex(props) {
    const { flash } = usePage().props;
    const [active, setActive] = useState('general');

    const [general, setGeneral] = useState({
        church_name: props.general?.church_name ?? '',
        email: props.general?.email ?? '',
        phone: props.general?.phone ?? '',
        address: props.general?.address ?? '',
        logo: null,
        remove_logo: false,
    });

    const [financial, setFinancial] = useState({
        offerings: props.financial?.offerings ?? [],
        payment_methods: props.financial?.payment_methods ?? [],
        currency: props.financial?.currency ?? 'XOF',
    });

    const [statistics, setStatistics] = useState(props.statistics ?? {});
    const [notifications, setNotifications] = useState(props.notifications ?? {});
    const [security, setSecurity] = useState(props.security ?? {});
    const [appearance, setAppearance] = useState(props.appearance ?? {});

    const [newUser, setNewUser] = useState({ name: '', email: '', role: props.roles?.[0] ?? 'admin', password: '' });
    const [newEventType, setNewEventType] = useState({ name: '', description: '', is_active: true });
    const logoUrl = useMemo(() => (props.general?.logo_path ? `/storage/${props.general.logo_path}` : null), [props.general?.logo_path]);

    const submitGeneral = (e) => {
        e.preventDefault();
        router.post('/settings/general', general, { forceFormData: true, preserveScroll: true });
    };

    const submitFinancial = (e) => { e.preventDefault(); router.post('/settings/financial', financial, { preserveScroll: true }); };
    const submitStatistics = (e) => { e.preventDefault(); router.post('/settings/statistics', statistics, { preserveScroll: true }); };
    const submitNotifications = (e) => { e.preventDefault(); router.post('/settings/notifications', notifications, { preserveScroll: true }); };
    const submitSecurity = (e) => { e.preventDefault(); router.post('/settings/security', security, { preserveScroll: true }); };
    const submitAppearance = (e) => { e.preventDefault(); router.post('/settings/appearance', appearance, { preserveScroll: true }); };

    const createUser = (e) => {
        e.preventDefault();
        router.post('/settings/users', newUser, { preserveScroll: true, onSuccess: () => setNewUser({ ...newUser, name: '', email: '', password: '' }) });
    };

    return (
        <MainLayout title="Paramètres" subtitle="Configurez toute l'application depuis une interface unifiée" actionLabel="Retour dashboard" onAction={() => router.visit('/dashboard')}>
            <Head title="Paramètres" />
            <PageContainer>
                {flash?.success ? <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{flash.success}</div> : null}
                {flash?.error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{flash.error}</div> : null}
                <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
                    <aside className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                        <nav className="space-y-1">
                            {sectionItems.map((item) => (
                                <button key={item.id} type="button" onClick={() => setActive(item.id)} className={`w-full rounded-xl px-3 py-2 text-left text-sm ${active === item.id ? 'bg-[#1a56a0]/10 font-medium text-[#1a56a0]' : 'text-gray-600 hover:bg-gray-100'}`}>
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    <div className="space-y-4">
                        {active === 'general' ? <Card title="Informations générales de l’église" description="Identité visuelle et informations de contact.">
                            <form onSubmit={submitGeneral} className="grid gap-4 md:grid-cols-2">
                                <div><Label>Nom de l'église</Label><input value={general.church_name} onChange={(e) => setGeneral((v) => ({ ...v, church_name: e.target.value }))} className="w-full rounded-xl border-gray-300" required /></div>
                                <div><Label>Email</Label><input type="email" value={general.email} onChange={(e) => setGeneral((v) => ({ ...v, email: e.target.value }))} className="w-full rounded-xl border-gray-300" /></div>
                                <div><Label>Téléphone</Label><input value={general.phone} onChange={(e) => setGeneral((v) => ({ ...v, phone: e.target.value }))} className="w-full rounded-xl border-gray-300" /></div>
                                <div className="md:col-span-2"><Label>Adresse</Label><textarea value={general.address} onChange={(e) => setGeneral((v) => ({ ...v, address: e.target.value }))} className="w-full rounded-xl border-gray-300" rows={3} /></div>
                                <div className="md:col-span-2">
                                    <Label>Logo</Label>
                                    <div className="flex items-center gap-3">
                                        {logoUrl ? <img src={logoUrl} className="h-14 w-14 rounded-lg border border-gray-200 object-contain p-1" alt="Logo" /> : <span className="text-sm text-gray-500">Aucun logo défini</span>}
                                        <input type="file" accept="image/*" onChange={(e) => setGeneral((v) => ({ ...v, logo: e.target.files?.[0] ?? null }))} />
                                        {logoUrl ? <button type="button" onClick={() => setGeneral((v) => ({ ...v, remove_logo: true, logo: null }))} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600">Supprimer logo</button> : null}
                                    </div>
                                </div>
                                <div className="md:col-span-2"><button className="rounded-xl bg-[#1a56a0] px-4 py-2 text-sm font-medium text-white">Enregistrer</button></div>
                            </form>
                        </Card> : null}

                        {active === 'users' ? <Card title="Gestion des utilisateurs" description="Créer, modifier et supprimer les comptes administratifs.">
                            <form onSubmit={createUser} className="mb-4 grid gap-3 md:grid-cols-4">
                                <input placeholder="Nom" value={newUser.name} onChange={(e) => setNewUser((v) => ({ ...v, name: e.target.value }))} className="rounded-xl border-gray-300" required />
                                <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser((v) => ({ ...v, email: e.target.value }))} className="rounded-xl border-gray-300" required />
                                <select value={newUser.role} onChange={(e) => setNewUser((v) => ({ ...v, role: e.target.value }))} className="rounded-xl border-gray-300">{props.roles.map((r) => <option key={r} value={r}>{r}</option>)}</select>
                                <input placeholder="Mot de passe" type="password" value={newUser.password} onChange={(e) => setNewUser((v) => ({ ...v, password: e.target.value }))} className="rounded-xl border-gray-300" required />
                                <div className="md:col-span-4"><button className="rounded-xl bg-[#1a56a0] px-4 py-2 text-sm font-medium text-white">Ajouter utilisateur</button></div>
                            </form>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead><tr className="text-left text-xs uppercase text-gray-500"><th className="px-2 py-2">Nom</th><th className="px-2 py-2">Email</th><th className="px-2 py-2">Rôle</th><th className="px-2 py-2 text-right">Actions</th></tr></thead>
                                    <tbody className="divide-y">
                                        {props.users.map((user) => <tr key={user.id}><td className="px-2 py-2">{user.name}</td><td className="px-2 py-2">{user.email}</td><td className="px-2 py-2">{user.role}</td><td className="px-2 py-2 text-right"><button className="rounded-lg border px-2 py-1 text-xs" onClick={() => {
                                            const name = window.prompt('Nouveau nom', user.name); if (!name) return;
                                            const role = window.prompt('Rôle', user.role); if (!role) return;
                                            router.put(`/settings/users/${user.id}`, { name, email: user.email, role }, { preserveScroll: true });
                                        }}>Modifier</button> <button className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600" onClick={() => window.confirm(`Supprimer ${user.name} ?`) && router.delete(`/settings/users/${user.id}`, { preserveScroll: true })}>Supprimer</button></td></tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </Card> : null}

                        {active === 'org' ? <Card title="Départements et comités" description="Accédez à la gestion détaillée des structures organisationnelles.">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-xl border border-gray-200 p-4"><h4 className="mb-2 font-medium">Départements</h4><p className="mb-3 text-sm text-gray-500">{props.departements.length} enregistré(s)</p><div className="flex gap-2"><Link href="/departements" className="rounded-lg border px-3 py-2 text-sm">Voir la liste</Link><Link href="/departements/create" className="rounded-lg bg-[#1a56a0] px-3 py-2 text-sm text-white">Ajouter</Link></div></div>
                                <div className="rounded-xl border border-gray-200 p-4"><h4 className="mb-2 font-medium">Comités</h4><p className="mb-3 text-sm text-gray-500">{props.comites.length} enregistré(s)</p><div className="flex gap-2"><Link href="/comites" className="rounded-lg border px-3 py-2 text-sm">Voir la liste</Link><Link href="/comites/create" className="rounded-lg bg-[#1a56a0] px-3 py-2 text-sm text-white">Ajouter</Link></div></div>
                            </div>
                        </Card> : null}

                        {active === 'events' ? <Card title="Types d’événements" description="Configurez les catégories utilisées pour les activités de l’église.">
                            <form onSubmit={(e) => { e.preventDefault(); router.post('/settings/event-types', newEventType, { preserveScroll: true, onSuccess: () => setNewEventType({ name: '', description: '', is_active: true }) }); }} className="mb-4 grid gap-3 md:grid-cols-4">
                                <input placeholder="Nom" value={newEventType.name} onChange={(e) => setNewEventType((v) => ({ ...v, name: e.target.value }))} className="rounded-xl border-gray-300" required />
                                <input placeholder="Description" value={newEventType.description} onChange={(e) => setNewEventType((v) => ({ ...v, description: e.target.value }))} className="rounded-xl border-gray-300" />
                                <select value={newEventType.is_active ? '1' : '0'} onChange={(e) => setNewEventType((v) => ({ ...v, is_active: e.target.value === '1' }))} className="rounded-xl border-gray-300"><option value="1">Actif</option><option value="0">Inactif</option></select>
                                <button className="rounded-xl bg-[#1a56a0] px-4 py-2 text-sm font-medium text-white">Ajouter</button>
                            </form>
                            <div className="space-y-2">{props.eventTypes.map((item) => <div key={item.id} className="flex items-center justify-between rounded-xl border border-gray-200 p-3 text-sm"><div><p className="font-medium">{item.name}</p><p className="text-gray-500">{item.description || '—'}</p></div><div className="flex gap-2"><button className="rounded-lg border px-2 py-1" onClick={() => {
                                const name = window.prompt('Nom', item.name); if (!name) return;
                                const description = window.prompt('Description', item.description ?? '') ?? '';
                                router.put(`/settings/event-types/${item.id}`, { name, description, is_active: item.is_active }, { preserveScroll: true });
                            }}>Modifier</button><button className="rounded-lg border border-red-200 px-2 py-1 text-red-600" onClick={() => window.confirm('Supprimer ce type ?') && router.delete(`/settings/event-types/${item.id}`, { preserveScroll: true })}>Supprimer</button></div></div>)}</div>
                        </Card> : null}

                        {active === 'financial' ? <Card title="Paramètres financiers" description="Types d’offrandes, méthodes de paiement et devise.">
                            <form onSubmit={submitFinancial} className="space-y-4">
                                <div><Label>Types d'offrandes (une valeur par ligne)</Label><textarea rows={4} value={financial.offerings.join('\n')} onChange={(e) => setFinancial((v) => ({ ...v, offerings: e.target.value.split('\n') }))} className="w-full rounded-xl border-gray-300" /></div>
                                <div><Label>Méthodes de paiement (une valeur par ligne)</Label><textarea rows={4} value={financial.payment_methods.join('\n')} onChange={(e) => setFinancial((v) => ({ ...v, payment_methods: e.target.value.split('\n') }))} className="w-full rounded-xl border-gray-300" /></div>
                                <div><Label>Devise</Label><input value={financial.currency} onChange={(e) => setFinancial((v) => ({ ...v, currency: e.target.value }))} className="w-52 rounded-xl border-gray-300" required /></div>
                                <button className="rounded-xl bg-[#1a56a0] px-4 py-2 text-sm font-medium text-white">Enregistrer</button>
                            </form>
                        </Card> : null}

                        {active === 'stats' ? <Card title="Statistiques" description="Choisissez les indicateurs visibles sur le dashboard.">
                            <form onSubmit={submitStatistics} className="space-y-3">{Object.entries({ presence: 'Présence', revenues: 'Revenus', new_members: 'Nouveaux membres', visitors: 'Visiteurs' }).map(([key, label]) => <label key={key} className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2 text-sm"><span>{label}</span><input type="checkbox" checked={Boolean(statistics[key])} onChange={(e) => setStatistics((v) => ({ ...v, [key]: e.target.checked }))} /></label>)}<button className="rounded-xl bg-[#1a56a0] px-4 py-2 text-sm font-medium text-white">Enregistrer</button></form>
                        </Card> : null}

                        {active === 'notifications' ? <Card title="Notifications" description="Activez/désactivez les canaux d’alerte.">
                            <form onSubmit={submitNotifications} className="space-y-3">{Object.entries({ email: 'Email', sms: 'SMS', in_app: 'In-app' }).map(([key, label]) => <label key={key} className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2 text-sm"><span>{label}</span><input type="checkbox" checked={Boolean(notifications[key])} onChange={(e) => setNotifications((v) => ({ ...v, [key]: e.target.checked }))} /></label>)}<button className="rounded-xl bg-[#1a56a0] px-4 py-2 text-sm font-medium text-white">Enregistrer</button></form>
                        </Card> : null}

                        {active === 'security' ? <Card title="Sécurité" description="Politique de mot de passe et niveau d’accès.">
                            <form onSubmit={submitSecurity} className="grid gap-4 md:grid-cols-2">
                                <div><Label>Longueur minimale du mot de passe</Label><input type="number" min={6} value={security.min_password_length ?? 8} onChange={(e) => setSecurity((v) => ({ ...v, min_password_length: Number(e.target.value) }))} className="w-full rounded-xl border-gray-300" /></div>
                                <div className="space-y-2 self-end">{Object.entries({ require_special_char: 'Caractère spécial obligatoire', force_password_rotation: 'Rotation périodique', two_factor: 'Authentification à deux facteurs' }).map(([key, label]) => <label key={key} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(security[key])} onChange={(e) => setSecurity((v) => ({ ...v, [key]: e.target.checked }))} />{label}</label>)}</div>
                                <div className="md:col-span-2"><button className="rounded-xl bg-[#1a56a0] px-4 py-2 text-sm font-medium text-white">Enregistrer</button></div>
                            </form>
                        </Card> : null}

                        {active === 'appearance' ? <Card title="Apparence" description="Personnalisez le thème global de l’application.">
                            <form onSubmit={submitAppearance} className="grid gap-4 md:grid-cols-2">
                                <div><Label>Thème</Label><select value={appearance.theme ?? 'light'} onChange={(e) => setAppearance((v) => ({ ...v, theme: e.target.value }))} className="w-full rounded-xl border-gray-300"><option value="light">Clair</option><option value="dark">Sombre</option></select></div>
                                <div><Label>Couleur principale</Label><input type="color" value={appearance.primary_color ?? '#1a56a0'} onChange={(e) => setAppearance((v) => ({ ...v, primary_color: e.target.value }))} className="h-10 w-24 rounded-lg border-gray-300" /></div>
                                <div className="md:col-span-2"><button className="rounded-xl bg-[#1a56a0] px-4 py-2 text-sm font-medium text-white">Enregistrer</button></div>
                            </form>
                        </Card> : null}
                    </div>
                </div>
            </PageContainer>
        </MainLayout>
    );
}
