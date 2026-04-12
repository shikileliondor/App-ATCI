import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import Button from '@/Components/ui/Button';
import StatusBadge from '@/Components/programmes/StatusBadge';
import Timeline from '@/Components/programmes/Timeline';

function durationInDays(start, end) {
    const begin = new Date(`${start}T00:00:00`);
    const finish = new Date(`${end}T00:00:00`);
    return Math.round((finish - begin) / (1000 * 60 * 60 * 24)) + 1;
}

export default function Show() {
    const { url } = usePage();
    const id = url.split('/')[2];
    const [programme, setProgramme] = useState(null);

    useEffect(() => {
        window.axios.get(`/api/programmes/${id}`).then((response) => setProgramme(response.data?.data));
    }, [id]);

    const duration = useMemo(() => {
        if (!programme) return 0;
        return durationInDays(programme.date_debut, programme.date_fin);
    }, [programme]);

    return (
        <MainLayout title="Détails du programme" subtitle="Vue dashboard complète de la période de prière">
            <Head title="Détails programme" />
            <PageContainer>
                {!programme ? <p className="text-sm text-gray-500">Chargement...</p> : (
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <h2 className="text-2xl font-semibold text-gray-900">{programme.nom}</h2>
                                    <StatusBadge status={programme.statut} />
                                </div>
                                <p className="mt-5 text-xs uppercase text-gray-500">Période</p>
                                <p className="text-sm font-medium text-gray-800">
                                    {new Date(programme.date_debut).toLocaleDateString('fr-FR')} → {new Date(programme.date_fin).toLocaleDateString('fr-FR')}
                                </p>

                                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-xs uppercase text-gray-500">Durée</p>
                                        <p className="text-sm font-medium text-gray-800">{duration} jours</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase text-gray-500">Lieu</p>
                                        <p className="text-sm font-medium text-gray-800">{programme.lieu}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase text-gray-500">Heure</p>
                                        <p className="text-sm font-medium text-gray-800">{programme.heure || '-'}</p>
                                    </div>
                                </div>

                                <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
                                    <p className="text-sm font-semibold text-gray-900">Description</p>
                                    <p className="mt-1 text-sm text-gray-700">{programme.description || 'Aucune description fournie.'}</p>
                                </div>
                            </div>

                            <Timeline startDate={programme.date_debut} endDate={programme.date_fin} />
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-sm font-semibold text-gray-900">Actions rapides</p>
                            <div className="mt-4 flex flex-col gap-2">
                                <Link href={`/programmes/${programme.id}/edit`}><Button className="w-full">Modifier le programme</Button></Link>
                                <Link href="/programmes"><Button variant="secondary" className="w-full">Retour à la liste</Button></Link>
                            </div>
                        </div>
                    </div>
                )}
            </PageContainer>
        </MainLayout>
    );
}
