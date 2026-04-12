import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import StatusBadge from '@/Components/StatusBadge';

export default function Show({ departement }) {
    return (
        <MainLayout title={departement.nom} subtitle="Détails du département">
            <Head title={departement.nom} />
            <PageContainer>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between"><h2 className="text-xl font-semibold text-gray-900">{departement.nom}</h2><StatusBadge statut={departement.statut} /></div>
                    <p className="text-sm text-gray-600">{departement.description || 'Aucune description.'}</p>
                    <p className="text-sm text-gray-500">Comités associés: {departement.comites_count ?? 0}</p>
                    <div className="flex gap-3"><Link href={`/departements/${departement.id}/edit`} className="rounded-xl border px-4 py-2">Modifier</Link><Link href="/departements" className="rounded-xl border px-4 py-2">Retour</Link></div>
                </div>
            </PageContainer>
        </MainLayout>
    );
}
