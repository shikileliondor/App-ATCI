import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PageContainer from '@/Layouts/PageContainer';
import Button from '@/Components/ui/Button';

export default function Show() {
    const { url } = usePage();
    const id = url.split('/')[2];
    const [culte, setCulte] = useState(null);

    useEffect(() => {
        window.axios.get(`/api/cultes/${id}`).then((response) => setCulte(response.data?.data));
    }, [id]);

    const participants = useMemo(() => {
        if (!culte) return 0;
        return [culte.hommes_adultes, culte.femmes_adultes, culte.jeunes_hommes, culte.jeunes_filles, culte.enfants, culte.visiteurs]
            .map((item) => Number(item ?? 0))
            .reduce((sum, value) => sum + value, 0);
    }, [culte]);

    return (
        <MainLayout title="Détails du culte" subtitle="Vue complète de la programmation">
            <Head title="Détails culte" />
            <PageContainer>
                {!culte ? <p className="text-sm text-gray-500">Chargement...</p> : (
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
                            <h2 className="text-xl font-semibold text-gray-900">{culte.titre}</h2>
                            <p className="mt-2 inline-flex rounded-full bg-[#1a56a0]/10 px-3 py-1 text-xs font-medium text-[#1a56a0]">{culte.theme ?? 'Autre'}</p>
                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <div><p className="text-xs uppercase text-gray-500">Date</p><p className="text-sm font-medium text-gray-800">{new Date(culte.date_culte).toLocaleDateString('fr-FR')}</p></div>
                                <div><p className="text-xs uppercase text-gray-500">Heure</p><p className="text-sm font-medium text-gray-800">{culte.heure ?? '-'}</p></div>
                                <div><p className="text-xs uppercase text-gray-500">Lieu</p><p className="text-sm font-medium text-gray-800">{culte.lieu ?? '-'}</p></div>
                                <div><p className="text-xs uppercase text-gray-500">Responsable</p><p className="text-sm font-medium text-gray-800">{culte.pasteur ?? '-'}</p></div>
                            </div>
                            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                                <p className="font-medium text-gray-900">Notes</p>
                                <p className="mt-1">{culte.observations ?? 'Aucune note enregistrée.'}</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-sm font-medium text-gray-700">Participants (extension future)</p>
                            <p className="mt-2 text-3xl font-semibold text-gray-900">{participants}</p>
                            <ul className="mt-4 space-y-1 text-sm text-gray-600">
                                <li>Hommes adultes : {culte.hommes_adultes ?? 0}</li>
                                <li>Femmes adultes : {culte.femmes_adultes ?? 0}</li>
                                <li>Jeunes hommes : {culte.jeunes_hommes ?? 0}</li>
                                <li>Jeunes filles : {culte.jeunes_filles ?? 0}</li>
                                <li>Enfants : {culte.enfants ?? 0}</li>
                                <li>Visiteurs : {culte.visiteurs ?? 0}</li>
                            </ul>
                            <div className="mt-6 flex gap-2">
                                <Link href={`/cultes/${culte.id}/edit`}><Button variant="secondary">Modifier</Button></Link>
                                <Link href="/cultes"><Button>Retour</Button></Link>
                            </div>
                        </div>
                    </div>
                )}
            </PageContainer>
        </MainLayout>
    );
}
