import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import StatusBadge from '@/Components/StatusBadge';

export default function Index({ comites, filters = {} }) {
    const { props } = usePage();
    const [search, setSearch] = useState(filters.search ?? '');
    const [statut, setStatut] = useState(filters.statut ?? '');
    const [deletingId, setDeletingId] = useState(null);
    const data = useMemo(() => (Array.isArray(comites?.data) ? comites.data : []), [comites]);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get('/comites', { search, statut }, { preserveState: true, replace: true, preserveScroll: true });
        }, 350);
        return () => clearTimeout(timer);
    }, [search, statut]);

    return (
        <MainLayout title="Comités" subtitle="Gestion complète des comités" actionLabel="Ajouter" onAction={() => router.visit('/comites/create')}>
            <Head title="Comités" />
            <PageContainer>
                {props.flash?.success ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{props.flash.success}</div> : null}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 grid gap-3 sm:grid-cols-3"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="rounded-xl border-gray-300 text-sm focus:border-[#1a56a0] focus:ring-[#1a56a0]" /><select value={statut} onChange={(e) => setStatut(e.target.value)} className="rounded-xl border-gray-300 text-sm focus:border-[#1a56a0] focus:ring-[#1a56a0]"><option value="">Tous les statuts</option><option value="actif">Actif</option><option value="inactif">Inactif</option></select><Link href="/comites/create" className="inline-flex items-center justify-center rounded-xl bg-[#1a56a0] px-4 py-2.5 text-sm font-medium text-white">Ajouter un comité</Link></div>
                    {data.length === 0 ? <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">Aucun comité trouvé.</div> : (
                        <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="text-left text-xs uppercase text-gray-500"><th className="px-3 py-2">Nom</th><th className="px-3 py-2">Département</th><th className="px-3 py-2">Description</th><th className="px-3 py-2">Statut</th><th className="px-3 py-2 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{data.map((item) => <tr key={item.id}><td className="px-3 py-3 font-medium text-gray-900">{item.nom}</td><td className="px-3 py-3 text-gray-600">{item.departement?.nom || '-'}</td><td className="px-3 py-3 text-gray-600">{item.description || '-'}</td><td className="px-3 py-3"><StatusBadge statut={item.statut} /></td><td className="px-3 py-3"><div className="flex justify-end gap-2"><Link href={`/comites/${item.id}`} className="rounded-lg border px-3 py-1.5">Voir</Link><Link href={`/comites/${item.id}/edit`} className="rounded-lg border px-3 py-1.5">Modifier</Link><button onClick={() => { if (!window.confirm(`Supprimer le comité \"${item.nom}\" ?`)) return; router.delete(`/comites/${item.id}`, { onStart: () => setDeletingId(item.id), onFinish: () => setDeletingId(null), preserveScroll: true }); }} disabled={deletingId === item.id} className="rounded-lg border border-red-200 px-3 py-1.5 text-red-600">{deletingId === item.id ? '...' : 'Supprimer'}</button></div></td></tr>)}</tbody></table></div>
                    )}
                </div>
            </PageContainer>
        </MainLayout>
    );
}
