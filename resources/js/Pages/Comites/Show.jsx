import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import StatusBadge from '@/Components/StatusBadge';

export default function Show({ comite }) {
    return (
        <MainLayout title={comite.nom} subtitle="Détails du comité">
            <Head title={comite.nom} />
            <PageContainer>
                <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between"><h2 className="text-xl font-semibold text-gray-900">{comite.nom}</h2><StatusBadge statut={comite.statut} /></div>
                    <p className="text-sm text-gray-600">Département: {comite.departement?.nom || '-'}</p>
                    <p className="text-sm text-gray-600">{comite.description || 'Aucune description.'}</p>
                    <div className="flex gap-3"><Link href={`/comites/${comite.id}/edit`} className="rounded-xl border px-4 py-2">Modifier</Link><Link href="/comites" className="rounded-xl border px-4 py-2">Retour</Link></div>
                </div>
            </PageContainer>
        </MainLayout>
    );
}
